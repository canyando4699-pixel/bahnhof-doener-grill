'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Realistischer Döner-Spieß:
 * - Gestapelte Fleischschichten (typische Tropfenform: oben breit,
 *   nach unten konisch zulaufend) mit Farb- und Radius-Variation
 * - Angegrillte Außenkanten (emissive Sear an zufälligen Schichten)
 * - Durchgehender Metallspieß, Teller oben + Auffangschale unten
 */

const LAYERS = 26;
const MEAT_TOP = 1.18;
const MEAT_BOTTOM = -1.3;

// Tropfenprofil: oben breit (Peak bei ~30%), nach unten konisch zulaufend
function profile(u: number) {
  return 0.26 + 0.58 * Math.sin(Math.PI * (0.28 + 0.72 * u));
}

const MEAT_COLORS = ['#6e3014', '#82421e', '#8f4a22', '#75361a', '#9b5326', '#7c3b18'];

export default function DoenerSpit({
  scale = 1,
  scroll,
}: {
  scale?: number;
  scroll?: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meatRef = useRef<THREE.Group>(null);

  const layers = useMemo(() => {
    const h = (MEAT_TOP - MEAT_BOTTOM) / LAYERS;
    return Array.from({ length: LAYERS }).map((_, i) => {
      const u0 = i / LAYERS;
      const u1 = (i + 1) / LAYERS;
      // Stärkerer Jitter + gelegentlich ausgefranste Kante → handgeschichtet
      const jitter = (Math.random() - 0.5) * 0.07 + (Math.random() < 0.18 ? 0.05 : 0);
      const seared = Math.random() < 0.3;
      return {
        y: MEAT_TOP - (u0 + u1) / 2 * (MEAT_TOP - MEAT_BOTTOM),
        rTop: Math.max(0.12, profile(u0) + jitter),
        rBottom: Math.max(0.1, profile(u1) + (Math.random() - 0.5) * 0.06),
        h: h * 1.06,
        color: MEAT_COLORS[Math.floor(Math.random() * MEAT_COLORS.length)],
        seared,
        rot: Math.random() * Math.PI * 2,
      };
    });
  }, []);

  useFrame((state, delta) => {
    const p = scroll?.current ?? 0;
    if (groupRef.current) {
      // Scroll-Story: Spieß dreht beim Scrollen deutlich schneller
      groupRef.current.rotation.y += delta * (0.45 + p * 2.4);
    }
    if (meatRef.current) {
      meatRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.015;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Metallspieß (durchgehend) */}
      <mesh>
        <cylinderGeometry args={[0.045, 0.045, 3.9, 12]} />
        <meshStandardMaterial color="#b8b8b8" metalness={0.95} roughness={0.28} />
      </mesh>
      {/* Spitze oben */}
      <mesh position={[0, 2.0, 0]}>
        <coneGeometry args={[0.045, 0.18, 12]} />
        <meshStandardMaterial color="#a8a8a8" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Teller über dem Fleisch */}
      <mesh position={[0, MEAT_TOP + 0.09, 0]}>
        <cylinderGeometry args={[0.5, 0.56, 0.07, 28]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* Fleischschichten */}
      <group ref={meatRef}>
        {layers.map((l, i) => (
          <mesh key={i} position={[0, l.y, 0]} rotation={[0, l.rot, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[l.rTop, l.rBottom, l.h, 26]} />
            <meshStandardMaterial
              color={l.color}
              roughness={0.82}
              metalness={0.04}
              emissive={l.seared ? '#9c3d0a' : '#1d0a04'}
              emissiveIntensity={l.seared ? 0.32 : 0.15}
            />
          </mesh>
        ))}
      </group>

      {/* Auffangschale unten */}
      <mesh position={[0, MEAT_BOTTOM - 0.28, 0]}>
        <cylinderGeometry args={[0.62, 0.52, 0.1, 28]} />
        <meshStandardMaterial color="#2e2e2e" metalness={0.85} roughness={0.35} />
      </mesh>
      {/* Halterung unten */}
      <mesh position={[0, MEAT_BOTTOM - 0.5, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 0.18, 16]} />
        <meshStandardMaterial color="#222" metalness={0.6} roughness={0.6} />
      </mesh>
    </group>
  );
}
