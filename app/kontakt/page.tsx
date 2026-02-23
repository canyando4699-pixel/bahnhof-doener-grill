import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontakt — Bahnhof Döner Grill',
};

export default function KontaktPage() {
  return (
    <main className="min-h-screen pt-20">
      <div className="max-w-container mx-auto px-[var(--container-px)] py-16 max-w-2xl">
        <h1 className="text-4xl font-bold text-[var(--color-text)] mb-10">Kontakt</h1>

        <div className="space-y-8 text-muted text-lg">
          <div>
            <p className="text-[var(--color-text)] font-semibold">Bahnhof Döner Grill</p>
            <p>Am Bahnhof 10</p>
            <p>35066 Frankenberg</p>
          </div>

          <div>
            <p className="text-dim text-sm uppercase tracking-wide mb-1">Telefon</p>
            <a href="tel:06451240925" className="hover:text-[var(--color-text)] transition-colors">
              06451 240925
            </a>
          </div>

          <div>
            <p className="text-dim text-sm uppercase tracking-wide mb-1">Öffnungszeiten</p>
            <p>Mo–Do & So: 10:00 – 23:00 Uhr</p>
            <p>Fr & Sa: 10:00 – 24:00 Uhr</p>
          </div>
        </div>
      </div>
    </main>
  );
}
