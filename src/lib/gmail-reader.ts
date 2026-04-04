import { google } from 'googleapis'
import { readFileSync } from 'fs'
import { join } from 'path'

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

// ── VRBO listing ID → property slug mapping ──────────────────────────────────
// Fill in the VRBO listing IDs for each apartment (visible in your Vrbo host dashboard)
const VRBO_LISTING_MAP: Record<string, string> = {
  '4985155': 'chalten-loft-cerro-torre', // TODO: verify which apt this is
  // '1234567': 'chalten-loft-fitz-roy',
  // '8901234': 'chalten-loft-poincenot',
}

// ── Main export: fetch all Airbnb confirmation emails ───────────────────────

export async function fetchAirbnbGuestData(): Promise<GuestData[]> {
  if (!process.env.GOOGLE_OAUTH_CLIENT_ID || !process.env.GOOGLE_GMAIL_REFRESH_TOKEN) {
    return []
  }

  const gmail = getGmailClient()
  const results: GuestData[] = []

  // Search for Airbnb RESERVATION confirmation emails specifically
  // Narrow query avoids review/notification emails (500→~120 results)
  const search = await gmail.users.messages.list({
    userId: 'me',
    q: 'from:airbnb.com (subject:"Reserva confirmada" OR subject:"Reservation confirmed" OR subject:"confirmada") -is:spam',
    maxResults: 300,
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
      // Extract subject from email headers
      const headers = full.data.payload?.headers || []
      const subjectHeader = headers.find((h: any) => h.name === 'Subject')
      const subject = subjectHeader?.value || ''
      const guest = parseEmailBody(bodyText, full.data.internalDate, subject)
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

  // Log if we didn't find any emails at all
  if (results.length === 0 && messages.length > 0) {
    console.warn('[Gmail Parser] Found', messages.length, 'emails but failed to parse all of them')
  }

  return results
}

// ── Raw email subjects for debugging ────────────────────────────────────────

export type RawEmailMeta = {
  subject: string
  from: string
  date: string
  internalDate: string
  parsed: boolean
}

export async function fetchRawEmailMeta(query?: string): Promise<{ totalFound: number; emails: RawEmailMeta[] }> {
  if (!process.env.GOOGLE_OAUTH_CLIENT_ID || !process.env.GOOGLE_GMAIL_REFRESH_TOKEN) {
    return { totalFound: 0, emails: [] }
  }

  const gmail = getGmailClient()
  const q = query || 'from:airbnb.com -is:spam'

  const search = await gmail.users.messages.list({ userId: 'me', q, maxResults: 500 })
  const messages = search.data.messages || []

  const fetched = await Promise.allSettled(
    messages
      .filter(msg => !!msg.id)
      .slice(0, 300)
      .map(msg =>
        gmail.users.messages.get({
          userId: 'me',
          id: msg.id!,
          format: 'metadata',
          metadataHeaders: ['Subject', 'From', 'Date'],
        })
      )
  )

  // Also get parsed emails to mark which ones succeeded
  const parsed = await fetchAirbnbGuestData()
  const parsedCodes = new Set(parsed.map(g => g.confirmationCode))

  const emails: RawEmailMeta[] = fetched
    .filter(r => r.status === 'fulfilled')
    .map(r => {
      const full = (r as PromiseFulfilledResult<any>).value
      const headers: any[] = full.data.payload?.headers || []
      const get = (name: string) => headers.find((h: any) => h.name === name)?.value || ''
      const subject = get('Subject')
      // Check if this email was successfully parsed (rough check by confirmation code in subject)
      const codeInSubject = subject.match(/\b(HM[A-Z0-9]{8,10})\b/)?.[1]
      return {
        subject,
        from: get('From'),
        date: get('Date'),
        internalDate: full.data.internalDate || '',
        parsed: codeInSubject ? parsedCodes.has(codeInSubject) : false,
      }
    })
    .sort((a, b) => parseInt(b.internalDate) - parseInt(a.internalDate))

  return { totalFound: messages.length, emails }
}

// ── Derive property slug from email property name ─────────────────────────

export function propertyToSlug(propertyListing: string): string {
  // VRBO format: "vrbo-4985155" — look up in mapping
  const vrboMatch = propertyListing.match(/^vrbo-(\d+)/)
  if (vrboMatch) {
    return VRBO_LISTING_MAP[vrboMatch[1]] || 'chalten-loft-cerro-torre'
  }
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

// ── VRBO/HomeAway email parser ───────────────────────────────────────────────

export async function fetchVrboGuestData(): Promise<GuestData[]> {
  if (!process.env.GOOGLE_OAUTH_CLIENT_ID || !process.env.GOOGLE_GMAIL_REFRESH_TOKEN) {
    return []
  }

  const gmail = getGmailClient()
  const results: GuestData[] = []

  // VRBO/HomeAway sends from messages.homeaway.com / vrbo.com
  const search = await gmail.users.messages.list({
    userId: 'me',
    q: 'from:messages.homeaway.com OR from:vrbo.com (subject:"Reservation" OR subject:"reservation") -is:spam',
    maxResults: 100,
  })

  const messages = search.data.messages || []
  if (messages.length === 0) return []

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
      const headers = full.data.payload?.headers || []
      const subject = headers.find((h: any) => h.name === 'Subject')?.value || ''
      const bodyText = extractBody(full.data.payload)
      const guest = parseVrboEmail(subject, bodyText, full.data.internalDate)
      if (guest) results.push(guest)
    } catch {
      // skip
    }
  }

  return results
}

// Parse VRBO email subject: "Reservation from Yu Zheng: Feb 28 - Mar 3, 2026 - Vrbo #4985155"
function parseVrboEmail(subject: string, body: string, internalDate?: string | null): GuestData | null {
  // Guest name
  const nameMatch = subject.match(/Reservation\s+from\s+(.+?):/i)
  if (!nameMatch) return null
  const guestName = nameMatch[1].trim()

  // VRBO listing ID
  const listingMatch = subject.match(/Vrbo\s+#(\d+)/i)
  const listingId = listingMatch ? listingMatch[1] : ''
  const slug = VRBO_LISTING_MAP[listingId] || 'chalten-loft-fitz-roy'

  // Confirmation code: use VRBO ID + timestamp
  const confirmationCode = listingId ? `VRBO${listingId}` : `VRBO_${Date.now()}`

  // Dates: "Feb 28 - Mar 3, 2026"
  const datesMatch = subject.match(/:\s+([A-Za-z]+\s+\d{1,2})\s*[-–]\s*([A-Za-z]+\s+\d{1,2}),?\s*(\d{4})/)
  if (!datesMatch) return null

  const MONTH_EN: Record<string, string> = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
  }

  const parseEnDate = (raw: string, year: string): string | null => {
    const m = raw.match(/([A-Za-z]+)\s+(\d{1,2})/)
    if (!m) return null
    const month = MONTH_EN[m[1].toLowerCase().slice(0, 3)]
    if (!month) return null
    return `${year}-${month}-${m[2].padStart(2, '0')}`
  }

  const year = datesMatch[3]
  const checkIn = parseEnDate(datesMatch[1], year)
  const checkOut = parseEnDate(datesMatch[2], year)
  if (!checkIn || !checkOut) return null

  // Guests — try to extract from body
  let guests = 2 // default
  const guestsMatch = body.match(/(\d+)\s+(?:guest|person|adult|traveler)/i)
  if (guestsMatch) guests = parseInt(guestsMatch[1])

  return {
    confirmationCode,
    guestName,
    checkIn,
    checkOut,
    guests,
    propertyListing: `vrbo-${listingId}`,
    emailDate: new Date(parseInt(internalDate || '0') || Date.now()).toISOString(),
  }
}

// ── Build a map keyed by slug|checkIn|checkOut for quick lookup ───────────

export async function buildGuestMap(): Promise<Map<string, GuestData>> {
  const [airbnbGuests, vrboGuests] = await Promise.all([
    fetchAirbnbGuestData(),
    fetchVrboGuestData(),
  ])
  const guests = [...airbnbGuests, ...vrboGuests]
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

  // Merge manual overrides (src/data/guest-overrides.json)
  // These take priority and fix reservations that Gmail fails to parse
  try {
    const overridesPath = join(process.cwd(), 'src', 'data', 'guest-overrides.json')
    const raw = readFileSync(overridesPath, 'utf-8')
    const overrides: Array<{
      slug: string
      checkIn: string
      checkOut: string
      guestName: string
      guests: number
      confirmationCode: string
    }> = JSON.parse(raw)

    for (const o of overrides) {
      const key = `${o.slug}|${o.checkIn}|${o.checkOut}`
      map.set(key, {
        confirmationCode: o.confirmationCode,
        guestName: o.guestName,
        checkIn: o.checkIn,
        checkOut: o.checkOut,
        guests: o.guests,
        propertyListing: o.slug,
        emailDate: new Date().toISOString(),
      })
    }
  } catch {
    // File doesn't exist or parse error — ignore silently
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

function parseEmailBody(text: string, internalDate?: string | null, subject: string = ''): GuestData | null {
  if (!text) return null

  const emailTimestamp = internalDate ? parseInt(internalDate) : Date.now()

  // Confirmation code — multiple patterns to handle different email formats
  let codeMatch = text.match(/c[oó]digo\s+de\s+confirmaci[oó]n[\s:]+([A-Z0-9]{6,12})/i)
  // Fallback: look for pattern like "HM[6+ alphanumeric]" anywhere
  if (!codeMatch) {
    codeMatch = text.match(/\b(HM[A-Z0-9]{8,10})\b/)
  }
  // Fallback: look for any 8-10 character alphanumeric code
  if (!codeMatch) {
    codeMatch = text.match(/(?:confirmaci[oó]n|confirmation)[:\s]+([A-Z0-9]{8,12})/i)
  }
  // Fallback: Extract from subject if available
  if (!codeMatch && subject) {
    // Subject might have code like "Reserva confirmada HM123456" or similar
    codeMatch = subject.match(/\b(HM[A-Z0-9]{8,10})\b/)
  }
  // If still no code, use a placeholder based on email date and property
  const confirmationCode = codeMatch ? codeMatch[1] : `MISSING_${Date.now()}`

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

  let checkIn = parseSpanishDate(checkInRaw, parseInt(checkInYear))
  let checkOut = parseSpanishDate(checkOutRaw, parseInt(checkOutYear))

  // Fallback: try to extract dates from subject line if body parsing failed
  if ((!checkIn || !checkOut) && subject) {
    // Look for "llega el 2 abr" or "check-in April 2" patterns
    const checkInMatch = subject.match(/(?:llega|check.?in)\s+(?:el\s+)?(\d{1,2})\s+(\w{3})/i) ||
                         subject.match(/(?:llega|check.?in)\s+(?:el\s+)?(\d{1,2})-(\d{1,2})\s+(\w{3})/)
    if (checkInMatch) {
      const day = checkInMatch[1].padStart(2, '0')
      const month = MONTH_MAP[checkInMatch[2].toLowerCase()] || MONTH_MAP[checkInMatch[3]?.toLowerCase()] || '00'
      if (month !== '00') {
        const year = inferYear(`${day} ${checkInMatch[2]}`, emailTimestamp)
        checkIn = `${year}-${month}-${day}`
      }
    }
  }

  // If we have checkIn but no checkOut, infer checkout as +3 days (reasonable default for Airbnb)
  if (checkIn && !checkOut) {
    const checkInDate = new Date(checkIn)
    checkInDate.setDate(checkInDate.getDate() + 3)
    checkOut = checkInDate.toISOString().split('T')[0]
  }

  if (!checkIn || !checkOut) {
    console.warn('[Gmail Parser] Date parsing failed', {
      checkInRaw,
      checkOutRaw,
      checkIn,
      checkOut,
      confirmationCode,
      hasSubject: !!subject,
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

  // Pattern 4: Extract from subject line as fallback
  // Subject format: "Reserva confirmada: Dario Premat llega el 2 abr" or "Confirmation: John Doe check in..."
  if (!rawName && subject) {
    // Try to extract name between "confirmada:" and "llega"/"check"/"el"
    let subjectMatch = subject.match(/(?:reserva\s+)?confirmada[:\s]+(.+?)(?:\s+(?:llega|check|el|the|para|a las))/i)
    if (!subjectMatch) {
      // Fallback: just take everything between confirmada: and any known delimiter
      subjectMatch = subject.match(/confirmada[:\s]+(.+?)(?:\s+\d|$)/i)
    }
    if (subjectMatch) {
      const extracted = subjectMatch[1].trim()
      // Clean up common unwanted additions
      rawName = extracted.replace(/\s*\(.*?\)/, '').trim()
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
