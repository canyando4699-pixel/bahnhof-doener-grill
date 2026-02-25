import type { Metadata } from 'next';
import MenuSection from '@/components/sections/MenuSection';
import menuData from '@/data/menu.json';
import { type MenuItem, isMultiPrice } from '@/types/menu';
import { getMenuImage } from '@/lib/getMenuImage';

export const metadata: Metadata = {
  title: 'Speisekarte — Bahnhof Döner Grill',
};

export default function MenuPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="py-12">
        <div className="max-w-container mx-auto px-[var(--container-px)] mb-12">
          <h1 className="font-display text-5xl md:text-6xl text-center text-[var(--color-text)] mb-5">
            Unsere Speisekarte
          </h1>
          <p className="text-center text-muted text-lg leading-relaxed">
            Alle Gerichte werden frisch für Sie zubereitet
          </p>
        </div>

        {menuData.categories.map((category) => (
          <MenuSection
            key={category.id}
            title={category.name}
            items={(category.items as MenuItem[]).map((item) => {
              const image = getMenuImage(item.name, category.id);
              const isZoomedOut = image === '/images/menu/boerek.webp' || image === '/images/menu/doener-box.webp';
              return {
                title: item.name,
                description: item.description,
                image,
                imageHeight: isZoomedOut ? 'h-64' : undefined,
                ...(isMultiPrice(item)
                  ? { prices: item.prices }
                  : { price: item.price }),
              };
            })}
          />
        ))}
      </div>
    </div>
  );
}
