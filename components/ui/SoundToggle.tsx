'use client';

import { useEffect, useState } from 'react';
import { setSoundEnabled } from '@/lib/sfx';

const KEY = 'sound-on';

export default function SoundToggle() {
  const [on, setOn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Gespeicherte Präferenz nur lesen — Audio selbst startet erst nach
    // einer User-Geste (Autoplay-Policy), deshalb hier kein setSoundEnabled(true)
    try {
      if (localStorage.getItem(KEY) === '1') setOn(true);
    } catch {}
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    setSoundEnabled(next); // Klick = User-Geste → AudioContext erlaubt
    try {
      localStorage.setItem(KEY, next ? '1' : '0');
    } catch {}
  };

  // Erst gespeicherten Zustand aktivieren, wenn der User irgendwo klickt
  useEffect(() => {
    if (!mounted || !on) return;
    const arm = () => setSoundEnabled(true);
    window.addEventListener('pointerdown', arm, { once: true });
    return () => window.removeEventListener('pointerdown', arm);
  }, [mounted, on]);

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Sound ausschalten' : 'Sound einschalten'}
      title={on ? 'Sound aus' : 'Sound an (Grill-Ambiente)'}
      className={`fixed bottom-5 right-5 z-[150] flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-300 ${
        on
          ? 'border-gold/60 bg-gold/15 text-gold shadow-[0_0_24px_-6px_rgba(255,176,31,0.7)]'
          : 'border-border bg-surface/80 text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:border-accent/50'
      }`}
    >
      <span aria-hidden="true" className="text-base leading-none">
        {on ? '🔊' : '🔇'}
      </span>
    </button>
  );
}
