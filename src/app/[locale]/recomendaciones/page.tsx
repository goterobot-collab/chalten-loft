import { setRequestLocale } from 'next-intl/server'
import { Droplets, Wifi, CloudLightning, Bus, ShoppingCart, Trash2, Rabbit, Phone, Banknote, Shield, Sun, AlertTriangle } from 'lucide-react'

type Props = {
  params: Promise<{ locale: string }>
}

type Locale = 'es' | 'en' | 'pt' | 'fr' | 'de' | 'ko' | 'ja' | 'zh'

// ── i18n ──────────────────────────────────────────────────────────────────────

const T: Record<string, Record<string, string>> = {
  tagline:    { es:'Para tu estadía', en:'For your stay', pt:'Para sua estadia', fr:'Pour votre séjour', de:'Für Ihren Aufenthalt', ko:'숙박을 위한 안내', ja:'ご滞在のために', zh:'住宿须知' },
  heroTitle:  { es:'Guía Práctica\nde Chaltén', en:'Practical Guide\nto Chaltén', pt:'Guia Prático\nde Chaltén', fr:'Guide Pratique\nde Chaltén', de:'Praktischer\nReiseführer Chaltén', ko:'찰텐 실용\n여행 가이드', ja:'チャルテン\n実用ガイド', zh:'查尔腾\n实用指南' },
  heroSub:    { es:'Todo lo que necesitás saber para aprovechar al máximo tu visita. Tips locales reales, no los genéricos de cualquier guía.', en:'Everything you need to know to make the most of your visit. Real local tips, not the generic stuff you find in any guide.', pt:'Tudo que você precisa saber para aproveitar ao máximo sua visita. Dicas locais reais, não as genéricas de qualquer guia.', fr:'Tout ce que vous devez savoir pour profiter au maximum de votre visite. Vrais conseils locaux, pas les génériques de n\'importe quel guide.', de:'Alles, was Sie wissen müssen, um Ihren Besuch optimal zu nutzen. Echte lokale Tipps, nicht die generischen aus irgendeinem Reiseführer.', ko:'방문을 최대한 즐기기 위해 알아야 할 모든 것. 어느 가이드에서나 볼 수 있는 일반적인 내용이 아닌 진짜 현지 팁.', ja:'訪問を最大限に楽しむために知っておくべきこと。どのガイドにも載っているような一般的な内容ではなく、本物の地元の情報。', zh:'充分享受旅程所需了解的一切。真正的当地贴士，而非任何指南中的通用内容。' },
}

// ── Section data ──────────────────────────────────────────────────────────────

type Section = {
  id: string
  icon: React.ReactNode
  color: string
  title: Record<string, string>
  items: Record<string, Array<{ text: string; type?: 'tip' | 'warning' | 'info' }>>
}

const SECTIONS: Section[] = [
  {
    id: 'water',
    icon: <Droplets className="w-6 h-6" />,
    color: 'bg-blue-50 text-blue-700 border-blue-100',
    title: { es:'Agua del Grifo: Potable ✅', en:'Tap Water: Safe to Drink ✅', pt:'Água da Torneira: Potável ✅', fr:'Eau du Robinet: Potable ✅', de:'Leitungswasser: Trinkbar ✅', ko:'수돗물: 마실 수 있음 ✅', ja:'水道水：飲めます ✅', zh:'自来水：可直接饮用 ✅' },
    items: {
      es: [
        { text: 'El Chaltén se abastece de agua dulce de napas subterráneas ligadas a glaciares. Es monitoreada por las autoridades locales y considerada apta para consumo humano.', type: 'info' },
        { text: 'Podés beber directamente del grifo. No necesitás comprar agua embotellada.', type: 'tip' },
        { text: 'Si preferís mayor tranquilidad, hay agua embotellada disponible en los supermercados del pueblo.', type: 'info' },
        { text: 'En los senderos del parque nacional, los ríos y arroyos son generalmente de buena calidad, pero se recomienda usar filtro si vas a tomar agua directamente de fuentes naturales.', type: 'warning' },
      ],
      en: [
        { text: 'El Chaltén is supplied with fresh water from underground aquifers connected to glaciers. It is monitored by local authorities and considered safe for human consumption.', type: 'info' },
        { text: 'You can drink directly from the tap. No need to buy bottled water.', type: 'tip' },
        { text: 'If you prefer extra peace of mind, bottled water is available at local supermarkets.', type: 'info' },
        { text: 'On national park trails, rivers and streams are generally good quality, but a filter is recommended if drinking directly from natural sources.', type: 'warning' },
      ],
      pt: [
        { text: 'El Chaltén é abastecido por água doce de lençóis subterrâneos ligados a geleiras. É monitorada pelas autoridades locais e considerada apta para consumo humano.', type: 'info' },
        { text: 'Você pode beber diretamente da torneira. Não precisa comprar água engarrafada.', type: 'tip' },
        { text: 'Se preferir mais tranquilidade, há água engarrafada disponível nos supermercados do vilarejo.', type: 'info' },
        { text: 'Nos trilhos do parque nacional, rios e riachos geralmente têm boa qualidade, mas recomenda-se filtro ao beber diretamente de fontes naturais.', type: 'warning' },
      ],
      fr: [
        { text: 'El Chaltén est approvisionné en eau douce provenant de nappes souterraines liées aux glaciers. Elle est contrôlée par les autorités locales et considérée comme potable.', type: 'info' },
        { text: 'Vous pouvez boire directement au robinet. Pas besoin d\'eau en bouteille.', type: 'tip' },
        { text: 'Si vous préférez plus de tranquillité d\'esprit, de l\'eau en bouteille est disponible dans les supermarchés locaux.', type: 'info' },
        { text: 'Sur les sentiers du parc national, rivières et ruisseaux sont généralement de bonne qualité, mais un filtre est recommandé si vous buvez directement à des sources naturelles.', type: 'warning' },
      ],
      de: [
        { text: 'El Chaltén wird mit Süßwasser aus Grundwasserleitern versorgt, die mit Gletschern verbunden sind. Es wird von den lokalen Behörden überwacht und als trinkbar eingestuft.', type: 'info' },
        { text: 'Sie können direkt aus dem Hahn trinken. Kein Kauf von Flaschenwasser nötig.', type: 'tip' },
        { text: 'Wer auf der sicheren Seite sein möchte: Flaschenwasser ist in den Supermärkten des Ortes erhältlich.', type: 'info' },
        { text: 'Auf den Wegen im Nationalpark haben Flüsse und Bäche meist gute Qualität, aber ein Filter wird empfohlen, wenn Sie direkt aus natürlichen Quellen trinken.', type: 'warning' },
      ],
      ko: [
        { text: '찰텐은 빙하와 연결된 지하 대수층의 민물을 공급받습니다. 지방 당국이 모니터링하며 음용에 적합한 것으로 간주됩니다.', type: 'info' },
        { text: '수돗물을 바로 마실 수 있습니다. 생수를 살 필요가 없습니다.', type: 'tip' },
        { text: '더 안심하고 싶다면 마을 슈퍼마켓에서 생수를 구입할 수 있습니다.', type: 'info' },
        { text: '국립공원 트레일에서 강과 개울은 일반적으로 수질이 좋지만, 자연 수원에서 직접 마실 때는 필터 사용을 권장합니다.', type: 'warning' },
      ],
      ja: [
        { text: 'チャルテンは氷河に繋がる地下帯水層の淡水で供給されています。地元当局が監視しており、飲用に適していると認定されています。', type: 'info' },
        { text: '蛇口から直接飲めます。ペットボトルの水を買う必要はありません。', type: 'tip' },
        { text: 'より安心したい方は、地元のスーパーでペットボトルの水が購入できます。', type: 'info' },
        { text: '国立公園のトレイルでは川や小川は一般的に良質ですが、自然の水源から直接飲む場合はフィルターの使用を推奨します。', type: 'warning' },
      ],
      zh: [
        { text: '查尔腾的供水来自与冰川相连的地下含水层。由当地政府监控，被认定为适合人类饮用。', type: 'info' },
        { text: '可以直接饮用自来水。无需购买瓶装水。', type: 'tip' },
        { text: '如果需要更安心，村里的超市有瓶装水出售。', type: 'info' },
        { text: '在国家公园步道上，河流和小溪通常水质良好，但若直接从天然水源饮用，建议使用过滤器。', type: 'warning' },
      ],
    },
  },
  {
    id: 'money',
    icon: <Banknote className="w-6 h-6" />,
    color: 'bg-green-50 text-green-700 border-green-100',
    title: { es:'Dinero y Cajeros', en:'Money & ATMs', pt:'Dinheiro e Caixas Eletrônicos', fr:'Argent et Distributeurs', de:'Geld & Geldautomaten', ko:'돈 및 ATM', ja:'お金とATM', zh:'货币与ATM' },
    items: {
      es: [
        { text: 'Hay un solo cajero automático en el pueblo (Banco Santa Cruz). En temporada alta se queda sin efectivo los fines de semana. Retirá pesos en El Calafate antes de llegar.', type: 'warning' },
        { text: 'Muchos restaurantes solo aceptan efectivo. La naftera solo acepta pesos en efectivo.', type: 'info' },
        { text: 'Los dólares americanos y euros son aceptados en muchos negocios, hostels y casas de cambio informales.', type: 'tip' },
        { text: 'Propina estándar: 10%. Siempre en efectivo — no se puede dejar propina con tarjeta.', type: 'info' },
        { text: 'El horario del banco es lunes a viernes de 8 AM a 1 PM solamente.', type: 'info' },
      ],
      en: [
        { text: 'There is only one ATM in town (Banco Santa Cruz). In high season it runs out of cash on weekends. Withdraw pesos in El Calafate before arriving.', type: 'warning' },
        { text: 'Many restaurants only accept cash. The gas station only accepts Argentine pesos in cash.', type: 'info' },
        { text: 'US dollars and euros are accepted at many shops, hostels and informal exchange points.', type: 'tip' },
        { text: 'Standard tip: 10%. Always in cash — you cannot leave a tip by card.', type: 'info' },
        { text: 'Bank hours: Monday to Friday, 8 AM to 1 PM only.', type: 'info' },
      ],
      pt: [
        { text: 'Há apenas um caixa eletrônico na cidade (Banco Santa Cruz). Na alta temporada fica sem dinheiro nos fins de semana. Saque pesos em El Calafate antes de chegar.', type: 'warning' },
        { text: 'Muitos restaurantes só aceitam dinheiro. O posto de gasolina só aceita pesos argentinos em espécie.', type: 'info' },
        { text: 'Dólares americanos e euros são aceitos em muitas lojas, hostels e pontos de câmbio informais.', type: 'tip' },
        { text: 'Gorjeta padrão: 10%. Sempre em dinheiro — não é possível deixar gorjeta com cartão.', type: 'info' },
        { text: 'Horário bancário: segunda a sexta, das 8h às 13h somente.', type: 'info' },
      ],
      fr: [
        { text: 'Il n\'y a qu\'un seul distributeur en ville (Banco Santa Cruz). En haute saison il est souvent vide le week-end. Retirez des pesos à El Calafate avant d\'arriver.', type: 'warning' },
        { text: 'Beaucoup de restaurants n\'acceptent que les espèces. La station-service n\'accepte que les pesos argentins en espèces.', type: 'info' },
        { text: 'Les dollars américains et euros sont acceptés dans de nombreux commerces, auberges et points de change informels.', type: 'tip' },
        { text: 'Pourboire standard : 10 %. Toujours en espèces — impossible de laisser un pourboire par carte.', type: 'info' },
        { text: 'Horaires bancaires : lundi au vendredi, de 8h à 13h seulement.', type: 'info' },
      ],
      de: [
        { text: 'Es gibt nur einen Geldautomaten im Ort (Banco Santa Cruz). In der Hochsaison ist er an Wochenenden oft leer. Heben Sie Pesos in El Calafate ab, bevor Sie ankommen.', type: 'warning' },
        { text: 'Viele Restaurants akzeptieren nur Bargeld. Die Tankstelle akzeptiert nur argentinische Pesos in bar.', type: 'info' },
        { text: 'US-Dollar und Euro werden in vielen Geschäften, Hostels und informellen Wechselstuben akzeptiert.', type: 'tip' },
        { text: 'Übliches Trinkgeld: 10 %. Immer in bar — Trinkgeld per Karte ist nicht möglich.', type: 'info' },
        { text: 'Bankzeiten: Montag bis Freitag, nur 8–13 Uhr.', type: 'info' },
      ],
      ko: [
        { text: '마을에 ATM이 하나뿐입니다(Banco Santa Cruz). 성수기에는 주말에 현금이 소진됩니다. 도착 전 엘 칼라파테에서 페소를 인출하세요.', type: 'warning' },
        { text: '많은 식당이 현금만 받습니다. 주유소는 아르헨티나 페소 현금만 받습니다.', type: 'info' },
        { text: '미국 달러와 유로는 많은 상점, 호스텔, 비공식 환전소에서 받습니다.', type: 'tip' },
        { text: '표준 팁: 10%. 항상 현금으로 — 카드로 팁을 남길 수 없습니다.', type: 'info' },
        { text: '은행 시간: 월요일~금요일, 오전 8시~오후 1시만.', type: 'info' },
      ],
      ja: [
        { text: '町にはATMが1台のみ（Banco Santa Cruz）。ハイシーズンは週末に現金が切れることがあります。到着前にエル・カラファテでペソを引き出してください。', type: 'warning' },
        { text: '多くのレストランは現金のみ。ガソリンスタンドはアルゼンチンペソ現金のみ。', type: 'info' },
        { text: '米ドルとユーロは多くの店、ホステル、非公式両替所で受け付けています。', type: 'tip' },
        { text: '標準チップ：10%。常に現金で — カードでのチップは不可。', type: 'info' },
        { text: '銀行の営業時間：月〜金、午前8時〜午後1時のみ。', type: 'info' },
      ],
      zh: [
        { text: '镇上只有一台ATM（Banco Santa Cruz）。旺季周末经常取光。请在抵达前在卡拉法特提取比索。', type: 'warning' },
        { text: '许多餐厅只收现金。加油站只接受阿根廷比索现金。', type: 'info' },
        { text: '美元和欧元在很多商店、旅馆和非正式兑换点被接受。', type: 'tip' },
        { text: '标准小费：10%。始终现金支付——不能用卡给小费。', type: 'info' },
        { text: '银行时间：周一至周五，仅上午8点至下午1点。', type: 'info' },
      ],
    },
  },
  {
    id: 'connectivity',
    icon: <Wifi className="w-6 h-6" />,
    color: 'bg-purple-50 text-purple-700 border-purple-100',
    title: { es:'Conectividad e Internet', en:'Connectivity & Internet', pt:'Conectividade e Internet', fr:'Connectivité et Internet', de:'Konnektivität & Internet', ko:'연결성 및 인터넷', ja:'通信とインターネット', zh:'通信与网络' },
    items: {
      es: [
        { text: 'En el pueblo hay señal móvil con Movistar, Claro y Personal (4G irregular). Dentro del apartamento tenés WiFi por fibra óptica — rápida y estable.', type: 'info' },
        { text: '⚡ Cero señal en los senderos y el Parque Nacional. Los guías usan radios VHF y teléfonos satelitales para emergencias.', type: 'warning' },
        { text: 'Descargá los mapas antes de salir: AllTrails, Maps.me y Wikiloc funcionan sin conexión.', type: 'tip' },
        { text: 'La fibra óptica hace que el Chaltén Loft tenga mejor conexión que muchos lugares de Argentina — ideal para trabajar en remoto.', type: 'tip' },
      ],
      en: [
        { text: 'In town there is mobile signal with Movistar, Claro and Personal (irregular 4G). Inside the apartment you have fiber optic WiFi — fast and stable.', type: 'info' },
        { text: '⚡ Zero signal on trails and in the National Park. Guides use VHF radios and satellite phones for emergencies.', type: 'warning' },
        { text: 'Download maps before heading out: AllTrails, Maps.me and Wikiloc work offline.', type: 'tip' },
        { text: 'Fiber optic connection means Chaltén Loft has better internet than most places in Argentina — great for remote work.', type: 'tip' },
      ],
      pt: [
        { text: 'Na cidade há sinal móvel com Movistar, Claro e Personal (4G irregular). Dentro do apartamento você tem WiFi por fibra óptica — rápido e estável.', type: 'info' },
        { text: '⚡ Zero sinal nas trilhas e no Parque Nacional. Guias usam rádios VHF e telefones satelitais para emergências.', type: 'warning' },
        { text: 'Baixe os mapas antes de sair: AllTrails, Maps.me e Wikiloc funcionam offline.', type: 'tip' },
        { text: 'Pode haver queda de internet em dias de muito vento — isso é normal.', type: 'info' },
      ],
      fr: [
        { text: 'En ville il y a un signal mobile avec Movistar, Claro et Personal (4G irrégulier). Dans l\'appartement vous avez le WiFi par fibre optique — rapide et stable.', type: 'info' },
        { text: '⚡ Zéro signal sur les sentiers et dans le Parc National. Les guides utilisent des radios VHF et des téléphones satellites pour les urgences.', type: 'warning' },
        { text: 'Téléchargez les cartes avant de partir : AllTrails, Maps.me et Wikiloc fonctionnent hors ligne.', type: 'tip' },
        { text: 'La fibre optique fait que Chaltén Loft a une meilleure connexion que la plupart des endroits en Argentine — idéal pour le télétravail.', type: 'tip' },
      ],
      de: [
        { text: 'Im Ort gibt es Mobilfunkempfang von Movistar, Claro und Personal (unregelmäßiges 4G). In der Wohnung haben Sie WLAN über Glasfaser — schnell und stabil.', type: 'info' },
        { text: '⚡ Kein Empfang auf den Wanderwegen und im Nationalpark. Guides nutzen VHF-Funkgeräte und Satellitentelefone für Notfälle.', type: 'warning' },
        { text: 'Karten vor dem Aufbruch herunterladen: AllTrails, Maps.me und Wikiloc funktionieren offline.', type: 'tip' },
        { text: 'Glasfaser-Internet bedeutet, dass Chaltén Loft eine bessere Verbindung hat als die meisten Orte in Argentinien — ideal für Remote-Arbeit.', type: 'tip' },
      ],
      ko: [
        { text: '마을에서는 Movistar, Claro, Personal로 모바일 신호가 있습니다(불규칙한 4G). 아파트 내에는 광섬유 WiFi가 있습니다 — 빠르고 안정적입니다.', type: 'info' },
        { text: '⚡ 트레일과 국립공원에서는 신호 없음. 가이드는 긴급 상황에 VHF 무선과 위성폰을 사용합니다.', type: 'warning' },
        { text: '출발 전 지도를 다운로드하세요: AllTrails, Maps.me, Wikiloc은 오프라인으로 작동합니다.', type: 'tip' },
        { text: '광섬유 덕분에 찰텐 로프트는 아르헨티나 대부분의 장소보다 인터넷이 빠릅니다 — 원격 근무에 최적입니다.', type: 'tip' },
      ],
      ja: [
        { text: '町ではMovistar、Claro、Personalで携帯電波があります（不安定な4G）。アパート内では光ファイバーWiFiが使えます — 高速で安定しています。', type: 'info' },
        { text: '⚡ トレイルと国立公園内は圏外。ガイドは緊急時にVHF無線と衛星電話を使用。', type: 'warning' },
        { text: '出発前にマップをダウンロード：AllTrails、Maps.me、Wikiloc はオフラインで動作します。', type: 'tip' },
        { text: '光ファイバーのおかげで、チャルテン・ロフトはアルゼンチンのほとんどの場所より快適なインターネット環境です — リモートワークに最適。', type: 'tip' },
      ],
      zh: [
        { text: '镇上有Movistar、Claro和Personal的移动信号（不稳定的4G）。公寓内提供光纤WiFi——快速稳定。', type: 'info' },
        { text: '⚡ 步道和国家公园内完全没有信号。向导在紧急情况下使用VHF无线电和卫星电话。', type: 'warning' },
        { text: '出发前下载地图：AllTrails、Maps.me和Wikiloc支持离线使用。', type: 'tip' },
        { text: '光纤连接使查尔腾阁楼的网络比阿根廷大多数地方都要好——非常适合远程办公。', type: 'tip' },
      ],
    },
  },
  {
    id: 'weather',
    icon: <CloudLightning className="w-6 h-6" />,
    color: 'bg-sky-50 text-sky-700 border-sky-100',
    title: { es:'Clima y Vestimenta', en:'Weather & Clothing', pt:'Clima e Vestuário', fr:'Météo et Vêtements', de:'Wetter & Kleidung', ko:'날씨 및 의류', ja:'天気と服装', zh:'天气与着装' },
    items: {
      es: [
        { text: 'Clima subantártico extremo: podés experimentar las 4 estaciones en un mismo día. Las ráfagas de viento pueden superar los 100 km/h — si no podés mantenerte en pie, volvé.', type: 'warning' },
        { text: 'Llevá siempre: campera impermeable + cortaviento, pantalón de lluvia, ropa térmica y botas de trekking con buen tobillero.', type: 'tip' },
        { text: 'Radiación UV muy alta — la capa de ozono está dañada en Patagonia. Usá SPF 50+ y anteojos de sol incluso en días nublados.', type: 'warning' },
        { text: 'Mejor época: marzo-abril (otoño), con vientos más calmos y colores increíbles. Enero-febrero es el pico turístico pero con más viento.', type: 'info' },
        { text: 'En verano hay luz solar desde las 4 AM hasta las 11 PM — aprovechable para salidas muy tempranas.', type: 'tip' },
      ],
      en: [
        { text: 'Extreme subantarctic climate: you can experience all 4 seasons in one day. Wind gusts can exceed 100 km/h — if you can\'t stand upright, turn back.', type: 'warning' },
        { text: 'Always bring: waterproof jacket + windbreaker, rain pants, thermal layers and hiking boots with good ankle support.', type: 'tip' },
        { text: 'Very high UV radiation — the ozone layer is damaged in Patagonia. Use SPF 50+ and sunglasses even on cloudy days.', type: 'warning' },
        { text: 'Best season: March–April (autumn), with calmer winds and stunning colors. January–February is peak tourist season but windier.', type: 'info' },
        { text: 'In summer there is daylight from 4 AM to 11 PM — great for very early starts.', type: 'tip' },
      ],
      pt: [
        { text: 'Clima subantártico extremo: você pode vivenciar as 4 estações em um mesmo dia. As rajadas de vento podem ultrapassar 100 km/h — se não conseguir ficar em pé, volte.', type: 'warning' },
        { text: 'Sempre leve: jaqueta impermeável + corta-vento, calça de chuva, roupas térmicas e botas de trekking com bom suporte de tornozelo.', type: 'tip' },
        { text: 'Radiação UV muito alta — a camada de ozônio está danificada na Patagônia. Use FPS 50+ e óculos de sol mesmo em dias nublados.', type: 'warning' },
        { text: 'Melhor época: março-abril (outono), com ventos mais calmos e cores incríveis. Janeiro-fevereiro é o pico turístico mas com mais vento.', type: 'info' },
        { text: 'No verão há luz solar das 4h às 23h — ótimo para saídas muito cedo.', type: 'tip' },
      ],
      fr: [
        { text: 'Climat subantarctique extrême : vous pouvez vivre les 4 saisons en une journée. Les rafales de vent peuvent dépasser 100 km/h — si vous ne pouvez pas tenir debout, faites demi-tour.', type: 'warning' },
        { text: 'Apportez toujours : veste imperméable + coupe-vent, pantalon de pluie, vêtements thermiques et chaussures de randonnée avec bon soutien de cheville.', type: 'tip' },
        { text: 'Rayonnement UV très élevé — la couche d\'ozone est endommagée en Patagonie. Utilisez SPF 50+ et lunettes de soleil même par temps nuageux.', type: 'warning' },
        { text: 'Meilleure saison : mars-avril (automne), avec des vents plus calmes et des couleurs splendides. Janvier-février est le pic touristique mais plus venté.', type: 'info' },
        { text: 'En été il y a de la lumière solaire de 4h à 23h — idéal pour des départs très matinaux.', type: 'tip' },
      ],
      de: [
        { text: 'Extremes subantarktisches Klima: Sie können alle 4 Jahreszeiten an einem Tag erleben. Windböen können 100 km/h überschreiten — wenn Sie sich nicht aufrecht halten können, umkehren.', type: 'warning' },
        { text: 'Immer mitnehmen: wasserdichte Jacke + Windschutz, Regenhose, Thermoschichten und Wanderschuhe mit gutem Knöchelschutz.', type: 'tip' },
        { text: 'Sehr hohe UV-Strahlung — die Ozonschicht ist in Patagonien beschädigt. SPF 50+ und Sonnenbrille auch an bewölkten Tagen verwenden.', type: 'warning' },
        { text: 'Beste Zeit: März-April (Herbst), mit ruhigeren Winden und atemberaubenden Farben. Januar-Februar ist die touristische Hauptsaison aber windiger.', type: 'info' },
        { text: 'Im Sommer gibt es Tageslicht von 4 bis 23 Uhr — ideal für sehr frühe Starts.', type: 'tip' },
      ],
      ko: [
        { text: '극도의 아남극 기후: 하루에 4계절을 경험할 수 있습니다. 돌풍이 100km/h를 초과할 수 있습니다 — 서 있기 힘들면 돌아가세요.', type: 'warning' },
        { text: '항상 가져가세요: 방수 재킷 + 바람막이, 비바지, 보온 레이어, 발목 지지력이 좋은 등산화.', type: 'tip' },
        { text: '매우 높은 자외선 — 파타고니아는 오존층이 손상되어 있습니다. 흐린 날에도 SPF 50+ 선크림과 선글라스를 착용하세요.', type: 'warning' },
        { text: '최적 시기: 3~4월(가을), 바람이 잔잔하고 색채가 멋집니다. 1~2월은 관광 성수기지만 바람이 더 강합니다.', type: 'info' },
        { text: '여름에는 오전 4시부터 오후 11시까지 햇빛이 납니다 — 이른 출발을 활용하세요.', type: 'tip' },
      ],
      ja: [
        { text: '極端な亜南極気候：1日で4つの季節を経験できます。突風は100km/hを超えることもあります — 立っていられなければ引き返してください。', type: 'warning' },
        { text: 'いつも持参：防水ジャケット＋ウィンドブレーカー、レインパンツ、保温レイヤー、足首サポートのしっかりしたハイキングブーツ。', type: 'tip' },
        { text: 'UV放射が非常に強い — パタゴニアではオゾン層が損傷しています。曇りの日でもSPF50+と日焼け止めサングラスを使用してください。', type: 'warning' },
        { text: 'ベストシーズン：3〜4月（秋）、風が穏やかで色彩が素晴らしい。1〜2月は観光ピークシーズンだがより風が強い。', type: 'info' },
        { text: '夏は午前4時から午後11時まで日が出ています — 非常に早い出発が可能。', type: 'tip' },
      ],
      zh: [
        { text: '极端的亚南极气候：您可能在同一天经历四季。阵风可超过100公里/小时——如果无法站稳，请返回。', type: 'warning' },
        { text: '始终携带：防水夹克+防风外套、雨裤、保暖层和具有良好踝部支撑的登山靴。', type: 'tip' },
        { text: '紫外线非常强——巴塔哥尼亚的臭氧层受损。即使在阴天也要使用SPF 50+防晒霜和太阳镜。', type: 'warning' },
        { text: '最佳时间：3-4月（秋季），风较平静，色彩壮观。1-2月是旅游旺季但风更大。', type: 'info' },
        { text: '夏季日照从凌晨4点到晚上11点——适合非常早出发。', type: 'tip' },
      ],
    },
  },
  {
    id: 'transport',
    icon: <Bus className="w-6 h-6" />,
    color: 'bg-amber-50 text-amber-700 border-amber-100',
    title: { es:'Cómo Llegar y Moverse', en:'Getting Here & Around', pt:'Como Chegar e Locomover-se', fr:'Comment Arriver et se Déplacer', de:'Anreise & Fortbewegung', ko:'이동 방법', ja:'アクセスと移動', zh:'如何到达和出行' },
    items: {
      es: [
        { text: 'El aeropuerto más cercano está en El Calafate (FTE), a ~213 km. El bus tarda entre 2,5 y 3 horas — reservá por Bus Bud o en la terminal de Calafate.', type: 'info' },
        { text: 'Si venís en auto: la Ruta 23 está pavimentada pero no hay nafterías entre Calafate y Chaltén. Llenás el tanque antes de salir.', type: 'warning' },
        { text: 'Dentro del pueblo no necesitás auto — todo está a 15 minutos caminando.', type: 'tip' },
        { text: 'Para los senderos del norte del parque hay taxis y remises muy económicos. El autoestop (dedo) es muy común y seguro en la zona.', type: 'info' },
        { text: 'El pueblo tiene calles de tierra sin iluminación — llevá linterna para salidas nocturnas.', type: 'info' },
      ],
      en: [
        { text: 'The nearest airport is in El Calafate (FTE), ~213 km away. Bus takes 2.5–3 hours — book via Bus Bud or at the Calafate terminal.', type: 'info' },
        { text: 'If driving: Route 23 is paved but there are no gas stations between Calafate and Chaltén. Fill your tank before leaving.', type: 'warning' },
        { text: 'Inside the village you don\'t need a car — everything is 15 minutes on foot.', type: 'tip' },
        { text: 'For the northern park trails there are very affordable taxis and remises. Hitchhiking is very common and safe in this area.', type: 'info' },
        { text: 'The village has dirt streets with no lighting — bring a flashlight for night outings.', type: 'info' },
      ],
      pt: [
        { text: 'O aeroporto mais próximo fica em El Calafate (FTE), a ~213 km. O ônibus leva entre 2,5 e 3 horas — reserve pelo Bus Bud ou no terminal de Calafate.', type: 'info' },
        { text: 'Se for de carro: a Rota 23 está pavimentada, mas não há postos entre Calafate e Chaltén. Encha o tanque antes de sair.', type: 'warning' },
        { text: 'Dentro do vilarejo você não precisa de carro — tudo fica a 15 minutos caminhando.', type: 'tip' },
        { text: 'Para as trilhas do norte do parque há táxis e remises muito baratos. Carona (autostop) é muito comum e seguro na região.', type: 'info' },
        { text: 'O vilarejo tem ruas de terra sem iluminação — leve lanterna para saídas noturnas.', type: 'info' },
      ],
      fr: [
        { text: 'L\'aéroport le plus proche se trouve à El Calafate (FTE), à ~213 km. Le bus prend 2h30 à 3h — réservez via Bus Bud ou au terminal de Calafate.', type: 'info' },
        { text: 'En voiture : la Route 23 est asphaltée mais il n\'y a pas de stations-service entre Calafate et Chaltén. Faites le plein avant de partir.', type: 'warning' },
        { text: 'Dans le village vous n\'avez pas besoin de voiture — tout est à 15 minutes à pied.', type: 'tip' },
        { text: 'Pour les sentiers du nord du parc il y a des taxis et remises très abordables. L\'auto-stop est très courant et sûr dans la région.', type: 'info' },
        { text: 'Le village a des rues en terre sans éclairage — apportez une lampe de poche pour les sorties nocturnes.', type: 'info' },
      ],
      de: [
        { text: 'Der nächste Flughafen ist in El Calafate (FTE), ~213 km entfernt. Bus braucht 2,5–3 Stunden — buchen Sie über Bus Bud oder am Calafate-Terminal.', type: 'info' },
        { text: 'Mit dem Auto: Route 23 ist asphaltiert, aber zwischen Calafate und Chaltén gibt es keine Tankstellen. Volltanken vor der Abfahrt.', type: 'warning' },
        { text: 'Im Ort brauchen Sie kein Auto — alles ist zu Fuß in 15 Minuten erreichbar.', type: 'tip' },
        { text: 'Für die nördlichen Parkwege gibt es sehr günstige Taxis und Remises. Trampen ist in der Region sehr üblich und sicher.', type: 'info' },
        { text: 'Der Ort hat unbefestigte, unbeleuchtete Straßen — Taschenlampe für Nachtausflüge mitnehmen.', type: 'info' },
      ],
      ko: [
        { text: '가장 가까운 공항은 약 213km 거리의 엘 칼라파테(FTE)입니다. 버스는 2.5~3시간 소요 — Bus Bud 또는 칼라파테 터미널에서 예약하세요.', type: 'info' },
        { text: '자동차로 올 경우: 23번 도로는 포장되어 있지만 칼라파테와 찰텐 사이에 주유소가 없습니다. 출발 전 탱크를 가득 채우세요.', type: 'warning' },
        { text: '마을 안에서는 차가 필요 없습니다 — 모든 것이 도보로 15분 거리입니다.', type: 'tip' },
        { text: '공원 북쪽 트레일을 위한 저렴한 택시와 레미세가 있습니다. 히치하이킹은 이 지역에서 매우 일반적이고 안전합니다.', type: 'info' },
        { text: '마을은 조명 없는 비포장 도로입니다 — 야간 외출 시 손전등을 가져가세요.', type: 'info' },
      ],
      ja: [
        { text: '最寄り空港はエル・カラファテ（FTE）で約213km先。バスは2.5〜3時間 — Bus Budかカラファテターミナルで予約を。', type: 'info' },
        { text: '車の場合：23号線は舗装済みですが、カラファテとチャルテンの間にガソリンスタンドがありません。出発前に満タンに。', type: 'warning' },
        { text: '村内は車不要 — 何でも徒歩15分以内。', type: 'tip' },
        { text: '公園北部のトレイルへは非常に安価なタクシーやレミセがあります。ヒッチハイクはこの地域でよく見られ安全です。', type: 'info' },
        { text: '村は照明のない砂利道 — 夜の外出には懐中電灯を。', type: 'info' },
      ],
      zh: [
        { text: '最近的机场在卡拉法特（FTE），约213公里。大巴需要2.5~3小时——通过Bus Bud或卡拉法特终点站预订。', type: 'info' },
        { text: '如果开车：23号公路是铺装路，但卡拉法特和查尔腾之间没有加油站。出发前加满油箱。', type: 'warning' },
        { text: '在村内不需要汽车——所有地方步行15分钟即可到达。', type: 'tip' },
        { text: '前往公园北部步道有非常便宜的出租车和包车。搭便车在该地区非常普遍且安全。', type: 'info' },
        { text: '村庄道路为无照明的土路——夜间外出请携带手电筒。', type: 'info' },
      ],
    },
  },
  {
    id: 'shopping',
    icon: <ShoppingCart className="w-6 h-6" />,
    color: 'bg-orange-50 text-orange-700 border-orange-100',
    title: { es:'Compras y Supermercados', en:'Shopping & Supermarkets', pt:'Compras e Supermercados', fr:'Courses et Supermarchés', de:'Einkaufen & Supermärkte', ko:'쇼핑 및 슈퍼마켓', ja:'ショッピング＆スーパー', zh:'购物与超市' },
    items: {
      es: [
        { text: 'Los dos supermercados principales son El Relincho y La Anónima. Los precios son considerablemente más altos que en Buenos Aires o El Calafate.', type: 'info' },
        { text: 'Si vas a cocinar mucho, stockeate de productos frescos y secos en El Calafate antes de llegar — hay más variedad y mejores precios.', type: 'tip' },
        { text: 'Horario general de comercios: 10h–13h y 15h–21h. Los cafés abren desde las 8h.', type: 'info' },
        { text: 'Hay tiendas de equipamiento de montaña en el pueblo (ej.: BajoZero) para alquilar o comprar equipo.', type: 'info' },
        { text: 'Reservá alojamiento con 3 a 6 meses de anticipación para enero–febrero.', type: 'warning' },
      ],
      en: [
        { text: 'The two main supermarkets are El Relincho and La Anónima. Prices are considerably higher than in Buenos Aires or El Calafate.', type: 'info' },
        { text: 'If you plan to cook a lot, stock up on fresh and dry products in El Calafate before arriving — more variety and better prices.', type: 'tip' },
        { text: 'General store hours: 10am–1pm and 3pm–9pm. Cafés open from 8am.', type: 'info' },
        { text: 'There are mountain gear shops in town (e.g. BajoZero) for renting or buying equipment.', type: 'info' },
        { text: 'Book accommodation 3 to 6 months in advance for January–February.', type: 'warning' },
      ],
      pt: [
        { text: 'Os dois supermercados principais são El Relincho e La Anónima. Os preços são consideravelmente mais altos do que em Buenos Aires ou El Calafate.', type: 'info' },
        { text: 'Se vai cozinhar bastante, estocar produtos frescos e secos em El Calafate antes de chegar — há mais variedade e melhores preços.', type: 'tip' },
        { text: 'Horário geral do comércio: 10h–13h e 15h–21h. Cafés abrem a partir das 8h.', type: 'info' },
        { text: 'Há lojas de equipamentos de montanha no vilarejo (ex.: BajoZero) para alugar ou comprar equipamentos.', type: 'info' },
        { text: 'Reserve acomodação com 3 a 6 meses de antecedência para janeiro-fevereiro.', type: 'warning' },
      ],
      fr: [
        { text: 'Les deux principaux supermarchés sont El Relincho et La Anónima. Les prix sont considérablement plus élevés qu\'à Buenos Aires ou El Calafate.', type: 'info' },
        { text: 'Si vous prévoyez de beaucoup cuisiner, faites le plein de produits frais et secs à El Calafate avant d\'arriver — plus de choix et meilleurs prix.', type: 'tip' },
        { text: 'Horaires généraux des commerces : 10h–13h et 15h–21h. Les cafés ouvrent dès 8h.', type: 'info' },
        { text: 'Il y a des magasins d\'équipement de montagne dans le village (ex. : BajoZero) pour louer ou acheter du matériel.', type: 'info' },
        { text: 'Réservez l\'hébergement 3 à 6 mois à l\'avance pour janvier-février.', type: 'warning' },
      ],
      de: [
        { text: 'Die zwei Hauptsupermärkte sind El Relincho und La Anónima. Die Preise sind deutlich höher als in Buenos Aires oder El Calafate.', type: 'info' },
        { text: 'Wenn Sie viel kochen wollen, kaufen Sie frische und trockene Produkte in El Calafate ein — mehr Auswahl und bessere Preise.', type: 'tip' },
        { text: 'Allgemeine Geschäftszeiten: 10–13 Uhr und 15–21 Uhr. Cafés öffnen ab 8 Uhr.', type: 'info' },
        { text: 'Es gibt Bergausrüstungsgeschäfte im Ort (z. B. BajoZero) zum Mieten oder Kaufen von Ausrüstung.', type: 'info' },
        { text: 'Unterkunft für Januar–Februar 3 bis 6 Monate im Voraus buchen.', type: 'warning' },
      ],
      ko: [
        { text: '두 개의 주요 슈퍼마켓은 El Relincho와 La Anónima입니다. 부에노스아이레스나 칼라파테보다 가격이 상당히 높습니다.', type: 'info' },
        { text: '요리를 많이 할 계획이라면 도착 전 칼라파테에서 신선식품과 건식품을 구입하세요 — 더 다양하고 가격도 낫습니다.', type: 'tip' },
        { text: '일반 상점 시간: 오전 10시~오후 1시 및 오후 3시~9시. 카페는 오전 8시부터 오픈.', type: 'info' },
        { text: '마을에 장비 대여/구매 가능한 등산장비점이 있습니다(예: BajoZero).', type: 'info' },
        { text: '1~2월 숙박은 3~6개월 전에 예약하세요.', type: 'warning' },
      ],
      ja: [
        { text: '2つの主なスーパーはEl RelinchoとLa Anónimaです。ブエノスアイレスやエル・カラファテより価格がかなり高いです。', type: 'info' },
        { text: '料理を多くする予定なら、到着前にエル・カラファテで食材を揃えてください — 品揃えも良く値段も安い。', type: 'tip' },
        { text: '一般店舗時間：10時〜13時と15時〜21時。カフェは8時から。', type: 'info' },
        { text: '町には山岳装備店があります（例：BajoZero）、レンタルまたは購入可能。', type: 'info' },
        { text: '1〜2月の宿泊は3〜6ヶ月前に予約を。', type: 'warning' },
      ],
      zh: [
        { text: '两大主要超市是El Relincho和La Anónima。价格明显高于布宜诺斯艾利斯或卡拉法特。', type: 'info' },
        { text: '如果计划多做饭，在到达前在卡拉法特购买新鲜食材和干货——品种更多，价格更好。', type: 'tip' },
        { text: '一般商店时间：上午10点至下午1点及下午3点至9点。咖啡馆从上午8点开始营业。', type: 'info' },
        { text: '村里有山地装备店（如BajoZero）可以租用或购买装备。', type: 'info' },
        { text: '1月至2月的住宿请提前3至6个月预订。', type: 'warning' },
      ],
    },
  },
  {
    id: 'nature',
    icon: <Rabbit className="w-6 h-6" />,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    title: { es:'Fauna y Naturaleza', en:'Wildlife & Nature', pt:'Fauna e Natureza', fr:'Faune et Nature', de:'Tierwelt & Natur', ko:'야생 동물과 자연', ja:'野生動物と自然', zh:'野生动物与自然' },
    items: {
      es: [
        { text: 'Es habitual ver cóndores andinos sobrevolando las cumbres (envergadura de hasta 3 m), guanacos en la estepa y zorros grises en los senderos.', type: 'info' },
        { text: 'Nunca alimentes animales — altera su comportamiento natural y pone en riesgo su salud.', type: 'warning' },
        { text: 'Los pumas están presentes en la zona. Son de hábitos nocturnos y raramente se ven. Si vas temprano en la madrugada, caminá en grupo conversando en voz normal — eso es suficiente.', type: 'info' },
        { text: 'El huemul (ciervo andino en peligro de extinción) tiene presencia ocasional. Si lo ves, mantené distancia y no lo perseguís.', type: 'info' },
        { text: 'En el Parque Nacional: pack it in, pack it out. Todo lo que entrás — envoltorios, papel higiénico, residuos — lo sacás. No laves utensilios en ríos ni lagos.', type: 'warning' },
      ],
      en: [
        { text: 'It\'s common to see Andean condors soaring over the peaks (wingspan up to 3 m), guanacos on the steppe and grey foxes on the trails.', type: 'info' },
        { text: 'Never feed animals — it alters their natural behavior and puts their health at risk.', type: 'warning' },
        { text: 'Pumas are present in the area. They are nocturnal and rarely seen. If heading out in the early hours, walk in groups talking at normal volume — that\'s enough.', type: 'info' },
        { text: 'The huemul (endangered Andean deer) makes occasional appearances. If you see one, keep your distance and don\'t follow it.', type: 'info' },
        { text: 'In the National Park: pack it in, pack it out. Everything you bring — wrappers, toilet paper, waste — you take out. Don\'t wash utensils in rivers or lakes.', type: 'warning' },
      ],
      pt: [
        { text: 'É comum ver cóndores andinos sobrevoando os picos (envergadura de até 3 m), guanacos na estepe e raposas cinzentas nas trilhas.', type: 'info' },
        { text: 'Nunca alimente animais — altera seu comportamento natural e coloca em risco sua saúde.', type: 'warning' },
        { text: 'Pumas estão presentes na região. São de hábitos noturnos e raramente vistos. Se for de madrugada, caminhe em grupo conversando normalmente — isso é suficiente.', type: 'info' },
        { text: 'O huemul (cervo andino em extinção) tem aparição ocasional. Se o vir, mantenha distância e não o siga.', type: 'info' },
        { text: 'No Parque Nacional: pack it in, pack it out. Tudo que entra — embalagens, papel higiênico, resíduos — você tira. Não lave utensílios em rios ou lagos.', type: 'warning' },
      ],
      fr: [
        { text: 'Il est courant de voir des condors des Andes planer au-dessus des sommets (envergure jusqu\'à 3 m), des guanacos dans la steppe et des renards gris sur les sentiers.', type: 'info' },
        { text: 'Ne jamais nourrir les animaux — cela altère leur comportement naturel et met leur santé en danger.', type: 'warning' },
        { text: 'Les pumas sont présents dans la région. Ils sont nocturnes et rarement vus. Si vous partez tôt le matin, marchez en groupe en parlant normalement — c\'est suffisant.', type: 'info' },
        { text: 'Le huemul (cerf andin en danger d\'extinction) fait des apparitions occasionnelles. Si vous en voyez un, gardez vos distances et ne le suivez pas.', type: 'info' },
        { text: 'Dans le Parc National : pack it in, pack it out. Tout ce que vous apportez — emballages, papier toilette, déchets — vous le ramenez. Ne lavez pas les ustensiles dans les rivières ou les lacs.', type: 'warning' },
      ],
      de: [
        { text: 'Es ist üblich, Andenkondore über den Gipfeln zu sehen (Spannweite bis 3 m), Guanacos in der Steppe und graue Füchse auf den Wegen.', type: 'info' },
        { text: 'Tiere niemals füttern — es verändert ihr natürliches Verhalten und gefährdet ihre Gesundheit.', type: 'warning' },
        { text: 'Pumas sind in der Region präsent. Sie sind nachtaktiv und selten zu sehen. Bei frühmorgendlichem Aufbruch in Gruppen in normaler Lautstärke sprechen — das reicht.', type: 'info' },
        { text: 'Der Huemul (bedrohter Andenhirsch) taucht gelegentlich auf. Bei Sichtung Abstand halten und nicht folgen.', type: 'info' },
        { text: 'Im Nationalpark: pack it in, pack it out. Alles mitgebrachte — Verpackungen, Toilettenpapier, Abfälle — mitnehmen. Kein Spülen von Utensilien in Flüssen oder Seen.', type: 'warning' },
      ],
      ko: [
        { text: '안데스 콘도르(날개 폭 최대 3m)가 정상 위를 날고, 스텝 지대의 과나코, 트레일의 회색 여우를 흔히 볼 수 있습니다.', type: 'info' },
        { text: '동물에게 먹이를 주지 마세요 — 자연 행동을 바꾸고 건강을 위협합니다.', type: 'warning' },
        { text: '이 지역에 퓨마가 서식합니다. 야행성이라 거의 보이지 않습니다. 이른 새벽에 출발할 때는 그룹으로 평소 목소리로 대화하면서 걸으세요 — 충분합니다.', type: 'info' },
        { text: '우에물(멸종 위기 안데스 사슴)이 가끔 나타납니다. 보이면 거리를 유지하고 따라가지 마세요.', type: 'info' },
        { text: '국립공원에서: 가져간 것은 가져오세요. 포장지, 화장지, 폐기물 모두 가져나와야 합니다. 강이나 호수에서 식기를 씻지 마세요.', type: 'warning' },
      ],
      ja: [
        { text: '峰の上を飛ぶアンデスコンドル（翼幅最大3m）、草原のグアナコ、トレイルのハイイロギツネをよく見かけます。', type: 'info' },
        { text: '動物に餌を与えないでください — 自然な行動が変わり健康を害します。', type: 'warning' },
        { text: 'この地域にはピューマが生息しています。夜行性でほとんど見られません。早朝出発時は普通の声で話しながらグループで歩いてください — それで十分です。', type: 'info' },
        { text: 'ウエムル（絶滅危惧のアンデスジカ）が時々現れます。見かけたら距離を保ち、追いかけないでください。', type: 'info' },
        { text: '国立公園では：持ち込んだものは持ち帰る。包装紙、トイレットペーパー、ゴミはすべて持ち出す。川や湖で食器を洗わない。', type: 'warning' },
      ],
      zh: [
        { text: '经常可以看到安第斯神鹰（翼展最大3米）飞翔于山顶，草原上的原驼，以及步道上的灰狐。', type: 'info' },
        { text: '请勿喂食动物——这会改变其自然行为并危害健康。', type: 'warning' },
        { text: '该地区有美洲狮出没。它们是夜行性动物，很少被看到。如果在清晨出发，请以正常音量说话成组行走——这就足够了。', type: 'info' },
        { text: '秘鲁马鹿（濒危的安第斯鹿）偶尔出现。如果看到，请保持距离不要跟随。', type: 'info' },
        { text: '在国家公园：带进去的东西带出来。所有包装、厕纸、废物都要带走。不要在河流或湖泊中清洗器具。', type: 'warning' },
      ],
    },
  },
  {
    id: 'emergency',
    icon: <Phone className="w-6 h-6" />,
    color: 'bg-red-50 text-red-700 border-red-100',
    title: { es:'Emergencias y Salud', en:'Emergencies & Health', pt:'Emergências e Saúde', fr:'Urgences et Santé', de:'Notfälle & Gesundheit', ko:'긴급상황 및 건강', ja:'緊急事態と健康', zh:'紧急情况与健康' },
    items: {
      es: [
        { text: '🚑 Emergencias médicas: 107 | 🚔 Policía: 101 | 🚒 Bomberos: 100', type: 'info' },
        { text: 'Centro de Visitantes del Parque Nacional: +54 2962 493004', type: 'info' },
        { text: 'El pueblo tiene instalaciones médicas básicas. El hospital más cercano está en El Calafate (~220 km). Si viajás al parque, avisale a tu alojamiento la ruta y hora de regreso esperada antes de salir.', type: 'warning' },
        { text: 'Seguro de viaje con cobertura de evacuación médica es altamente recomendado dada la lejanía del pueblo.', type: 'tip' },
        { text: 'No hay señal en los senderos — en caso de emergencia, los guías del parque usan radio VHF.', type: 'info' },
      ],
      en: [
        { text: '🚑 Medical emergencies: 107 | 🚔 Police: 101 | 🚒 Fire: 100', type: 'info' },
        { text: 'National Park Visitor Center: +54 2962 493004', type: 'info' },
        { text: 'The village has basic medical facilities. The nearest hospital is in El Calafate (~220 km). Before heading into the park, inform your accommodation of your planned route and expected return time.', type: 'warning' },
        { text: 'Travel insurance with medical evacuation coverage is highly recommended given the remoteness.', type: 'tip' },
        { text: 'No signal on trails — in case of emergency, park rangers use VHF radio.', type: 'info' },
      ],
      pt: [
        { text: '🚑 Emergências médicas: 107 | 🚔 Polícia: 101 | 🚒 Bombeiros: 100', type: 'info' },
        { text: 'Centro de Visitantes do Parque Nacional: +54 2962 493004', type: 'info' },
        { text: 'O vilarejo tem instalações médicas básicas. O hospital mais próximo fica em El Calafate (~220 km). Antes de ir ao parque, avise sua acomodação sobre a rota e horário de retorno.', type: 'warning' },
        { text: 'Seguro viagem com cobertura de evacuação médica é altamente recomendado dada a remotidade.', type: 'tip' },
        { text: 'Sem sinal nas trilhas — em caso de emergência, os guardas do parque usam rádio VHF.', type: 'info' },
      ],
      fr: [
        { text: '🚑 Urgences médicales : 107 | 🚔 Police : 101 | 🚒 Pompiers : 100', type: 'info' },
        { text: 'Centre de visiteurs du Parc National : +54 2962 493004', type: 'info' },
        { text: 'Le village dispose d\'installations médicales de base. L\'hôpital le plus proche est à El Calafate (~220 km). Avant d\'aller dans le parc, informez votre hébergement de votre itinéraire et heure de retour prévue.', type: 'warning' },
        { text: 'Une assurance voyage avec couverture d\'évacuation médicale est vivement recommandée vu l\'isolement.', type: 'tip' },
        { text: 'Pas de signal sur les sentiers — en cas d\'urgence, les rangers utilisent la radio VHF.', type: 'info' },
      ],
      de: [
        { text: '🚑 Medizinische Notfälle: 107 | 🚔 Polizei: 101 | 🚒 Feuerwehr: 100', type: 'info' },
        { text: 'Besucherzentrum des Nationalparks: +54 2962 493004', type: 'info' },
        { text: 'Der Ort hat einfache medizinische Einrichtungen. Das nächste Krankenhaus ist in El Calafate (~220 km). Vor dem Parkeintritt Unterkunft über geplante Route und Rückkehrzeit informieren.', type: 'warning' },
        { text: 'Reiseversicherung mit medizinischer Evakuierungsdeckung wird wegen der Abgelegenheit dringend empfohlen.', type: 'tip' },
        { text: 'Kein Empfang auf den Wegen — im Notfall nutzen Parkranger VHF-Funk.', type: 'info' },
      ],
      ko: [
        { text: '🚑 응급 의료: 107 | 🚔 경찰: 101 | 🚒 소방서: 100', type: 'info' },
        { text: '국립공원 방문자 센터: +54 2962 493004', type: 'info' },
        { text: '마을에는 기본 의료 시설이 있습니다. 가장 가까운 병원은 칼라파테(약 220km)에 있습니다. 공원 입장 전 숙소에 계획된 경로와 귀환 예정 시간을 알려주세요.', type: 'warning' },
        { text: '외딴 지역이므로 의료 후송 보장을 포함한 여행 보험을 강력히 권장합니다.', type: 'tip' },
        { text: '트레일에서는 신호 없음 — 긴급 상황에서 공원 경비원은 VHF 무선을 사용합니다.', type: 'info' },
      ],
      ja: [
        { text: '🚑 医療緊急：107 | 🚔 警察：101 | 🚒 消防：100', type: 'info' },
        { text: '国立公園ビジターセンター：+54 2962 493004', type: 'info' },
        { text: '村には基本的な医療施設があります。最寄り病院はエル・カラファテ（約220km）。公園に入る前に、予定ルートと帰還時間を宿泊先に知らせてください。', type: 'warning' },
        { text: '遠隔地のため、医療避難補償付き旅行保険を強くお勧めします。', type: 'tip' },
        { text: 'トレイルでは圏外 — 緊急時は公園レンジャーがVHF無線を使用。', type: 'info' },
      ],
      zh: [
        { text: '🚑 医疗急救：107 | 🚔 警察：101 | 🚒 消防：100', type: 'info' },
        { text: '国家公园游客中心：+54 2962 493004', type: 'info' },
        { text: '村里有基本医疗设施。最近的医院在卡拉法特（约220公里）。进入公园前，请告知住宿处您计划的路线和预计返回时间。', type: 'warning' },
        { text: '鉴于偏远性，强烈建议购买含医疗后送保障的旅行保险。', type: 'tip' },
        { text: '步道上没有信号——紧急情况下公园护林员使用VHF无线电。', type: 'info' },
      ],
    },
  },
  {
    id: 'safety',
    icon: <Shield className="w-6 h-6" />,
    color: 'bg-slate-50 text-slate-700 border-slate-100',
    title: { es:'Seguridad General', en:'General Safety', pt:'Segurança Geral', fr:'Sécurité Générale', de:'Allgemeine Sicherheit', ko:'일반 안전', ja:'一般的な安全', zh:'一般安全' },
    items: {
      es: [
        { text: 'El Chaltén es uno de los pueblos más seguros de Argentina. No hay robos, delincuencia ni pickpockets.', type: 'tip' },
        { text: 'Las calles son de tierra, sin iluminación y con piedras sueltas. Llevá linterna para salidas nocturnas — los tropiezos son el principal riesgo.', type: 'info' },
        { text: 'En campamentos y hostels: no hay problemas de seguridad pero llevá un candado combinado propio — los candados locales son caros.', type: 'info' },
      ],
      en: [
        { text: 'El Chaltén is one of the safest towns in Argentina. No theft, crime or pickpockets.', type: 'tip' },
        { text: 'Streets are unpaved, unlit and have loose stones. Bring a flashlight for night outings — tripping is the main risk.', type: 'info' },
        { text: 'In campsites and hostels: no security issues but bring your own combination lock — local padlocks are expensive.', type: 'info' },
      ],
      pt: [
        { text: 'El Chaltén é um dos vilarejos mais seguros da Argentina. Não há roubos, criminalidade nem batedor de carteiras.', type: 'tip' },
        { text: 'As ruas são de terra, sem iluminação e com pedras soltas. Leve lanterna para saídas noturnas — tropeçar é o principal risco.', type: 'info' },
        { text: 'Em acampamentos e hostels: sem problemas de segurança, mas leve seu próprio cadeado — os cadeados locais são caros.', type: 'info' },
      ],
      fr: [
        { text: 'El Chaltén est l\'un des villages les plus sûrs d\'Argentine. Pas de vol, de criminalité ni de pickpockets.', type: 'tip' },
        { text: 'Les rues sont en terre, sans éclairage et avec des pierres détachées. Apportez une lampe de poche pour les sorties nocturnes — trébucher est le principal risque.', type: 'info' },
        { text: 'Dans les campings et auberges : pas de problèmes de sécurité, mais apportez votre propre cadenas — les cadenas locaux sont chers.', type: 'info' },
      ],
      de: [
        { text: 'El Chaltén ist einer der sichersten Orte Argentiniens. Keine Diebstähle, Kriminalität oder Taschendiebe.', type: 'tip' },
        { text: 'Straßen sind unbefestigt, unbeleuchtet und haben lose Steine. Taschenlampe für Nachtausflüge — Stolpern ist das Hauptrisiko.', type: 'info' },
        { text: 'In Campingplätzen und Hostels: keine Sicherheitsprobleme, aber eigenes Zahlenschloss mitbringen — lokale Vorhängeschlösser sind teuer.', type: 'info' },
      ],
      ko: [
        { text: '찰텐은 아르헨티나에서 가장 안전한 마을 중 하나입니다. 도둑, 범죄, 소매치기가 없습니다.', type: 'tip' },
        { text: '도로는 비포장이고 조명이 없으며 돌이 있습니다. 야간 외출 시 손전등을 가져가세요 — 넘어지는 게 주요 위험입니다.', type: 'info' },
        { text: '캠프장과 호스텔: 보안 문제 없지만 자물쇠를 가져가세요 — 현지 자물쇠는 비쌉니다.', type: 'info' },
      ],
      ja: [
        { text: 'チャルテンはアルゼンチンで最も安全な町のひとつ。盗難、犯罪、スリは一切ありません。', type: 'tip' },
        { text: '道は未舗装で照明なし、石も多い。夜の外出は懐中電灯を — つまずきが主なリスク。', type: 'info' },
        { text: 'キャンプ場やホステル：セキュリティの問題はありませんが、自分の南京錠を持参してください — 現地のものは高価です。', type: 'info' },
      ],
      zh: [
        { text: '查尔腾是阿根廷最安全的城镇之一。没有盗窃、犯罪或扒手。', type: 'tip' },
        { text: '街道是未铺砌的，没有照明，还有松散的石头。夜间外出请携带手电筒——绊倒是主要风险。', type: 'info' },
        { text: '在营地和旅馆：没有安全问题，但请携带自己的密码锁——当地挂锁很贵。', type: 'info' },
      ],
    },
  },
  {
    id: 'park',
    icon: <Sun className="w-6 h-6" />,
    color: 'bg-teal-50 text-teal-700 border-teal-100',
    title: { es:'Parque Nacional: Reglas Esenciales', en:'National Park: Essential Rules', pt:'Parque Nacional: Regras Essenciais', fr:'Parc National : Règles Essentielles', de:'Nationalpark: Wesentliche Regeln', ko:'국립공원: 필수 규칙', ja:'国立公園：基本ルール', zh:'国家公园：基本规定' },
    items: {
      es: [
        { text: 'Entrada al parque: ARS ~45.000 para extranjeros (~USD 42). 50% de descuento el segundo día consecutivo.', type: 'info' },
        { text: 'Camping: solo en campamentos oficiales con reserva previa obligatoria en amigospnlosglaciares.org (~USD 14/noche). No se puede acampar libre.', type: 'warning' },
        { text: 'Portales de acceso: abiertos de 7:00 a 20:00. Fuegos y fogones PROHIBIDOS en todo el parque — solo hornillos portátiles.', type: 'warning' },
        { text: 'No crear nuevos senderos ni tomar atajos — causa erosión grave.', type: 'info' },
        { text: 'Para el amanecer en Laguna de Los Tres: pasar la noche en Campamento Poincenot y salir 2 horas antes del alba con linterna.', type: 'tip' },
      ],
      en: [
        { text: 'Park entrance: ARS ~45,000 for foreigners (~USD 42). 50% discount on the second consecutive day.', type: 'info' },
        { text: 'Camping: only at official campsites with mandatory prior booking at amigospnlosglaciares.org (~USD 14/night). Free camping is not permitted.', type: 'warning' },
        { text: 'Access gates: open 7am–8pm. Fires and campfires PROHIBITED throughout the park — portable stoves only.', type: 'warning' },
        { text: 'Do not create new trails or take shortcuts — causes serious erosion.', type: 'info' },
        { text: 'For sunrise at Laguna de Los Tres: spend the night at Campamento Poincenot and leave 2 hours before dawn with a flashlight.', type: 'tip' },
      ],
      pt: [
        { text: 'Entrada no parque: ARS ~45.000 para estrangeiros (~USD 42). 50% de desconto no segundo dia consecutivo.', type: 'info' },
        { text: 'Camping: somente em acampamentos oficiais com reserva antecipada obrigatória em amigospnlosglaciares.org (~USD 14/noite). Camping livre não é permitido.', type: 'warning' },
        { text: 'Portões de acesso: abertos das 7h às 20h. Fogueiras PROIBIDAS em todo o parque — apenas fogareiros portáteis.', type: 'warning' },
        { text: 'Não criar novos trilhos nem usar atalhos — causa erosão grave.', type: 'info' },
        { text: 'Para o amanhecer na Laguna de Los Tres: passar a noite no Campamento Poincenot e sair 2 horas antes do amanhecer com lanterna.', type: 'tip' },
      ],
      fr: [
        { text: 'Entrée du parc : ARS ~45 000 pour les étrangers (~42 USD). 50 % de réduction le deuxième jour consécutif.', type: 'info' },
        { text: 'Camping : uniquement dans les campings officiels avec réservation préalable obligatoire sur amigospnlosglaciares.org (~14 USD/nuit). Le camping sauvage n\'est pas autorisé.', type: 'warning' },
        { text: 'Portails d\'accès : ouverts de 7h à 20h. Feux et feux de camp INTERDITS dans tout le parc — réchauds portables uniquement.', type: 'warning' },
        { text: 'Ne pas créer de nouveaux sentiers ni prendre de raccourcis — cause une érosion grave.', type: 'info' },
        { text: 'Pour le lever de soleil sur la Laguna de Los Tres : passer la nuit au Campamento Poincenot et partir 2 heures avant l\'aube avec une lampe de poche.', type: 'tip' },
      ],
      de: [
        { text: 'Parkeintritt: ARS ~45.000 für Ausländer (~42 USD). 50 % Rabatt am zweiten aufeinanderfolgenden Tag.', type: 'info' },
        { text: 'Camping: nur auf offiziellen Campingplätzen mit Pflicht-Voranmeldung auf amigospnlosglaciares.org (~14 USD/Nacht). Wildcampen nicht gestattet.', type: 'warning' },
        { text: 'Zugangstore: offen 7–20 Uhr. Feuer und Lagerfeuer im gesamten Park VERBOTEN — nur Campingkocher.', type: 'warning' },
        { text: 'Keine neuen Wege anlegen oder Abkürzungen nehmen — verursacht ernsthafte Erosion.', type: 'info' },
        { text: 'Für den Sonnenaufgang an der Laguna de Los Tres: Nacht auf Campamento Poincenot verbringen, 2 Stunden vor der Morgendämmerung mit Taschenlampe aufbrechen.', type: 'tip' },
      ],
      ko: [
        { text: '공원 입장료: 외국인 ARS ~45,000(~USD 42). 연속 이틀째 50% 할인.', type: 'info' },
        { text: '캠핑: amigospnlosglaciares.org에서 필수 사전 예약된 공식 캠프장만 이용 가능(~USD 14/박). 자유 캠핑 불허.', type: 'warning' },
        { text: '출입구: 오전 7시~오후 8시 개방. 공원 전체에서 화기 및 캠프파이어 금지 — 휴대용 스토브만 사용 가능.', type: 'warning' },
        { text: '새로운 트레일을 만들거나 지름길을 택하지 마세요 — 심각한 침식을 유발합니다.', type: 'info' },
        { text: 'Laguna de Los Tres 일출을 위해: Campamento Poincenot에서 하룻밤을 보내고 손전등을 들고 새벽 2시간 전에 출발하세요.', type: 'tip' },
      ],
      ja: [
        { text: '公園入場料：外国人向けARS~45,000（~USD 42）。2日連続で50%割引。', type: 'info' },
        { text: 'キャンプ：amigospnlosglaciares.orgで事前予約必須の公式キャンプ場のみ（~USD 14/泊）。フリーキャンプ不可。', type: 'warning' },
        { text: 'アクセスゲート：7時〜20時開場。公園全体で火および焚き火禁止 — 携帯コンロのみ使用可。', type: 'warning' },
        { text: '新しい道を作ったりショートカットを取らないでください — 深刻な浸食の原因になります。', type: 'info' },
        { text: 'Laguna de Los Tres の日の出のために：Campamento Poincenot で一夜を過ごし、夜明けの2時間前に懐中電灯を持って出発。', type: 'tip' },
      ],
      zh: [
        { text: '公园门票：外国人约ARS 45,000（约42美元）。连续第二天享受50%折扣。', type: 'info' },
        { text: '露营：仅限在amigospnlosglaciares.org提前强制预订的官方营地（约14美元/晚）。不允许野外露营。', type: 'warning' },
        { text: '入口大门：上午7点至晚上8点开放。整个公园内禁止明火和篝火——仅限便携式炉具。', type: 'warning' },
        { text: '不要开辟新道路或走捷径——会造成严重侵蚀。', type: 'info' },
        { text: '在Laguna de Los Tres看日出：在Campamento Poincenot过夜，带手电筒在黎明前2小时出发。', type: 'tip' },
      ],
    },
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

const ITEM_STYLES = {
  tip:     'bg-primary/5 border-l-4 border-primary text-dark/80',
  warning: 'bg-amber-50 border-l-4 border-amber-400 text-amber-900',
  info:    'bg-surface/60 border-l-4 border-surface text-dark/70',
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function RecomendacionesPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const loc = locale as Locale
  const t = (key: string) => T[key]?.[loc] ?? T[key]?.en ?? key

  return (
    <main className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-primary/8 via-background to-teal-50/40 pt-16 pb-12 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary/70 mb-4">
            {t('tagline')}
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-black text-dark leading-tight mb-4 whitespace-pre-line">
            {t('heroTitle')}
          </h1>
          <p className="text-lg text-dark/60 max-w-2xl mx-auto leading-relaxed">
            {t('heroSub')}
          </p>
        </div>
      </section>

      {/* ── Quick nav pills ── */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-surface">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
          {SECTIONS.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-surface/60 text-dark/60 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {s.icon && <span className="w-3.5 h-3.5 [&>svg]:w-3.5 [&>svg]:h-3.5">{s.icon}</span>}
              {s.title[loc] ?? s.title.en}
            </a>
          ))}
        </div>
      </div>

      {/* ── Sections ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        {SECTIONS.map((section, i) => {
          const items = section.items[loc] ?? section.items.en ?? []
          return (
            <section key={section.id} id={section.id} className="scroll-mt-32">
              {/* Section header */}
              <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl border mb-6 ${section.color}`}>
                {section.icon}
                <h2 className="font-heading text-xl font-bold">
                  {section.title[loc] ?? section.title.en}
                </h2>
              </div>

              {/* Items */}
              <ul className="space-y-3">
                {items.map((item, j) => (
                  <li
                    key={j}
                    className={`rounded-r-xl px-4 py-3 text-sm leading-relaxed ${ITEM_STYLES[item.type ?? 'info']}`}
                  >
                    {item.text}
                  </li>
                ))}
              </ul>

              {i < SECTIONS.length - 1 && (
                <div className="mt-16 border-t border-surface/50" />
              )}
            </section>
          )
        })}
      </div>

      {/* ── CTA ── */}
      <section className="bg-primary/5 border-t border-primary/10">
        <div className="max-w-2xl mx-auto px-4 py-14 text-center">
          <p className="text-dark/60 mb-6 leading-relaxed">
            {loc === 'es' ? '¿Tenés alguna duda sobre tu estadía? Escribinos y te respondemos.' :
             loc === 'pt' ? 'Tem alguma dúvida sobre sua estadia? Escreva para nós.' :
             loc === 'fr' ? 'Des questions sur votre séjour ? Écrivez-nous.' :
             loc === 'de' ? 'Fragen zu Ihrem Aufenthalt? Schreiben Sie uns.' :
             loc === 'ko' ? '숙박에 대한 질문이 있으신가요? 메시지를 보내주세요.' :
             loc === 'ja' ? 'ご滞在についてご質問は？メッセージをどうぞ。' :
             loc === 'zh' ? '对您的住宿有疑问吗？给我们留言。' :
             'Have any questions about your stay? Write to us.'}
          </p>
          <a
            href="https://wa.me/5492966421502"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
        </div>
      </section>

    </main>
  )
}
