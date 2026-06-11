import MenuCard from '@/components/ui/MenuCard';

interface MenuItem {
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

export default function MenuSection({ id, title, items, level }: MenuSectionProps) {
  return (
    <section id={id} className="py-12 scroll-mt-32 lg:scroll-mt-24">
      <div className="max-w-container mx-auto px-[var(--container-px)]">
        {level !== undefined && (
          <p className="text-center mb-3">
            <span className="inline-block text-[10px] tracking-[0.35em] uppercase text-accent border border-accent/40 rounded-full px-4 py-1.5">
              Level {String(level).padStart(2, '0')}
            </span>
          </p>
        )}
        <h2 className="font-display text-3xl md:text-4xl text-[var(--color-text)] mb-8 text-center">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <MenuCard
              key={`${item.title}-${i}`}
              title={item.title}
              description={item.description}
              price={item.price}
              prices={item.prices}
              image={item.image}
              imageHeight={item.imageHeight}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
