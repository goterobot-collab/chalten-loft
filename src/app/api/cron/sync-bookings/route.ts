import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { icalFeeds } from '@/lib/ical-config'
import { parseICal } from '@/lib/ical-parser'
import { properties } from '@/lib/properties'

// This cron syncs Airbnb iCal bookings → Supabase → generates cleaning tasks
// Should run every 10 minutes via Vercel Cron or manual trigger

export async function GET() {
  const results = []

  for (const [slug, feedUrls] of Object.entries(icalFeeds)) {
    try {
      // Fetch all iCal feeds for this property and merge
      const urls = Array.isArray(feedUrls) ? feedUrls : [feedUrls]
      const seen = new Set<string>()
      const events = []
      for (const url of urls) {
        const res = await fetch(url, { cache: 'no-store' })
        const icalText = await res.text()
        for (const e of parseICal(icalText)) {
          const key = `${e.startDate}|${e.endDate}`
          if (!seen.has(key)) { seen.add(key); events.push(e) }
        }
      }

      const property = properties.find((p) => p.slug === slug)
      const propertyName = property
        ? `${property.name} (${property.subtitle})`
        : slug

      // Only process confirmed reservations (not just blocked dates)
      const reservations = events.filter((e) => e.isReserved)

      for (const reservation of reservations) {
        // Check if booking already exists
        const { data: existing } = await supabase
          .from('bookings')
          .select('id')
          .eq('property_slug', slug)
          .eq('check_in', reservation.startDate)
          .eq('check_out', reservation.endDate)
          .single()

        if (!existing) {
          // Insert new booking
          const nights = Math.ceil(
            (new Date(reservation.endDate).getTime() -
              new Date(reservation.startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )

          const { data: booking } = await supabase
            .from('bookings')
            .insert({
              property_slug: slug,
              property_name: propertyName,
              check_in: reservation.startDate,
              check_out: reservation.endDate,
              guests_count: 2, // Default — Airbnb iCal doesn't include guest count
              source: 'airbnb',
              external_id: reservation.reservationId || null,
              status: 'confirmed',
            })
            .select('id')
            .single()

          // Generate cleaning task for checkout day
          if (booking) {
            // Check if there's a next booking on the same checkout day
            const nextBooking = reservations.find(
              (r) => r.startDate === reservation.endDate
            )

            await supabase.from('cleaning_tasks').insert({
              booking_id: booking.id,
              property_slug: slug,
              property_name: propertyName,
              task_date: reservation.endDate,
              checkout_guests: 2,
              checkin_date: nextBooking?.startDate || null,
              checkin_guests: nextBooking ? 2 : null,
              status: 'pending',
            })
          }

          results.push({
            slug,
            action: 'new_booking',
            checkIn: reservation.startDate,
            checkOut: reservation.endDate,
          })
        }
      }
    } catch (error) {
      results.push({ slug, action: 'error', error: String(error) })
    }
  }

  return NextResponse.json({
    synced: results.length,
    results,
    timestamp: new Date().toISOString(),
  })
}
