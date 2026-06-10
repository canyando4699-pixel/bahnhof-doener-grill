'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Procedural Low-Poly Döner-Spieß
 * - Rotiert kontinuierlich (Spit-Rotation)
 * - Layered Mesh: dunkles Fleisch → warme Sear-Highlights
 * - Subtle Heat-Wobble via vertex displacement
 */
export default function DoenerSpit({ scale = 1 }: { scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const meatRef = useRef<THREE.Mesh>(null);

  const meatGeometry = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.55, 0.8, 2.4, 24, 12, true);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const noise =
        Math.sin(y * 8 + x * 4) * 0.04 +
        Math.cos(z * 6 + y * 3) * 0.03 +
        (Math.random() - 0.5) * 0.025;
      const len = Math.sqrt(x * x + z * z);
      if (len > 0) {
        pos.setX(i, x + (x / len) * noise);
        pos.setZ(i, z + (z / len) * noise);
      }
    }
    g.computeVertexNormals();
    return g;
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
    }
    if (meatRef.current) {
      const t = state.clock.elapsedTime;
      meatRef.current.position.y = Math.sin(t * 1.5) * 0.015;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Spieß (Metall) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 3.6, 12]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.95} roughness={0.25} />
      </mesh>

      {/* Spitze oben */}
      <mesh position={[0, 1.85, 0]}>
        <coneGeometry args={[0.05, 0.2, 12]} />
        <meshStandardMaterial color="#a8a8a8" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Halterung unten */}
      <mesh position={[0, -1.85, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.15, 16]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.6} />
      </mesh>

      {/* Fleisch-Hauptmasse */}
      <mesh ref={meatRef} geometry={meatGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color="#7a3216"
          roughness={0.88}
          metalness={0.05}
          emissive="#2a0d05"
          emissiveIntensity={0.18}
        />
      </mesh>

      {/* Sear-Layer (knusprig) */}
      <mesh geometry={meatGeometry} scale={1.012}>
        <meshStandardMaterial
          color="#b85c28"
          roughness={0.6}
          metalness={0.08}
          emissive="#c44d12"
          emissiveIntensity={0.22}
          transparent
          opacity={0.42}
        />
      </mesh>

      {/* Top Cap (gerundet) */}
      <mesh position={[0, 1.25, 0]}>
        <sphereGeometry args={[0.55, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#9a4520"
          roughness={0.7}
          emissive="#421a08"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Drippings (kleine Tropfen) */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const r = 0.78;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * r, -1.2 - (i % 2) * 0.15, Math.sin(angle) * r]}
          >
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshStandardMaterial
              color="#d8541c"
              emissive="#ff5a1a"
              emissiveIntensity={0.6}
              roughness={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
}
