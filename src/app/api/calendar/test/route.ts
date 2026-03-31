import { NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function GET() {
  const calendarId = process.env.GOOGLE_CALENDAR_ID
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON

  if (!calendarId || !serviceAccountJson) {
    return NextResponse.json({
      error: 'Missing env vars',
      hasCalendarId: !!calendarId,
      hasServiceAccount: !!serviceAccountJson,
    })
  }

  try {
    const credentials = JSON.parse(serviceAccountJson)
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    })
    const calendar = google.calendar({ version: 'v3', auth })

    // Create a test event for today
    const today = new Date().toISOString().split('T')[0]
    const event = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: '🧹 TEST — Borrar este evento',
        start: { date: today },
        end: { date: today },
      },
    })

    return NextResponse.json({
      success: true,
      calendarId,
      eventId: event.data.id,
      eventLink: event.data.htmlLink,
      serviceAccountEmail: credentials.client_email,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: msg, calendarId })
  }
}
