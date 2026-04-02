# 🚀 START HERE — Nueva Sesión

**Leer en este orden:**

## 1. ESTE ARCHIVO (2 min)
✅ Estás acá

## 2. SESION_ANTERIOR_RESUMEN.txt (5 min)
📄 Resumen visual del problema y solución
```bash
cat SESION_ANTERIOR_RESUMEN.txt
```

## 3. BACKUP_SESSION_2026_04_02.md (10 min)
📋 Contexto técnico detallado, cambios exactos, próximos pasos
```bash
cat BACKUP_SESSION_2026_04_02.md
```

## 4. CURRENT_TASK.md (2 min)
✏️ Acciones inmediatas a ejecutar
```bash
cat CURRENT_TASK.md
```

---

## 🎯 RESUMEN ULTRACORTO

**Problema:** Google Calendar muestra "Huésped Airbnb (3 pax)" en lugar de "Dario (2 pax)"

**Solución:** Mejorado parser de Gmail + iCal para extraer guest data

**Estado:** Cambios implementados, esperando ejecución de sync

**Próximos pasos:**
```bash
1. Deploy a Vercel
2. GET /api/debug/email-parse?name=dario (verificar)
3. GET /api/manual-sync?property=chalten-loft-cerro-torre (ejecutar)
4. Chequear Google Calendar
```

---

## 📁 Archivos Nuevos

- `SESION_ANTERIOR_RESUMEN.txt` ← Resumen visual
- `BACKUP_SESSION_2026_04_02.md` ← Contexto técnico completo
- `CURRENT_TASK.md` ← Próximos pasos
- `START_HERE_NUEVA_SESION.md` ← Este archivo
- `src/app/api/manual-sync/route.ts` ← Nuevo endpoint
- `src/app/api/debug/*` ← 4 endpoints de debug

---

## 🔧 Archivos Modificados

- `src/lib/gmail-reader.ts` ← Guest parsing mejorado
- `src/lib/ical-parser.ts` ← Guest extraction agregada
- `src/app/api/calendar/sync-airbnb/route.ts` ← Fallback logic
- `vercel.json` ← Cron agregado

---

## ✅ CHECKLIST PARA NUEVA SESIÓN

```
[ ] Leer SESION_ANTERIOR_RESUMEN.txt (5 min)
[ ] Leer BACKUP_SESSION_2026_04_02.md (10 min)
[ ] Leer CURRENT_TASK.md (2 min)
[ ] Ejecutar: git add -A && git commit -m "Improve guest data extraction" && git push
[ ] Esperar deploy en Vercel (~2-3 min)
[ ] Visitar: /api/debug/email-parse?name=dario (verificar)
[ ] Visitar: /api/manual-sync?property=chalten-loft-cerro-torre&debug=true (ejecutar)
[ ] Esperar respuesta JSON
[ ] Chequear Google Calendar
[ ] ¿Muestra "Dario (2 pax)"? ✅ ÉXITO
[ ] ¿Sigue "Huésped Airbnb (3 pax)"? ❌ Revisar /api/debug/turnaround
```

---

**¡Ya está todo documentado y listo para continuar!**
