import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Email sender — uses Resend's default domain until custom domain is set up
const FROM_EMAIL = 'Chaltén Loft <onboarding@resend.dev>'

export type BookingEmailData = {
  guestName: string
  guestEmail: string
  propertyName: string
  checkIn: string        // "April 5, 2026"
  checkOut: string
  guestsCount: number
  nights: number
}

// ─── EMAIL 1: Booking Confirmation ───────────────────────────
export async function sendConfirmationEmail(data: BookingEmailData) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: data.guestEmail,
    subject: `Booking Confirmed — ${data.propertyName}, El Chaltén`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <img src="https://chaltenloft.com/images/logo.png" alt="Chaltén Loft" width="80" style="margin-bottom: 24px;">
        <h1 style="color: #2C3E2D; font-size: 28px;">Booking Confirmed!</h1>
        <p>Hi ${data.guestName},</p>
        <p>Your reservation at <strong>${data.propertyName}</strong> is confirmed.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
          <tr><td style="padding: 8px 0; color: #8B8578;">Check-in</td><td style="padding: 8px 0;"><strong>${data.checkIn}</strong> from 3:00 PM</td></tr>
          <tr><td style="padding: 8px 0; color: #8B8578;">Check-out</td><td style="padding: 8px 0;"><strong>${data.checkOut}</strong> by 10:00 AM</td></tr>
          <tr><td style="padding: 8px 0; color: #8B8578;">Guests</td><td style="padding: 8px 0;"><strong>${data.guestsCount}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #8B8578;">Nights</td><td style="padding: 8px 0;"><strong>${data.nights}</strong></td></tr>
        </table>
        <p>We'll send you detailed arrival instructions 3 days before check-in.</p>
        <p>Questions? WhatsApp Gabriel: <a href="https://wa.me/5492901644067">+54 9 2901 64-4067</a></p>
        <hr style="border: none; border-top: 1px solid #F0EBE3; margin: 32px 0;">
        <p style="color: #8B8578; font-size: 13px;">Chaltén Loft · El Chaltén, Patagonia Argentina</p>
      </div>
    `,
  })
}

// ─── EMAIL 2: Pre-Arrival (3 days before) ────────────────────
export async function sendPreArrivalEmail(data: BookingEmailData) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: data.guestEmail,
    subject: `Arriving in 3 days — ${data.propertyName}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <img src="https://chaltenloft.com/images/logo.png" alt="Chaltén Loft" width="80" style="margin-bottom: 24px;">
        <h1 style="color: #2C3E2D; font-size: 28px;">Almost there!</h1>
        <p>Hi ${data.guestName},</p>
        <p>Your stay at <strong>${data.propertyName}</strong> starts on <strong>${data.checkIn}</strong>.</p>
        <h3 style="color: #2C3E2D;">How to get there</h3>
        <ul>
          <li>El Chaltén is 3.5 hours by bus from El Calafate airport</li>
          <li>Bus companies: Chaltén Travel, TAQSA (book ahead in peak season)</li>
          <li>The loft is in the center of town, 3 blocks from the Fitz Roy trailhead</li>
        </ul>
        <h3 style="color: #2C3E2D;">What to bring</h3>
        <ul>
          <li>Layers — temperature changes 15°C in a day</li>
          <li>Good trekking shoes</li>
          <li>Cash — ATMs in El Chaltén run out in peak season</li>
        </ul>
        <p>We'll send you the access code and WiFi password on check-in day.</p>
        <p>WhatsApp Gabriel anytime: <a href="https://wa.me/5492901644067">+54 9 2901 64-4067</a></p>
        <hr style="border: none; border-top: 1px solid #F0EBE3; margin: 32px 0;">
        <p style="color: #8B8578; font-size: 13px;">Chaltén Loft · El Chaltén, Patagonia Argentina</p>
      </div>
    `,
  })
}

// ─── EMAIL 3: Check-in Day ───────────────────────────────────
export async function sendCheckinDayEmail(data: BookingEmailData & { wifiPassword?: string; accessCode?: string }) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: data.guestEmail,
    subject: `Welcome today! — ${data.propertyName}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <img src="https://chaltenloft.com/images/logo.png" alt="Chaltén Loft" width="80" style="margin-bottom: 24px;">
        <h1 style="color: #2C3E2D; font-size: 28px;">Welcome to El Chaltén!</h1>
        <p>Hi ${data.guestName}, your loft is ready.</p>
        <div style="background: #F0EBE3; padding: 20px; border-radius: 12px; margin: 24px 0;">
          <p style="margin: 0;"><strong>Check-in:</strong> from 3:00 PM</p>
          <p style="margin: 8px 0;"><strong>Access:</strong> Key lockbox — code sent via WhatsApp</p>
          <p style="margin: 8px 0;"><strong>WiFi:</strong> ChaltenLoft / password sent via WhatsApp</p>
          <p style="margin: 0;"><strong>Luggage storage:</strong> Available if you arrive early</p>
        </div>
        <h3 style="color: #2C3E2D;">Gabriel's top tips for today</h3>
        <ul>
          <li>Register at the park office on Av. Güemes (free, takes 10 min)</li>
          <li>If weather is clear → do Laguna de los Tres tomorrow (don't wait)</li>
          <li>Groceries: La Ranchería supermarket on San Martín</li>
        </ul>
        <p>WhatsApp Gabriel for anything: <a href="https://wa.me/5492901644067">+54 9 2901 64-4067</a></p>
        <hr style="border: none; border-top: 1px solid #F0EBE3; margin: 32px 0;">
        <p style="color: #8B8578; font-size: 13px;">Chaltén Loft · El Chaltén, Patagonia Argentina</p>
      </div>
    `,
  })
}

// ─── EMAIL 4: Check-out Thank You ────────────────────────────
export async function sendCheckoutEmail(data: BookingEmailData) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: data.guestEmail,
    subject: `Thanks for staying — ${data.propertyName}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <img src="https://chaltenloft.com/images/logo.png" alt="Chaltén Loft" width="80" style="margin-bottom: 24px;">
        <h1 style="color: #2C3E2D; font-size: 28px;">Thanks, ${data.guestName}!</h1>
        <p>We hope you loved El Chaltén as much as we do.</p>
        <p>If you have a moment, a review means the world to us:</p>
        <a href="https://www.airbnb.com.ar/users/profile/1470434834287428445" style="display: inline-block; background: #B56A3F; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">Leave a Review</a>
        <h3 style="color: #2C3E2D;">Come back and save</h3>
        <p>Book direct next time at <strong>chaltenloft.com</strong> and skip the Airbnb fee — you save 15-20%.</p>
        <p>See you in Patagonia! 🏔️</p>
        <p>— Gabriel</p>
        <hr style="border: none; border-top: 1px solid #F0EBE3; margin: 32px 0;">
        <p style="color: #8B8578; font-size: 13px;">Chaltén Loft · El Chaltén, Patagonia Argentina</p>
      </div>
    `,
  })
}
