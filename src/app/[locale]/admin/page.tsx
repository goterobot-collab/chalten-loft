'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Users, Calendar, Home, Save, CheckCircle, MessageCircle } from 'lucide-react'
import Image from 'next/image'

type Booking = {
  id: string
  property_name: string
  property_slug: string
  check_in: string
  check_out: string
  guests_count: number
  guest_name: string | null
  guest_email: string | null
  guest_phone: string | null
  source: string
  status: string
  nights: number
  notes: string | null
}

const SOURCE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  airbnb: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Airbnb' },
  booking: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Booking' },
  vrbo: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'VRBO' },
  direct: { bg: 'bg-green-100', text: 'text-green-700', label: 'Directa' },
  manual: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Manual' },
}

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  async function fetchBookings() {
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .order('check_in', { ascending: true })

    if (data) setBookings(data)
    setLoading(false)
  }

  function updateBooking(id: string, field: string, value: string | number) {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    )
  }

  async function saveBooking(id: string) {
    setSaving(id)
    const booking = bookings.find((b) => b.id === id)
    if (!booking) return

    await supabase
      .from('bookings')
      .update({
        guests_count: booking.guests_count,
        guest_name: booking.guest_name,
        guest_email: booking.guest_email,
        guest_phone: booking.guest_phone,
        source: booking.source,
        notes: booking.notes,
      })
      .eq('id', id)

    // Update cleaning task with correct guest count
    await supabase
      .from('cleaning_tasks')
      .update({ checkout_guests: booking.guests_count })
      .eq('booking_id', id)

    setSaving(null)
    setSaved(id)
    setTimeout(() => setSaved(null), 2000)
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
    })
  }

  // WhatsApp message for Tania
  function getCleaningWhatsApp(booking: Booking) {
    const msg = `🧹 LIMPIEZA — ${booking.property_name}\n📅 Check-out: ${formatDate(booking.check_out)} a las 10:00\n👥 Huéspedes: ${booking.guests_count} personas\n${booking.notes ? `📝 Notas: ${booking.notes}` : ''}`
    return `https://wa.me/5492615402732?text=${encodeURIComponent(msg)}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Group bookings by property
  const grouped = bookings.reduce(
    (acc, b) => {
      const key = b.property_name
      if (!acc[key]) acc[key] = []
      acc[key].push(b)
      return acc
    },
    {} as Record<string, Booking[]>
  )

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Image
            src="/images/logo.png"
            alt="Chaltén Loft"
            width={48}
            height={48}
            className="mix-blend-multiply"
          />
          <div>
            <h1 className="font-heading text-3xl text-primary">Panel Admin</h1>
            <p className="text-muted text-sm">{bookings.length} reservas · Datos de Airbnb + editables</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-xl p-5 border border-surface">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-accent" />
              <div>
                <p className="text-2xl font-bold text-primary">{bookings.length}</p>
                <p className="text-xs text-muted">Reservas</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-surface">
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-accent" />
              <div>
                <p className="text-2xl font-bold text-primary">{Object.keys(grouped).length}</p>
                <p className="text-xs text-muted">Lofts</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-surface">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-accent" />
              <div>
                <p className="text-2xl font-bold text-primary">
                  {bookings.reduce((sum, b) => sum + (b.guests_count || 0), 0)}
                </p>
                <p className="text-xs text-muted">Huéspedes</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-surface">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-accent" />
              <div>
                <p className="text-2xl font-bold text-primary">
                  {bookings.reduce((sum, b) => sum + (b.nights || 0), 0)}
                </p>
                <p className="text-xs text-muted">Noches</p>
              </div>
            </div>
          </div>
        </div>

        {/* Color Legend */}
        <div className="flex flex-wrap gap-3 mb-8">
          {Object.entries(SOURCE_COLORS).map(([key, val]) => (
            <span key={key} className={`px-3 py-1 rounded-full text-xs font-semibold ${val.bg} ${val.text}`}>
              {val.label}
            </span>
          ))}
        </div>

        {/* Bookings by Property */}
        {Object.entries(grouped).map(([propertyName, propertyBookings]) => (
          <div key={propertyName} className="mb-12">
            <h2 className="font-heading text-xl text-primary mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-accent" />
              {propertyName}
              <span className="text-sm text-muted font-normal">
                ({propertyBookings.length} reservas)
              </span>
            </h2>

            <div className="space-y-4">
              {propertyBookings.map((booking) => {
                const sourceStyle = SOURCE_COLORS[booking.source] || SOURCE_COLORS.manual

                return (
                  <div
                    key={booking.id}
                    className={`bg-white rounded-2xl border-l-4 shadow-sm hover:shadow-md transition-all ${
                      booking.source === 'airbnb' ? 'border-l-rose-400' :
                      booking.source === 'booking' ? 'border-l-blue-400' :
                      booking.source === 'vrbo' ? 'border-l-purple-400' :
                      booking.source === 'direct' ? 'border-l-green-400' :
                      'border-l-amber-400'
                    }`}
                  >
                    <div className="p-5">
                      {/* Top row: dates + source badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-xs text-muted uppercase">Check-in</p>
                            <p className="text-lg font-bold text-primary">{formatDate(booking.check_in)}</p>
                          </div>
                          <span className="text-muted">→</span>
                          <div className="text-center">
                            <p className="text-xs text-muted uppercase">Check-out</p>
                            <p className="text-lg font-bold text-primary">{formatDate(booking.check_out)}</p>
                          </div>
                          <div className="text-center px-3">
                            <p className="text-xs text-muted uppercase">Noches</p>
                            <p className="text-lg font-bold text-accent">{booking.nights}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Source selector */}
                          <select
                            value={booking.source}
                            onChange={(e) => updateBooking(booking.id, 'source', e.target.value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border-0 cursor-pointer ${sourceStyle.bg} ${sourceStyle.text}`}
                          >
                            <option value="airbnb">Airbnb</option>
                            <option value="booking">Booking</option>
                            <option value="vrbo">VRBO</option>
                            <option value="direct">Directa</option>
                            <option value="manual">Manual</option>
                          </select>

                          {/* WhatsApp Tania */}
                          <a
                            href={getCleaningWhatsApp(booking)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                            title="Enviar a Tania por WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4 text-green-600" />
                          </a>

                          {/* Save */}
                          <button
                            onClick={() => saveBooking(booking.id)}
                            disabled={saving === booking.id}
                            className="p-2 rounded-lg hover:bg-accent/10 transition-colors"
                            title="Guardar cambios"
                          >
                            {saved === booking.id ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : saving === booking.id ? (
                              <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Save className="w-5 h-5 text-accent" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Editable fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1">
                            Huéspedes
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={6}
                            value={booking.guests_count}
                            onChange={(e) => updateBooking(booking.id, 'guests_count', parseInt(e.target.value) || 1)}
                            className="w-full border border-surface rounded-lg px-3 py-2 text-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-accent/30"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1">
                            Nombre
                          </label>
                          <input
                            type="text"
                            value={booking.guest_name || ''}
                            onChange={(e) => updateBooking(booking.id, 'guest_name', e.target.value)}
                            placeholder="Nombre del huésped..."
                            className="w-full border border-surface rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/30"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={booking.guest_email || ''}
                            onChange={(e) => updateBooking(booking.id, 'guest_email', e.target.value)}
                            placeholder="email@..."
                            className="w-full border border-surface rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/30"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1">
                            Teléfono
                          </label>
                          <input
                            type="tel"
                            value={booking.guest_phone || ''}
                            onChange={(e) => updateBooking(booking.id, 'guest_phone', e.target.value)}
                            placeholder="+54 9..."
                            className="w-full border border-surface rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/30"
                          />
                        </div>
                      </div>

                      {/* Notes / Comments */}
                      <div className="mt-3">
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted mb-1">
                          Comentarios / Notas
                        </label>
                        <textarea
                          value={booking.notes || ''}
                          onChange={(e) => updateBooking(booking.id, 'notes', e.target.value)}
                          placeholder="Ej: Llegan tarde, piden cama extra, viajan con perro..."
                          rows={2}
                          className="w-full border border-surface rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
