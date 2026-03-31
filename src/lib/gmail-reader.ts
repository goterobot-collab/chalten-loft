import { google } from 'googleapis'

// ── OAuth2 Gmail client ──────────────────────────────────────────────────────
// Setup: run scripts/get-gmail-token.mjs once to get GOOGLE_GMAIL_REFRESH_TOKEN

function getGmailClient() {
  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID?.trim(),
    process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim(),
  )
  oauth2.setCredentials({
    refresh_token: process.env.GOOGLE_GMAIL_REFRESH_TOKEN?.trim(),
  })
  return google.gmail({ version: 'v1', auth: oauth2 })
}

export type GuestData = {
  confirmationCode: string
  guestName: string
  checkIn: string   // YYYY-MM-DD
  checkOut: string  // YYYY-MM-DD
  guests: number
  propertyListing: string  // e.g. "1- Chaltén Loft"
  emailDate: string        // ISO timestamp
}

// ── Main export: fetch all Airbnb confirmation emails ───────────────────────

export async function fetchAirbnbGuestData(): Promise<GuestData[]> {
  if (!process.env.GOOGLE_OAUTH_CLIENT_ID || !process.env.GOOGLE_GMAIL_REFRESH_TOKEN) {
    return []
  }

  const gmail = getGmailClient()
  const results: GuestData[] = []

  const search = await gmail.users.messages.list({
    userId: 'me',
    q: 'reserva confirmada',
    maxResults: 500,
  })

  const messages = search.data.messages || []

  for (const msg of messages) {
    if (!msg.id) continue
    try {
      const full = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
        format: 'full',
      })

      const bodyText = extractBody(full.data.payload)
      const guest = parseEmailBody(bodyText, full.data.internalDate)
      if (guest) results.push(guest)
    } catch {
      // Skip emails that fail to parse
    }
  }

  return results
}

// ── Build a map keyed by checkIn|checkOut for quick lookup ──────────────────

export async function buildGuestMap(): Promise<Map<string, GuestData>> {
  const guests = await fetchAirbnbGuestData()
  const map = new Map<string, GuestData>()

  for (const g of guests) {
    const key = `${g.checkIn}|${g.checkOut}`
    // Keep the most recent email if duplicates exist
    const existing = map.get(key)
    if (!existing || g.emailDate > existing.emailDate) {
      map.set(key, g)
    }
  }

  return map
}

// ── Helpers ──────────────────────────────────────────────────────────────────

type GmailPayload = {
  mimeType?: string | null
  body?: { data?: string | null } | null
  parts?: GmailPayload[] | null
}

function extractBody(payload?: GmailPayload | null): string {
  if (!payload) return ''

  if (payload.body?.data) {
    const decoded = Buffer.from(payload.body.data, 'base64url').toString('utf-8')
    if (payload.mimeType === 'text/plain') return decoded
    // For HTML, strip tags
    return stripHtml(decoded)
  }

  if (payload.parts) {
    // Prefer plain text
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        return Buffer.from(part.body.data, 'base64url').toString('utf-8')
      }
    }
    // Fall back to HTML
    for (const part of payload.parts) {
      if (part.mimeType === 'text/html' && part.body?.data) {
        return stripHtml(Buffer.from(part.body.data, 'base64url').toString('utf-8'))
      }
      // Recurse into multipart
      if (part.mimeType?.startsWith('multipart/')) {
        const text = extractBody(part)
        if (text) return text
      }
    }
  }

  return ''
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s{2,}/g, ' ')
}

const MONTH_MAP: Record<string, string> = {
  ene: '01', feb: '02', mar: '03', abr: '04', may: '05', jun: '06',
  jul: '07', ago: '08', sep: '09', oct: '10', nov: '11', dic: '12',
}

// Parse "lun, 30 mar" or "30 mar" → "YYYY-MM-DD"
function parseSpanishDate(raw: string, emailYear: number): string | null {
  const match = raw.match(/(\d{1,2})\s+(\w{3})/)
  if (!match) return null
  const day = match[1].padStart(2, '0')
  const month = MONTH_MAP[match[2].toLowerCase()]
  if (!month) return null
  return `${emailYear}-${month}-${day}`
}

function inferYear(dateStr: string, emailTimestamp: number): string {
  const emailDate = new Date(emailTimestamp)
  const emailYear = emailDate.getFullYear()
  const emailMonth = emailDate.getMonth() + 1 // 1-12

  const match = dateStr.match(/(\d{1,2})\s+(\w{3})/)
  if (!match) return String(emailYear)

  const dateMonth = parseInt(MONTH_MAP[match[2].toLowerCase()] || '0')
  // If event month is well before email month, it's next year
  // (e.g. email in Nov, event in Feb → next year)
  if (dateMonth > 0 && dateMonth < emailMonth - 3) {
    return String(emailYear + 1)
  }
  return String(emailYear)
}

function parseEmailBody(text: string, internalDate?: string | null): GuestData | null {
  if (!text) return null

  const emailTimestamp = internalDate ? parseInt(internalDate) : Date.now()
  const emailYear = new Date(emailTimestamp).getFullYear()

  // Confirmation code
  const codeMatch = text.match(/[Cc][oó]digo de confirmaci[oó]n\s+([A-Z0-9]{6,12})/)
  if (!codeMatch) return null
  const confirmationCode = codeMatch[1]

  // Viajeros
  const viajerosMatch = text.match(/Viajeros\s+(\d+)\s+adulto/)
  const guests = viajerosMatch ? parseInt(viajerosMatch[1]) : 1

  // Dates — find after "Llegada" and "Salida" labels
  const llegadaMatch = text.match(/Llegada\s+([\w,]+\s+\d{1,2}\s+\w{3})/)
  const salidaMatch = text.match(/Salida\s+([\w,]+\s+\d{1,2}\s+\w{3})/)
  if (!llegadaMatch || !salidaMatch) return null

  const checkInYear = inferYear(llegadaMatch[1], emailTimestamp)
  const checkOutYear = inferYear(salidaMatch[1], emailTimestamp)

  const checkIn = parseSpanishDate(llegadaMatch[1], parseInt(checkInYear))
  const checkOut = parseSpanishDate(salidaMatch[1], parseInt(checkOutYear))
  if (!checkIn || !checkOut) return null

  // Guest name — "¡Nueva reserva confirmada! [Name] llega"
  const nameMatch = text.match(/[Nn]ueva reserva confirmada[!.]?\s+(.+?)\s+llega/)
  const guestName = nameMatch ? nameMatch[1].trim() : ''

  // Property listing name
  const propMatch = text.match(/(\d+[-–]\s*Chaltén Loft[^\n\r]*)/)
  const propertyListing = propMatch ? propMatch[1].trim() : ''

  return {
    confirmationCode,
    guestName,
    checkIn,
    checkOut,
    guests,
    propertyListing,
    emailDate: new Date(emailTimestamp).toISOString(),
  }
}
