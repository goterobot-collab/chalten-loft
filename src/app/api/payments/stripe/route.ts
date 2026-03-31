import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const stripe = new Stripe(secretKey)

  try {
    const body = await request.json()
    const {
      propertyName,
      propertySlug,
      checkIn,
      checkOut,
      nights,
      guests,
      totalPrice,
      guestName,
      guestEmail,
    } = body

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://chalten-loft.vercel.app'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: guestEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: propertyName,
              description: `${checkIn} → ${checkOut} · ${nights} nights · ${guests} guest${guests > 1 ? 's' : ''}`,
              images: [],
            },
            unit_amount: Math.round(totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        propertySlug,
        checkIn,
        checkOut,
        nights: String(nights),
        guests: String(guests),
        guestName,
        guestEmail,
      },
      success_url: `${baseUrl}/en/success?session_id={CHECKOUT_SESSION_ID}&property=${propertySlug}`,
      cancel_url: `${baseUrl}/en/booking/${propertySlug}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err)
    return NextResponse.json({ error: 'Payment error' }, { status: 500 })
  }
}
