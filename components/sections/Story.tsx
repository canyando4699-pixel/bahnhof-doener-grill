import Counter from '@/components/ui/Counter';
import menuData from '@/data/menu.json';

const dishCount = menuData.categories.reduce((sum, c) => sum + c.items.length, 0);

const stats = [
  { value: 4.5, decimals: 1, suffix: '★', label: 'Google-Bewertung', icon: '⭐' },
  { value: 769, decimals: 0, suffix: '+', label: 'Bewertungen', icon: '💬' },
  { value: dishCount, decimals: 0, suffix: '', label: 'Gerichte auf der Karte', icon: '🍽️' },
  { value: 7, decimals: 0, suffix: '', label: 'Tage die Woche frisch', icon: '🔥' },
];

export default function Story() {
  return (
    <section className="relative py-[var(--section-py)] overflow-hidden bg-surface border-y border-border">
      <span
        className="absolute -bottom-16 -left-6 font-display text-[clamp(10rem,28vw,24rem)] leading-none text-outline-dim select-none pointer-events-none"
        aria-hidden="true"
      >
        02
      </span>

      <div className="max-w-container mx-auto px-[var(--container-px)] relative">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-24 items-start">
          <div className="lg:sticky lg:top-32">
            <p className="text-xs tracking-[0.45em] uppercase text-accent mb-4">Direkt am Gleis. Direkt vom Spieß.</p>
            <h2 className="font-display text-5xl md:text-7xl text-[var(--color-text)] leading-[0.9]">
              Ankommen.
              <br />
              <span className="ember-text">Zubeißen.</span>
            </h2>
            <p className="mt-8 text-[var(--color-text-muted)] leading-relaxed max-w-md">
              Wer in Frankenberg aus dem Zug steigt, riecht es zuerst: Hier dreht sich
              alles um den Spieß. Hackfleisch vom Kalb, täglich frisch aufgesetzt,
              dazu Brot mit Biss und hausgemachte Soßen — ohne Schnickschnack,
              dafür mit Geschmack.
            </p>
            <p className="mt-4 text-[var(--color-text)] font-semibold">
              Bahnhof Döner Grill — seit Jahren die erste Adresse nach der Ankunft.
            </p>
          </div>

          {/* Erfolge im Game-Stil */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="scroll-reveal group relative border border-border rounded-2xl p-6 md:p-7 bg-[var(--color-bg)]/50 hover:border-gold/50 hover:-translate-y-1 transition-all duration-300"
              >
                <p className="text-[9px] tracking-[0.3em] uppercase text-gold/80 mb-4 flex items-center gap-1.5">
                  <span aria-hidden="true">🏆</span> Freigeschaltet
                </p>
                <p className="font-display text-5xl md:text-6xl text-[var(--color-text)] leading-none flex items-end gap-2.5">
                  <span className="text-3xl mb-0.5" aria-hidden="true">{stat.icon}</span>
                  <span>
                    <Counter to={stat.value} decimals={stat.decimals} />
                    <span className="ember-text">{stat.suffix}</span>
                  </span>
                </p>
                <div className="h-[2px] w-12 bg-accent mt-5 mb-3 group-hover:w-20 transition-all duration-300" aria-hidden="true" />
                <p className="text-xs tracking-[0.25em] uppercase text-[var(--color-text-dim)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
