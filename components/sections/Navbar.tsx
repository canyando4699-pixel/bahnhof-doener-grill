'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'Start' },
  { href: '/menu', label: 'Speisekarte' },
  { href: '/#game', label: '🎮 Game' },
  { href: '/kontakt', label: 'Kontakt' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 140 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[120] transition-all duration-500 ${
          hidden && !isOpen ? '-translate-y-full' : 'translate-y-0'
        } ${
          scrolled && !isOpen
            ? 'bg-[#080605]/80 backdrop-blur-xl border-b border-border'
            : 'bg-transparent border-b border-transparent'
        }`}
        role="navigation"
        aria-label="Hauptnavigation"
      >
        <div className="max-w-container mx-auto px-[var(--container-px)]">
          <div className={`flex justify-between items-center transition-all duration-500 ${scrolled ? 'h-20' : 'h-28'}`}>
            <Link href="/" aria-label="Zur Startseite" className="relative z-[130] shrink-0" onClick={() => setIsOpen(false)}>
              <Image
                src="/images/logo.png"
                alt="Bahnhof Döner Grill"
                width={150}
                height={150}
                className={`object-contain transition-all duration-500 ${scrolled ? 'w-16 h-16' : 'w-24 h-24'}`}
                priority
              />
            </Link>

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-9">
              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="link-sweep text-xs tracking-[0.3em] uppercase font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="tel:06451240925"
                className="group flex items-center gap-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:shadow-[0_8px_40px_-8px_rgba(255,90,31,0.8)]"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                06451 240925
              </a>
            </div>

            {/* Mobile Burger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative z-[130] flex flex-col justify-center items-center w-12 h-12 gap-[7px]"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Menü schließen' : 'Menü öffnen'}
            >
              <span className={`block h-[2px] w-7 bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[4.5px]' : ''}`} />
              <span className={`block h-[2px] w-7 bg-current transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[4.5px]' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Fullscreen Mobile-Menü */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-[110] md:hidden bg-[#0a0705] transition-all duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col justify-center min-h-full px-8 pt-24 pb-12">
          <nav className="space-y-2" aria-label="Mobile Navigation">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block font-display text-6xl text-[var(--color-text)] hover:text-accent transition-all duration-500 ${
                  isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: isOpen ? `${150 + i * 90}ms` : '0ms' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div
            className={`mt-14 space-y-3 text-[var(--color-text-muted)] transition-all duration-500 ${
              isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: isOpen ? '480ms' : '0ms' }}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-text-dim)]">Am Bahnhof 10 · Frankenberg</p>
            <a href="tel:06451240925" className="inline-block bg-accent text-white font-semibold px-7 py-3.5 rounded-full">
              06451 240925
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
