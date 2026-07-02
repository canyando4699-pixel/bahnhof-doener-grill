import MenuCard from '@/components/ui/MenuCard';
import MenuBoard from '@/components/ui/MenuBoard';
import Reveal from '@/components/ui/Reveal';
import ScrollReveal from '@/components/animations/ScrollReveal';

interface MenuItem {
  id: string;
  title: string;
  description: string;
  price?: string;
  prices?: { klein: string; groß: string };
  image?: string | null;
  imageHeight?: string;
}

interface MenuSectionProps {
  id: string;
  title: string;
  items: MenuItem[];
  level?: number;
}

/* Mehr Gerichte = mehr Flammen (Level-Schwierigkeit) — vgl. Categories.tsx */
const flames = (count: number) => Math.min(5, Math.max(1, Math.ceil(count / 8)));

export default function MenuSection({ id, title, items, level }: MenuSectionProps) {
  const isDrinks = id === 'getraenke';

  return (
    <section id={id} className="relative py-14 scroll-mt-32 lg:scroll-mt-24 overflow-hidden">
      {/* Riesen-Levelnummer im Hintergrund */}
      {level !== undefined && (
        <span
          className="absolute -top-6 -right-2 font-display text-[clamp(7rem,18vw,14rem)] leading-none text-outline-dim select-none pointer-events-none"
          aria-hidden="true"
        >
          {String(level).padStart(2, '0')}
        </span>
      )}

      <div className="relative max-w-container mx-auto px-[var(--container-px)]">
        <ScrollReveal>
          <div className="mb-8 md:mb-10">
            {level !== undefined && (
              <p className="mb-3">
                <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.35em] uppercase text-accent border border-accent/40 rounded-full px-4 py-1.5">
                  Level {String(level).padStart(2, '0')}
                  <span className="text-xs" aria-label={`Schwierigkeit ${flames(items.length)} von 5`}>
                    <span aria-hidden="true">
                      {'🔥'.repeat(flames(items.length))}
                    </span>
                  </span>
                </span>
              </p>
            )}
            <h2 className="font-display text-4xl md:text-6xl">
              <span className="title-shimmer">{title}</span>
            </h2>
            <p className="text-[var(--color-text-dim)] text-sm mt-2">
              {items.length} {items.length === 1 ? 'Gericht' : 'Gerichte'}
            </p>
          </div>
        </ScrollReveal>

        {isDrinks ? (
          <MenuBoard
            items={items.map((it) => ({ id: it.id, title: it.title, description: it.description, price: it.price }))}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 items-stretch">
            {items.map((item, i) => (
              <Reveal key={item.id} index={i} className="h-full">
                <MenuCard
                  id={item.id}
                  title={item.title}
                  description={item.description}
                  price={item.price}
                  prices={item.prices}
                  image={item.image}
                  imageHeight={item.imageHeight}
                />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
