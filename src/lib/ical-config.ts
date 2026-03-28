// iCal URLs for each property — syncs availability from Airbnb
// These are READ-ONLY calendar exports, not credentials
export const icalFeeds = {
  'chalten-loft-fitz-roy':
    'https://www.airbnb.com.ar/calendar/ical/1011472949294454066.ics?t=ba2c9ce1d9164b7f9b6819364980efb3',
  'chalten-loft-cerro-torre':
    'https://www.airbnb.com.ar/calendar/ical/1310153437538596146.ics?t=2fa9f291a343401fb1afd4122305e79f',
  'chalten-loft-poincenot':
    'https://www.airbnb.com.ar/calendar/ical/1535576347091682548.ics?t=ae02e2029d8d441f94eb56d530b629ca',
} as const

export type PropertySlug = keyof typeof icalFeeds
