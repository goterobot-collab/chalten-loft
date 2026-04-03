import { NextResponse } from 'next/server'
import { google } from 'googleapis'

// Lightweight auto-sync: checks Gmail for new Airbnb emails since last check.
// If new emails found → triggers full calendar sync.
// Designed to be called every 2-5 minutes via external cron.

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

// In-memory: last known email count (resets on cold start, which is fine)
let lastKnownCount: number | null = null
let lastSyncTime = 0

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const force = searchParams.get('force') === '1'

  // Rate limit: don't sync more than once per 60 seconds
  const now = Date.now()
  if (!force && now - lastSyncTime < 60_000) {
    return NextResponse.json({
      synced: false,
      reason: 'rate-limited',
      lastSync: new Date(lastSyncTime).toISOString(),
    })
  }

  try {
    const gmail = getGmailClient()

    // Quick check: count Airbnb reservation emails
    const search = await gmail.users.messages.list({
      userId: 'me',
      q: 'from:airbnb.com (subject:"Reserva confirmada" OR subject:"Reservation confirmed" OR subject:"confirmada") -is:spam',
      maxResults: 1, // We only need the total count from resultSizeEstimate
    })

    const currentCount = search.data.resultSizeEstimate ?? 0

    // If count changed (new email arrived) or first run → full sync
    const needsSync = force || lastKnownCount === null || currentCount !== lastKnownCount
    lastKnownCount = currentCount

    if (!needsSync) {
      return NextResponse.json({
        synced: false,
        reason: 'no-changes',
        emailCount: currentCount,
        lastSync: new Date(lastSyncTime).toISOString(),
      })
    }

    // Trigger full sync by calling our own sync endpoint
    const baseUrl = new URL(req.url).origin
    const syncRes = await fetch(`${baseUrl}/api/calendar/sync-airbnb`, {
      cache: 'no-store',
    })
    const syncData = await syncRes.json()

    lastSyncTime = Date.now()

    return NextResponse.json({
      synced: true,
      emailCount: currentCount,
      previousCount: lastKnownCount,
      syncResult: syncData,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json({
      synced: false,
      error: String(err),
    }, { status: 500 })
  }
}
