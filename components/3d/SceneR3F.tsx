'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import DoenerSpit from './DoenerSpit';
import SteamParticles from './SteamParticles';
import FloatingIngredients from './FloatingIngredients';

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

export default function SceneR3F() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.6, 5.2], fov: 42 }}
        dpr={[1, 2]}
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
            <DoenerSpit scale={1.05} />
          </Float>

          <SteamParticles count={70} origin={[0, 1.3, 0]} />
          <FloatingIngredients />

          <ContactShadows
            position={[0, -1.95, 0]}
            opacity={0.55}
            scale={8}
            blur={2.5}
            far={4}
            color="#000000"
          />

          <Environment preset="night" />

          <MouseParallaxRig />

          <EffectComposer multisampling={0}>
            <Bloom
              intensity={1.1}
              luminanceThreshold={0.25}
              luminanceSmoothing={0.85}
              mipmapBlur
            />
            <ChromaticAberration
              offset={new THREE.Vector2(0.0006, 0.0009)}
              blendFunction={BlendFunction.NORMAL}
              radialModulation={false}
              modulationOffset={0}
            />
            <Vignette eskil={false} offset={0.2} darkness={0.85} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
