import type { Metadata } from 'next';
import MenuSection from '@/components/sections/MenuSection';
import MenuSidebar from '@/components/ui/MenuSidebar';
import menuData from '@/data/menu.json';
import { type MenuItem, isMultiPrice } from '@/types/menu';
import { getMenuImage } from '@/lib/getMenuImage';

export const metadata: Metadata = {
  title: 'Speisekarte — Bahnhof Döner Grill',
};

export default function MenuPage() {
  const categories = menuData.categories.map((c) => ({
    id: c.id,
    name: c.name,
    count: c.items.length,
  }));

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-container mx-auto px-[var(--container-px)]">
        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-10 lg:items-start">
          <MenuSidebar categories={categories} />

          <main>
            {/* Page header — zentriert über den Karten */}
            <div className="py-14">
              <p className="text-center text-xs tracking-[0.45em] uppercase text-accent mb-4">
                Bahnhof Döner Grill
              </p>
              <h1 className="font-display text-6xl md:text-8xl text-center text-[var(--color-text)] mb-5 leading-[0.9]">
                Speise<span className="ember-text">karte</span>
              </h1>
              <p className="text-center text-[var(--color-text-muted)] text-lg leading-relaxed">
                Alle Gerichte werden frisch für Sie zubereitet
              </p>
            </div>

            {menuData.categories.map((category, i) => (
              <MenuSection
                key={category.id}
                id={category.id}
                title={category.name}
                level={i + 1}
                items={(category.items as MenuItem[]).map((item) => {
                  const image = getMenuImage(item.name, category.id);
                  const isZoomedOut =
                    image === '/images/menu/boerek.webp' ||
                    image === '/images/menu/doener-box.webp';
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
          </main>
        </div>
      </div>
    </div>
  );
}
