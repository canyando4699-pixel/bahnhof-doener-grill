'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import MagneticButton from '@/components/animations/MagneticButton';
import Marquee from '@/components/ui/Marquee';

const Scene3D = dynamic(() => import('@/components/3d/Scene3D'), {
  ssr: false,
  loading: () => null,
});

const marqueeItems = ['Döner', 'Pizza', 'Lahmacun', 'Pide', 'Dürüm', 'Salate'];

function Star({ fill }: { fill: 'full' | 'half' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      {fill === 'half' && (
        <defs>
          <linearGradient id="star-half">
            <stop offset="50%" stopColor="#ffb01f" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.18)" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={fill === 'full' ? '#ffb01f' : 'url(#star-half)'}
      />
    </svg>
  );
}

export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (contentRef.current) {
          contentRef.current.style.opacity = String(Math.max(0, 1 - y / 480));
          contentRef.current.style.transform = `translateY(${y * 0.22}px)`;
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
    <section className="relative min-h-[100svh] flex flex-col overflow-hidden bg-black">
      {/* Atmosphäre */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_62%_38%,#1c0b04_0%,#0a0705_52%,#050403_100%)]"
        aria-hidden="true"
      />

      {/* 3D-Spieß — sitzt zwischen den beiden Titelzeilen (Tiefen-Sandwich) */}
      <div className="absolute inset-y-0 right-0 w-full md:w-[68%] z-[10] opacity-80 md:opacity-100">
        <Scene3D />
      </div>

      <div className="relative flex-1 flex flex-col justify-center pt-32 pb-10">
        <div className="max-w-container mx-auto px-[var(--container-px)] w-full">
          <div ref={contentRef}>
            {/* Eyebrow-Zeile */}
            <div className="mb-6 hero-fade-in">
              <p className="text-[11px] md:text-xs tracking-[0.45em] uppercase text-[var(--color-text-muted)]">
                Am Bahnhof 10 — Frankenberg
              </p>
            </div>

            {/* Riesen-Typo, Layer-Sandwich mit dem 3D-Spieß */}
            <h1 className="font-display uppercase select-none">
              {/* pt/-mt: Luft für Umlaut-Punkte (Ö), die sonst vom overflow-hidden geclippt werden */}
              <span className="title-rise-wrap block relative z-[5] pt-[0.2em] -mt-[0.2em]">
                <span className="title-rise text-outline text-[clamp(4.2rem,16vw,13.5rem)] leading-[0.85] block">
                  Bahnhof
                </span>
              </span>
              <span className="title-rise-wrap block relative z-[20] pt-[0.2em] -mt-[0.2em]">
                <span
                  className="title-rise ember-text text-[clamp(4.2rem,16vw,13.5rem)] leading-[0.85] block"
                  style={{ animationDelay: '0.12s' }}
                >
                  Döner
                </span>
              </span>
            </h1>

            {/* Copy + CTAs */}
            <div className="relative z-[30] mt-9 md:mt-12 max-w-md">
              <p className="text-base md:text-lg leading-relaxed text-[var(--color-text-muted)] hero-fade-in hero-delay-3">
                Frisch vom Spieß, seit Jahren die erste Adresse nach der Ankunft.
                <br />
                <span className="text-[var(--color-text)]">Knuspriges Brot. Saftiges Fleisch. Echte Frische.</span>
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4 hero-fade-in hero-delay-4">
                <MagneticButton
                  href="/menu"
                  className="bg-accent hover:bg-accent-hover text-white px-9 py-4 rounded-full font-semibold heat-pulse"
                >
                  Speisekarte →
                </MagneticButton>
                <MagneticButton
                  href="/kontakt"
                  className="px-7 py-4 rounded-full border border-white/15 hover:border-gold/60 hover:bg-white/5 transition-colors text-[var(--color-text)]"
                >
                  Standort & Zeiten
                </MagneticButton>
              </div>

              {/* Google-Bewertung — prominent */}
              <div className="mt-9 flex items-center gap-3.5 hero-fade-in hero-delay-4">
                <span className="flex items-center gap-0.5">
                  <Star fill="full" />
                  <Star fill="full" />
                  <Star fill="full" />
                  <Star fill="full" />
                  <Star fill="half" />
                </span>
                <span className="font-display text-2xl text-gold leading-none pt-0.5">4.5</span>
                <span className="text-sm text-[var(--color-text-muted)]">
                  769 Google-Bewertungen
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Vertikale Zeile rechts */}
        <p
          className="hidden lg:block absolute right-7 top-1/2 -translate-y-1/2 rotate-90 origin-right text-[10px] tracking-[0.55em] uppercase text-[var(--color-text-dim)] whitespace-nowrap z-[30]"
          aria-hidden="true"
        >
          Frisch vom Spieß — täglich ab 10 Uhr
        </p>

        {/* Scroll-Hinweis */}
        <div
          className="absolute bottom-20 left-[var(--container-px)] hidden md:flex items-center gap-3 text-[var(--color-text-dim)] z-[30]"
          aria-hidden="true"
        >
          <div className="animate-bounce-slow w-5 h-8 border-2 border-white/20 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-gold/80 rounded-full" />
          </div>
          <span className="text-[10px] tracking-[0.35em] uppercase">Scroll</span>
        </div>
      </div>

      {/* Marquee am unteren Rand */}
      <div className="relative z-[30] border-y border-border bg-[#0a0705]/70 backdrop-blur-sm">
        <Marquee speed="26s" className="py-4">
          {marqueeItems.map((item) => (
            <span key={item} className="flex items-center shrink-0">
              <span className="font-display text-2xl md:text-3xl uppercase text-[var(--color-text)] px-6">
                {item}
              </span>
              <span className="text-accent text-xl" aria-hidden="true">✦</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
