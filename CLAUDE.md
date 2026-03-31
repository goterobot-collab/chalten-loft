# CLAUDE.md — Chaltén Loft

## Contexto del proyecto
Web de **reservas directas** para 3 lofts en El Chaltén, Patagonia.
Dueño: Gabriel Otero — gabrieloterounpa@gmail.com
URL live: https://chalten-loft.vercel.app
Stack: **Next.js 15 + next-intl v4 + Supabase + Vercel Hobby**

## Reglas críticas del stack

- `setRequestLocale(locale)` requerido en TODA página server (next-intl v4)
- `force-dynamic` en páginas con `locale×slug`
- Las env vars de Google Calendar van a nivel **PROYECTO** en Vercel, NO a nivel equipo
- El calendario solo muestra reservas existentes en Airbnb — si un dpto no tiene reservas en un mes, no aparece **(correcto, no es bug)**
- Leer `node_modules/next/dist/docs/` antes de escribir código Next.js (breaking changes)

## Lo que está 100% funcionando — NO tocar sin razón

| Feature | Estado |
|---------|--------|
| Web en 8 idiomas con detección automática | ✅ |
| Calendario de disponibilidad sincronizado con Airbnb (iCal, tiempo real) | ✅ |
| Pricing dinámico por mes (-8% vs Airbnb) | ✅ |
| Pagos MercadoPago (argentinos, ARS) | ✅ |
| Pagos Stripe (extranjeros, USD) — modo TEST | ✅ |
| Email de confirmación a Gabriel + Tania por reserva | ✅ |
| Google Calendar de limpieza con colores | ✅ |
| Sync Airbnb → Google Calendar | ✅ |

## Pendiente (priorizado)

1. **Dominio** `chaltenloft.com` (~$12/año) — comprar y configurar en Vercel
2. **Stripe live** — pasar de test a producción
3. **Stripe → Payoneer** — Gabriel tiene cuenta Payoneer, conectar para recibir USD
4. **Borrar evento TEST** del calendario ("TEST — Borrar este evento", 30 marzo)
5. **Vercel Pro** — para crons cada 30min ($20/mes, ahora es 1x/día)

## Archivos clave

```
src/lib/google-calendar.ts        — eventos limpieza (ingreso/egreso/turnaround)
src/lib/pricing.ts                — precios por mes por propiedad
src/lib/ical-config.ts            — URLs iCal de Airbnb (3 propiedades)
src/lib/properties.ts             — datos de las 3 propiedades
src/app/api/calendar/sync-airbnb  — sync Airbnb → Google Calendar
src/app/api/payments/stripe/      — checkout + webhook Stripe
src/app/api/payments/mercadopago/ — checkout + webhook MP
src/app/[locale]/booking/[slug]/  — página de reserva con dual payment
```

## Re-sincronizar Airbnb → Google Calendar
Abrir: https://chalten-loft.vercel.app/api/calendar/sync-airbnb
(borra eventos viejos y crea nuevos)

## Google Calendar — Colores de limpieza
- 🟢 Verde — Ingreso (llega huésped)
- 🔴 Rojo — Egreso + Limpieza (se va, limpiar, queda libre)
- 🧹 Naranja — Turnaround (sale uno, entra otro el mismo día)
