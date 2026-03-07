'use client';

import { useState, useEffect, useRef } from 'react';

interface Category {
  id: string;
  name: string;
  count: number;
}

export default function MenuSidebar({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState(categories[0]?.id ?? '');
  const isScrollingRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout>>();

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
          <p className="text-[10px] font-bold tracking-[0.18em] text-[var(--color-text-dim)] uppercase px-3 mb-3">
            Kategorien
          </p>

          <nav className="space-y-0.5">
            {categories.map(({ id, name, count }) => (
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
                <span>{name}</span>
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
