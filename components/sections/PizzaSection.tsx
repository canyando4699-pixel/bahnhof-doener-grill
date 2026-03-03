import Link from 'next/link';

export default function PizzaSection() {
  return (
    <section className="py-[var(--section-py)]">
      <div className="max-w-container mx-auto px-[var(--container-px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-4xl md:text-5xl text-[var(--color-text)] mb-5">
              Auch Pizza? Natürlich.
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-9">
              Neben unserem klassischen Döner gibt es bei uns auch knusprige,
              heiße Pizza – frisch aus dem Ofen.
            </p>
            <Link
              href="/menu"
              className="inline-block bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded font-semibold transition-colors"
            >
              Zur Speisekarte
            </Link>
          </div>

          <div className="relative aspect-square max-w-md mx-auto md:mx-0 md:ml-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/pizza.avif"
              alt="Frische Pizza"
              loading="lazy"
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
