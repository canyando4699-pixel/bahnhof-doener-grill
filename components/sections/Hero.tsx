'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import MagneticButton from '@/components/animations/MagneticButton';

const SceneR3F = dynamic(() => import('@/components/3d/SceneR3F'), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (contentRef.current) {
          contentRef.current.style.opacity = String(Math.max(0, 1 - y / 380));
          contentRef.current.style.transform = `translateY(${y * 0.18}px)`;
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative min-h-[100svh] text-[var(--color-text)] overflow-hidden bg-black perspective-root spice-grain">
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#1a0a05_0%,#0a0a0a_55%,#000_100%)]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 veil-warm pointer-events-none" aria-hidden="true" />

      <SceneR3F />

      <div className="relative z-10 min-h-[100svh] flex items-center py-16 md:py-0">
        <div className="max-w-container mx-auto px-[var(--container-px)] w-full">
          <div ref={contentRef} className="max-w-xl">
            <p className="hero-fade-in text-xs tracking-[0.4em] uppercase text-[var(--color-text-muted)] mb-5">
              Am Bahnhof 10 · Frankenberg
            </p>
            <h1 className="font-display text-6xl md:text-8xl leading-none">
              <span className="block hero-fade-in">Frisch</span>
              <span className="block title-shimmer hero-fade-in hero-delay-1">vom Spieß.</span>
            </h1>
            <p className="mt-7 text-lg md:text-xl leading-relaxed text-[var(--color-text-muted)] max-w-md hero-fade-in hero-delay-2">
              Knuspriges Brot. Saftiges Fleisch.
              <br />
              <span className="text-[var(--color-text)]">Echte Frische — täglich.</span>
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4 hero-fade-in hero-delay-2">
              <MagneticButton
                href="/menu"
                className="bg-accent hover:bg-accent-hover text-white px-9 py-4 rounded-full font-semibold shadow-[0_10px_40px_-10px_rgba(220,38,38,0.7)] heat-pulse"
              >
                Menü entdecken →
              </MagneticButton>
              <MagneticButton
                href="/kontakt"
                className="text-[var(--color-text)] px-7 py-4 rounded-full border border-white/15 hover:border-white/40 hover:bg-white/5 transition-colors"
              >
                Standort & Öffnungszeiten
              </MagneticButton>
            </div>

            <div className="mt-20 flex items-center gap-3 text-[var(--color-text-dim)]" aria-hidden="true">
              <div className="animate-bounce-slow w-5 h-8 border-2 border-white/25 rounded-full flex items-start justify-center pt-1.5">
                <div className="w-1 h-2 bg-white/60 rounded-full" />
              </div>
              <span className="text-xs tracking-[0.3em] uppercase">Scroll</span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[var(--color-bg)] pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
}
