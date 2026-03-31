import nodemailer from 'nodemailer'

// Gmail SMTP — can send to ANY email address (Tania, huéspedes, etc.)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export type EmailOptions = {
  to: string | string[]    // One or multiple recipients
  subject: string
  html: string
}

export async function sendEmail(options: EmailOptions) {
  const to = Array.isArray(options.to) ? options.to.join(', ') : options.to

  return transporter.sendMail({
    from: `"Chaltén Loft" <${process.env.GMAIL_USER}>`,
    to,
    subject: options.subject,
    html: options.html,
  })
}

// Pre-configured recipients
export const RECIPIENTS = {
  gabriel: 'chaltenloft@gmail.com',
  tania: 'taniayeminagarrido@gmail.com',
  both: ['chaltenloft@gmail.com', 'taniayeminagarrido@gmail.com'],
}
