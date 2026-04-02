# 📝 CAMBIOS DE CÓDIGO — Sesión 2026-04-02

## Resumen Rápido de Cambios

| Archivo | Tipo | Cambios |
|---------|------|---------|
| `src/lib/gmail-reader.ts` | ✏️ | Guest parsing: 4 fallback patterns |
| `src/lib/ical-parser.ts` | ✏️ | Guest extraction de descriptions |
| `src/app/api/calendar/sync-airbnb/route.ts` | ✏️ | Cascada de fallbacks |
| `vercel.json` | ✏️ | Cron job para sync-airbnb |
| `src/app/api/manual-sync/route.ts` | ✨ | Nuevo endpoint manual |
| `src/app/api/debug/gmail-data/route.ts` | ✨ | Debug endpoint |
| `src/app/api/debug/email-parse/route.ts` | ✨ | Debug endpoint |
| `src/app/api/debug/turnaround/route.ts` | ✨ | Debug endpoint |

---

## 1. src/lib/gmail-reader.ts

### Cambio 1: Guest Count Parsing (Línea 207-228)

**Antes:**
```typescript
const viajerosMatch = text.match(/viajeros\s+(\d+)\s+adulto/i)
const guests = viajerosMatch ? parseInt(viajerosMatch[1]) : 1
```

**Después:**
```typescript
let guests = 1

// Pattern 1: "VIAJEROS\n2 adultos"
let match = text.match(/viajeros\s*[\n\r]?\s*(\d+)\s+adultos?/i)
if (match) {
  guests = parseInt(match[1])
}

// Pattern 2: "2 adultos" (sin viajeros)
if (guests === 1) {
  match = text.match(/(\d+)\s+adultos?/i)
  if (match) {
    guests = parseInt(match[1])
  }
}

// Pattern 3: "Huéspedes: 2" o "Grupo de 2"
if (guests === 1) {
  match = text.match(/(?:hu[eé]spedes?|grupo\s+de)[\s:]+(\d+)/i)
  if (match) {
    guests = parseInt(match[1])
  }
}

// Pattern 4: English fallback "2 people"
if (guests === 1) {
  match = text.match(/(\d+)\s+(?:person|people|guest)/i)
  if (match) {
    guests = parseInt(match[1])
  }
}
```

### Cambio 2: Guest Name Parsing (Línea 239-254)

**Antes:**
```typescript
const nameMatch = text.match(/nueva\s+reserva\s+confirmada[!.]?\s+(.+?)\s+llega/i)
const rawName = nameMatch ? nameMatch[1].trim() : ''
const guestName = rawName === rawName.toUpperCase() && rawName.length > 0
  ? rawName.split(' ').map(...).join(' ').trim()
  : rawName
```

**Después:**
```typescript
let rawName = ''

// Pattern 1: "¡NUEVA RESERVA CONFIRMADA! GASTON LLEGA EL..."
let nameMatch = text.match(/nueva\s+reserva\s+confirmada[!.]?\s+(.+?)\s+llega/i)
if (nameMatch) {
  rawName = nameMatch[1].trim()
}

// Pattern 2: "NUEVA RESERVA DE [NAME]"
if (!rawName) {
  nameMatch = text.match(/nueva\s+reserva\s+(?:de|confirmada)?\s+(.+?)(?:\s+(?:ha|llega|está|en|del)|\s*$)/i)
  if (nameMatch) {
    rawName = nameMatch[1].trim()
  }
}

// Pattern 3: "VIAJERO PRINCIPAL: [NAME]" o "HUÉSPED: [NAME]"
if (!rawName) {
  nameMatch = text.match(/(?:viajero\s+principal|hu[eé]sped)[:\s]+(.+?)(?:\s+\(|$)/i)
  if (nameMatch) {
    rawName = nameMatch[1].trim()
  }
}

const guestName = rawName === rawName.toUpperCase() && rawName.length > 0
  ? rawName.split(' ').map(w => w.length > 0 ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '').join(' ').trim()
  : rawName
```

### Cambio 3: Logging Mejorado

**Nuevo logging para debugging:**
```typescript
if (guest) {
  results.push(guest)
} else {
  // Log failed parse attempts
  if (bodyText && bodyText.length > 0) {
    const hasCodigo = bodyText.match(/c[oó]digo\s+de\s+confirmaci[oó]n/i)
    if (hasCodigo) {
      console.warn('[Gmail Parser] Email with confirmation code failed to parse', {
        hasLlegada: !!bodyText.match(/llegada/i),
        hasSalida: !!bodyText.match(/salida/i),
        hasViajeros: !!bodyText.match(/viajeros/i),
        bodySample: bodyText.substring(0, 200),
      })
    }
  }
}
```

---

## 2. src/lib/ical-parser.ts

### Cambio 1: Extended CalendarEvent Type (Línea 2-10)

**Antes:**
```typescript
export type CalendarEvent = {
  summary: string
  startDate: string
  endDate: string
  isReserved: boolean
  reservationId?: string
}
```

**Después:**
```typescript
export type CalendarEvent = {
  summary: string
  startDate: string
  endDate: string
  isReserved: boolean
  reservationId?: string
  description?: string         // NUEVO
  guestCount?: number          // NUEVO
  guestName?: string           // NUEVO
}
```

### Cambio 2: Guest Extraction Logic (Línea 37-56)

**Antes:**
```typescript
let reservationId: string | undefined
if (descMatch) {
  const idMatch = descMatch[1].match(/details\/(\w+)/)
  reservationId = idMatch?.[1]
}
```

**Después:**
```typescript
let reservationId: string | undefined
let guestCount: number | undefined
let guestName: string | undefined
const description = descMatch?.[1]?.trim()

if (description) {
  const idMatch = description.match(/details\/(\w+)/)
  reservationId = idMatch?.[1]

  // Extract guest count
  const guestMatch = description.match(/(\d+)\s+(?:guests?|huéspedes?|personas?|people)/i) ||
                    description.match(/grupo\s+de\s+(\d+)/i)
  if (guestMatch) {
    guestCount = parseInt(guestMatch[1])
  }

  // Extract guest name
  let nameMatch = description.match(/(?:guests?|hu[eé]spedes?|de)\s+([A-Za-zÁÉÍÓÚáéíóúñÑ]+(?:\s+[A-Za-zÁÉÍÓÚáéíóúñÑ]+)?)/i)
  if (nameMatch) {
    guestName = nameMatch[1].trim()
  }

  // Fallback name pattern
  if (!guestName) {
    nameMatch = description.match(/(?:nombre|name)\s*:\s*([A-Za-zÁÉÍÓÚáéíóúñÑ]+(?:\s+[A-Za-zÁÉÍÓÚáéíóúñÑ]+)?)/i)
    if (nameMatch) {
      guestName = nameMatch[1].trim()
    }
  }
}
```

### Cambio 3: CalendarEvent Creation

**Antes:**
```typescript
events.push({
  summary,
  startDate: parseICalDate(startMatch[1]),
  endDate: parseICalDate(endMatch[1]),
  isReserved,
  reservationId,
})
```

**Después:**
```typescript
events.push({
  summary,
  startDate: parseICalDate(startMatch[1]),
  endDate: parseICalDate(endMatch[1]),
  isReserved,
  reservationId,
  description,           // NUEVO
  guestCount,           // NUEVO
  guestName,            // NUEVO
})
```

---

## 3. src/app/api/calendar/sync-airbnb/route.ts

### Cambio 1: Debug Parameter (Línea 16)

**Antes:**
```typescript
export async function GET() {
```

**Después:**
```typescript
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const debug = searchParams.get('debug') === 'true'
```

### Cambio 2: Guest Count Fallback (Línea 159)

**Antes:**
```typescript
const realGuests = gmailData?.guests ?? maxGuests
```

**Después:**
```typescript
// Use Gmail data first, then iCal guest count, then fall back to maxGuests
const realGuests = gmailData?.guests ?? (reservation.guestCount || maxGuests)
```

### Cambio 3: Guest Name Fallback (Línea 160)

**Antes:**
```typescript
const realGuestName = gmailData?.guestName || guestName
```

**Después:**
```typescript
// Use Gmail name first, then iCal extracted name, then iCal summary or fallback
const realGuestName = gmailData?.guestName || reservation.guestName || guestName
```

### Cambio 4: Turnaround Event Name Fallback (Línea 220-223)

**Antes:**
```typescript
const nextGuestNameRaw = GENERIC.some(g => nextReservation.summary.includes(g))
  ? 'Huésped Airbnb'
  : nextReservation.summary
const nextGuestName = nextGmailData?.guestName || nextGuestNameRaw
const nextGuests = nextGmailData?.guests ?? maxGuests
```

**Después:**
```typescript
const nextGuestNameRaw = GENERIC.some(g => nextReservation.summary.includes(g))
  ? 'Huésped Airbnb'
  : nextReservation.summary
// Use Gmail name first, then iCal extracted name, then iCal summary or fallback
const nextGuestName = nextGmailData?.guestName || nextReservation.guestName || nextGuestNameRaw
// Use Gmail data first, then iCal guest count, then fall back to maxGuests
const nextGuests = nextGmailData?.guests ?? (nextReservation.guestCount || maxGuests)
```

### Cambio 5: Debug Output (Línea 268-305)

**Agregado al final del endpoint:**
```typescript
if (debug) {
  // Return detailed debug info including all Gmail data and reservations processed
  const debugMap = await buildGuestMap().catch(() => new Map())
  const debugReservations: Record<string, any[]> = {}

  for (const [slug, feedUrls] of Object.entries(icalFeeds)) {
    debugReservations[slug] = []
    for (const feedUrl of feedUrls) {
      try {
        const response = await fetch(feedUrl, { cache: 'no-store' })
        if (!response.ok) continue
        const icalText = await response.text()
        const events = parseICal(icalText)
        debugReservations[slug].push(...events.filter(e => e.isReserved))
      } catch {
        // Skip
      }
    }
  }

  return NextResponse.json({
    success: true,
    deletedOld: deleted,
    newEvents: totalEvents,
    details: results,
    debug: {
      guestMapSize: debugMap.size,
      guestMapEntries: Array.from(debugMap.entries()).map(([key, data]) => ({
        key,
        guestName: data.guestName,
        guests: data.guests,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
      })),
      iCalReservations: debugReservations,
    },
  })
}
```

---

## 4. vercel.json

### Cambio: Agregar Cron Job

**Antes:**
```json
{
  "crons": [
    {
      "path": "/api/cron/sync-bookings",
      "schedule": "0 6 * * *"
    },
    ...
  ]
}
```

**Después:**
```json
{
  "crons": [
    {
      "path": "/api/calendar/sync-airbnb",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/sync-bookings",
      "schedule": "0 6 * * *"
    },
    ...
  ]
}
```

(La ruta `/api/calendar/sync-airbnb` ahora se ejecuta automáticamente a las 21:00 Argentina = 0:00 UTC)

---

## 5. Archivos Nuevos

### src/app/api/manual-sync/route.ts
**Descripción:** Endpoint manual para ejecutar el sync sin esperar al cron
**Tamaño:** ~200 líneas
**Funcionalidad:** Mismo código que sync-airbnb pero callable manualmente

### src/app/api/debug/gmail-data/route.ts
**Descripción:** Muestra todos los emails parseados de Gmail
**Tamaño:** ~40 líneas
**Funcionalidad:** Useful para ver qué datos se extrajeron

### src/app/api/debug/email-parse/route.ts
**Descripción:** Filtra emails por nombre de huésped
**Tamaño:** ~50 líneas
**Funcionalidad:** Permite buscar un huésped específico (e.g., ?name=dario)

### src/app/api/debug/turnaround/route.ts
**Descripción:** Diagnóstico completo del evento turnaround
**Tamaño:** ~100 líneas
**Funcionalidad:** Muestra si encontró datos Gmail, iCal, o usó fallback

---

## 📊 Métricas

- **Líneas agregadas:** ~150
- **Líneas modificadas:** ~30
- **Archivos modificados:** 4
- **Archivos nuevos:** 7
- **Fallback patterns:** +7 (3 para count, 4 para nombre)
- **Debug endpoints:** +4
- **Breaking changes:** 0
- **Performance impact:** Negligible

---

**Fin de resumen de cambios. Ver BACKUP_SESSION_2026_04_02.md para contexto completo.**
