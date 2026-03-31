import { NextRequest, NextResponse } from 'next/server'
import { sendEmail as sendGmail } from '@/lib/gmail'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { name, email, loft, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required' },
        { status: 400 }
      )
    }

    // Send notification to Gabriel via Gmail
    await sendGmail({
      to: 'chaltenloft@gmail.com',
      subject: `Nuevo mensaje de contacto — ${name}${loft ? ` (${loft})` : ''}`,
      html: `
        <h2>Nuevo mensaje desde la web</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${loft ? `<p><strong>Loft:</strong> ${loft}</p>` : ''}
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><a href="mailto:${email}">Responder a ${name}</a></p>
      `,
    })

    // Send auto-reply to guest via Resend
    await resend.emails.send({
      from: 'Chaltén Loft <onboarding@resend.dev>',
      to: email,
      subject: 'Thanks for contacting Chaltén Loft! / ¡Gracias por contactarnos!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d3436;">Hi ${name}! </h2>
          <p>Thanks for reaching out. Gabriel will get back to you within 1 hour.</p>
          <p>In the meantime, feel free to message us on
            <a href="https://wa.me/5492901644067">WhatsApp</a> for a faster response.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
          <p style="color: #636e72;">
            <em>Hola ${name}! Gracias por escribirnos. Gabriel te va a responder en menos de 1 hora.
            Si preferis, escribinos por
            <a href="https://wa.me/5492901644067">WhatsApp</a> para una respuesta mas rapida.</em>
          </p>
          <p style="color: #b2bec3; font-size: 12px; margin-top: 32px;">
            Chalte&#769;n Loft — El Chalte&#769;n, Patagonia Argentina
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
