import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'
import { sendEmail, RECIPIENTS } from '@/lib/gmail'
import { addCleaningEvent } from '@/lib/google-calendar'
import { properties } from '@/lib/properties'

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const stripe = new Stripe(secretKey)
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const meta = session.metadata

    if (meta) {
      const { propertySlug, checkIn, checkOut, nights, guests, guestName, guestEmail } = meta
      const totalUSD = session.amount_total ? session.amount_total / 100 : 0
      const property = properties.find(p => p.slug === propertySlug)
      const propertyName = property ? property.subtitle : propertySlug
      const resolvedGuestName = guestName || session.customer_details?.name || 'International Guest'

      // Save booking to Supabase
      await supabase.from('bookings').insert({
        property_slug: propertySlug,
        property_name: propertyName,
        guest_name: resolvedGuestName,
        guest_email: guestEmail || session.customer_details?.email || null,
        check_in: checkIn,
        check_out: checkOut,
        guests_count: parseInt(guests) || 2,
        source: 'direct',
        status: 'confirmed',
        notes: `Stripe #${session.payment_intent} — $${totalUSD} USD · ${nights} nights`,
      })

      // Add cleaning event to Google Calendar
      await addCleaningEvent({
        propertyName,
        propertySlug,
        checkOut,
        checkIn: '', // next check-in unknown at this point
        guestName: resolvedGuestName,
        guests: parseInt(guests) || 2,
        nights: parseInt(nights) || 0,
      })

      // Notify Gabriel + Tania
      await sendEmail({
        to: RECIPIENTS.both,
        subject: `💳 NUEVA RESERVA DIRECTA (USD) — ${propertyName}`,
        html: `
          <div style="font-family: system-ui, sans-serif; padding: 32px; max-width: 600px;">
            <h2 style="color: #2C3E2D;">💳 ¡Nueva reserva directa internacional!</h2>
            <div style="background: #F0EBE3; padding: 20px; border-radius: 12px;">
              <p><strong>🏠</strong> ${propertySlug}</p>
              <p><strong>📅</strong> ${checkIn} → ${checkOut} (${nights} noches)</p>
              <p><strong>👥</strong> ${guests} huéspedes</p>
              <p><strong>💰</strong> $${totalUSD} USD (Stripe)</p>
              <p><strong>👤</strong> ${guestName} — ${guestEmail}</p>
              <p><strong>🆔</strong> ${session.payment_intent}</p>
            </div>
            <p style="color: #888; font-size: 12px; margin-top: 24px;">Chaltén Loft · Reserva directa</p>
          </div>
        `,
      })
    }
  }

  return NextResponse.json({ received: true })
}
