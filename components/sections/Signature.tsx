import Link from 'next/link';
import Tilt3DCard from '@/components/ui/Tilt3DCard';
import menuData from '@/data/menu.json';
import { type MenuItem, isMultiPrice } from '@/types/menu';

function findItem(categoryId: string, itemId?: string) {
  const category = menuData.categories.find((c) => c.id === categoryId);
  if (!category) return null;
  const items = category.items as MenuItem[];
  const item = itemId ? items.find((i) => i.id === itemId) : items[0];
  if (!item) return null;
  return { item, categoryId: category.id, categoryName: category.name };
}

function priceLabel(item: MenuItem) {
  return isMultiPrice(item) ? `ab ${item.prices.klein}` : item.price;
}

const picks = [
  findItem('drehspiess', 'drehspiess-1'),
  findItem('drehspiess', 'drehspiess-5'),
  findItem('lahmacun'),
  findItem('pizza'),
].filter(Boolean) as NonNullable<ReturnType<typeof findItem>>[];

/* Game-Rarities pro Klassiker */
const rarities = [
  { label: 'Legendär', color: '#ffb01f' },
  { label: 'Episch', color: '#b66bff' },
  { label: 'Selten', color: '#5ab1ff' },
  { label: 'Beliebt', color: '#ff5a1f' },
];

export default function Signature() {
  return (
    <section className="relative py-[var(--section-py)] overflow-hidden">
      {/* Riesige Hintergrund-Nummer */}
      <span
        className="absolute -top-10 right-0 font-display text-[clamp(10rem,28vw,24rem)] leading-none text-outline-dim select-none pointer-events-none"
        aria-hidden="true"
      >
        01
      </span>

      <div className="max-w-container mx-auto px-[var(--container-px)] relative">
        <div className="mb-16 md:mb-20">
          <p className="text-xs tracking-[0.45em] uppercase text-accent mb-4">Vom Grill direkt auf die Hand</p>
          <h2 className="font-display text-5xl md:text-7xl text-[var(--color-text)]">
            Die <span className="title-shimmer">Klassiker</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {picks.map(({ item, categoryId, categoryName }, i) => (
            <div key={item.id} className={i % 2 === 1 ? 'md:translate-y-12' : ''}>
              <Tilt3DCard className="rounded-3xl h-full">
                <Link
                  href={`/menu#${categoryId}`}
                  className="group block h-full bg-surface border border-border rounded-3xl p-8 md:p-10 transition-colors duration-300 hover:border-accent/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-display text-5xl md:text-6xl text-outline-dim group-hover:text-outline transition-all duration-300">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex flex-wrap justify-end gap-2 mt-2">
                      <span
                        className="text-[10px] tracking-[0.3em] uppercase border rounded-full px-3.5 py-1.5 font-semibold"
                        style={{
                          color: rarities[i].color,
                          borderColor: `${rarities[i].color}66`,
                          boxShadow: `0 0 20px -5px ${rarities[i].color}aa`,
                        }}
                      >
                        ◆ {rarities[i].label}
                      </span>
                      <span className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-text-dim)] border border-border rounded-full px-3.5 py-1.5">
                        {categoryName}
                      </span>
                    </span>
                  </div>

                  <h3 className="font-display text-3xl md:text-4xl text-[var(--color-text)] mt-10 group-hover:text-gold transition-colors duration-300">
                    {item.name}
                  </h3>
                  <p className="text-[var(--color-text-muted)] mt-3 leading-relaxed text-sm md:text-base">
                    {item.description}
                  </p>

                  <div className="flex items-end justify-between mt-9">
                    <span className="font-display text-3xl ember-text">{priceLabel(item)}</span>
                    <span className="text-[var(--color-text-dim)] group-hover:text-accent group-hover:translate-x-2 transition-all duration-300 text-2xl" aria-hidden="true">
                      →
                    </span>
                  </div>
                </Link>
              </Tilt3DCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
