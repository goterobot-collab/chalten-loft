import { NextResponse } from 'next/server'
import { fetchAirbnbGuestData } from '@/lib/gmail-reader'

// Debug endpoint to see raw parsed email data with detailed diagnostics
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const guestNameFilter = searchParams.get('name')?.toLowerCase() || ''

  try {
    const allGuests = await fetchAirbnbGuestData()

    // Filter to specific guest if requested
    const filtered = guestNameFilter
      ? allGuests.filter(g => g.guestName.toLowerCase().includes(guestNameFilter))
      : allGuests

    // Sort by checkIn date, newest first
    const sorted = filtered.sort((a, b) => b.checkIn.localeCompare(a.checkIn))

    // Group by property
    const byProperty: Record<string, any[]> = {}
    for (const guest of sorted) {
      const prop = guest.propertyListing
      if (!byProperty[prop]) byProperty[prop] = []
      byProperty[prop].push({
        guestName: guest.guestName,
        guests: guest.guests,
        checkIn: guest.checkIn,
        checkOut: guest.checkOut,
        nights: Math.ceil(
          (new Date(guest.checkOut).getTime() - new Date(guest.checkIn).getTime()) / (1000 * 60 * 60 * 24)
        ),
        confirmationCode: guest.confirmationCode,
        emailDate: guest.emailDate,
      })
    }

    return NextResponse.json({
      totalEmails: allGuests.length,
      filtered: filtered.length,
      byProperty,
      all: sorted,
    })
  } catch (err) {
    return NextResponse.json({
      error: String(err),
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
    }, { status: 500 })
  }
}
