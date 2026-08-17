"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { HERO_CONFIG, mapProgress } from "../animation/hero-progress";
import { useDevicePerformance } from "../hooks/use-device-performance";
import { useReducedMotion } from "../hooks/use-reduced-motion";
import type { HeroProgressRef, PerformanceTier, PointerRef } from "../types";
import { AmbientParticles } from "./AmbientParticles";
import { IndonesiaParticles } from "./IndonesiaParticles";

type HeroCanvasProps = {
  active: boolean;
  progressRef: HeroProgressRef;
  pointerRef: PointerRef;
};

function SceneRoot({
  progressRef,
  pointerRef,
  tier,
  reducedMotion,
}: Pick<HeroCanvasProps, "progressRef" | "pointerRef"> & {
  tier: PerformanceTier;
  reducedMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { size } = useThree();
  const isMobile = size.width < 768;
  const particleCount = HERO_CONFIG.particles[tier];
  const ambientCount = HERO_CONFIG.ambientParticles[tier];
  const pixelRatio = HERO_CONFIG.dpr[tier];

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const progress = reducedMotion ? 0.3 : progressRef.current;
    const baseScale = isMobile ? 0.33 : size.width < 1024 ? 0.68 : 1;
    const narrativeScale = mapProgress(progress, 0.34, 0.66, 0, isMobile ? 0.025 : 0.07);
    const exitScale = mapProgress(progress, 0.93, 1, 0, isMobile ? 0.035 : 0.12);
    const targetScale = baseScale * (1 + narrativeScale + exitScale);
    const pointerEnabled = !reducedMotion && !isMobile && tier !== "low";
    const targetRotationX = pointerEnabled ? pointerRef.current.y * 0.035 : 0;
    const targetRotationY = pointerEnabled ? pointerRef.current.x * 0.052 : 0;

    groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 6, delta));
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotationX, 5, delta);
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotationY, 5, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, isMobile ? 0.22 : 0, 6, delta);

  });

  return (
    <>
      <HeroCamera progressRef={progressRef} reducedMotion={reducedMotion} />
      <AmbientParticles count={ambientCount} reducedMotion={reducedMotion} />
      <group ref={groupRef}>
        <IndonesiaParticles
          count={particleCount}
          progressRef={progressRef}
          reducedMotion={reducedMotion}
          pixelRatio={pixelRatio}
        />
      </group>
    </>
  );
}

function HeroCamera({ progressRef, reducedMotion }: Pick<HeroCanvasProps, "progressRef"> & { reducedMotion: boolean }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { size } = useThree();
  const isMobile = size.width < 768;

  useFrame((_, delta) => {
    if (!cameraRef.current) return;
    const progress = reducedMotion ? 0.3 : progressRef.current;
    const cameraStart = isMobile ? 7.8 : 7.4;
    const cameraPush = isMobile ? progress * 0.25 : progress * 0.85;
    const exitPush = mapProgress(progress, 0.93, 1, 0, isMobile ? 0.15 : 0.65);
    cameraRef.current.position.z = THREE.MathUtils.damp(
      cameraRef.current.position.z,
      cameraStart - cameraPush - exitPush,
      6,
      delta,
    );
    cameraRef.current.position.y = THREE.MathUtils.damp(
      cameraRef.current.position.y,
      isMobile ? 0.05 : progress * 0.07,
      6,
      delta,
    );
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, isMobile ? 7.8 : 7.4]} fov={42} near={0.1} far={30} />;
}

export default function HeroCanvas({ active, progressRef, pointerRef }: HeroCanvasProps) {
  const tier = useDevicePerformance();
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={HERO_CONFIG.dpr[tier]}
      camera={{ position: [0, 0, 7.4], fov: 42, near: 0.1, far: 30 }}
      gl={{ alpha: true, antialias: tier !== "low", powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor("#050505", 1)}
    >
      <SceneRoot
        progressRef={progressRef}
        pointerRef={pointerRef}
        tier={tier}
        reducedMotion={reducedMotion}
      />
    </Canvas>
  );
}
