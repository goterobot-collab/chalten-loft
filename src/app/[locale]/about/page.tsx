import Image from 'next/image'
import { chaltenPhotos } from '@/lib/properties'

export default function AboutPage() {
  return (
    <>
      {/* Hero — Das Wanda editorial style */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-6">
            Our Story
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-primary mb-8 leading-tight">
            Where the mountains<br />
            begin at your door.
          </h1>
          <p className="text-lg text-muted leading-relaxed max-w-2xl mx-auto">
            We came to El Chaltén and somewhere between the first hike
            and the first night of wind, we realized we did not want to leave.
          </p>
        </div>
      </section>

      {/* Photo break */}
      <section className="relative h-[50vh] min-h-[300px]">
        <Image
          src={chaltenPhotos[1]}
          alt="Fitz Roy green valley sunset — El Chaltén Patagonia"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </section>

      {/* Story */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 text-dark/80 leading-relaxed text-[17px]">
            <p>
              The lofts exist because we wanted guests to have what we would want
              as travellers ourselves. After six hours on the trail, you do not want
              a hotel lobby. You want a hot shower, a real kitchen, and a window that
              faces something that matters.
            </p>
            <p>
              Each loft is fully equipped — not a studio with a microwave, but an actual
              kitchen where you can cook a proper meal. A washer because after four days
              of trekking your clothes need it. A bed that is genuinely comfortable, not
              just acceptable.
            </p>
            <p>
              We live in El Chaltén. When you book direct, you are not talking to a call
              centre — you are talking to someone who walked the same trails yesterday
              and knows which one to do first based on today&apos;s weather.
            </p>
          </div>

          {/* Host info */}
          <div className="mt-16 pt-16 border-t border-surface">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="w-24 h-24 rounded-full bg-surface flex items-center justify-center">
                <span className="font-heading text-3xl text-primary">G</span>
              </div>
              <div>
                <h3 className="font-heading text-xl text-primary mb-1">Gabriel</h3>
                <p className="text-muted text-sm mb-3">Host · El Chaltén local · 153 reviews</p>
                <p className="text-dark/70 text-[15px] leading-relaxed">
                  Response rate 97%. Usually responds within one hour.
                  Speaks Spanish, English, and enough trail vocabulary
                  in six other languages to point you in the right direction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Numbers — Lisboans trust section */}
      <section className="py-20 bg-primary text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
              <p className="font-heading text-4xl sm:text-5xl font-bold">3</p>
              <p className="text-white/60 text-sm mt-2">Lofts</p>
            </div>
            <div>
              <p className="font-heading text-4xl sm:text-5xl font-bold">153</p>
              <p className="text-white/60 text-sm mt-2">Reviews</p>
            </div>
            <div>
              <p className="font-heading text-4xl sm:text-5xl font-bold">4.66</p>
              <p className="text-white/60 text-sm mt-2">Average Rating</p>
            </div>
            <div>
              <p className="font-heading text-4xl sm:text-5xl font-bold">2</p>
              <p className="text-white/60 text-sm mt-2">Years Hosting</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
