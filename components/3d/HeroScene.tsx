'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Particles() {
  const ref = useRef<THREE.Points>(null!);

  const [positions, colors] = useMemo(() => {
    const count = 300;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#f59e0b'),
      new THREE.Color('#dc2626'),
      new THREE.Color('#d97706'),
    ];
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    ref.current.rotation.x = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

const ICO_CONFIGS: {
  position: [number, number, number];
  scale: number;
  speed: number;
  emissive: string;
}[] = [
  { position: [3,    1,    -2],   scale: 0.50, speed: 0.50, emissive: '#f59e0b' },
  { position: [-3.5, -0.5, -3],   scale: 0.80, speed: 0.35, emissive: '#dc2626' },
  { position: [1.5,  -2,   -1.5], scale: 0.35, speed: 0.60, emissive: '#d97706' },
  { position: [-1.5, 2,    -2.5], scale: 0.60, speed: 0.45, emissive: '#f59e0b' },
  { position: [4,    -1.5, -3.5], scale: 0.45, speed: 0.55, emissive: '#dc2626' },
];

function FloatingIco({
  position, scale, speed, emissive, index,
}: {
  position: [number, number, number];
  scale: number;
  speed: number;
  emissive: string;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const offset = index * 1.3;

  useFrame((state) => {
    ref.current.rotation.x += 0.004;
    ref.current.rotation.y += 0.006;
    ref.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * speed + offset) * 0.25;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#1a1a1a"
        wireframe
        emissive={emissive}
        emissiveIntensity={0.6}
      />
    </mesh>
  );
}

function CameraParallax() {
  const { camera } = useThree();
  useFrame((state) => {
    camera.position.x += (state.mouse.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (state.mouse.y * 0.3 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene() {
  return (
    <>
      <fog attach="fog" args={['#0a0a0a', 5, 15]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 2]}   intensity={1.5} color="#f59e0b" />
      <pointLight position={[-5, -3, 2]} intensity={1.0} color="#dc2626" />
      <pointLight position={[0, 3, 4]}   intensity={0.8} color="#d97706" />
      <Particles />
      {ICO_CONFIGS.map((cfg, i) => (
        <FloatingIco key={i} index={i} {...cfg} />
      ))}
      <CameraParallax />
    </>
  );
}
