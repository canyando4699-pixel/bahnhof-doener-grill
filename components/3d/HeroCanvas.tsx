'use client';

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import HeroScene from './HeroScene';

function GlowFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-[#f59e0b]/10 blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-[#dc2626]/10 blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-[#d97706]/10 blur-3xl animate-float-slow" />
    </div>
  );
}

export default function HeroCanvas() {
  const [mode, setMode] = useState<'loading' | 'webgl' | 'fallback'>('loading');

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReduced || isMobile) {
      setMode('fallback');
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const hasWebGL = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      setMode(hasWebGL ? 'webgl' : 'fallback');
    } catch {
      setMode('fallback');
    }
  }, []);

  if (mode === 'loading') return null;
  if (mode === 'fallback') return <GlowFallback />;

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.5]}
      >
        <HeroScene />
      </Canvas>
    </div>
  );
}
