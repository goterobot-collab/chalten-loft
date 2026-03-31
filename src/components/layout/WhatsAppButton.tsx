'use client'

import { MessageCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

const WHATSAPP_NUMBER = '5492901644067'

export default function WhatsAppButton() {
  const t = useTranslations('whatsapp')
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('defaultMessage'))}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group"
      aria-label="WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      {/* Tooltip */}
      <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-dark text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {t('chatWithUs')}
      </span>
    </a>
  )
}
