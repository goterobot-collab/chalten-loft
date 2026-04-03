# HANDOFF — Sesion 2 (2026-04-02)

## Problema principal

Google Calendar muestra **"Huésped Airbnb (3 pax)"** en lugar de **"Dario (2 pax)"** para una reserva en DPTO 2 (cerro-torre), check-in 2 abril 2026.

El email de Dario **existe en Gmail** (la usuaria lo confirmó visualmente):
- **Subject:** "Reserva confirmada: Dario Premat llega el 2 abr"
- **From:** automated@airbnb.com
- **Date:** 29 dic 2025
- **Property:** DPTO 2 (cerro-torre)

## Lo que se hizo en esta sesión

### Vercel deployment (RESUELTO)
- Se instaló Vercel GitHub App en goterobot-collab/chalten-loft
- Se hizo `vercel link` + `vercel deploy --prod` desde terminal
- Deploy funciona: endpoints responden 200 OK

### Gmail parser (EN PROGRESO — NO RESUELTO)
Se iteró 6+ veces sobre `src/lib/gmail-reader.ts` buscando que el email de Dario aparezca en los resultados:

| Commit | Cambio | Resultado |
|--------|--------|-----------|
| d131b48 | Query: `"Código de confirmación" newer_than:730d` | 87 emails, sin Dario |
| 1329afa | Query: `from:(express@ OR automated@ OR email.airbnb.com)` | 87 emails, sin Dario |
| 810e0f4 | Query: `subject:"Reserva confirmada" OR from:airbnb.com` | 87 emails, sin Dario |
| c72e2e3 | Query: `from:airbnb.com -is:spam -is:trash` | 87 emails, sin Dario |
| 7073d4c | Confirmation code fallback patterns + logging | 87 emails, sin Dario |
| afac40f | Extraer nombre del subject | 105 total pero Dario filtered=0 |
| 8227e06 | Confirmation code opcional (placeholder si no se encuentra) | Sin cambio |
| 62b1944 | Inferir checkout +3 días si solo hay check-in | Sin cambio |
| 506d3c8 | Regex más amplio para nombre en subject | 87 parsed, sin Dario |

### Estado final del código
- **Query actual:** `from:airbnb.com -is:spam` (maxResults: 500)
- **Confirmation code:** Ahora opcional (placeholder `MISSING_xxx` si no se encuentra)
- **Guest name:** 4 patterns body + 1 pattern subject
- **Dates:** Body parsing + subject fallback + checkout inference +3 días
- **Subject line:** Se extrae del header y se pasa a parseEmailBody

## El misterio sin resolver

La búsqueda `from:airbnb.com` devuelve ~87-105 emails pero **ninguno es el de Dario**.

### Hipótesis no descartadas:
1. **El email de Dario no tiene `from:airbnb.com`** — Quizás la dirección real del remitente es algo diferente a lo que muestra Gmail (ej: `noreply@airbnb.com`, `no-reply@guest.airbnb.com`, etc.)
2. **El email está en una categoría/pestaña** que Gmail API no busca por defecto (Promotions, Social, Updates)
3. **El email es de otro formato** — quizás no es un email de confirmación sino de recordatorio/actualización
4. **El email pertenece a otra cuenta** — quizás la búsqueda está en la cuenta correcta pero el email se recibió en otra

### Lo que se debería hacer NEXT:
1. **VER EL EMAIL REAL DE DARIO** — Abrir el email en Gmail, hacer "Show original" y copiar los headers reales (From:, Reply-To:, Return-Path:). Esto revela el remitente real.
2. **O MEJOR: Crear un endpoint debug que muestre TODOS los subjects encontrados** — para ver qué emails sí encuentra y cuáles no. Algo como:

```typescript
// En un endpoint debug, agregar:
const allSubjects = []
for (const result of fetched) {
  if (result.status !== 'fulfilled') continue
  const headers = result.value.data.payload?.headers || []
  const subject = headers.find(h => h.name === 'Subject')?.value || '(sin subject)'
  const from = headers.find(h => h.name === 'From')?.value || '(sin from)'
  allSubjects.push({ subject, from, date: result.value.data.internalDate })
}
// Retornar allSubjects en la respuesta
```

3. **Probar con query más amplia** — `subject:Dario` o `Dario Premat` directamente
4. **Verificar que la Gmail API tiene scope de lectura** — El refresh token podría tener scopes limitados

## Archivos clave

| Archivo | Qué hace |
|---------|----------|
| `src/lib/gmail-reader.ts` | Parser de emails Airbnb → GuestData |
| `src/lib/ical-parser.ts` | Parser de feeds iCal |
| `src/app/api/calendar/sync-airbnb/route.ts` | Sync principal: iCal + Gmail → Google Calendar |
| `src/app/api/debug/gmail-data/route.ts` | Debug: muestra todos los emails parseados |
| `src/app/api/debug/email-parse/route.ts` | Debug: filtra por nombre de huésped |
| `src/app/api/debug/turnaround/route.ts` | Debug: diagnóstico turnaround |
| `src/app/api/manual-sync/route.ts` | Trigger manual del sync |

## URLs de testing

```
https://chalten-loft.vercel.app/api/debug/gmail-data        → ver todos los emails parseados
https://chalten-loft.vercel.app/api/debug/email-parse?name=dario → buscar Dario
https://chalten-loft.vercel.app/api/manual-sync              → ejecutar sync
https://chalten-loft.vercel.app/api/calendar/sync-airbnb?debug=true → sync con debug info
```

## Cascada de fallbacks para guest data

```
sync-airbnb/route.ts usa:
  realGuests = gmailData?.guests ?? reservation.guestCount ?? maxGuests
  realGuestName = gmailData?.guestName || reservation.guestName || defaultName
```

Donde:
- `gmailData` viene de `buildGuestMap()` → Gmail API
- `reservation.guestCount/guestName` viene de iCal description
- `maxGuests` / `defaultName` es el fallback genérico

## Git

- Repo: goterobot-collab/chalten-loft (GitHub)
- Branch: main
- Último commit: 506d3c8 "Improve subject line name extraction with broader pattern"
- Deploy: Vercel auto-deploys on push to main (GitHub App instalada)

## Env vars necesarios en Vercel

- GOOGLE_OAUTH_CLIENT_ID
- GOOGLE_OAUTH_CLIENT_SECRET
- GOOGLE_GMAIL_REFRESH_TOKEN
- GOOGLE_CALENDAR_* (para escritura al calendario)
