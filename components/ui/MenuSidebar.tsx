'use client';

import { useState, useEffect, useRef } from 'react';

interface Category {
  id: string;
  name: string;
  count: number;
}

export default function MenuSidebar({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState(categories[0]?.id ?? '');
  const [progress, setProgress] = useState(0);
  const isScrollingRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    categories.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (!isScrollingRef.current && entry.isIntersecting) setActive(id);
        },
        { rootMargin: '-20% 0px -70% 0px' },
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => {
      observers.forEach((o) => o.disconnect());
      clearTimeout(scrollTimerRef.current);
    };
  }, [categories]);

  const handleClick = (id: string) => {
    setActive(id);
    isScrollingRef.current = true;
    clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 900);
  };

  return (
    <>
      {/* ── Mobile: sticky horizontal tab bar ─────────────────── */}
      <div
        className="lg:hidden sticky top-32 z-30 bg-bg/95 backdrop-blur-sm border-b border-[var(--color-border)]"
        aria-label="Kategorien"
      >
        <div className="flex overflow-x-auto gap-2 px-[var(--container-px)] py-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {categories.map(({ id, name }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => handleClick(id)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                active === id
                  ? 'bg-accent text-white'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:text-[var(--color-text)]'
              }`}
            >
              {name}
            </a>
          ))}
        </div>
      </div>

      {/* ── Desktop: sticky sidebar ────────────────────────────── */}
      <aside
        className="hidden lg:block sticky top-28 self-start"
        aria-label="Kategorien"
      >
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4 overflow-hidden">
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[10px] font-bold tracking-[0.18em] text-[var(--color-text-dim)] uppercase">
              🎮 Level wählen
            </p>
            <span className="text-[10px] tabular-nums text-accent font-semibold">
              {Math.round(progress * 100)}%
            </span>
          </div>
          {/* Scroll-Fortschritt durch die Karte */}
          <div className="mx-3 mb-3 h-1 rounded-full bg-[var(--color-surface-2)] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-gold transition-[width] duration-150 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          <nav className="space-y-0.5">
            {categories.map(({ id, name, count }, i) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => handleClick(id)}
                className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                  active === id
                    ? 'bg-accent text-white font-semibold'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]'
                }`}
              >
                <span>
                  <span
                    className={`text-[10px] tabular-nums mr-2 ${
                      active === id ? 'text-white/60' : 'text-[var(--color-text-dim)]'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {name}
                </span>
                <span
                  className={`text-xs tabular-nums transition-colors ${
                    active === id
                      ? 'text-white/60'
                      : 'text-[var(--color-text-dim)] group-hover:text-[var(--color-text-muted)]'
                  }`}
                >
                  {count}
                </span>
              </a>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
