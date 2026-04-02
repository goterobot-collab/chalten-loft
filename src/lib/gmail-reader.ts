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

  // Limit to recent emails (2 years) — older ones are for past bookings we don't need
  // Search for Airbnb confirmation emails from Airbnb's express address
  const search = await gmail.users.messages.list({
    userId: 'me',
    q: 'from:express@airbnb.com newer_than:730d',
    maxResults: 500,  // Increased from 200 to catch more reservations
  })

  const messages = search.data.messages || []

  // Fetch all messages in parallel for speed
  const fetched = await Promise.allSettled(
    messages
      .filter(msg => !!msg.id)
      .map(msg =>
        gmail.users.messages.get({
          userId: 'me',
          id: msg.id!,
          format: 'full',
        })
      )
  )

  for (const result of fetched) {
    if (result.status !== 'fulfilled') continue
    try {
      const full = result.value
      const bodyText = extractBody(full.data.payload)
      const guest = parseEmailBody(bodyText, full.data.internalDate)
      if (guest) {
        results.push(guest)
      } else {
        // Log failed parse attempts for debugging
        if (bodyText && bodyText.length > 0) {
          const hasCodigo = bodyText.match(/c[oó]digo\s+de\s+confirmaci[oó]n/i)
          // Only log if it looks like an Airbnb email but failed to parse
          if (hasCodigo) {
            console.warn('[Gmail Parser] Email with confirmation code failed to parse', {
              hasLlegada: !!bodyText.match(/llegada/i),
              hasSalida: !!bodyText.match(/salida/i),
              hasViajeros: !!bodyText.match(/viajeros/i),
              bodySample: bodyText.substring(0, 200),
            })
          }
        }
      }
    } catch (err) {
      // Skip emails that fail to parse
      console.warn('[Gmail Parser] Error parsing email:', err instanceof Error ? err.message : String(err))
    }
  }

  return results
}

// ── Derive property slug from email property name ─────────────────────────

export function propertyToSlug(propertyListing: string): string {
  const lower = propertyListing.toLowerCase()
  // "CHALTÉN LOFT / DPTO2", "CHALTÉN LOFT/ DPTO. 2", etc.
  const dptoMatch = lower.match(/dpto\.?\s*(\d)/)
  if (dptoMatch) {
    if (dptoMatch[1] === '1') return 'chalten-loft-fitz-roy'
    if (dptoMatch[1] === '2') return 'chalten-loft-cerro-torre'
    if (dptoMatch[1] === '3') return 'chalten-loft-poincenot'
  }
  // "1- CHALTÉN LOFT", "CHALTÉN LOFT 1"
  if (/\b1\b/.test(lower) || lower.startsWith('1')) return 'chalten-loft-fitz-roy'
  if (/\b2\b/.test(lower)) return 'chalten-loft-cerro-torre'
  if (/\b3\b/.test(lower)) return 'chalten-loft-poincenot'
  return 'chalten-loft-fitz-roy'
}

// ── Build a map keyed by slug|checkIn|checkOut for quick lookup ───────────

export async function buildGuestMap(): Promise<Map<string, GuestData>> {
  const guests = await fetchAirbnbGuestData()
  const map = new Map<string, GuestData>()

  for (const g of guests) {
    const slug = propertyToSlug(g.propertyListing)
    const key = `${slug}|${g.checkIn}|${g.checkOut}`
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

  // Confirmation code — matches "CÓDIGO DE CONFIRMACIÓN\nHMRR4XZNJX" (case-insensitive)
  const codeMatch = text.match(/c[oó]digo\s+de\s+confirmaci[oó]n\s+([A-Z0-9]{6,12})/i)
  if (!codeMatch) return null
  const confirmationCode = codeMatch[1]

  // Guests — Multiple fallback patterns for different Airbnb email formats
  let guests = 1

  // Pattern 1: "VIAJEROS\n2 adultos" (most common in Spanish Airbnb)
  let match = text.match(/viajeros\s*[\n\r]?\s*(\d+)\s+adultos?/i)
  if (match) {
    guests = parseInt(match[1])
  }

  // Pattern 2: "X adulto" without "viajeros"
  if (guests === 1) {
    match = text.match(/(\d+)\s+adultos?/i)
    if (match) {
      guests = parseInt(match[1])
    }
  }

  // Pattern 3: "Huéspedes: X" or "Grupo de X"
  if (guests === 1) {
    match = text.match(/(?:hu[eé]spedes?|grupo\s+de)[\s:]+(\d+)/i)
    if (match) {
      guests = parseInt(match[1])
    }
  }

  // Pattern 4: Look for "X person" or "X people" (English format)
  if (guests === 1) {
    match = text.match(/(\d+)\s+(?:person|people|guest)/i)
    if (match) {
      guests = parseInt(match[1])
    }
  }

  // Dates — Airbnb emails show dates in a table:
  // "Llegada       Salida\n\njue, 17 dic   mar, 22 dic"
  // Both dates appear on the SAME line after the column headers
  let checkInRaw = ''
  let checkOutRaw = ''

  const datesOnSameLine = text.match(
    /Llegada[\s\S]{0,300}?Salida[\s\S]{0,200}?([\w]+,\s+\d{1,2}\s+\w{3})\s+([\w]+,\s+\d{1,2}\s+\w{3})/i
  )
  if (datesOnSameLine) {
    checkInRaw = datesOnSameLine[1]
    checkOutRaw = datesOnSameLine[2]
  } else {
    // Fallback: dates on separate lines
    const llegadaMatch = text.match(/Llegada\s+([\w,]+\s+\d{1,2}\s+\w{3})/i)
    const salidaMatch = text.match(/Salida\s+([\w,]+\s+\d{1,2}\s+\w{3})/i)
    if (!llegadaMatch || !salidaMatch) return null
    checkInRaw = llegadaMatch[1]
    checkOutRaw = salidaMatch[1]
  }

  const checkInYear = inferYear(checkInRaw, emailTimestamp)
  const checkOutYear = inferYear(checkOutRaw, emailTimestamp)

  const checkIn = parseSpanishDate(checkInRaw, parseInt(checkInYear))
  const checkOut = parseSpanishDate(checkOutRaw, parseInt(checkOutYear))
  if (!checkIn || !checkOut) {
    console.warn('[Gmail Parser] Date parsing failed', {
      checkInRaw,
      checkOutRaw,
      checkIn,
      checkOut,
      confirmationCode,
    })
    return null
  }

  // Guest name — Multiple patterns to handle different Airbnb email formats
  let rawName = ''

  // Pattern 1: "¡NUEVA RESERVA CONFIRMADA! GASTON LLEGA EL..." (most common)
  let nameMatch = text.match(/nueva\s+reserva\s+confirmada[!.]?\s+(.+?)\s+llega/i)
  if (nameMatch) {
    rawName = nameMatch[1].trim()
  }

  // Pattern 2: "NUEVA RESERVA DE [NAME]" or just "[NAME] ha hecho una reserva"
  if (!rawName) {
    nameMatch = text.match(/nueva\s+reserva\s+(?:de|confirmada)?\s+(.+?)(?:\s+(?:ha|llega|está|en|del)|\s*$)/i)
    if (nameMatch) {
      rawName = nameMatch[1].trim()
    }
  }

  // Pattern 3: Look for name after "Viajero principal:" or "Huésped:"
  if (!rawName) {
    nameMatch = text.match(/(?:viajero\s+principal|hu[eé]sped)[:\s]+(.+?)(?:\s+\(|$)/i)
    if (nameMatch) {
      rawName = nameMatch[1].trim()
    }
  }

  // Normalize ALL-CAPS names: "GASTON PAZ" → "Gaston Paz", handles Unicode accents (É→é)
  const guestName = rawName === rawName.toUpperCase() && rawName.length > 0
    ? rawName.split(' ').map(w => w.length > 0 ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '').join(' ').trim()
    : rawName

  // Property listing — "CHALTÉN LOFT / DPTO2" or "1- Chaltén Loft..."
  const propMatch = text.match(/(\d+[-–]\s*chalt[eé]n\s+loft[^\n\r]*)/i)
    ?? text.match(/(chalt[eé]n\s+loft\s*\/?\s*dpto\s*\d+[^\n\r]*)/i)
    ?? text.match(/(chalt[eé]n\s+loft[^\n\r]{0,30})/i)
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
