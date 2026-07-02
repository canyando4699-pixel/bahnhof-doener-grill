'use client';

import dynamic from 'next/dynamic';
import Counter from '@/components/ui/Counter';

const MenuHero3D = dynamic(() => import('@/components/3d/MenuHero3D'), {
  ssr: false,
  loading: () => null,
});

interface MenuHeaderProps {
  dishCount: number;
  levelCount: number;
}

export default function MenuHeader({ dishCount, levelCount }: MenuHeaderProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Atmosphäre */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_10%,#1c0b04_0%,transparent_60%)]"
        aria-hidden="true"
      />
      {/* Leichter 3D-Accent hinter dem Titel */}
      <div className="absolute inset-0 opacity-70 pointer-events-none">
        <MenuHero3D />
      </div>

      <div className="relative py-16 md:py-20 text-center">
        <p className="text-xs tracking-[0.45em] uppercase text-accent mb-4 hero-fade-in">
          Bahnhof Döner Grill
        </p>
        <h1 className="font-display text-6xl md:text-8xl leading-[0.9] select-none">
          <span className="title-rise-wrap block">
            <span className="title-rise block">
              Speise<span className="ember-text">karte</span>
            </span>
          </span>
        </h1>

        {/* Stats-Strip */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 hero-fade-in hero-delay-3">
          <Stat value={dishCount} label="Gerichte" />
          <Divider />
          <Stat value={levelCount} label="Level" />
          <Divider />
          <Stat value={4.5} decimals={1} label="Sterne" />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label, decimals = 0 }: { value: number; label: string; decimals?: number }) {
  return (
    <span className="flex flex-col items-center">
      <Counter to={value} decimals={decimals} className="font-display text-3xl md:text-4xl ember-text" />
      <span className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-text-dim)] mt-1">
        {label}
      </span>
    </span>
  );
}

function Divider() {
  return <span className="h-8 w-px bg-border" aria-hidden="true" />;
}
