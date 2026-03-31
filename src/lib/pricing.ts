/**
 * PRICING ENGINE — Chaltén Loft
 *
 * Precios basados en datos históricos de Airbnb (2023-2026)
 * con 10% de descuento por reserva directa.
 *
 * Para editar precios: modificar las tablas MONTHLY_RATES y HIGH_DEMAND_DATES abajo.
 */

// ═══════════════════════════════════════════════════════════════
// PRECIOS MENSUALES POR PROPIEDAD (USD/noche)
// Basados en Airbnb histórico -10% descuento directo
// ═══════════════════════════════════════════════════════════════

type PropertySlug = 'fitz-roy' | 'cerro-torre' | 'poincenot'

// Map full slugs → short keys
const SLUG_MAP: Record<string, PropertySlug> = {
  'chalten-loft-fitz-roy': 'fitz-roy',
  'chalten-loft-cerro-torre': 'cerro-torre',
  'chalten-loft-poincenot': 'poincenot',
  'fitz-roy': 'fitz-roy',
  'cerro-torre': 'cerro-torre',
  'poincenot': 'poincenot',
}

// Mes 0 = Enero, 11 = Diciembre
// Precios = Airbnb publicado × 0.92 (8% descuento directo, ya que Airbnb cobra 15.5% al anfitrión)
const MONTHLY_RATES: Record<PropertySlug, number[]> = {
  // Dpto 1 — Fitz Roy (75m², 3 huéspedes) — CIERRA May-Oct
  'fitz-roy': [
    161,  // Ene — peak (Airbnb ~$175, -8%)
    152,  // Feb — alto
    110,  // Mar — shoulder
    92,   // Abr
    0,    // May — CERRADO
    0,    // Jun — CERRADO
    0,    // Jul — CERRADO
    0,    // Ago — CERRADO
    0,    // Sep — CERRADO
    0,    // Oct — CERRADO
    124,  // Nov — apertura fuerte
    156,  // Dic — peak
  ],

  // Dpto 2 — Cerro Torre (40m², 3 huéspedes)
  'cerro-torre': [
    129,  // Ene
    122,  // Feb
    88,   // Mar
    74,   // Abr
    0,    // May — CERRADO
    0,    // Jun — CERRADO
    0,    // Jul — CERRADO
    0,    // Ago — CERRADO
    0,    // Sep — CERRADO
    74,   // Oct — apertura
    99,   // Nov
    124,  // Dic
  ],

  // Dpto 3 — Poincenot (55m², 4 huéspedes)
  'poincenot': [
    143,  // Ene
    134,  // Feb
    97,   // Mar
    81,   // Abr
    0,    // May — CERRADO
    0,    // Jun — CERRADO
    0,    // Jul — CERRADO
    0,    // Ago — CERRADO
    0,    // Sep — CERRADO
    81,   // Oct — apertura
    110,  // Nov
    138,  // Dic
  ],
}

// ═══════════════════════════════════════════════════════════════
// FECHAS DE ALTA DEMANDA — Recargo automático
// ═══════════════════════════════════════════════════════════════

type DemandPeriod = {
  name: string
  start: string  // MM-DD
  end: string    // MM-DD
  surcharge: number // multiplicador (1.2 = +20%)
}

// Fechas con recargo — se aplican SOBRE el precio mensual
const HIGH_DEMAND_DATES: DemandPeriod[] = [
  // PEAK ABSOLUTO (+20%)
  { name: 'Navidad y Año Nuevo', start: '12-20', end: '01-10', surcharge: 1.20 },
  { name: 'Semana Santa 2026', start: '03-29', end: '04-05', surcharge: 1.20 },

  // ALTA DEMANDA (+10%)
  { name: 'Festival del Trekking', start: '03-15', end: '03-20', surcharge: 1.10 },

  // Fines de semana largos Argentina 2026
  { name: 'Carnaval', start: '02-16', end: '02-17', surcharge: 1.15 },
  { name: 'Día de la Memoria', start: '03-24', end: '03-24', surcharge: 1.15 },
  { name: 'Día del Trabajador', start: '05-01', end: '05-01', surcharge: 1.15 },
]

// ═══════════════════════════════════════════════════════════════
// CONFIGURACIÓN GENERAL
// ═══════════════════════════════════════════════════════════════

const CLEANING_FEE_USD = 0 // Sin tarifa de limpieza separada — incluida en precio noche

// Mínimo de noches por temporada
const MIN_NIGHTS: Record<string, number> = {
  peak: 3,      // Dic-Feb
  shoulder: 2,  // Oct-Nov, Mar-Abr
  low: 1,       // May-Sep (si abre)
}

// Tipo de cambio ARS/USD (actualizar periódicamente)
const EXCHANGE_RATE = 1200

// ═══════════════════════════════════════════════════════════════
// FUNCIONES PÚBLICAS
// ═══════════════════════════════════════════════════════════════

export type PricingResult = {
  nights: number
  pricePerNight: number[]     // precio por cada noche
  avgPerNight: number         // promedio
  subtotal: number            // noches × precio
  cleaningFee: number
  totalUSD: number
  totalARS: number
  minNights: number
  isClosed: boolean
  closedDates: string[]       // fechas donde la propiedad está cerrada
  demandSurcharges: string[]  // nombres de períodos de alta demanda aplicados
}

/**
 * Calcula el precio para una estadía.
 * Cada noche toma el precio del mes correspondiente.
 * Si cruza meses, cada noche usa su propio precio.
 */
export function getPrice(
  slug: string,
  checkIn: string,  // YYYY-MM-DD
  checkOut: string   // YYYY-MM-DD
): PricingResult {
  const propertySlug = (SLUG_MAP[slug] ?? slug) as PropertySlug
  const rates = MONTHLY_RATES[propertySlug]

  if (!rates) {
    throw new Error(`Unknown property: ${slug}`)
  }

  const startDate = new Date(checkIn + 'T12:00:00')
  const endDate = new Date(checkOut + 'T12:00:00')
  const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  if (nights <= 0) {
    return {
      nights: 0, pricePerNight: [], avgPerNight: 0, subtotal: 0,
      cleaningFee: CLEANING_FEE_USD, totalUSD: 0, totalARS: 0,
      minNights: 2, isClosed: false, closedDates: [], demandSurcharges: [],
    }
  }

  const pricePerNight: number[] = []
  const closedDates: string[] = []
  const demandSet = new Set<string>()

  for (let i = 0; i < nights; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    const month = date.getMonth() // 0-indexed
    const baseRate = rates[month]

    if (baseRate === 0) {
      closedDates.push(formatDate(date))
      pricePerNight.push(0)
      continue
    }

    // Check for demand surcharges
    let surcharge = 1.0
    for (const period of HIGH_DEMAND_DATES) {
      if (isInDemandPeriod(date, period)) {
        if (period.surcharge > surcharge) {
          surcharge = period.surcharge
          demandSet.add(period.name)
        }
      }
    }

    pricePerNight.push(Math.round(baseRate * surcharge))
  }

  const isClosed = closedDates.length > 0
  const validPrices = pricePerNight.filter(p => p > 0)
  const subtotal = validPrices.reduce((sum, p) => sum + p, 0)
  const avgPerNight = validPrices.length > 0 ? Math.round(subtotal / validPrices.length) : 0
  const totalUSD = subtotal + CLEANING_FEE_USD
  const minNights = getMinNights(startDate)

  return {
    nights,
    pricePerNight,
    avgPerNight,
    subtotal,
    cleaningFee: CLEANING_FEE_USD,
    totalUSD,
    totalARS: totalUSD * EXCHANGE_RATE,
    minNights,
    isClosed,
    closedDates,
    demandSurcharges: Array.from(demandSet),
  }
}

/**
 * Obtiene el precio base de una propiedad para un mes dado.
 * Útil para mostrar "desde $X/noche" en cards.
 */
export function getBasePrice(slug: string, month?: number): number {
  const rates = MONTHLY_RATES[slug as PropertySlug]
  if (!rates) return 0

  if (month !== undefined) return rates[month]

  // Retorna el precio del mes actual, o el próximo mes abierto
  const now = new Date()
  let m = now.getMonth()
  for (let i = 0; i < 12; i++) {
    if (rates[(m + i) % 12] > 0) return rates[(m + i) % 12]
  }
  return 0
}

/**
 * Verifica si una propiedad está abierta en un rango de fechas.
 */
export function isPropertyOpen(slug: string, checkIn: string, checkOut: string): boolean {
  const result = getPrice(slug, checkIn, checkOut)
  return !result.isClosed
}

/**
 * Retorna la config de pricing para mostrar en la UI.
 */
export function getPricingConfig() {
  return {
    cleaningFee: CLEANING_FEE_USD,
    exchangeRate: EXCHANGE_RATE,
    discount: '10%',
    discountNote: 'vs Airbnb',
  }
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function isInDemandPeriod(date: Date, period: DemandPeriod): boolean {
  const [startMonth, startDay] = period.start.split('-').map(Number)
  const [endMonth, endDay] = period.end.split('-').map(Number)

  const month = date.getMonth() + 1 // 1-indexed
  const day = date.getDate()

  // Handle periods that cross year boundary (e.g., Dec 20 - Jan 10)
  if (startMonth > endMonth) {
    // In the start year side (Dec)
    if (month > startMonth || (month === startMonth && day >= startDay)) return true
    // In the end year side (Jan)
    if (month < endMonth || (month === endMonth && day <= endDay)) return true
    return false
  }

  // Same year period
  const dateVal = month * 100 + day
  const startVal = startMonth * 100 + startDay
  const endVal = endMonth * 100 + endDay

  return dateVal >= startVal && dateVal <= endVal
}

function getMinNights(date: Date): number {
  const month = date.getMonth()
  if (month >= 11 || month <= 1) return MIN_NIGHTS.peak     // Dic-Feb
  if (month >= 9 || month <= 3) return MIN_NIGHTS.shoulder   // Oct-Nov, Mar-Abr
  return MIN_NIGHTS.low                                       // May-Sep
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}
