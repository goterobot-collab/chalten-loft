import { MapPin, Mail, Clock, MessageCircle, Luggage } from 'lucide-react'
import Image from 'next/image'

export default function ContactPage() {
  return (
    <>
      {/* Hero with Logo */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Big Logo */}
          <div className="mb-10">
            <Image
              src="/images/logo.png"
              alt="Chaltén Loft Patagonia"
              width={160}
              height={160}
              className="mx-auto mix-blend-multiply"
            />
          </div>

          <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-6">
            Contact
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-primary mb-8">
            Questions before booking?
          </h1>
          <p className="text-lg text-muted leading-relaxed max-w-2xl mx-auto">
            We respond in Spanish, English, and usually within an hour.
            Ask us anything about the lofts, the trails, or El Chaltén.
          </p>
        </div>
      </section>

      {/* Luggage Storage Highlight */}
      <section className="pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-8 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Luggage className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h3 className="font-heading text-lg text-primary mb-1">
                Luggage Storage Available
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                Arriving early or leaving late? We have a secure locker where you can leave
                your bags before check-in or after check-out — free of charge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Contact Form */}
            <div>
              <h2 className="font-heading text-2xl text-primary mb-8">
                Send us a message
              </h2>
              <form className="space-y-5">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full border border-surface rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all bg-white"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full border border-surface rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all bg-white"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Loft
                  </label>
                  <select className="w-full border border-surface rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all bg-white">
                    <option>Any loft</option>
                    <option>Dpto 1 — Fitz Roy (75m²)</option>
                    <option>Dpto 2 — Cerro Torre (40m²)</option>
                    <option>Dpto 3 — Poincenot (55m²)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full border border-surface rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all bg-white resize-none"
                    placeholder="Tell us about your trip plans..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl px-6 py-3.5 transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <h2 className="font-heading text-2xl text-primary mb-8">
                Or reach us directly
              </h2>

              <div className="space-y-6">
                <a
                  href="https://wa.me/5491112345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-surface hover:border-green-300 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary text-sm">WhatsApp</p>
                    <p className="text-muted text-sm">Fastest way to reach us</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-surface">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary text-sm">Email</p>
                    <p className="text-muted text-sm">chaltenloft@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-surface">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary text-sm">Location</p>
                    <p className="text-muted text-sm">
                      El Chaltén, Santa Cruz, Argentina<br />
                      3 blocks from Fitz Roy trailhead
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-surface">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary text-sm">Response Time</p>
                    <p className="text-muted text-sm">Usually within 1 hour</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-surface">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Luggage className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary text-sm">Luggage Storage</p>
                    <p className="text-muted text-sm">Free secure locker — drop bags before check-in or after check-out</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
