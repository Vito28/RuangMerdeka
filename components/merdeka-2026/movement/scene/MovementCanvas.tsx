"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useDevicePerformance } from "../../hero/hooks/use-device-performance";
import { MOVEMENT_CONFIG, mapMovementProgress } from "../animation/movement-progress";
import { createMovementSceneData } from "../data/movement-scene-data";
import type { MovementCanvasProps, MovementProgressRef } from "../types";
import { MovementAtmosphere } from "./MovementAtmosphere";
import { MovementParticles } from "./MovementParticles";
import { MovementTrails } from "./MovementTrails";

function MovementCamera({ progressRef }: { progressRef: MovementProgressRef }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { size } = useThree();
  const isMobile = size.width < 768;

  useFrame((_, delta) => {
    if (!cameraRef.current) return;
    const progress = progressRef.current;
    const pullBack = mapMovementProgress(progress, 0.03, 0.4, 0, isMobile ? 0.28 : 0.62);
    const momentum = mapMovementProgress(progress, 0.58, 0.78, 0, 1) * (1 - mapMovementProgress(progress, 0.8, 0.9));
    const closingPush = mapMovementProgress(progress, 0.9, 1, 0, isMobile ? 0.18 : 0.4);
    const startZ = isMobile ? 7.9 : 7.55;
    cameraRef.current.position.z = THREE.MathUtils.damp(cameraRef.current.position.z, startZ + pullBack - closingPush, 5, delta);
    cameraRef.current.position.x = THREE.MathUtils.damp(cameraRef.current.position.x, momentum * (isMobile ? 0.025 : 0.09), 5, delta);
    cameraRef.current.position.y = THREE.MathUtils.damp(cameraRef.current.position.y, momentum * 0.035, 5, delta);
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, isMobile ? 7.9 : 7.55]} fov={42} near={0.1} far={30} />;
}

function MovementScene({ progressRef }: Pick<MovementCanvasProps, "progressRef">) {
  const groupRef = useRef<THREE.Group>(null);
  const tier = useDevicePerformance();
  const { size } = useThree();
  const isMobile = size.width < 768;
  const data = useMemo(
    () => createMovementSceneData(
      MOVEMENT_CONFIG.particles[tier],
      MOVEMENT_CONFIG.trails[tier],
      MOVEMENT_CONFIG.ambient[tier],
    ),
    [tier],
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const progress = progressRef.current;
    const values = mapMovementProgress(progress, 0.42, 0.56);
    const together = mapMovementProgress(progress, 0.78, 0.87);
    const closing = mapMovementProgress(progress, 0.9, 1);
    const baseScale = isMobile ? 0.315 : size.width < 1024 ? 0.65 : 0.84;
    const targetScale = baseScale * (1 - values * 0.025 + together * 0.045 + closing * 0.025);
    const openingX = isMobile ? 0 : 0.95;
    const targetX = THREE.MathUtils.lerp(THREE.MathUtils.lerp(openingX, 0, values), isMobile ? 0 : 0.82, closing);
    const targetY = isMobile ? 0.22 : THREE.MathUtils.lerp(-0.02, 0.38, closing);
    const momentum = mapMovementProgress(progress, 0.67, 0.78) * (1 - together);

    groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 6, delta));
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 5, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 5, delta);
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, momentum * 0.025, 5, delta);
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, momentum * 0.018, 5, delta);
  });

  return (
    <>
      <MovementCamera progressRef={progressRef} />
      <MovementAtmosphere data={data} pixelRatio={MOVEMENT_CONFIG.dpr[tier]} progressRef={progressRef} />
      <group ref={groupRef}>
        <MovementParticles data={data} pixelRatio={MOVEMENT_CONFIG.dpr[tier]} progressRef={progressRef} />
        <MovementTrails data={data} pixelRatio={MOVEMENT_CONFIG.dpr[tier]} progressRef={progressRef} />
      </group>
    </>
  );
}

export default function MovementCanvas({ active, progressRef }: MovementCanvasProps) {
  const tier = useDevicePerformance();

  return (
    <Canvas
      aria-hidden="true"
      frameloop={active ? "always" : "never"}
      dpr={MOVEMENT_CONFIG.dpr[tier]}
      camera={{ position: [0, 0, 7.55], fov: 42, near: 0.1, far: 30 }}
      gl={{ alpha: true, antialias: tier !== "low", powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor("#050505", 1)}
    >
      <MovementScene progressRef={progressRef} />
    </Canvas>
  );
}
