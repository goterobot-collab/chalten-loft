'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function HeroSearchWidget() {
  const t = useTranslations('home')
  const router = useRouter()
  const pathname = usePathname()

  const locale = pathname.split('/')[1] || 'es'

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const defaultCheckIn = today.toISOString().split('T')[0]
  const defaultCheckOut = tomorrow.toISOString().split('T')[0]

  const [checkIn, setCheckIn] = useState(defaultCheckIn)
  const [checkOut, setCheckOut] = useState(defaultCheckOut)
  const [guests, setGuests] = useState('2')

  function handleSearch() {
    const params = new URLSearchParams({ checkIn, checkOut, guests })
    router.push(`/${locale}/properties?${params.toString()}`)
  }

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 max-w-3xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="text-left">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
            {t('checkIn')}
          </label>
          <input
            type="date"
            value={checkIn}
            min={defaultCheckIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full border-0 border-b-2 border-surface bg-transparent px-0 py-2 text-dark text-sm focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div className="text-left">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
            {t('checkOut')}
          </label>
          <input
            type="date"
            value={checkOut}
            min={checkIn || defaultCheckIn}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full border-0 border-b-2 border-surface bg-transparent px-0 py-2 text-dark text-sm focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div className="text-left">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
            {t('guests')}
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full border-0 border-b-2 border-surface bg-transparent px-0 py-2 text-dark text-sm focus:outline-none focus:border-accent transition-colors"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="w-full bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl px-6 py-3 transition-all hover:shadow-lg hover:-translate-y-0.5 text-sm"
          >
            {t('search')}
          </button>
        </div>
      </div>
    </div>
  )
}
