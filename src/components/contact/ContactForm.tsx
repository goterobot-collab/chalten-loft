'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export default function ContactForm() {
  const t = useTranslations('contact')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loft, setLoft] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, loft, message }),
      })

      if (res.ok) {
        setStatus('success')
        setName('')
        setEmail('')
        setLoft('')
        setMessage('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <p className="text-green-800 font-heading text-xl mb-2">{t('successTitle')}</p>
        <p className="text-green-600 text-sm">{t('successDesc')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
          {t('name')}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-surface rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all bg-white"
          placeholder={t('namePlaceholder')}
          required
        />
      </div>
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
          {t('email')}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-surface rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all bg-white"
          placeholder="your@email.com"
          required
        />
      </div>
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
          {t('loft')}
        </label>
        <select
          value={loft}
          onChange={(e) => setLoft(e.target.value)}
          className="w-full border border-surface rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all bg-white"
        >
          <option value="">{t('anyLoft')}</option>
          <option value="Dpto 1 — Fitz Roy (75m²)">Dpto 1 — Fitz Roy (75m²)</option>
          <option value="Dpto 2 — Cerro Torre (40m²)">Dpto 2 — Cerro Torre (40m²)</option>
          <option value="Dpto 3 — Poincenot (55m²)">Dpto 3 — Poincenot (55m²)</option>
        </select>
      </div>
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
          {t('message')}
        </label>
        <textarea
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-surface rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all bg-white resize-none"
          placeholder={t('messagePlaceholder')}
          required
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{t('errorMsg')}</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl px-6 py-3.5 transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50"
      >
        {status === 'sending' ? t('sending') : t('send')}
      </button>
    </form>
  )
}
