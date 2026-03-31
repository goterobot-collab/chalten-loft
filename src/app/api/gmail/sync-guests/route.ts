import { NextResponse } from 'next/server'
import { fetchAirbnbGuestData } from '@/lib/gmail-reader'
import { supabase } from '@/lib/supabase'

// Reads Airbnb confirmation emails → extracts guest counts → updates Supabase bookings
// Also handles modifications: always uses the most recent email per reservation
export async function GET() {
  if (!process.env.GOOGLE_OAUTH_CLIENT_ID || !process.env.GOOGLE_GMAIL_REFRESH_TOKEN) {
    return NextResponse.json({
      error: 'Gmail OAuth not configured. Set GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_GMAIL_REFRESH_TOKEN.',
    }, { status: 500 })
  }

  try {
    // Quick diagnostic — test raw search
    let rawCount = -1
    let debugError = ''
    try {
      const { google } = await import('googleapis')
      const oauth2 = new google.auth.OAuth2(
        process.env.GOOGLE_OAUTH_CLIENT_ID?.trim(),
        process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim(),
      )
      oauth2.setCredentials({ refresh_token: process.env.GOOGLE_GMAIL_REFRESH_TOKEN?.trim() })
      const gmail = google.gmail({ version: 'v1', auth: oauth2 })
      const r = await gmail.users.messages.list({ userId: 'me', q: 'reserva confirmada', maxResults: 5 })
      rawCount = r.data.messages?.length ?? 0
    } catch (e) {
      debugError = String(e)
    }

    const guests = await fetchAirbnbGuestData()

    // Deduplicate: for same checkIn|checkOut, keep most recent email
    const deduped = new Map<string, (typeof guests)[0]>()
    for (const g of guests) {
      const key = `${g.checkIn}|${g.checkOut}`
      const existing = deduped.get(key)
      if (!existing || g.emailDate > existing.emailDate) {
        deduped.set(key, g)
      }
    }

    let updated = 0
    let inserted = 0
    const details = []

    for (const [, guest] of deduped) {
      // Try to update existing booking
      const { data: existing, error: findErr } = await supabase
        .from('bookings')
        .select('id, guests_count')
        .eq('check_in', guest.checkIn)
        .eq('check_out', guest.checkOut)
        .maybeSingle()

      if (findErr) continue

      if (existing) {
        if (existing.guests_count !== guest.guests) {
          await supabase
            .from('bookings')
            .update({ guests_count: guest.guests })
            .eq('id', existing.id)
          updated++
        }
      } else {
        // Booking not in DB yet — insert it
        await supabase.from('bookings').insert({
          property_slug: guestToSlug(guest.propertyListing),
          property_name: guest.propertyListing,
          check_in: guest.checkIn,
          check_out: guest.checkOut,
          guests_count: guest.guests,
          source: 'airbnb',
          status: 'confirmed',
        })
        inserted++
      }

      details.push({
        code: guest.confirmationCode,
        guest: guest.guestName,
        checkIn: guest.checkIn,
        checkOut: guest.checkOut,
        guests: guest.guests,
        property: guest.propertyListing,
      })
    }

    return NextResponse.json({
      success: true,
      rawCount,
      debugError,
      parsed: guests.length,
      deduped: deduped.size,
      updated,
      inserted,
      details,
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

function guestToSlug(propertyListing: string): string {
  if (propertyListing.includes('1')) return 'chalten-loft-fitz-roy'
  if (propertyListing.includes('2')) return 'chalten-loft-cerro-torre'
  if (propertyListing.includes('3')) return 'chalten-loft-poincenot'
  return 'chalten-loft-fitz-roy'
}
