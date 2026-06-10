'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type ItemType = 'tomato' | 'lettuce' | 'meat' | 'onion';

type Item = {
  type: ItemType;
  pos: [number, number, number];
  scale: number;
  speed: number;
  rot: [number, number, number];
};

/** Gewelltes Salatblatt: Kreis mit Rand-Wellen */
function useLettuceGeometry() {
  return useMemo(() => {
    const g = new THREE.CircleGeometry(1, 28);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const r = Math.sqrt(x * x + y * y);
      const angle = Math.atan2(y, x);
      // Wellen am Rand, Mitte bleibt flach
      pos.setZ(i, Math.sin(angle * 5) * 0.22 * r * r + Math.sin(angle * 11) * 0.07 * r);
    }
    g.computeVertexNormals();
    return g;
  }, []);
}

/** Leicht gewölbter Fleischstreifen (frisch vom Spieß gehobelt) */
function useMeatGeometry() {
  return useMemo(() => {
    const g = new THREE.PlaneGeometry(1.7, 0.55, 10, 2);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      // Rollung an den Enden + leichte Unregelmäßigkeit
      pos.setZ(i, Math.pow(Math.abs(x) * 0.85, 2) * 0.5 + Math.sin(x * 6) * 0.03);
    }
    g.computeVertexNormals();
    return g;
  }, []);
}

function Tomato() {
  return (
    <group>
      {/* Scheibe: dunklere Schale, helleres Fruchtfleisch oben/unten */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.16, 24]} />
        <meshStandardMaterial attach="material-0" color="#b8251a" roughness={0.45} />
        <meshStandardMaterial attach="material-1" color="#e0492f" roughness={0.55} />
        <meshStandardMaterial attach="material-2" color="#e0492f" roughness={0.55} />
      </mesh>
      {/* Kern */}
      <mesh position={[0, 0, 0.085]}>
        <circleGeometry args={[0.55, 20]} />
        <meshStandardMaterial color="#f2705a" roughness={0.6} />
      </mesh>
    </group>
  );
}

function Lettuce({ geometry }: { geometry: THREE.BufferGeometry }) {
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#5fae3e" roughness={0.55} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Meat({ geometry }: { geometry: THREE.BufferGeometry }) {
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color="#8a4a22"
        roughness={0.8}
        emissive="#3d1707"
        emissiveIntensity={0.25}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Onion() {
  return (
    <mesh>
      <torusGeometry args={[0.7, 0.16, 10, 24]} />
      <meshStandardMaterial color="#f3e6d0" roughness={0.5} />
    </mesh>
  );
}

export default function FloatingIngredients() {
  const groupRef = useRef<THREE.Group>(null);
  const lettuceGeo = useLettuceGeometry();
  const meatGeo = useMeatGeometry();

  const items = useMemo<Item[]>(() => {
    const types: ItemType[] = ['tomato', 'lettuce', 'meat', 'onion'];
    return Array.from({ length: 12 }).map((_, i) => {
      const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.4;
      const radius = 2.6 + Math.random() * 1.3;
      const y = -0.7 + Math.random() * 2.2;
      return {
        type: types[i % types.length],
        // z abgeflacht → nichts fliegt der Kamera direkt vors Objektiv
        pos: [Math.cos(angle) * radius, y, Math.sin(angle) * radius * 0.4],
        scale: 0.13 + Math.random() * 0.08,
        speed: 0.3 + Math.random() * 0.5,
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      };
    });
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.08;
    groupRef.current.children.forEach((child, i) => {
      const item = items[i];
      if (!item) return;
      child.position.y = item.pos[1] + Math.sin(state.clock.elapsedTime * item.speed + i) * 0.25;
      child.rotation.x += delta * item.speed * 0.4;
      child.rotation.z += delta * item.speed * 0.25;
    });
  });

  return (
    <group ref={groupRef}>
      {items.map((it, i) => (
        <group key={i} position={it.pos} scale={it.scale} rotation={it.rot}>
          {it.type === 'tomato' && <Tomato />}
          {it.type === 'lettuce' && <Lettuce geometry={lettuceGeo} />}
          {it.type === 'meat' && <Meat geometry={meatGeo} />}
          {it.type === 'onion' && <Onion />}
        </group>
      ))}
    </group>
  );
}
