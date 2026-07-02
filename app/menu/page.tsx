import type { Metadata } from 'next';
import MenuSection from '@/components/sections/MenuSection';
import MenuSidebar from '@/components/ui/MenuSidebar';
import MenuHeader from '@/components/sections/MenuHeader';
import { OrderProvider } from '@/components/order/OrderContext';
import OrderDock from '@/components/order/OrderDock';
import menuData from '@/data/menu.json';
import { type MenuItem, isMultiPrice } from '@/types/menu';
import { getMenuImage } from '@/lib/getMenuImage';

export const metadata: Metadata = {
  title: 'Speisekarte — Bahnhof Döner Grill',
};

/* Einheitliches Bild pro Kategorie — nur „Kleine Gerichte" (gemischt)
   behält Bilder pro Gericht via getMenuImage */
const CATEGORY_IMAGE: Record<string, string> = {
  drehspiess: '/images/menu/doener.webp',
  'drehspiess-teller': '/images/menu/doener-teller.webp',
  lahmacun: '/images/menu/lahmacun.webp',
  pizza: '/images/menu/pizza.webp',
  salate: '/images/menu/salat.webp',
  pide: '/images/menu/pide.webp',
};

export default function MenuPage() {
  const categories = menuData.categories.map((c) => ({
    id: c.id,
    name: c.name,
    count: c.items.length,
  }));

  const dishCount = menuData.categories.reduce((n, c) => n + c.items.length, 0);

  return (
    <OrderProvider>
      <div className="min-h-screen pt-20">
        <div className="max-w-container mx-auto px-[var(--container-px)]">
          <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-10 lg:items-start">
            <MenuSidebar categories={categories} />

            <main>
              <MenuHeader dishCount={dishCount} levelCount={menuData.categories.length} />

              {menuData.categories.map((category, i) => (
                <MenuSection
                  key={category.id}
                  id={category.id}
                  title={category.name}
                  level={i + 1}
                  items={[...(category.items as MenuItem[])]
                    .sort((a, b) => a.nr - b.nr)
                    .map((item) => ({
                      id: item.id,
                      title: item.name,
                      description: item.description,
                      image: CATEGORY_IMAGE[category.id] ?? getMenuImage(item.name, category.id),
                      ...(isMultiPrice(item)
                        ? { prices: item.prices }
                        : { price: item.price }),
                    }))}
                />
              ))}
            </main>
          </div>
        </div>
      </div>

      <OrderDock />
    </OrderProvider>
  );
}
