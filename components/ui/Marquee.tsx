import { ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode;
  speed?: string;
  reverse?: boolean;
  className?: string;
}

/** Endlos-Laufband — Inhalt wird intern dupliziert (CSS-only Loop). */
export default function Marquee({ children, speed = '30s', reverse = false, className = '' }: MarqueeProps) {
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div
        className={`marquee-track ${reverse ? 'marquee-reverse' : ''}`}
        style={{ ['--marquee-speed' as string]: speed }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center">{children}</div>
      </div>
    </div>
  );
}
