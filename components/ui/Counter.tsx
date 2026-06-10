'use client';

import { useEffect, useRef } from 'react';

interface CounterProps {
  to: number;
  decimals?: number;
  duration?: number;
  className?: string;
}

/**
 * Zählt beim Erscheinen im Viewport von 0 hoch.
 * SSR rendert den Endwert — ohne JS stimmen die Zahlen trotzdem.
 */
export default function Counter({ to, decimals = 0, duration = 1600, className = '' }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = (v: number) => v.toFixed(decimals).replace('.', ',');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 4);
          el.textContent = format(to * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, decimals, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {format(to)}
    </span>
  );
}
