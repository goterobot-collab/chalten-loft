import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import {
  sendConfirmationEmail,
  sendPreArrivalEmail,
  sendCheckinDayEmail,
  sendCheckoutEmail,
  type BookingEmailData,
} from '@/lib/email'

// Runs every hour — checks which emails need to be sent based on booking dates
// Email schedule:
//   1. Confirmation → immediately when booking is synced
//   2. Pre-arrival → 3 days before check-in
//   3. Check-in day → morning of check-in
//   4. Check-out → morning of check-out
//   5. Follow-up → 7 days after check-out (TODO)

export async function GET() {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  // Calculate dates
  const threeDaysFromNow = new Date(today)
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
  const threeDaysStr = threeDaysFromNow.toISOString().split('T')[0]

  const results = []

  // Get all confirmed bookings with guest email
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('status', 'confirmed')
    .not('guest_email', 'is', null)

  if (!bookings) {
    return NextResponse.json({ message: 'No bookings found' })
  }

  for (const booking of bookings) {
    const emailData: BookingEmailData = {
      guestName: booking.guest_name || 'Guest',
      guestEmail: booking.guest_email,
      propertyName: booking.property_name,
      checkIn: new Date(booking.check_in).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      checkOut: new Date(booking.check_out).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      guestsCount: booking.guests_count,
      nights: booking.nights,
    }

    // Check which emails have already been sent for this booking
    const { data: sentEmails } = await supabase
      .from('emails_log')
      .select('email_type')
      .eq('booking_id', booking.id)

    const sentTypes = sentEmails?.map((e) => e.email_type) || []

    // 1. CONFIRMATION — if not sent yet
    if (!sentTypes.includes('confirmation')) {
      try {
        await sendConfirmationEmail(emailData)
        await supabase.from('emails_log').insert({
          booking_id: booking.id,
          email_type: 'confirmation',
          recipient: booking.guest_email,
          subject: `Booking Confirmed — ${booking.property_name}`,
        })
        results.push({ booking_id: booking.id, email: 'confirmation', status: 'sent' })
      } catch (error) {
        results.push({ booking_id: booking.id, email: 'confirmation', status: 'failed', error: String(error) })
      }
    }

    // 2. PRE-ARRIVAL — 3 days before check-in
    if (booking.check_in === threeDaysStr && !sentTypes.includes('pre_arrival')) {
      try {
        await sendPreArrivalEmail(emailData)
        await supabase.from('emails_log').insert({
          booking_id: booking.id,
          email_type: 'pre_arrival',
          recipient: booking.guest_email,
          subject: `Arriving in 3 days — ${booking.property_name}`,
        })
        results.push({ booking_id: booking.id, email: 'pre_arrival', status: 'sent' })
      } catch (error) {
        results.push({ booking_id: booking.id, email: 'pre_arrival', status: 'failed' })
      }
    }

    // 3. CHECK-IN DAY — morning of arrival
    if (booking.check_in === todayStr && !sentTypes.includes('checkin_day')) {
      try {
        await sendCheckinDayEmail(emailData)
        await supabase.from('emails_log').insert({
          booking_id: booking.id,
          email_type: 'checkin_day',
          recipient: booking.guest_email,
          subject: `Welcome today! — ${booking.property_name}`,
        })
        results.push({ booking_id: booking.id, email: 'checkin_day', status: 'sent' })
      } catch (error) {
        results.push({ booking_id: booking.id, email: 'checkin_day', status: 'failed' })
      }
    }

    // 4. CHECK-OUT — morning of departure
    if (booking.check_out === todayStr && !sentTypes.includes('checkout')) {
      try {
        await sendCheckoutEmail(emailData)
        await supabase.from('emails_log').insert({
          booking_id: booking.id,
          email_type: 'checkout',
          recipient: booking.guest_email,
          subject: `Thanks for staying — ${booking.property_name}`,
        })
        results.push({ booking_id: booking.id, email: 'checkout', status: 'sent' })
      } catch (error) {
        results.push({ booking_id: booking.id, email: 'checkout', status: 'failed' })
      }
    }
  }

  return NextResponse.json({
    date: todayStr,
    bookingsChecked: bookings.length,
    emailsSent: results.filter((r) => r.status === 'sent').length,
    results,
  })
}
