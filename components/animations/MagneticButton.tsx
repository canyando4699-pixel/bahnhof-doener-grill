'use client';

import { useRef, MouseEvent, ReactNode } from 'react';
import Link from 'next/link';

interface MagneticButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  strength?: number;
}

export default function MagneticButton({
  href,
  children,
  className = '',
  strength = 0.35,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  function onMove(e: MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  }

  function onLeave() {
    if (ref.current) ref.current.style.transform = 'translate(0,0)';
  }

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-block transition-transform duration-500 ease-out will-change-transform ${className}`}
    >
      {children}
    </Link>
  );
}
