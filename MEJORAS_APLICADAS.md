# Mejoras Aplicadas — 2026-04-04 (8am automático)

## Implementado ✅

### 1. Booking Conversion — ALTA prioridad (crítica)

**Cambio 1 — Hero Search Widget funcional**
- Archivo nuevo: `src/components/booking/HeroSearchWidget.tsx`
- Antes: botón "Buscar" sin onClick — no hacía nada
- Ahora: redirige a `/properties?checkIn=...&checkOut=...&guests=...`

**Cambio 2 — Properties page con searchParams**
- Archivo: `src/app/[locale]/properties/page.tsx`
- Lee checkIn/checkOut/guests de la URL y los pasa al link de reserva de cada propiedad

**Cambio 3 — PropertyBookingSidebar funcional**
- Archivo nuevo: `src/components/properties/PropertyBookingSidebar.tsx`
- Antes: sidebar estático, botón sin fechas
- Ahora: captura fechas → las transfiere al booking page via query params
- Bonus: muestra "Desde USD {priceFrom} / noche" como ancla de precio

**Cambio 4 — Booking page pre-rellena fechas**
- Archivo: `src/app/[locale]/booking/[slug]/page.tsx`
- Lee checkIn/checkOut/guests de useSearchParams()
- El calendario se inicializa con las fechas elegidas en el sidebar

### 2. Mobile UX — ALTA prioridad

**MobileBookingBar — sticky CTA en mobile**
- Archivo nuevo: `src/components/properties/MobileBookingBar.tsx`
- Barra fija en la parte inferior en pantallas < 1024px
- Aparece al scrollear 300px, desaparece cuando el sidebar real es visible
- Muestra precio desde / noche + botón "Reservar Ahora"

**priceFrom en properties.ts**
- Fitz Roy: USD 85/noche
- Cerro Torre: USD 65/noche
- Poincenot: USD 75/noche

### 3. Content CTAs — ALTA prioridad

**ContentPageBookingCTA — componente unificado**
- Archivo nuevo: `src/components/content/ContentPageBookingCTA.tsx`
- Copy contextual en los 8 idiomas del sitio (es/en/pt/fr/de/ko/ja/zh)
- Variantes: trekking, gastronomia, recomendaciones
- Dos CTAs: primario → `/properties` | secundario → WhatsApp

**Páginas actualizadas:**
- `gastronomia/page.tsx`: CTA "A pasos de los mejores restaurantes"
- `trekking/page.tsx`: CTA "Tu base en el corazón del trekking"
- `recomendaciones/page.tsx`: CTA "La mejor ubicación para vivir todo esto"

### 4. i18n keys — soporte para nuevas features

Agregadas en los 8 archivos de idioma (`messages/`):
- `property.priceFrom` — "Desde" / "From" / "A partir de" / etc.
- `property.night` — "noche" / "night" / "noite" / etc.

---

## Pendiente ⏳ (no aplicado en esta sesión)

Las siguientes mejoras de MEDIA/BAJA prioridad quedaron pendientes por el volumen total del archivo MEJORAS_NOCTURNAS.md (13,000+ líneas):

- SEO & meta tags
- Social proof / reseñas
- Open Graph / redes sociales
- Schema.org / Datos estructurados
- Calendario de precios por fecha
- Cookie consent / GDPR
- Widget de clima Open-Meteo
- Trip Builder
- Guía digital del huésped
- PWA / Modo offline
- ...y muchas más (ver MEJORAS_NOCTURNAS.md)

---

## URL del sitio para verificar

https://chalten-loft.vercel.app

### Flujo crítico a testear:
1. Hero → seleccionar fechas → "Buscar" → debe ir a `/properties?checkIn=...`
2. Properties → click "Reservar Ahora" → booking page con fechas pre-rellenadas
3. Property detail → seleccionar fechas en sidebar → "Reservar Ahora" → booking con fechas
4. Mobile: scroll en property detail → debe aparecer barra sticky en el fondo
5. Gastronomia/Trekking/Recomendaciones: botón "Ver disponibilidad" debe ir a `/properties`
