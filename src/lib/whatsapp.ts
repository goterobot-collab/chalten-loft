// WhatsApp notifications via WhatsApp Web API link
// For production, this should use the Meta WhatsApp Cloud API
// For now, we generate the WhatsApp message and can send via the API route

export type CleaningNotification = {
  propertyName: string
  checkoutDate: string     // "28/03"
  checkoutTime: string     // "10:00"
  checkoutGuests: number
  checkinDate: string | null
  checkinTime: string | null
  checkinGuests: number | null
  notes?: string
}

export function formatCleaningMessage(data: CleaningNotification): string {
  const urgency = data.checkinDate === data.checkoutDate
    ? '⚠️ MISMO DÍA — entrada y salida hoy'
    : data.checkinDate
    ? `⏰ Próximo check-in: ${data.checkinDate} a las ${data.checkinTime}\n👥 Próximos huéspedes: ${data.checkinGuests} personas`
    : '🟢 Sin próximo check-in — limpieza sin urgencia'

  const lines = [
    `🧹 *LIMPIEZA — ${data.propertyName}*`,
    '',
    `📅 Check-out: ${data.checkoutDate} a las ${data.checkoutTime}`,
    `👥 Huéspedes: ${data.checkoutGuests} personas`,
    '',
    urgency,
  ]

  if (data.notes) {
    lines.push('', `📝 Notas: ${data.notes}`)
  }

  return lines.join('\n')
}

// Generate WhatsApp link for direct sending
export function getWhatsAppLink(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

// Tania's number
export const CLEANER_PHONE = '5492615402732'
export const CLEANER_NAME = 'Tania'

// Gabriel's number
export const HOST_PHONE = '5492901644067'
export const HOST_NAME = 'Gabriel'
