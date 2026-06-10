import Marquee from '@/components/ui/Marquee';

export default function CTABanner() {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,90,31,0.16)_0%,transparent_65%)]"
        aria-hidden="true"
      />

      {/* Hintergrund-Marquee */}
      <div className="absolute inset-0 flex items-center opacity-[0.13]" aria-hidden="true">
        <Marquee speed="20s" className="w-full">
          {['Hunger?', 'Acıktın mı?', 'Hungry?'].map((word) => (
            <span key={word} className="font-display text-[10rem] md:text-[16rem] uppercase text-outline whitespace-nowrap px-10">
              {word}
            </span>
          ))}
        </Marquee>
      </div>

      <div className="relative max-w-container mx-auto px-[var(--container-px)] text-center">
        <h2 className="font-display text-[clamp(4rem,14vw,11rem)] leading-[0.85] uppercase">
          <span className="block text-outline">Hunger</span>
          <span className="block ember-text">bekommen?</span>
        </h2>
        <p className="mt-8 text-[var(--color-text-muted)] max-w-md mx-auto">
          Anrufen, abholen, reinbeißen — oder einfach spontan vorbeikommen.
          Der Spieß dreht sich schon.
        </p>
        <div className="mt-10 flex justify-center">
          <a
            href="tel:06451240925"
            className="bg-accent hover:bg-accent-hover text-white px-12 py-5 rounded-full font-semibold text-lg heat-pulse transition-colors"
          >
            ☎ 06451 240925
          </a>
        </div>
      </div>
    </section>
  );
}
