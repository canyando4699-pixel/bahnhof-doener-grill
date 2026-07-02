'use client';

import Image from 'next/image';
import Tilt3DCard from '@/components/ui/Tilt3DCard';
import HoverSparks from '@/components/ui/HoverSparks';
import AddToOrderButton from '@/components/order/AddToOrderButton';

interface Rarity {
  label: string;
  color: string;
}

interface MenuCardProps {
  id: string;
  title: string;
  description: string;
  price?: string;
  prices?: { klein: string; groß: string };
  image?: string | null;
  imageHeight?: string;
  /** Große Feature-Variante: Bild füllend, Titel overlaid */
  featured?: boolean;
  rarity?: Rarity;
}

function Price({ price, prices, large }: Pick<MenuCardProps, 'price' | 'prices'> & { large?: boolean }) {
  if (prices) {
    return (
      <span className={`ember-text font-display tabular-nums text-right shrink-0 ${large ? 'text-2xl' : 'text-lg'}`}>
        <span className="block leading-tight">kl. {prices.klein}</span>
        <span className="block leading-tight">gr. {prices.groß}</span>
      </span>
    );
  }
  return (
    <span className={`ember-text font-display tabular-nums shrink-0 ${large ? 'text-3xl' : 'text-xl'}`}>
      {price}
    </span>
  );
}

function RarityBadge({ rarity }: { rarity: Rarity }) {
  return (
    <span
      className="text-[10px] tracking-[0.3em] uppercase border rounded-full px-3 py-1.5 font-semibold backdrop-blur-sm"
      style={{
        color: rarity.color,
        borderColor: `${rarity.color}66`,
        boxShadow: `0 0 20px -5px ${rarity.color}aa`,
      }}
    >
      ◆ {rarity.label}
    </span>
  );
}

export default function MenuCard({
  id,
  title,
  description,
  price,
  prices,
  image,
  imageHeight = 'h-52',
  featured = false,
  rarity,
}: MenuCardProps) {
  const orderItem = { id, title, description, price, prices };
  /* ── Feature-Karte: großes Bild, Titel darüber ───────────────── */
  if (featured && image) {
    return (
      <Tilt3DCard className="rounded-3xl h-full" intensity={8}>
        <div className="group relative h-full min-h-[22rem] overflow-hidden rounded-3xl border border-border">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 66vw"
            priority
          />
          {/* Lesbarkeits-Verlauf + Ember-Schimmer */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080605] via-[#080605]/55 to-transparent" aria-hidden="true" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_50%_120%,rgba(255,90,31,0.35)_0%,transparent_60%)]" aria-hidden="true" />

          <div className="absolute top-4 left-4 flex gap-2">
            {rarity && <RarityBadge rarity={rarity} />}
          </div>
          <AddToOrderButton item={orderItem} />

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            <div className="flex items-end justify-between gap-4">
              <h3 className="font-display text-3xl md:text-4xl text-[var(--color-text)] group-hover:text-gold transition-colors duration-300">
                {title}
              </h3>
              <Price price={price} prices={prices} large />
            </div>
            {description && (
              <p className="text-[var(--color-text-muted)] text-sm md:text-base mt-2 leading-relaxed max-w-lg">
                {description}
              </p>
            )}
          </div>
        </div>
      </Tilt3DCard>
    );
  }

  /* ── Standard-Karte: Bild oben, Text unten ───────────────────── */
  return (
    <Tilt3DCard className="rounded-2xl h-full" intensity={10}>
      <div className="group relative h-full flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-300 hover:border-accent/50">
        {image && (
          <div className={`relative w-full ${imageHeight} shrink-0 overflow-hidden`}>
            <Image
              src={image}
              alt={title}
              fill
              loading="lazy"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#110d0a] via-transparent to-transparent opacity-70" aria-hidden="true" />
          </div>
        )}

        <div className="p-4 sm:p-5 flex flex-col flex-1">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-gold transition-colors duration-300">
              {title}
            </h3>
            <Price price={price} prices={prices} />
          </div>
          {description && (
            <p className="text-muted text-sm leading-relaxed mt-1.5">{description}</p>
          )}
        </div>

        <AddToOrderButton item={orderItem} />
        <HoverSparks />
      </div>
    </Tilt3DCard>
  );
}
