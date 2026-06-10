'use client';

import { useRef, useState, MouseEvent, ReactNode } from 'react';

interface Tilt3DCardProps {
  children: ReactNode;
  className?: string;
  glow?: string;
  intensity?: number;
}

/**
 * Magnetic 3D Tilt Card mit Glow-Spotlight.
 * Reine CSS-3D Transforms → 60fps, kein JS-heavy Animation Loop.
 */
export default function Tilt3DCard({
  children,
  className = '',
  glow = 'rgba(255,106,26,0.45)',
  intensity = 14,
}: Tilt3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50, opacity: 0 });

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - y) * intensity;
    const ry = (x - 0.5) * intensity;
    setStyle({
      transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`,
      transition: 'transform 60ms linear',
    });
    setGlowPos({ x: x * 100, y: y * 100, opacity: 1 });
  }

  function onLeave() {
    setStyle({
      transform: 'perspective(900px) rotateX(0) rotateY(0)',
      transition: 'transform 500ms cubic-bezier(0.22,0.61,0.36,1)',
    });
    setGlowPos((g) => ({ ...g, opacity: 0 }));
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative will-change-transform ${className}`}
      style={style}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          background: `radial-gradient(420px circle at ${glowPos.x}% ${glowPos.y}%, ${glow}, transparent 55%)`,
          opacity: glowPos.opacity,
          mixBlendMode: 'screen',
        }}
      />
      <div style={{ transform: 'translateZ(40px)' }} className="relative">
        {children}
      </div>
    </div>
  );
}
