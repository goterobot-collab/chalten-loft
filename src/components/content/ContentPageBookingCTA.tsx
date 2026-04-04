// Server Component — sin 'use client'

type Variant = 'trekking' | 'gastronomia' | 'recomendaciones'

const COPY: Record<Variant, Record<string, {
  title: string; body: string; primary: string; secondary: string
}>> = {
  trekking: {
    es: { title: 'Tu base en el corazón del trekking', body: 'Chaltén Loft está a 5 minutos caminando del inicio de los principales senderos. Salís al amanecer sin necesidad de traslado.', primary: 'Ver disponibilidad', secondary: 'Preguntar por WhatsApp' },
    en: { title: 'Your base in the heart of the trails', body: 'Chaltén Loft is a 5-minute walk from the main trailheads. Start at dawn with no transportation needed.', primary: 'Check availability', secondary: 'Ask on WhatsApp' },
    pt: { title: 'Sua base no coração das trilhas', body: 'Chaltén Loft fica a 5 minutos a pé dos principais acessos. Saia ao amanhecer sem precisar de transporte.', primary: 'Ver disponibilidade', secondary: 'Perguntar pelo WhatsApp' },
    fr: { title: 'Votre base au cœur des sentiers', body: 'Chaltén Loft est à 5 minutes à pied des principaux départs. Partez à l\'aube sans transport.', primary: 'Voir les disponibilités', secondary: 'Demander par WhatsApp' },
    de: { title: 'Ihre Basis im Herzen der Wanderwege', body: 'Chaltén Loft liegt 5 Gehminuten von den Wanderausgangspunkten. Starten Sie in der Morgendämmerung ohne Fahrt.', primary: 'Verfügbarkeit prüfen', secondary: 'Per WhatsApp fragen' },
    ko: { title: '트레일의 중심에서 출발하세요', body: '찰텐 로프트는 주요 등산로 입구에서 도보 5분. 차 없이 새벽에 바로 출발.', primary: '예약 가능 여부 확인', secondary: 'WhatsApp으로 문의' },
    ja: { title: 'トレイルの中心地があなたの拠点', body: 'チャルテン・ロフトは主要トレイル入口から徒歩5分。送迎不要で夜明けに出発できます。', primary: '空き状況を確認', secondary: 'WhatsAppで質問' },
    zh: { title: '徒步大本营，近在咫尺', body: '查尔腾 Loft 距主要步道入口步行5分钟。无需交通，黎明即发。', primary: '查看空房', secondary: '通过WhatsApp咨询' },
  },
  gastronomia: {
    es: { title: 'A pasos de los mejores restaurantes', body: 'Quedáte en Chaltén Loft y tenés todos estos lugares a menos de 10 minutos a pie. Sin auto, sin traslados.', primary: 'Ver disponibilidad', secondary: 'Consultar por WhatsApp' },
    en: { title: 'Steps away from the best restaurants', body: 'Stay at Chaltén Loft and all these spots are within a 10-minute walk. No car, no transfers.', primary: 'Check availability', secondary: 'Ask on WhatsApp' },
    pt: { title: 'A passos dos melhores restaurantes', body: 'Fique no Chaltén Loft e todos esses lugares ficam a menos de 10 minutos a pé. Sem carro.', primary: 'Ver disponibilidade', secondary: 'Consultar pelo WhatsApp' },
    fr: { title: 'À deux pas des meilleurs restaurants', body: 'Séjournez au Chaltén Loft — tous ces endroits sont à moins de 10 minutes à pied.', primary: 'Voir les disponibilités', secondary: 'Demander par WhatsApp' },
    de: { title: 'Wenige Schritte von den besten Restaurants', body: 'Im Chaltén Loft wohnen — alle Lokale in 10 Gehminuten. Kein Auto nötig.', primary: 'Verfügbarkeit prüfen', secondary: 'Per WhatsApp fragen' },
    ko: { title: '최고의 레스토랑이 모두 도보권', body: '찰텐 로프트에서 모든 식당까지 도보 10분. 차도, 이동도 필요 없습니다.', primary: '예약 가능 여부 확인', secondary: 'WhatsApp으로 문의' },
    ja: { title: '最高のレストランがすぐそこに', body: 'チャルテン・ロフトに滞在すれば、全レストランが徒歩10分以内。移動不要。', primary: '空き状況を確認', secondary: 'WhatsAppで質問' },
    zh: { title: '最佳餐厅近在咫尺', body: '入住查尔腾 Loft，所有餐厅步行10分钟可达。无需租车。', primary: '查看空房', secondary: '通过WhatsApp咨询' },
  },
  recomendaciones: {
    es: { title: 'La mejor ubicación para vivir todo esto', body: 'Chaltén Loft está en el centro del pueblo — a igual distancia del súper, el banco, los senderos y los restaurantes.', primary: 'Ver disponibilidad', secondary: 'Consultar por WhatsApp' },
    en: { title: 'The best location to experience all of this', body: 'Chaltén Loft is in the center of town — equal distance from the supermarket, bank, trails, and restaurants.', primary: 'Check availability', secondary: 'Ask on WhatsApp' },
    pt: { title: 'A melhor localização para viver tudo isso', body: 'Chaltén Loft fica no centro da cidade — a igual distância do mercado, banco, trilhas e restaurantes.', primary: 'Ver disponibilidade', secondary: 'Consultar pelo WhatsApp' },
    fr: { title: 'Le meilleur emplacement pour tout vivre', body: 'Chaltén Loft est au centre du village — à égale distance du supermarché, de la banque, des sentiers et des restaurants.', primary: 'Voir les disponibilités', secondary: 'Demander par WhatsApp' },
    de: { title: 'Die beste Lage, um alles zu erleben', body: 'Chaltén Loft liegt im Ortszentrum — gleich nah zu Supermarkt, Bank, Wanderwegen und Restaurants.', primary: 'Verfügbarkeit prüfen', secondary: 'Per WhatsApp fragen' },
    ko: { title: '모든 것을 즐기기 위한 최고의 위치', body: '찰텐 로프트는 마을 중심에 있어 슈퍼마켓, 은행, 트레일, 레스토랑 모두 동일한 거리입니다.', primary: '예약 가능 여부 확인', secondary: 'WhatsApp으로 문의' },
    ja: { title: 'すべてを楽しむためのベストロケーション', body: 'チャルテン・ロフトはタウンセンターに位置し、スーパー、銀行、トレイル、レストランが等距離。', primary: '空き状況を確認', secondary: 'WhatsAppで質問' },
    zh: { title: '享受一切的最佳地点', body: '查尔腾 Loft 位于镇中心，距超市、银行、步道和餐厅距离相等。', primary: '查看空房', secondary: '通过WhatsApp咨询' },
  },
}

const WA_NUMBERS: Record<Variant, string> = {
  trekking: '5492901644067',
  gastronomia: '5492966421502',
  recomendaciones: '5492966421502',
}

export default function ContentPageBookingCTA({
  locale,
  variant,
}: {
  locale: string
  variant: Variant
}) {
  const copy = COPY[variant][locale] ?? COPY[variant]['en']
  const waNumber = WA_NUMBERS[variant]

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5 border-t border-primary/10">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
        <p className="text-4xl mb-5">🏡</p>
        <h2 className="font-heading text-2xl sm:text-3xl text-primary mb-4 leading-tight">
          {copy.title}
        </h2>
        <p className="text-muted mb-10 leading-relaxed max-w-lg mx-auto">
          {copy.body}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`/${locale}/properties`}
            className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-4 rounded-xl transition-colors shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {copy.primary}
          </a>
          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-surface text-primary font-semibold px-8 py-4 rounded-xl border border-primary/20 transition-colors"
          >
            <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {copy.secondary}
          </a>
        </div>
      </div>
    </section>
  )
}
