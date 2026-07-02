'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** Position im Grid → gestaffelte Verzögerung */
  index?: number;
  /** Basis-Delay pro Index in ms */
  step?: number;
  className?: string;
}

/**
 * Staggered Entrance-Reveal via IntersectionObserver.
 * Ohne JS / bei prefers-reduced-motion sofort sichtbar (SSR rendert Endzustand).
 * Muster angelehnt an components/ui/Counter.tsx.
 */
export default function Reveal({ children, index = 0, step = 70, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        setShown(true);
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`menu-reveal ${shown ? 'is-shown' : ''} ${className}`}
      style={{ ['--reveal-delay' as string]: `${index * step}ms` }}
    >
      {children}
    </div>
  );
}
