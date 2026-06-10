'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EmbersProps {
  count?: number;
}

/**
 * Glut-Funken: additiv geblendete Punkte, die vom Spieß
 * aufsteigen, seitlich driften und ausglühen.
 */
export default function Embers({ count = 90 }: EmbersProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 0.6;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = -1.8 + Math.random() * 3.6;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      seeds[i * 4] = Math.random() * Math.PI * 2;     // Phase
      seeds[i * 4 + 1] = 0.25 + Math.random() * 0.65; // Steiggeschwindigkeit
      seeds[i * 4 + 2] = angle;
      seeds[i * 4 + 3] = radius;
    }
    return { positions, seeds };
  }, [count]);

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;
    const t = state.clock.elapsedTime;
    const pos = points.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      const phase = seeds[i * 4];
      const speed = seeds[i * 4 + 1];
      const angle = seeds[i * 4 + 2];
      const radius = seeds[i * 4 + 3];
      // Loop von -1.8 bis +2.2, dann reset
      const y = -1.8 + (((t * speed + phase) % 4) / 4) * 4;
      const drift = Math.sin(t * 1.4 + phase * 7) * 0.12;
      pos.setXYZ(
        i,
        Math.cos(angle + t * 0.12) * (radius + drift),
        y,
        Math.sin(angle + t * 0.12) * (radius + drift)
      );
    }
    pos.needsUpdate = true;
    const material = points.material as THREE.PointsMaterial;
    material.opacity = 0.75 + Math.sin(t * 5.2) * 0.15;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffa12b"
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
