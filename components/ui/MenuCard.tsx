import Image from 'next/image';

interface MenuCardProps {
  title: string;
  description: string;
  price?: string;
  prices?: { klein: string; groß: string };
  image?: string | null;
  imageHeight?: string;
}

export default function MenuCard({ title, description, price, prices, image, imageHeight = 'h-52' }: MenuCardProps) {
  return (
    <div className="bg-surface rounded-lg border border-border hover:-translate-y-0.5 hover:border-[var(--color-text-dim)] transition-all duration-200 overflow-hidden flex flex-col">
      {/* Bild oben — nur wenn vorhanden */}
      {image && (
        <div className={`relative w-full ${imageHeight} shrink-0 overflow-hidden`}>
          <Image
            src={image}
            alt={title}
            fill
            loading="lazy"
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Text-Bereich */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-base font-semibold text-[var(--color-text)]">{title}</h3>
          {prices ? (
            <span className="text-sm font-semibold text-accent tabular-nums text-right shrink-0">
              <span className="block">kl. {prices.klein}</span>
              <span className="block">gr. {prices.groß}</span>
            </span>
          ) : (
            <span className="text-sm font-semibold text-accent tabular-nums shrink-0">
              {price}
            </span>
          )}
        </div>

        {description && (
          <p className="text-muted text-sm leading-relaxed mt-1.5">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
