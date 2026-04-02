import { NextResponse } from 'next/server'
import { buildGuestMap } from '@/lib/gmail-reader'

// Debug endpoint to see what Gmail data is currently extracted
export async function GET() {
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
