import { google } from 'googleapis'

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID!

function getCalendarClient() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!)
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  })
  return google.calendar({ version: 'v3', auth })
}

// Google Calendar color IDs:
// '2' = Sage/Green, '10' = Basil/Dark Green, '11' = Tomato/Red, '5' = Banana/Yellow

/**
 * Crea evento de INGRESO (verde) — llega un huésped
 */
export async function addCheckInEvent(params: EventParams) {
  const pax = params.guests > 0 ? ` (${params.guests} pax)` : ''
  return createEvent({
    summary: `🟢 ${params.propertyName} — Ingreso · ${params.guestName}${pax}`,
    description: `INGRESO\n${formatDescription(params)}`,
    date: params.checkIn,
    colorId: '10', // Basil green
    reminders: [{ method: 'popup' as const, minutes: 120 }],
  })
}

/**
 * Crea evento de EGRESO + LIMPIEZA (rojo) — se va el huésped, limpiar, queda libre
 */
export async function addCheckOutEvent(params: EventParams) {
  const freeLabel = params.freeDaysAfter != null
    ? params.freeDaysAfter === 0
      ? '⚡ TURNO INMEDIATO'
      : `🗓 ${params.freeDaysAfter} día${params.freeDaysAfter === 1 ? '' : 's'} libre${params.freeDaysAfter === 1 ? '' : 's'}`
    : '🗓 Sin próx. reserva'

  const freeDesc = params.freeDaysAfter != null
    ? params.freeDaysAfter === 0
      ? 'TURNO INMEDIATO — entra nuevo huésped el mismo día'
      : `Días libres hasta próxima reserva: ${params.freeDaysAfter}`
    : 'Sin próxima reserva registrada'

  return createEvent({
    summary: `🔴 ${params.propertyName} · ${freeLabel}`,
    description: `EGRESO + LIMPIEZA\n\n${params.maxGuests ? `Dejar loft para ${params.maxGuests} pax\n` : ''}${freeDesc}`,
    date: params.checkOut,
    colorId: '11', // Tomato red
    reminders: [
      { method: 'popup' as const, minutes: 60 },
      { method: 'email' as const, minutes: 480 },
    ],
  })
}

/**
 * Crea evento de LIMPIEZA entre huéspedes (naranja) — sale uno y entra otro el mismo día
 * Lo más importante: cuántos ENTRAN (para preparar la limpieza)
 */
export async function addTurnaroundEvent(params: EventParams & {
  nextGuestName?: string
  nextGuests?: number
  nextCheckIn?: string
  nextCheckOut?: string
  nextNights?: number
}) {
  const nextPax = params.nextGuests && params.nextGuests > 0 ? params.nextGuests : '?'
  const outPax = params.guests > 0 ? params.guests : '?'

  return createEvent({
    summary: `🧹 ${params.propertyName} — Limpieza · ${params.guestName}→${params.nextGuestName ?? '?'} (${nextPax} pax)`,
    description: [
      `⚡ TURNO MISMO DÍA`,
      ``,
      `📤 SALE: ${params.guestName} (${outPax} pax)`,
      `   Check-out: ${params.checkOut}`,
      ``,
      `📥 ENTRA: ${params.nextGuestName || '?'} (${nextPax} pax)`,
      `   Check-in: ${params.nextCheckIn || params.checkOut}`,
      `   Check-out: ${params.nextCheckOut || '?'}`,
      `   Estadía: ${params.nextNights ?? '?'} noches`,
      ``,
      `Dpto: ${params.propertySlug}`,
    ].join('\n'),
    date: params.checkOut,
    colorId: '6', // Tangerine/Orange
    reminders: [
      { method: 'popup' as const, minutes: 60 },
      { method: 'email' as const, minutes: 480 },
    ],
  })
}

/**
 * Borra TODOS los eventos del calendario de limpieza (para re-sync limpio)
 */
export async function clearAllEvents() {
  if (!CALENDAR_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_JSON) return 0

  const calendar = getCalendarClient()
  let deleted = 0
  let pageToken: string | undefined

  do {
    const res = await calendar.events.list({
      calendarId: CALENDAR_ID,
      maxResults: 250,
      pageToken,
    })

    const events = res.data.items || []
    for (const event of events) {
      if (event.id) {
        await calendar.events.delete({ calendarId: CALENDAR_ID, eventId: event.id })
        deleted++
      }
    }
    pageToken = res.data.nextPageToken || undefined
  } while (pageToken)

  return deleted
}

// Backward compatibility — used by webhooks
export async function addCleaningEvent(params: EventParams) {
  return addBookingEvents(params)
}

export async function addBookingEvents(params: EventParams) {
  if (!CALENDAR_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_JSON) return null

  const checkInResult = params.checkIn ? await addCheckInEvent(params) : null
  const checkOutResult = params.checkOut ? await addCheckOutEvent(params) : null
  return { checkIn: checkInResult, checkOut: checkOutResult }
}

// ── Types & Helpers ──

export type EventParams = {
  propertyName: string
  propertySlug: string
  checkIn: string
  checkOut: string
  guestName: string
  guests: number
  nights: number
  freeDaysAfter?: number | null
  maxGuests?: number
}

function formatDescription(params: EventParams): string {
  return `Huésped: ${params.guestName}\nHuéspedes: ${params.guests || '?'}\nEstadía: ${params.nights} noches\nCheck-in: ${params.checkIn}\nCheck-out: ${params.checkOut}\nDpto: ${params.propertySlug}`
}

function formatCheckoutDescription(params: EventParams): string {
  const base = formatDescription(params)
  // When nobody checks in the same day, remind cleaner to prepare for max capacity
  if (params.maxGuests && params.freeDaysAfter !== 0) {
    return `${base}\nnotes\nDejar loft para ${params.maxGuests} pax`
  }
  return base
}

async function createEvent(opts: {
  summary: string
  description: string
  date: string
  colorId: string
  reminders: { method: 'popup' | 'email'; minutes: number }[]
}) {
  if (!CALENDAR_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_JSON) return null

  const calendar = getCalendarClient()
  const event = await calendar.events.insert({
    calendarId: CALENDAR_ID,
    requestBody: {
      summary: opts.summary,
      description: opts.description,
      start: { date: opts.date },
      end: { date: opts.date },
      colorId: opts.colorId,
      reminders: {
        useDefault: false,
        overrides: opts.reminders,
      },
    },
  })
  return event.data
}
