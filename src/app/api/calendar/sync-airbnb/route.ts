import { NextResponse } from 'next/server'
import { icalFeeds } from '@/lib/ical-config'
import { parseICal } from '@/lib/ical-parser'
import { addCheckInEvent, addCheckOutEvent, addTurnaroundEvent, clearAllEvents } from '@/lib/google-calendar'
import { properties } from '@/lib/properties'
import { buildGuestMap, propertyToSlug } from '@/lib/gmail-reader'
import type { GuestData } from '@/lib/gmail-reader'
import type { EventParams } from '@/lib/google-calendar'

// Sync Airbnb → Google Calendar
// Borra todos los eventos existentes y crea nuevos con la lógica:
// - 🟢 Ingreso (verde) — llega huésped
// - 🔴 Egreso + Limpieza (rojo) — se va, limpiar, queda libre
// - 🧹 Limpieza (naranja) — sale uno y entra otro el mismo día
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const debug = searchParams.get('debug') === 'true'
  const today = new Date().toISOString().split('T')[0]

  // Step 1: Cargar datos de huéspedes desde Gmail (guest count real)
  // Si no están configurados los env vars de Gmail, devuelve mapa vacío sin romper
  const guestMap = await buildGuestMap().catch(() => new Map())

  // Step 2: Borrar todos los eventos existentes para evitar duplicados
  let deleted = 0
  try {
    deleted = await clearAllEvents()
  } catch (err) {
    return NextResponse.json({ error: `Failed to clear events: ${err}` })
  }

  // Step 2: Importar reservas de cada propiedad
  const results: { property: string; events: number; errors: string[] }[] = []

  for (const [slug, feedUrls] of Object.entries(icalFeeds)) {
    const property = properties.find(p => p.slug === slug)
    const propertyName = property ? property.subtitle : slug // "Dpto 1 — Fitz Roy" etc.
    let eventCount = 0
    const errors: string[] = []

    try {
      // Merge events from all URLs for this property, deduplicate by checkIn+checkOut
      const allReservations = []

      for (const feedUrl of feedUrls) {
        try {
          const response = await fetch(feedUrl, { cache: 'no-store' })
          if (!response.ok) throw new Error(`iCal fetch failed: ${response.status}`)
          const icalText = await response.text()
          const events = parseICal(icalText)

          for (const e of events) {
            if (!e.isReserved || e.endDate < today) continue
            allReservations.push(e)
          }
        } catch (err) {
          errors.push(`Feed ${feedUrl.split('/').pop()}: ${err}`)
        }
      }

      // Dedup por solapamiento: si dos reservas se solapan en fechas, quedarse con la que
      // tiene nombre de huésped real (no "Not available" / "Huésped Airbnb")
      const deduped = allReservations
        .sort((a, b) => a.startDate.localeCompare(b.startDate))
        .filter((r, idx, arr) => {
          // Check if this reservation overlaps with any earlier one
          const overlaps = arr.slice(0, idx).some(prev =>
            r.startDate < prev.endDate && r.endDate > prev.startDate
          )
          if (!overlaps) return true
          // Overlaps — keep this one only if it has a real guest name and the prev doesn't
          const prev = arr.slice(0, idx).find(p =>
            r.startDate < p.endDate && r.endDate > p.startDate
          )!
          const prevIsGeneric = ['Reserved', 'Not available', 'Airbnb'].includes(prev.summary)
          const thisIsReal = !['Reserved', 'Not available', 'Airbnb'].includes(r.summary)
          if (thisIsReal && prevIsGeneric) {
            // Replace prev with this one
            const prevIdx = arr.indexOf(prev)
            arr[prevIdx] = r
          }
          return false
        })

      // Inject Gmail reservations that are missing from iCal (e.g. today's checkouts
      // that Airbnb already removed from the feed). This ensures turnaround detection works.
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      for (const [key, data] of guestMap) {
        if (!key.startsWith(slug + '|')) continue
        // Only inject recent/current reservations (checkout >= yesterday)
        if (data.checkOut < yesterdayStr) continue
        // Check if this reservation already exists in deduped (by date overlap)
        const alreadyExists = deduped.some(r =>
          r.startDate === data.checkIn && r.endDate === data.checkOut
        )
        if (!alreadyExists) {
          deduped.push({
            summary: data.guestName || 'Reserved',
            startDate: data.checkIn,
            endDate: data.checkOut,
            isReserved: true,
            reservationId: data.confirmationCode,
          })
        }
      }
      // Re-sort after injection
      deduped.sort((a, b) => a.startDate.localeCompare(b.startDate))

      const reservations = deduped

      for (let i = 0; i < reservations.length; i++) {
        const reservation = reservations[i]
        const nextReservation = reservations[i + 1]

        const checkIn = reservation.startDate
        const checkOut = reservation.endDate
        const start = new Date(checkIn + 'T12:00:00')
        const end = new Date(checkOut + 'T12:00:00')
        const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

        const GENERIC = ['Reserved', 'Not available', 'Airbnb', 'Not Available']
        const guestName = GENERIC.some(g => reservation.summary.includes(g))
          ? 'Huésped Airbnb'
          : reservation.summary

        // Days free after checkout until next booking
        const freeDaysAfter = nextReservation
          ? Math.ceil((new Date(nextReservation.startDate + 'T12:00:00').getTime() - new Date(checkOut + 'T12:00:00').getTime()) / (1000 * 60 * 60 * 24))
          : null

        // Skip owner blocks (very long stays >60 nights with generic names)
        if (nights > 60 && GENERIC.some(g => reservation.summary.includes(g))) {
          continue
        }

        // Enrich with real guest count from Gmail
        // 1) Exact match by slug + dates
        const gmailKey = `${slug}|${checkIn}|${checkOut}`
        let gmailData: GuestData | undefined = guestMap.get(gmailKey)

        // 2) Fuzzy match: same slug, dates within ±2 days
        if (!gmailData) {
          for (const [key, data] of guestMap) {
            if (!key.startsWith(slug + '|')) continue
            const diffIn = Math.abs(new Date(data.checkIn).getTime() - new Date(checkIn).getTime()) / 86400000
            const diffOut = Math.abs(new Date(data.checkOut).getTime() - new Date(checkOut).getTime()) / 86400000
            if (diffIn <= 2 && diffOut <= 2) {
              gmailData = data
              break
            }
          }
        }

        const maxGuests = property?.maxGuests ?? 0
        // Use Gmail data first, then iCal guest count, then fall back to maxGuests
        const realGuests = gmailData?.guests ?? (reservation.guestCount || maxGuests)
        // Use Gmail name first, then iCal extracted name, then iCal summary or fallback
        const realGuestName = gmailData?.guestName || reservation.guestName || guestName

        const params: EventParams = {
          propertyName,
          propertySlug: slug,
          checkIn,
          checkOut,
          guestName: realGuestName,
          guests: realGuests,
          nights,
          freeDaysAfter,
          maxGuests,
        }

        try {
          const isBackToBack = nextReservation && checkOut === nextReservation.startDate
          const prevReservation = reservations[i - 1]
          const isPrevBackToBack = prevReservation && prevReservation.endDate === checkIn

          if (!isPrevBackToBack) {
await addCheckInEvent(params)
            eventCount++
          } else {
          }

          if (isBackToBack) {
            // Look up NEXT guest's Gmail data for the incoming booking
            const nextCheckIn = nextReservation.startDate
            const nextCheckOut = nextReservation.endDate
            const nextStart = new Date(nextCheckIn + 'T12:00:00')
            const nextEnd = new Date(nextCheckOut + 'T12:00:00')
            const nextNights = Math.ceil((nextEnd.getTime() - nextStart.getTime()) / (1000 * 60 * 60 * 24))

            const nextGmailKey = `${slug}|${nextCheckIn}|${nextCheckOut}`
            let nextGmailData: GuestData | undefined = guestMap.get(nextGmailKey)
            let gmailLookupMethod = 'exact'

            // Fuzzy match for next guest too
            if (!nextGmailData) {
              for (const [key, data] of guestMap) {
                if (!key.startsWith(slug + '|')) continue
                const diffIn = Math.abs(new Date(data.checkIn).getTime() - new Date(nextCheckIn).getTime()) / 86400000
                const diffOut = Math.abs(new Date(data.checkOut).getTime() - new Date(nextCheckOut).getTime()) / 86400000
                if (diffIn <= 2 && diffOut <= 2) {
                  nextGmailData = data
                  gmailLookupMethod = 'fuzzy'
                  break
                }
              }
            }

            if (debug && !nextGmailData && nextReservation.summary.includes('Dario')) {
              // Log info about missing Dario data
              const allGmailForProperty = Array.from(guestMap.entries())
                .filter(([key]) => key.startsWith(slug + '|'))
                .map(([key, data]) => ({ key, guestName: data.guestName, checkIn: data.checkIn, checkOut: data.checkOut }))
              console.log('DEBUG: Dario not found in Gmail for', { nextCheckIn, nextCheckOut, nextGmailKey, allGmailForProperty })
            }

            const nextGuestNameRaw = GENERIC.some(g => nextReservation.summary.includes(g))
              ? 'Huésped Airbnb'
              : nextReservation.summary
            // Use Gmail name first, then iCal extracted name, then iCal summary or fallback
            const nextGuestName = nextGmailData?.guestName || nextReservation.guestName || nextGuestNameRaw
            // Use Gmail data first, then iCal guest count, then fall back to maxGuests
            const nextGuests = nextGmailData?.guests ?? (nextReservation.guestCount || maxGuests)

await addTurnaroundEvent({
              ...params,
              nextGuestName,
              nextGuests,
              nextCheckIn,
              nextCheckOut,
              nextNights,
            })
            eventCount++
          } else {
            // Even if not back-to-back, look up next guest to show correct "Dejar loft para N pax"
            let nextGuestsForCheckout: number | undefined
            if (nextReservation) {
              const nextGmailKey = `${slug}|${nextReservation.startDate}|${nextReservation.endDate}`
              let nextGmailData: GuestData | undefined = guestMap.get(nextGmailKey)
              if (!nextGmailData) {
                for (const [key, data] of guestMap) {
                  if (!key.startsWith(slug + '|')) continue
                  const diffIn = Math.abs(new Date(data.checkIn).getTime() - new Date(nextReservation.startDate).getTime()) / 86400000
                  const diffOut = Math.abs(new Date(data.checkOut).getTime() - new Date(nextReservation.endDate).getTime()) / 86400000
                  if (diffIn <= 2 && diffOut <= 2) { nextGmailData = data; break }
                }
              }
              nextGuestsForCheckout = nextGmailData?.guests ?? nextReservation.guestCount ?? undefined
            }
await addCheckOutEvent({ ...params, nextGuests: nextGuestsForCheckout })
            eventCount++
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err)
          errors.push(`${checkIn}-${checkOut}: ${msg}`)
        }
      }
    } catch (err) {
      errors.push(`Error general: ${err}`)
    }

    results.push({ property: slug, events: eventCount, errors })
  }

  const totalEvents = results.reduce((sum, r) => sum + r.events, 0)

  if (debug) {
    // Return detailed debug info including all Gmail data and reservations processed
    const debugMap = await buildGuestMap().catch(() => new Map())
    const debugReservations: Record<string, any[]> = {}

    for (const [slug, feedUrls] of Object.entries(icalFeeds)) {
      debugReservations[slug] = []
      for (const feedUrl of feedUrls) {
        try {
          const response = await fetch(feedUrl, { cache: 'no-store' })
          if (!response.ok) continue
          const icalText = await response.text()
          const events = parseICal(icalText)
          debugReservations[slug].push(...events.filter(e => e.isReserved))
        } catch {
          // Skip
        }
      }
    }

    return NextResponse.json({
      success: true,
      deletedOld: deleted,
      newEvents: totalEvents,
      details: results,
      debug: {
        guestMapSize: debugMap.size,
        guestMapEntries: Array.from(debugMap.entries()).map(([key, data]) => ({
          key,
          guestName: data.guestName,
          guests: data.guests,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
        })),
        iCalReservations: debugReservations,
      },
    })
  }

  return NextResponse.json({
    success: true,
    deletedOld: deleted,
    newEvents: totalEvents,
    details: results,
  })
}
