'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SteamParticlesProps {
  count?: number;
  origin?: [number, number, number];
}

/**
 * Aufsteigender Dampf + Würz-Funken über dem Spieß.
 * GPU-effizient via InstancedMesh.
 */
export default function SteamParticles({
  count = 60,
  origin = [0, 1.4, 0],
}: SteamParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const sparkRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      offset: Math.random() * 6,
      speed: 0.18 + Math.random() * 0.25,
      driftX: (Math.random() - 0.5) * 0.4,
      driftZ: (Math.random() - 0.5) * 0.4,
      scale: 0.22 + Math.random() * 0.35,
    }));
  }, [count]);

  const sparks = useMemo(() => {
    return Array.from({ length: 28 }).map(() => ({
      offset: Math.random() * 4,
      speed: 0.5 + Math.random() * 0.6,
      angle: Math.random() * Math.PI * 2,
      radius: 0.6 + Math.random() * 0.5,
    }));
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      particles.forEach((p, i) => {
        const life = ((t + p.offset) * p.speed) % 4;
        const y = origin[1] + life * 0.9;
        const fade = Math.max(0, 1 - life / 4);
        dummy.position.set(
          origin[0] + p.driftX * life + Math.sin(t * 0.6 + i) * 0.06,
          y,
          origin[2] + p.driftZ * life + Math.cos(t * 0.5 + i) * 0.06,
        );
        const s = p.scale * (0.5 + life * 0.4) * fade;
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
    if (sparkRef.current) {
      sparks.forEach((s, i) => {
        const life = ((t + s.offset) * s.speed) % 3;
        const y = origin[1] - 0.2 + life * 0.8;
        const r = s.radius * (1 - life / 3);
        const fade = Math.max(0, 1 - life / 3);
        dummy.position.set(
          origin[0] + Math.cos(s.angle + life) * r,
          y,
          origin[2] + Math.sin(s.angle + life) * r,
        );
        dummy.scale.setScalar(0.035 * fade);
        dummy.updateMatrix();
        sparkRef.current!.setMatrixAt(i, dummy.matrix);
      });
      sparkRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial
          color="#ffd9a8"
          transparent
          opacity={0.12}
          depthWrite={false}
          emissive="#ff8a3a"
          emissiveIntensity={0.15}
        />
      </instancedMesh>
      <instancedMesh ref={sparkRef} args={[undefined, undefined, 28]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color="#ffb84a" toneMapped={false} />
      </instancedMesh>
    </group>
  );
}
