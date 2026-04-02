# 🎯 CURRENT_TASK — Estado 2026-04-02

## 🚨 PROBLEMA ACTIVO

**El evento de turnaround del 2 de abril muestra datos incorrectos:**
```
Actual:   🧹 Dpto 2 — Cerro Torre — Limpieza · Emmanuel→Huésped Airbnb (3 pax) ❌
Esperado: 🧹 Dpto 2 — Cerro Torre — Limpieza · Emmanuel→Dario (2 pax) ✅
```

**Causa:** Datos de Dario (guest count 2, nombre) no encontrados en Gmail → fallback a maxGuests (3) + "Huésped Airbnb"

---

## ✅ COMPLETADO EN SESIÓN ANTERIOR

1. **Análisis** del flujo Gmail → iCal → Google Calendar
2. **Parser de Gmail mejorado** con 4 fallback patterns para guest count
3. **Parser de Gmail mejorado** con 3 fallback patterns para guest names
4. **iCal parser extendido** para extraer guestCount y guestName de descriptions
5. **Sync logic refactorizada** con cascada: Gmail → iCal → maxGuests
6. **4 endpoints de debug** para diagnóstico
7. **Endpoint manual `/api/manual-sync`** para testing
8. **Cron job agregado** a vercel.json

---

## ⏳ PRÓXIMO PASO (Nueva Sesión)

```
1. Leer BACKUP_SESSION_2026_04_02.md (contexto completo)

2. Deployar cambios a Vercel:
   git add -A
   git commit -m "Improve guest data extraction: Gmail + iCal parsing"
   git push

3. Verificar diagnóstico:
   GET /api/debug/email-parse?name=dario
   → Si datos ✅ = Email parseado
   → Si vacío ❌ = No encontrado

4. Ejecutar sync manual:
   GET /api/manual-sync?property=chalten-loft-cerro-torre&debug=true

5. Chequear Google Calendar:
   ¿Dice "Dario (2 pax)"? ✅ PROBLEMA RESUELTO ✅
```

---

## 📋 ARCHIVOS CLAVE

| Archivo | Estado |
|---------|--------|
| `BACKUP_SESSION_2026_04_02.md` | ✨ NUEVO — Lee esto primero |
| `src/lib/gmail-reader.ts` | ✏️ Editado — Guest parsing |
| `src/lib/ical-parser.ts` | ✏️ Editado — Guest extraction |
| `src/app/api/calendar/sync-airbnb/route.ts` | ✏️ Editado — Fallback logic |
| `src/app/api/manual-sync/route.ts` | ✨ NUEVO — Para testing |
| `src/app/api/debug/*` | ✨ NUEVOS — 4 endpoints |

---

## 🎯 Success Criteria

✅ Google Calendar muestra "Dario (2 pax)" en evento turnaround
❌ Si sigue mostrando "Huésped Airbnb (3 pax)" → revisar debug endpoints

---

**Status:** Cambios implementados, esperando validación y sync manual
**Urgencia:** Media (guest data incompleta)
**Bloqueador:** Ninguno
**Documentación:** Completa en BACKUP_SESSION_2026_04_02.md
