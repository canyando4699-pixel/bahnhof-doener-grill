import Link from 'next/link';
import menuData from '@/data/menu.json';

/* Mehr Gerichte = mehr Flammen (Level-Schwierigkeit) */
const flames = (count: number) => Math.min(5, Math.max(1, Math.ceil(count / 8)));

export default function Categories() {
  return (
    <section className="relative py-[var(--section-py)]">
      <div className="max-w-container mx-auto px-[var(--container-px)]">
        <div className="mb-14 md:mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.45em] uppercase text-accent mb-4">Wähle dein Level</p>
            <h2 className="font-display text-5xl md:text-7xl text-[var(--color-text)]">Die Karte</h2>
          </div>
          <Link
            href="/menu"
            className="link-sweep text-xs tracking-[0.3em] uppercase font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors pb-2"
          >
            Alles ansehen →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-border">
          {menuData.categories.map((category, i) => (
            <Link
              key={category.id}
              href={`/menu#${category.id}`}
              className="group relative border-b border-r border-border p-7 md:p-9 min-h-[180px] flex flex-col justify-between overflow-hidden transition-colors duration-400 hover:bg-surface-2"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_50%_120%,rgba(255,90,31,0.18)_0%,transparent_60%)]"
                aria-hidden="true"
              />
              <div className="relative flex items-start justify-between">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-text-dim)] group-hover:text-gold transition-colors duration-300">
                  Level {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-xl" aria-hidden="true">
                  <span className="inline group-hover:hidden text-[var(--color-text-dim)]">→</span>
                  <span className="hidden group-hover:inline font-display text-sm tracking-[0.2em] text-accent uppercase">
                    Start ▶
                  </span>
                </span>
              </div>
              <div className="relative">
                <h3 className="font-display text-2xl md:text-3xl text-[var(--color-text)] group-hover:text-gold transition-colors duration-300">
                  {category.name}
                </h3>
                <div className="flex items-center gap-2.5 mt-2">
                  <span className="text-[11px] tracking-wide" aria-label={`Schwierigkeit ${flames(category.items.length)} von 5`}>
                    <span aria-hidden="true">
                      {'🔥'.repeat(flames(category.items.length))}
                      <span className="opacity-25 grayscale">{'🔥'.repeat(5 - flames(category.items.length))}</span>
                    </span>
                  </span>
                  <p className="text-xs text-[var(--color-text-dim)]">{category.items.length} Gerichte</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
