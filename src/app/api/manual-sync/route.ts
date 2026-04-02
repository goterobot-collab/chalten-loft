import { NextResponse } from 'next/server'
import { icalFeeds } from '@/lib/ical-config'
import { parseICal } from '@/lib/ical-parser'
import { addCheckInEvent, addCheckOutEvent, addTurnaroundEvent, clearAllEvents } from '@/lib/google-calendar'
import { properties } from '@/lib/properties'
import { buildGuestMap, propertyToSlug } from '@/lib/gmail-reader'
import type { GuestData } from '@/lib/gmail-reader'
import type { EventParams } from '@/lib/google-calendar'

// Manual sync endpoint — same logic as /api/calendar/sync-airbnb but can be called anytime
// Usage: GET /api/manual-sync?property=chalten-loft-cerro-torre&debug=true
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const specificProperty = searchParams.get('property')
  const debug = searchParams.get('debug') === 'true'

  const today = new Date().toISOString().split('T')[0]
  const guestMap = await buildGuestMap().catch(() => new Map())

  let deleted = 0
  try {
    deleted = await clearAllEvents()
  } catch (err) {
    return NextResponse.json({ error: `Failed to clear events: ${err}` }, { status: 500 })
  }

  const results: { property: string; events: number; errors: string[] }[] = []

  for (const [slug, feedUrls] of Object.entries(icalFeeds)) {
    // Filter by specific property if requested
    if (specificProperty && slug !== specificProperty) continue

    const property = properties.find(p => p.slug === slug)
    const propertyName = property ? property.subtitle : slug
    let eventCount = 0
    const errors: string[] = []

    try {
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
          errors.push(`Feed error: ${err}`)
        }
      }

      // Dedup
      const deduped = allReservations
        .sort((a, b) => a.startDate.localeCompare(b.startDate))
        .filter((r, idx, arr) => {
          const overlaps = arr.slice(0, idx).some(prev =>
            r.startDate < prev.endDate && r.endDate > prev.startDate
          )
          if (!overlaps) return true
          const prev = arr.slice(0, idx).find(p =>
            r.startDate < p.endDate && r.endDate > p.startDate
          )!
          const prevIsGeneric = ['Reserved', 'Not available', 'Airbnb'].includes(prev.summary)
          const thisIsReal = !['Reserved', 'Not available', 'Airbnb'].includes(r.summary)
          if (thisIsReal && prevIsGeneric) {
            const prevIdx = arr.indexOf(prev)
            arr[prevIdx] = r
          }
          return false
        })

      // Inject Gmail reservations
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      for (const [key, data] of guestMap) {
        if (!key.startsWith(slug + '|')) continue
        if (data.checkOut < yesterdayStr) continue
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

        const freeDaysAfter = nextReservation
          ? Math.ceil((new Date(nextReservation.startDate + 'T12:00:00').getTime() - new Date(checkOut + 'T12:00:00').getTime()) / (1000 * 60 * 60 * 24))
          : null

        if (nights > 60 && GENERIC.some(g => reservation.summary.includes(g))) {
          continue
        }

        const gmailKey = `${slug}|${checkIn}|${checkOut}`
        let gmailData: GuestData | undefined = guestMap.get(gmailKey)

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
        const realGuests = gmailData?.guests ?? (reservation.guestCount || maxGuests)
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
            const nextCheckIn = nextReservation.startDate
            const nextCheckOut = nextReservation.endDate
            const nextStart = new Date(nextCheckIn + 'T12:00:00')
            const nextEnd = new Date(nextCheckOut + 'T12:00:00')
            const nextNights = Math.ceil((nextEnd.getTime() - nextStart.getTime()) / (1000 * 60 * 60 * 24))

            const nextGmailKey = `${slug}|${nextCheckIn}|${nextCheckOut}`
            let nextGmailData: GuestData | undefined = guestMap.get(nextGmailKey)

            if (!nextGmailData) {
              for (const [key, data] of guestMap) {
                if (!key.startsWith(slug + '|')) continue
                const diffIn = Math.abs(new Date(data.checkIn).getTime() - new Date(nextCheckIn).getTime()) / 86400000
                const diffOut = Math.abs(new Date(data.checkOut).getTime() - new Date(nextCheckOut).getTime()) / 86400000
                if (diffIn <= 2 && diffOut <= 2) {
                  nextGmailData = data
                  break
                }
              }
            }

            const nextGuestNameRaw = GENERIC.some(g => nextReservation.summary.includes(g))
              ? 'Huésped Airbnb'
              : nextReservation.summary
            const nextGuestName = nextGmailData?.guestName || nextReservation.guestName || nextGuestNameRaw
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
    message: 'Manual sync completed. Check Google Calendar for updated events.',
  })
}
