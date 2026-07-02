/* Glut-Funken beim Karten-Hover — reine CSS-Animation (.group:hover .spark),
   deterministische Werte statt Math.random → kein Hydration-Mismatch. */

const SPARKS = [
  { x: '10%', delay: '0s',    dur: '1.1s',  drift: '-14px', color: 'var(--color-gold)' },
  { x: '24%', delay: '0.25s', dur: '0.9s',  drift: '10px',  color: 'var(--color-accent)' },
  { x: '38%', delay: '0.5s',  dur: '1.25s', drift: '-8px',  color: 'var(--color-gold)' },
  { x: '52%', delay: '0.1s',  dur: '1s',    drift: '16px',  color: 'var(--color-accent)' },
  { x: '66%', delay: '0.4s',  dur: '1.15s', drift: '-12px', color: 'var(--color-gold)' },
  { x: '78%', delay: '0.65s', dur: '0.95s', drift: '8px',   color: 'var(--color-accent)' },
  { x: '88%', delay: '0.2s',  dur: '1.2s',  drift: '-6px',  color: 'var(--color-gold)' },
  { x: '45%', delay: '0.8s',  dur: '1.05s', drift: '12px',  color: 'var(--color-gold)' },
];

export default function HoverSparks() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none" aria-hidden="true">
      {SPARKS.map((s, i) => (
        <span
          key={i}
          className="spark"
          style={{
            ['--spark-x' as string]: s.x,
            ['--spark-delay' as string]: s.delay,
            ['--spark-dur' as string]: s.dur,
            ['--spark-drift' as string]: s.drift,
            ['--spark-color' as string]: s.color,
          }}
        />
      ))}
    </div>
  );
}
