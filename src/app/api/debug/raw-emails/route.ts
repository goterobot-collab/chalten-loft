import { NextResponse } from 'next/server'
import { google } from 'googleapis'

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

// Debug endpoint: shows ALL raw email subjects+from before any parsing
// Use ?q=QUERY to try different search queries
// Use ?name=dario to filter results by subject containing that string
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const customQuery = searchParams.get('q')
  const filterName = searchParams.get('name')?.toLowerCase()

  const gmail = getGmailClient()

  const queries = customQuery
    ? [customQuery]
    : [
        'from:airbnb.com -is:spam',
        'from:automated@airbnb.com',
        'subject:"Reserva confirmada" OR subject:"Reservation confirmed"',
      ]

  const results: Record<string, any> = {}

  for (const q of queries) {
    try {
      const search = await gmail.users.messages.list({
        userId: 'me',
        q,
        maxResults: 500,
      })

      const messages = search.data.messages || []

      const fetched = await Promise.allSettled(
        messages
          .filter(msg => !!msg.id)
          .slice(0, 200) // limit to avoid timeout
          .map(msg =>
            gmail.users.messages.get({
              userId: 'me',
              id: msg.id!,
              format: 'metadata',
              metadataHeaders: ['Subject', 'From', 'Date'],
            })
          )
      )

      const emails = fetched
        .filter(r => r.status === 'fulfilled')
        .map(r => {
          const full = (r as PromiseFulfilledResult<any>).value
          const headers: any[] = full.data.payload?.headers || []
          const get = (name: string) => headers.find((h: any) => h.name === name)?.value || ''
          return {
            subject: get('Subject'),
            from: get('From'),
            date: get('Date'),
            internalDate: full.data.internalDate,
          }
        })
        .filter(e => !filterName || e.subject.toLowerCase().includes(filterName) || e.from.toLowerCase().includes(filterName))
        .sort((a, b) => parseInt(b.internalDate || '0') - parseInt(a.internalDate || '0'))

      results[q] = {
        totalFound: messages.length,
        fetched: emails.length,
        emails,
      }
    } catch (err) {
      results[q] = { error: String(err) }
    }
  }

  return NextResponse.json(results)
}
