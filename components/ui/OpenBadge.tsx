'use client';

import { useEffect, useState } from 'react';

/* Mo–Do + So: 10–23 Uhr · Fr + Sa: 10–24 Uhr */
function getStatus(now: Date) {
  const day = now.getDay(); // 0 = So
  const closeHour = day === 5 || day === 6 ? 24 : 23;
  const h = now.getHours() + now.getMinutes() / 60;

  if (h >= 10 && h < closeHour) {
    const minsLeft = Math.round((closeHour - h) * 60);
    return { open: true as const, closeHour, minsLeft };
  }
  return { open: false as const, opensToday: h < 10 };
}

export default function OpenBadge({ className = '' }: { className?: string }) {
  const [status, setStatus] = useState<ReturnType<typeof getStatus> | null>(null);

  useEffect(() => {
    const tick = () => setStatus(getStatus(new Date()));
    tick();
    const t = setInterval(tick, 60_000);
    return () => clearInterval(t);
  }, []);

  // Erst nach Mount rendern (Uhrzeit ist client-abhängig → kein SSR-Mismatch)
  if (!status) return null;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs tracking-wide ${
        status.open
          ? 'border-[#3dba5d]/40 text-[#7ee29a] bg-[#3dba5d]/10'
          : 'border-border text-[var(--color-text-dim)] bg-surface'
      } ${className}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          status.open ? 'bg-[#3dba5d] animate-pulse' : 'bg-[var(--color-text-dim)]'
        }`}
        aria-hidden="true"
      />
      {status.open
        ? status.minsLeft <= 60
          ? `Jetzt geöffnet · schließt in ${status.minsLeft} Min`
          : `Jetzt geöffnet · bis ${status.closeHour === 24 ? '00:00' : status.closeHour} Uhr`
        : `Geschlossen · öffnet ${status.opensToday ? 'heute' : 'morgen'} 10 Uhr`}
    </span>
  );
}
