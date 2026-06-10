'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type Item = {
  type: 'pepper' | 'onion' | 'tomato' | 'pita';
  pos: [number, number, number];
  scale: number;
  speed: number;
  axis: [number, number, number];
};

const PALETTE = {
  pepper: '#2fa84a',
  onion: '#f3e6d0',
  tomato: '#d8341c',
  pita: '#e9c98a',
};

export default function FloatingIngredients() {
  const groupRef = useRef<THREE.Group>(null);

  const items = useMemo<Item[]>(() => {
    const types: Item['type'][] = ['pepper', 'onion', 'tomato', 'pita'];
    return Array.from({ length: 14 }).map((_, i) => {
      const angle = (i / 14) * Math.PI * 2 + Math.random() * 0.4;
      const radius = 2.4 + Math.random() * 1.6;
      const y = -0.8 + Math.random() * 2.6;
      return {
        type: types[i % types.length],
        pos: [Math.cos(angle) * radius, y, Math.sin(angle) * radius],
        scale: 0.12 + Math.random() * 0.14,
        speed: 0.3 + Math.random() * 0.5,
        axis: [Math.random(), Math.random(), Math.random()],
      };
    });
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
      groupRef.current.children.forEach((child, i) => {
        const t = state.clock.elapsedTime;
        const item = items[i];
        if (!item) return;
        child.position.y = item.pos[1] + Math.sin(t * item.speed + i) * 0.25;
        child.rotation.x += delta * item.speed * 0.5;
        child.rotation.z += delta * item.speed * 0.3;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {items.map((it, i) => (
        <mesh key={i} position={it.pos} scale={it.scale}>
          {it.type === 'pita' ? (
            <torusGeometry args={[1, 0.45, 8, 20]} />
          ) : it.type === 'pepper' ? (
            <coneGeometry args={[0.55, 1.5, 8]} />
          ) : (
            <icosahedronGeometry args={[0.85, 0]} />
          )}
          <meshStandardMaterial
            color={PALETTE[it.type]}
            roughness={0.55}
            metalness={0.08}
            emissive={PALETTE[it.type]}
            emissiveIntensity={0.12}
          />
        </mesh>
      ))}
    </group>
  );
}
