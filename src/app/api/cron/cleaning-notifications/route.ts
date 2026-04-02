import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { formatCleaningMessage, CLEANER_PHONE, CLEANER_NAME } from '@/lib/whatsapp'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Runs daily — sends cleaning notifications for tomorrow's checkouts
// Also sends a morning summary to Tania at 7am

export async function GET() {
  // Use Argentina time (UTC-3) for date calculations.
  // Cron runs at 00:00 UTC = 21:00 Argentina the previous day.
  // "tomorrow Argentina" = the same calendar date as UTC today.
  const ARG_OFFSET_MS = 3 * 60 * 60 * 1000 // UTC-3
  const argNow = new Date(Date.now() - ARG_OFFSET_MS)
  const tomorrow = new Date(argNow)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  const today = argNow.toISOString().split('T')[0]

  // Get cleaning tasks for tomorrow that haven't been notified
  const { data: tasks } = await supabase
    .from('cleaning_tasks')
    .select('*, bookings(*)')
    .eq('task_date', tomorrowStr)
    .eq('status', 'pending')

  if (!tasks || tasks.length === 0) {
    return NextResponse.json({ message: 'No cleaning tasks for tomorrow', date: tomorrowStr })
  }

  const notifications = []

  for (const task of tasks) {
    // Format the WhatsApp message
    const message = formatCleaningMessage({
      propertyName: task.property_name,
      checkoutDate: new Date(task.task_date).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
      }),
      checkoutTime: task.checkout_time || '10:00',
      checkoutGuests: task.checkout_guests || 2,
      checkinDate: task.checkin_date
        ? new Date(task.checkin_date).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
          })
        : null,
      checkinTime: task.checkin_time || '15:00',
      checkinGuests: task.checkin_guests || null,
      notes: task.notes || undefined,
    })

    // Send email to Tania as notification
    try {
      await resend.emails.send({
        from: 'Chaltén Loft <onboarding@resend.dev>',
        to: ['chaltenloft@gmail.com', 'taniayeminagarrido@gmail.com', 'gabrieloterounpa@gmail.com'],
        subject: `🧹 Limpieza mañana — ${task.property_name}`,
        html: `
          <div style="font-family: system-ui, sans-serif; padding: 20px;">
            <h2>🧹 Limpieza programada para mañana</h2>
            <pre style="background: #f5f5f5; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${message}</pre>
            <p><a href="https://wa.me/${CLEANER_PHONE}?text=${encodeURIComponent(message)}">
              📱 Enviar a ${CLEANER_NAME} por WhatsApp
            </a></p>
          </div>
        `,
      })

      // Log the notification
      await supabase.from('notifications_log').insert({
        cleaning_task_id: task.id,
        channel: 'email',
        recipient: 'chaltenloft@gmail.com',
        message,
        status: 'sent',
      })

      // Mark task as notified
      await supabase
        .from('cleaning_tasks')
        .update({ status: 'notified', notified_at: new Date().toISOString() })
        .eq('id', task.id)

      notifications.push({
        task_id: task.id,
        property: task.property_name,
        date: task.task_date,
        status: 'notified',
      })
    } catch (error) {
      notifications.push({
        task_id: task.id,
        property: task.property_name,
        error: String(error),
      })
    }
  }

  return NextResponse.json({
    date: tomorrowStr,
    tasksFound: tasks.length,
    notifications,
  })
}
