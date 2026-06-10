import type { Metadata } from 'next';
import Location from '@/components/sections/Location';
import CTABanner from '@/components/sections/CTABanner';

export const metadata: Metadata = {
  title: 'Kontakt — Bahnhof Döner Grill',
};

export default function KontaktPage() {
  return (
    <main className="min-h-screen pt-28">
      <div className="max-w-container mx-auto px-[var(--container-px)] pt-14 pb-4">
        <p className="text-xs tracking-[0.45em] uppercase text-accent mb-4">Bahnhof Döner Grill</p>
        <h1 className="font-display text-6xl md:text-8xl text-[var(--color-text)] leading-[0.9]">
          Kon<span className="ember-text">takt</span>
        </h1>
      </div>
      <Location />
      <CTABanner />
    </main>
  );
}
