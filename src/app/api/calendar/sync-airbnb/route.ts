import { NextResponse } from 'next/server'
import { icalFeeds, type PropertySlug } from '@/lib/ical-config'
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

  for (const [slug, feedUrl] of Object.entries(icalFeeds)) {
    const property = properties.find(p => p.slug === slug)
    const propertyName = property ? property.subtitle : slug // "Dpto 1 — Fitz Roy" etc.
    let eventCount = 0
    const errors: string[] = []

    try {
      const response = await fetch(feedUrl, { cache: 'no-store' })
      if (!response.ok) throw new Error(`iCal fetch failed: ${response.status}`)

      const icalText = await response.text()
      const events = parseICal(icalText)

      // Solo reservas futuras, ordenadas por fecha
      const reservations = events
        .filter(e => e.isReserved && e.endDate >= today)
        .sort((a, b) => a.startDate.localeCompare(b.startDate))

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
          // ¿El checkout de esta reserva coincide con el checkin de la siguiente?
          const isBackToBack = nextReservation && checkOut === nextReservation.startDate

          // INGRESO (verde) — siempre, excepto si el checkin coincide con el checkout anterior
          // (en ese caso ya se creó un evento 🧹 Limpieza en la iteración anterior)
          const prevReservation = reservations[i - 1]
          const isPrevBackToBack = prevReservation && prevReservation.endDate === checkIn

          if (!isPrevBackToBack) {
            await addCheckInEvent(params)
            eventCount++
          }

          if (isBackToBack) {
            // 🧹 Limpieza entre huéspedes (naranja) — sale uno, entra otro mismo día
            const nextGuestName = nextReservation.summary === 'Reserved' || nextReservation.summary === 'Airbnb'
              ? 'Huésped Airbnb'
              : nextReservation.summary
            await addTurnaroundEvent({ ...params, nextGuestName })
            eventCount++
          } else {
            // 🔴 Egreso + Limpieza (rojo) — se va, queda libre
            await addCheckOutEvent(params)
            eventCount++
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err)
          errors.push(`${checkIn}-${checkOut}: ${msg}`)
        }
      }
    } catch (err) {
      errors.push(`Feed error: ${err}`)
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
