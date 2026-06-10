const mapsUrl =
  'https://www.google.com/maps/dir/?api=1&destination=Bahnhof+D%C3%B6ner+Grill,+Am+Bahnhof+10,+35066+Frankenberg';

const hours = [
  { days: 'Mo – Do', time: '10 – 23 Uhr' },
  { days: 'Freitag', time: '10 – 24 Uhr' },
  { days: 'Samstag', time: '10 – 24 Uhr' },
  { days: 'Sonntag', time: '10 – 23 Uhr' },
];

export default function Location() {
  return (
    <section className="relative py-[var(--section-py)] bg-surface border-y border-border overflow-hidden">
      {/* Bahnlinie mit fahrendem Lichtpunkt */}
      <div className="absolute top-0 left-0 right-0">
        <div className="rail-line">
          <span className="rail-dot" aria-hidden="true" />
        </div>
      </div>
      <span
        className="absolute -top-8 right-0 font-display text-[clamp(10rem,28vw,24rem)] leading-none text-outline-dim select-none pointer-events-none"
        aria-hidden="true"
      >
        03
      </span>

      <div className="max-w-container mx-auto px-[var(--container-px)] relative">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-24">
          <div>
            <p className="text-xs tracking-[0.45em] uppercase text-accent mb-4">Nicht zu verfehlen</p>
            <h2 className="font-display text-5xl md:text-7xl text-[var(--color-text)] leading-[0.9]">
              Gleis da.
              <br />
              <span className="title-shimmer">Gleich da.</span>
            </h2>
            <address className="not-italic mt-8 text-[var(--color-text-muted)] leading-relaxed">
              <span className="block font-display text-2xl text-[var(--color-text)] mb-1.5">Am Bahnhof 10</span>
              35066 Frankenberg (Eder)
            </address>
            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent hover:bg-accent-hover text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-[0_8px_40px_-8px_rgba(255,90,31,0.8)]"
              >
                Route planen ↗
              </a>
              <a
                href="tel:06451240925"
                className="px-7 py-4 rounded-full border border-white/15 hover:border-gold/60 hover:bg-white/5 transition-colors text-[var(--color-text)]"
              >
                06451 240925
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-text-dim)] mb-7">Öffnungszeiten</p>
            <dl>
              {hours.map((row) => (
                <div
                  key={row.days}
                  className="flex items-baseline justify-between gap-6 py-4 border-b border-border group hover:border-accent/40 transition-colors"
                >
                  <dt className="text-[var(--color-text-muted)] tracking-wide">{row.days}</dt>
                  <dd className="font-display text-2xl md:text-3xl text-[var(--color-text)] group-hover:text-gold transition-colors">
                    {row.time}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-xs text-[var(--color-text-dim)]">Barzahlung & EC-Karte — frisch vor Ort zubereitet.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
