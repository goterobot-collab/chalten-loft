'use client'

import { useState, useEffect } from 'react'
import { DayPicker, type DateRange } from 'react-day-picker'
import { useTranslations } from 'next-intl'
import 'react-day-picker/style.css'

type Props = {
  propertySlug: string
  onDateChange?: (range: DateRange | undefined) => void
}

export default function AvailabilityCalendar({ propertySlug, onDateChange }: Props) {
  const t = useTranslations('home')
  const [blockedDates, setBlockedDates] = useState<Date[]>([])
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAvailability() {
      try {
        const res = await fetch(`/api/availability/${propertySlug}`)
        const data = await res.json()
        if (data.blockedDates) {
          setBlockedDates(
            data.blockedDates.map((d: string) => new Date(d + 'T12:00:00'))
          )
        }
      } catch (err) {
        console.error('Failed to fetch availability:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAvailability()
  }, [propertySlug])

  function handleSelect(range: DateRange | undefined) {
    setSelectedRange(range)
    onDateChange?.(range)
  }

  const nights =
    selectedRange?.from && selectedRange?.to
      ? Math.ceil(
          (selectedRange.to.getTime() - selectedRange.from.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="h-[320px] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <DayPicker
          mode="range"
          selected={selectedRange}
          onSelect={handleSelect}
          disabled={[
            { before: new Date() },
            ...blockedDates,
          ]}
          numberOfMonths={2}
          weekStartsOn={1}
          classNames={{
            root: 'text-sm',
            months: 'flex flex-col sm:flex-row gap-4',
            month_caption: 'font-heading text-primary text-base font-semibold mb-2',
            day_button: 'w-10 h-10 rounded-full hover:bg-accent/10 transition-colors',
            selected: 'bg-accent text-white rounded-full',
            range_middle: 'bg-accent/10',
            disabled: 'text-muted/40 line-through cursor-not-allowed',
            today: 'font-bold text-accent',
          }}
        />
      )}

      {nights > 0 && (
        <div className="bg-surface rounded-lg p-4 text-center">
          <span className="text-primary font-heading text-lg">
            {nights} {nights === 1 ? 'night' : 'nights'} selected
          </span>
        </div>
      )}
    </div>
  )
}
