'use client';

import { Canvas } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { Suspense } from 'react';
import Embers from './Embers';
import FloatingIngredients from './FloatingIngredients';

/**
 * Leichter 3D-Accent für den Speisekarte-Hero.
 * Bewusst schlank: keine Postprocessing-Pässe, kein DoenerSpit — nur
 * schwebende Zutaten + Glut-Funken hinter der Überschrift.
 * pointer-events-none → blockiert keine Klicks. dpr gedeckelt.
 */
export default function MenuHero3D() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.4, 6], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent', pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} color="#ffd9a8" />
          <directionalLight position={[3, 5, 4]} intensity={0.6} color="#ffe1b8" />
          <pointLight position={[-2, 1, 2]} color="#ff5a1f" intensity={1.2} distance={7} />

          <Float floatIntensity={0.6} rotationIntensity={0.3} speed={1.1}>
            <FloatingIngredients />
          </Float>
          <Embers count={60} />
        </Suspense>
      </Canvas>
    </div>
  );
}
