'use client';

import { useEffect, useState } from 'react';

/**
 * Intro-Preloader: Wortmarke + Ladebalken, verschwindet nach ~2s.
 * Exit läuft rein über CSS-Animation (.preloader) — funktioniert
 * also auch, falls JS/Hydration ausfällt. Der Zähler ist Bonus.
 */
export default function Preloader() {
  const [count, setCount] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1900);
      setCount(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const t = setTimeout(() => setGone(true), 3100);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, []);

  if (gone) return null;

  return (
    <div className="preloader" aria-hidden="true">
      <div className="text-center">
        <p className="font-display text-5xl md:text-7xl text-outline leading-none">Bahnhof</p>
        <p className="font-display text-5xl md:text-7xl ember-text leading-none">Döner</p>
      </div>
      <span className="absolute bottom-8 right-8 font-display text-2xl text-[var(--color-text-dim)] tabular-nums">
        {count}%
      </span>
      <div className="preloader-bar" />
    </div>
  );
}
