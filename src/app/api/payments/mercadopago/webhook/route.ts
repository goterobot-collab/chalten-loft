import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { supabase } from '@/lib/supabase'
import { sendEmail, RECIPIENTS } from '@/lib/gmail'
import { addCleaningEvent } from '@/lib/google-calendar'
import { properties } from '@/lib/properties'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (body.type === 'payment') {
      const payment = new Payment(client)
      const paymentData = await payment.get({ id: body.data.id })

      if (paymentData.status === 'approved') {
        // Parse external_reference: "propertySlug|checkIn|checkOut|guests|nights|guestName"
        const ref = paymentData.external_reference?.split('|')
        if (ref && ref.length >= 4) {
          const [propertySlug, checkIn, checkOut, guests, nights, encodedName] = ref
          const guestName = encodedName ? decodeURIComponent(encodedName) : (paymentData.payer?.first_name || 'Huésped')
          const property = properties.find(p => p.slug === propertySlug)
          const propertyName = property ? property.subtitle : propertySlug

          // Save booking to Supabase
          await supabase.from('bookings').insert({
            property_slug: propertySlug,
            property_name: propertyName,
            guest_name: guestName,
            guest_email: paymentData.payer?.email || null,
            check_in: checkIn,
            check_out: checkOut,
            guests_count: parseInt(guests) || 2,
            source: 'direct',
            status: 'confirmed',
            notes: `MercadoPago #${paymentData.id} — $${paymentData.transaction_amount} ARS`,
          })

          // Add cleaning event to Google Calendar
          await addCleaningEvent({
            propertyName,
            propertySlug,
            checkOut,
            checkIn: '', // next check-in unknown at this point
            guestName,
            guests: parseInt(guests) || 2,
            nights: parseInt(nights) || 0,
          })

          // Notify Gabriel + Tania
          await sendEmail({
            to: RECIPIENTS.both,
            subject: `💰 NUEVA RESERVA DIRECTA — ${propertySlug}`,
            html: `
              <div style="font-family: system-ui, sans-serif; padding: 32px; max-width: 600px;">
                <h2 style="color: #2C3E2D;">💰 ¡Nueva reserva directa!</h2>
                <div style="background: #F0EBE3; padding: 20px; border-radius: 12px;">
                  <p><strong>🏠</strong> ${propertySlug}</p>
                  <p><strong>📅</strong> ${checkIn} → ${checkOut}</p>
                  <p><strong>👥</strong> ${guests} huéspedes</p>
                  <p><strong>💰</strong> $${paymentData.transaction_amount} ARS (MercadoPago)</p>
                  <p><strong>👤</strong> ${paymentData.payer?.first_name || 'N/A'} — ${paymentData.payer?.email || 'N/A'}</p>
                </div>
                <p style="color: #B56A3F; font-weight: bold; margin-top: 16px;">
                  ¡Reserva DIRECTA sin comisión de Airbnb! 🎉
                </p>
              </div>
            `,
          })
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ received: true })
  }
}
