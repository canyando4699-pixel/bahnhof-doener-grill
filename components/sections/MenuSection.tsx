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
  title: string;
  items: MenuItem[];
}

export default function MenuSection({ title, items }: MenuSectionProps) {
  return (
    <section className="py-12">
      <div className="max-w-container mx-auto px-[var(--container-px)]">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-8 text-center">
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
