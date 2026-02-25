import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-[580px] md:min-h-[700px] text-[var(--color-text)] overflow-hidden bg-black">
      {/* Hero Image — rechte 60%, damit bei großem Fenster kein leerer Bereich entsteht */}
      <div className="absolute top-0 bottom-0 right-0 w-[60%]" aria-hidden="true">
        <Image
          src="/images/hero.webp"
          alt="Bahnhof Döner Grill — frisch vom Spieß"
          fill
          priority
          className="object-cover object-center"
          sizes="60vw"
        />
      </div>

      {/* Gradient: links schwarz → rechts transparent, überlappt Bildkante */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/10"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex h-full min-h-[580px] md:min-h-[700px] items-center">
        <div className="max-w-container mx-auto px-[var(--container-px)] w-full">
          <div className="max-w-lg">
            <h1 className="font-display text-5xl md:text-7xl">
              Frisch vom Spieß.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-[var(--color-text-muted)] max-w-sm">
              Knuspriges Brot. Saftiges Fleisch. Echte Frische.
            </p>
            <div className="mt-9">
              <Link
                href="/menu"
                className="inline-block bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded font-semibold transition-colors"
              >
                Menü entdecken
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
