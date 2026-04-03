# Estado actual de gmail-reader.ts

## Query de búsqueda
```typescript
q: 'from:airbnb.com -is:spam',
maxResults: 500,
```

## parseEmailBody acepta 3 params
```typescript
function parseEmailBody(text: string, internalDate?: string | null, subject: string = ''): GuestData | null
```

## Confirmation code: OPCIONAL
Si no encuentra código con ningún pattern, usa placeholder `MISSING_${timestamp}`.
Patterns probados:
1. `c[oó]digo\s+de\s+confirmaci[oó]n[\s:]+([A-Z0-9]{6,12})`
2. `\b(HM[A-Z0-9]{8,10})\b`
3. `(?:confirmaci[oó]n|confirmation)[:\s]+([A-Z0-9]{8,12})`
4. Subject: `\b(HM[A-Z0-9]{8,10})\b`

## Guest name: 4 body patterns + 1 subject pattern
1. Body: `nueva\s+reserva\s+confirmada[!.]?\s+(.+?)\s+llega`
2. Body: `nueva\s+reserva\s+(?:de|confirmada)?\s+(.+?)(?:\s+(?:ha|llega|está|en|del)|\s*$)`
3. Body: `(?:viajero\s+principal|hu[eé]sped)[:\s]+(.+?)(?:\s+\(|$)`
4. Subject: `confirmada[:\s]+(.+?)(?:\s+(?:llega|check|el|the|para|a las))`
5. Subject fallback: `confirmada[:\s]+(.+?)(?:\s+\d|$)`

## Dates: Body + subject fallback + checkout inference
- Body primary: `Llegada...Salida` table format
- Body fallback: Separate `Llegada` and `Salida` lines
- Subject fallback: `(?:llega|check.?in)\s+(?:el\s+)?(\d{1,2})\s+(\w{3})`
- If only checkIn found, checkOut = checkIn + 3 days

## Guest count: 4 patterns
1. `viajeros\s*[\n\r]?\s*(\d+)\s+adultos?`
2. `(\d+)\s+adultos?`
3. `(?:hu[eé]spedes?|grupo\s+de)[\s:]+(\d+)`
4. `(\d+)\s+(?:person|people|guest)`

## Property: 3 patterns
1. `(\d+[-–]\s*chalt[eé]n\s+loft[^\n\r]*)`
2. `(chalt[eé]n\s+loft\s*\/?\s*dpto\s*\d+[^\n\r]*)`
3. `(chalt[eé]n\s+loft[^\n\r]{0,30})`

## Subject extraction
Se extrae del header `Subject` del email y se pasa como tercer argumento a parseEmailBody.
