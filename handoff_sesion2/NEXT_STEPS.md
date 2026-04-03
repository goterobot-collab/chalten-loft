# NEXT STEPS — Prioridad de acciones

## 1. DIAGNOSTICAR por qué Gmail API no encuentra el email de Dario

### Opción A: Endpoint debug de subjects (recomendado)
Modificar `/api/debug/gmail-data` para que devuelva TODOS los subjects y remitentes de los emails encontrados, no solo los que se parsean exitosamente. Esto muestra si el email de Dario está en la búsqueda pero falla en el parsing.

### Opción B: Buscar directo por nombre
Probar cambiar la query de Gmail a: `Dario Premat` (sin filtro de from:) para ver si lo encuentra. Si lo encuentra, el problema es que el "From:" real no es airbnb.com.

### Opción C: Ver headers reales del email
En Gmail web, abrir el email de Dario → tres puntos → "Show original". Copiar el header `From:` real. Puede ser que Gmail muestre "Airbnb" pero el From: real sea otro dominio.

## 2. Una vez encontrado el email, verificar el parsing

```bash
curl https://chalten-loft.vercel.app/api/debug/email-parse?name=dario
```

Si aparece con datos correctos → siguiente paso.

## 3. Ejecutar sync manual

```bash
curl https://chalten-loft.vercel.app/api/manual-sync
# o
curl https://chalten-loft.vercel.app/api/calendar/sync-airbnb?debug=true
```

## 4. Verificar Google Calendar

Abrir Google Calendar y buscar el evento del 2 de abril en DPTO 2.
Debe decir "Dario (2 pax)" en lugar de "Huésped Airbnb (3 pax)".

## DONE cuando:
- [ ] El email de Dario aparece en /api/debug/email-parse?name=dario
- [ ] El sync manual actualiza el evento correctamente
- [ ] Google Calendar muestra "Dario Premat (2 pax)" para check-in 2 abril DPTO 2
