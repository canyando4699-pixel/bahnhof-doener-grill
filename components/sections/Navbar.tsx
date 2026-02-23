'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

function NavBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-950 ring-2 ring-orange-500 shrink-0">
      {children}
    </span>
  );
}

function IconMenu() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

function IconMapPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <line x1="12" y1="18" x2="12" y2="18.5" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

const navLinks = [
  { href: '/menu', label: 'Speisekarte', icon: <IconMenu /> },
  { href: '/kontakt', label: 'Kontakt', icon: <IconMapPin /> },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/60 to-transparent"
      role="navigation"
      aria-label="Hauptnavigation"
    >
      <div className="max-w-container mx-auto px-[var(--container-px)]">
        <div className="flex justify-between items-center h-32">
          <Link href="/" aria-label="Zur Startseite">
            <Image
              src="/images/logo.png"
              alt="Bahnhof Döner Grill"
              width={150}
              height={150}
              className="object-contain"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                <NavBadge>{link.icon}</NavBadge>
                {link.label}
              </Link>
            ))}
            <a
              href="tel:06451240925"
              className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              <NavBadge><IconPhone /></NavBadge>
              06451 240925
            </a>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label="Hauptmenü"
          >
            <span className="sr-only">{isOpen ? 'Menü schließen' : 'Menü öffnen'}</span>
            {!isOpen ? (
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-sm" id="mobile-menu">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 text-white/80 hover:text-white px-3 py-2 text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                <NavBadge>{link.icon}</NavBadge>
                {link.label}
              </Link>
            ))}
            <a
              href="tel:06451240925"
              className="flex items-center gap-3 text-white/80 hover:text-white px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              <NavBadge><IconPhone /></NavBadge>
              06451 240925
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
