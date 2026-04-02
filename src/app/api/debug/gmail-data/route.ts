import { NextResponse } from 'next/server'
import { buildGuestMap, fetchRawEmailMeta } from '@/lib/gmail-reader'

// Debug endpoint to see what Gmail data is currently extracted
// ?raw=1           → show raw subjects/from of ALL emails found (before parsing)
// ?raw=1&q=QUERY   → use custom Gmail search query
// ?raw=1&name=dario → filter raw results by subject containing name
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const showRaw = searchParams.get('raw') === '1'
  const customQuery = searchParams.get('q') || undefined
  const filterName = searchParams.get('name')?.toLowerCase()

  if (showRaw) {
    const raw = await fetchRawEmailMeta(customQuery)
    const filtered = filterName
      ? raw.emails.filter(e => e.subject.toLowerCase().includes(filterName) || e.from.toLowerCase().includes(filterName))
      : raw.emails
    return NextResponse.json({ totalFound: raw.totalFound, filtered: filtered.length, emails: filtered })
  }

  // Original behavior below
  try {
    const guestMap = await buildGuestMap()

    const data = Array.from(guestMap.entries()).map(([key, value]) => ({
      key,
      confirmationCode: value.confirmationCode,
      guestName: value.guestName,
      guests: value.guests,
      checkIn: value.checkIn,
      checkOut: value.checkOut,
      propertyListing: value.propertyListing,
      emailDate: value.emailDate,
    }))

    // Filter to show only recent entries (this month and next)
    const now = new Date()
    const recentData = data.filter(d => {
      const [year, month] = d.checkIn.split('-')
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth() + 1
      const entryYear = parseInt(year)
      const entryMonth = parseInt(month)

      return (entryYear === currentYear && entryMonth >= currentMonth) ||
             (entryYear === currentYear + 1 && entryMonth <= currentMonth + 2)
    })

    return NextResponse.json({
      total: guestMap.size,
      recent: recentData,
      allKeys: Array.from(guestMap.keys()),
    })
  } catch (err) {
    return NextResponse.json({
      error: String(err),
      message: err instanceof Error ? err.message : 'Unknown error',
    }, { status: 500 })
  }
}
