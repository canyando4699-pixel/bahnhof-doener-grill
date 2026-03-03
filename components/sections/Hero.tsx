'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import SeamlessVideo from '@/components/ui/SeamlessVideo';

const HeroCanvas = dynamic(() => import('@/components/3d/HeroCanvas'), { ssr: false });

export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (contentRef.current) {
        contentRef.current.style.opacity = String(Math.max(0, 1 - y / 300));
        contentRef.current.style.transform = `translateY(${y * 0.2}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="relative md:min-h-[700px] text-[var(--color-text)] overflow-hidden bg-black">
      {/* Hero Video */}
      <SeamlessVideo
        wrapperClassName="relative w-full overflow-hidden md:absolute md:inset-0"
        videoClassName="w-full h-auto md:h-full md:object-cover md:object-center"
        poster="/images/hero.webp"
        webmSrc="/images/Hero_Video.webm"
        mp4Src="/images/Hero%20Video.mp4"
        fadeTime={1.5}
      />

      {/* Gradient — Desktop only */}
      <div
        className="hidden md:block absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/10"
        aria-hidden="true"
      />

      {/* 3D Canvas */}
      <HeroCanvas />

      {/* Content */}
      <div className="relative z-10 md:absolute md:inset-0 md:flex md:items-center py-16 md:py-0">
        <div className="max-w-container mx-auto px-[var(--container-px)] w-full">
          <div ref={contentRef} className="max-w-lg">
            <h1 className="font-display text-5xl md:text-7xl hero-fade-in">
              Frisch vom Spieß.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-[var(--color-text-muted)] max-w-sm hero-fade-in hero-delay-1">
              Knuspriges Brot. Saftiges Fleisch. Echte Frische.
            </p>
            <div className="mt-9 hero-fade-in hero-delay-2">
              <Link
                href="/menu"
                className="inline-block bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded font-semibold transition-colors"
              >
                Menü entdecken
              </Link>
            </div>

            {/* Scroll indicator */}
            <div className="mt-16 flex justify-start" aria-hidden="true">
              <div className="animate-bounce-slow w-5 h-8 border-2 border-white/30 rounded-full flex items-start justify-center pt-1.5">
                <div className="w-1 h-2 bg-white/50 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
