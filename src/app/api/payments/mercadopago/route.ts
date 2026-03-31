import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { propertyName, propertySlug, checkIn, checkOut, nights, guests, totalPrice, guestName, guestEmail } = body

    const preference = new Preference(client)

    const result = await preference.create({
      body: {
        items: [
          {
            id: propertySlug,
            title: `Reserva ${propertyName} — ${nights} noches`,
            description: `Check-in: ${checkIn} · Check-out: ${checkOut} · ${guests} huéspedes`,
            quantity: 1,
            unit_price: totalPrice,
            currency_id: 'ARS',
          },
        ],
        payer: {
          name: guestName || undefined,
          email: guestEmail || undefined,
        },
        // back_urls only work with public domains (not localhost)
        // Will be enabled after Vercel deploy
        ...(req.nextUrl.origin.includes('localhost')
          ? {}
          : {
              back_urls: {
                success: `${req.nextUrl.origin}/en/booking/success?property=${propertySlug}&checkin=${checkIn}&checkout=${checkOut}&guests=${guests}`,
                failure: `${req.nextUrl.origin}/en/properties/${propertySlug}?payment=failed`,
                pending: `${req.nextUrl.origin}/en/booking/success?property=${propertySlug}&status=pending`,
              },
              auto_return: 'approved' as const,
            }),
        external_reference: `${propertySlug}|${checkIn}|${checkOut}|${guests}|${nights}|${encodeURIComponent(guestName || '')}`,
        notification_url: `${req.nextUrl.origin}/api/payments/mercadopago/webhook`,
      },
    })

    return NextResponse.json({
      id: result.id,
      init_point: result.init_point,
    })
  } catch (error) {
    console.error('MercadoPago error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment preference' },
      { status: 500 }
    )
  }
}
