import { NextResponse } from 'next/server'
import { icalFeeds } from '@/lib/ical-config'
import { parseICal } from '@/lib/ical-parser'
import { addCheckInEvent, addCheckOutEvent, addTurnaroundEvent, clearAllEvents } from '@/lib/google-calendar'
import { properties } from '@/lib/properties'
import type { EventParams } from '@/lib/google-calendar'

// Sync Airbnb → Google Calendar
// Borra todos los eventos existentes y crea nuevos con la lógica:
// - 🟢 Ingreso (verde) — llega huésped
// - 🔴 Egreso + Limpieza (rojo) — se va, limpiar, queda libre
// - 🧹 Limpieza (naranja) — sale uno y entra otro el mismo día
export async function GET() {
  const today = new Date().toISOString().split('T')[0]

  // Step 1: Borrar todos los eventos existentes para evitar duplicados
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

      const reservations = deduped

      for (let i = 0; i < reservations.length; i++) {
        const reservation = reservations[i]
        const nextReservation = reservations[i + 1]

        const checkIn = reservation.startDate
        const checkOut = reservation.endDate
        const start = new Date(checkIn + 'T12:00:00')
        const end = new Date(checkOut + 'T12:00:00')
        const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

        const guestName = reservation.summary === 'Reserved' || reservation.summary === 'Airbnb'
          ? 'Huésped Airbnb'
          : reservation.summary

        const params: EventParams = {
          propertyName,
          propertySlug: slug,
          checkIn,
          checkOut,
          guestName,
          guests: 0,
          nights,
        }

        try {
          const isBackToBack = nextReservation && checkOut === nextReservation.startDate
          const prevReservation = reservations[i - 1]
          const isPrevBackToBack = prevReservation && prevReservation.endDate === checkIn

          if (!isPrevBackToBack) {
            await addCheckInEvent(params)
            eventCount++
          }

          if (isBackToBack) {
            const nextGuestName = nextReservation.summary === 'Reserved' || nextReservation.summary === 'Airbnb'
              ? 'Huésped Airbnb'
              : nextReservation.summary
            await addTurnaroundEvent({ ...params, nextGuestName })
            eventCount++
          } else {
            await addCheckOutEvent(params)
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

  return NextResponse.json({
    success: true,
    deletedOld: deleted,
    newEvents: totalEvents,
    details: results,
  })
}
