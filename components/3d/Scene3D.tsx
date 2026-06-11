'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows, Float, Lightformer } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import DoenerSpit from './DoenerSpit';
import SteamParticles from './SteamParticles';
import FloatingIngredients from './FloatingIngredients';
import Embers from './Embers';

function MouseParallaxRig() {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    target.current.x = pointer.x * 1.6;
    target.current.y = 0.4 + pointer.y * 0.9;
    camera.position.x += (target.current.x - camera.position.x) * 0.04;
    camera.position.y += (target.current.y - camera.position.y) * 0.04;
    camera.lookAt(0, 0.2, 0);
  });
  return null;
}

function HeatLight() {
  const ref = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.intensity = 2.4 + Math.sin(t * 4.2) * 0.25 + Math.sin(t * 9.1) * 0.12;
    }
  });
  return (
    <pointLight
      ref={ref}
      position={[1.4, 0.6, 1.8]}
      color="#ff6a1a"
      intensity={2.4}
      distance={8}
      decay={1.6}
    />
  );
}

export default function Scene3D() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.5, 6.6], fov: 38 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={['#0a0a0a', 6, 14]} />

          <ambientLight intensity={0.25} color="#ffd9a8" />
          <directionalLight position={[3, 6, 4]} intensity={0.7} color="#ffe1b8" />
          <HeatLight />
          <pointLight position={[-2.5, 1, -1]} color="#dc2626" intensity={1.1} distance={6} />

          <Float floatIntensity={0.4} rotationIntensity={0.15} speed={1.2}>
            <group position={[0.7, -0.15, 0]}>
              <DoenerSpit scale={0.8} />
            </group>
          </Float>

          <SteamParticles count={70} origin={[0, 1.3, 0]} />
          <FloatingIngredients />
          <Embers count={90} />

          <ContactShadows
            position={[0, -1.95, 0]}
            opacity={0.55}
            scale={8}
            blur={2.5}
            far={4}
            color="#000000"
          />

          {/* Lokales Environment (keine CDN-Fetches → CSP-sicher) */}
          <Environment resolution={64}>
            <Lightformer intensity={1.6} color="#ffd9a8" position={[2, 3, 2]} scale={[3, 3, 1]} />
            <Lightformer intensity={0.9} color="#ff5a1f" position={[-3, 0.5, 1]} scale={[2, 4, 1]} />
            <Lightformer intensity={0.5} color="#3a4a6a" position={[0, 1, -4]} scale={[6, 3, 1]} />
          </Environment>

          <MouseParallaxRig />

          {/* ChromaticAberration entfernt: kaum sichtbar, aber teurer
              Fullscreen-Pass → weniger GPU-Last (Lüfter/Spulenfiepen) */}
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.7}
              luminanceThreshold={0.45}
              luminanceSmoothing={0.85}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.2} darkness={0.85} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
