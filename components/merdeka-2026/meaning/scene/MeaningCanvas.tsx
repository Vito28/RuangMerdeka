"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useDevicePerformance } from "../../hero/hooks/use-device-performance";
import { MEANING_CONFIG, mapMeaningProgress } from "../animation/meaning-progress";
import { createMeaningSceneData } from "../data/meaning-scene-data";
import type { MeaningCanvasProps, MeaningProgressRef } from "../types";
import { FlowRibbons } from "./FlowRibbons";
import { FutureStructures } from "./FutureStructures";
import { LightTrails } from "./LightTrails";
import { MeaningParticles } from "./MeaningParticles";
import { PulseNetwork } from "./PulseNetwork";

function MeaningCamera({ progressRef }: { progressRef: MeaningProgressRef }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const targetRef = useRef(new THREE.Vector3());
  const { size } = useThree();
  const isMobile = size.width < 768;

  useFrame(({ pointer }, delta) => {
    if (!cameraRef.current) return;
    const progress = progressRef.current;
    const alive = mapMeaningProgress(progress, 0, 0.1);
    const feather = mapMeaningProgress(progress, 0.1, 0.26);
    const direction = mapMeaningProgress(progress, 0.26, 0.6);
    const creation = mapMeaningProgress(progress, 0.6, 0.78);
    const framework = mapMeaningProgress(progress, 0.78, 0.91);
    const pulse = mapMeaningProgress(progress, 0.91, 0.97);
    const exit = mapMeaningProgress(progress, 0.97, 1);

    const startZ = isMobile ? 8.8 : 8;
    let targetZ = THREE.MathUtils.lerp(startZ, isMobile ? 8.4 : 7.65, alive);
    targetZ = THREE.MathUtils.lerp(targetZ, isMobile ? 5.2 : 3.8, feather);
    targetZ = THREE.MathUtils.lerp(targetZ, isMobile ? 6.1 : 4.75, direction);
    targetZ = THREE.MathUtils.lerp(targetZ, isMobile ? 6.9 : 5.55, creation);
    targetZ = THREE.MathUtils.lerp(targetZ, isMobile ? 8.1 : 6.85, framework);
    targetZ = THREE.MathUtils.lerp(targetZ, isMobile ? 9.3 : 8.35, pulse);
    targetZ = THREE.MathUtils.lerp(targetZ, isMobile ? 11 : 10.5, exit);

    let targetX = THREE.MathUtils.lerp(0, isMobile ? 0 : -0.34, direction);
    targetX = THREE.MathUtils.lerp(targetX, isMobile ? 0 : 0.46, creation);
    targetX = THREE.MathUtils.lerp(targetX, isMobile ? 0 : 0.18, framework);
    targetX = THREE.MathUtils.lerp(targetX, 0, pulse);
    targetX += isMobile ? 0 : pointer.x * 0.06;

    let targetY = THREE.MathUtils.lerp(0, isMobile ? -0.04 : -0.16, feather);
    targetY = THREE.MathUtils.lerp(targetY, 0.04, direction);
    targetY = THREE.MathUtils.lerp(targetY, 0.13, creation);
    targetY = THREE.MathUtils.lerp(targetY, 0.04, framework);
    targetY += isMobile ? 0 : pointer.y * 0.035;

    cameraRef.current.position.x = THREE.MathUtils.damp(cameraRef.current.position.x, targetX, 4.5, delta);
    cameraRef.current.position.y = THREE.MathUtils.damp(cameraRef.current.position.y, targetY, 4.5, delta);
    cameraRef.current.position.z = THREE.MathUtils.damp(cameraRef.current.position.z, targetZ, 4.5, delta);
    let targetFov = THREE.MathUtils.lerp(isMobile ? 46 : 42, isMobile ? 50 : 49, feather);
    targetFov = THREE.MathUtils.lerp(targetFov, isMobile ? 48 : 47, direction);
    targetFov = THREE.MathUtils.lerp(targetFov, isMobile ? 46 : 45, creation);
    targetFov = THREE.MathUtils.lerp(targetFov, isMobile ? 45 : 44, framework);
    cameraRef.current.fov = THREE.MathUtils.damp(cameraRef.current.fov, targetFov, 4, delta);
    cameraRef.current.updateProjectionMatrix();

    targetRef.current.x = THREE.MathUtils.damp(targetRef.current.x, targetX * 0.22, 4, delta);
    targetRef.current.y = THREE.MathUtils.damp(targetRef.current.y, creation * 0.08, 4, delta);
    targetRef.current.z = THREE.MathUtils.damp(targetRef.current.z, -direction * 0.12, 4, delta);
    cameraRef.current.lookAt(targetRef.current);
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 0, isMobile ? 8.8 : 8]}
      fov={isMobile ? 46 : 42}
      near={0.1}
      far={40}
    />
  );
}

function MeaningScene({ progressRef }: Pick<MeaningCanvasProps, "progressRef">) {
  const particleGroupRef = useRef<THREE.Group>(null);
  const spatialGroupRef = useRef<THREE.Group>(null);
  const tier = useDevicePerformance();
  const { size } = useThree();
  const isMobile = size.width < 768;
  const data = useMemo(
    () => createMeaningSceneData(MEANING_CONFIG.particles[tier], MEANING_CONFIG.structures[tier]),
    [tier],
  );

  useFrame((_, delta) => {
    const progress = progressRef.current;
    const alive = mapMeaningProgress(progress, 0, 0.1);
    const feather = mapMeaningProgress(progress, 0.1, 0.28);
    const exit = mapMeaningProgress(progress, 0.97, 1);

    if (particleGroupRef.current) {
      const openingScale = isMobile ? 0.31 : size.width < 1024 ? 0.62 : 0.78;
      const wingScale = isMobile ? 0.58 : size.width < 1024 ? 0.78 : 0.94;
      const targetScale = THREE.MathUtils.lerp(openingScale, wingScale, feather);
      const nextScale = THREE.MathUtils.damp(
        particleGroupRef.current.scale.x,
        targetScale * (1 + alive * (1 - feather) * 0.025),
        5,
        delta,
      );
      particleGroupRef.current.scale.setScalar(nextScale);
      particleGroupRef.current.rotation.y = THREE.MathUtils.damp(
        particleGroupRef.current.rotation.y,
        alive * (1 - feather) * -0.018,
        4,
        delta,
      );
    }

    if (spatialGroupRef.current) {
      const targetScale = (isMobile ? 0.7 : 1) * (1 - exit * 0.18);
      const nextScale = THREE.MathUtils.damp(spatialGroupRef.current.scale.x, targetScale, 5, delta);
      spatialGroupRef.current.scale.setScalar(nextScale);
      spatialGroupRef.current.rotation.y = THREE.MathUtils.damp(
        spatialGroupRef.current.rotation.y,
        Math.sin(progress * Math.PI) * 0.035,
        4,
        delta,
      );
    }
  });

  return (
    <>
      <MeaningCamera progressRef={progressRef} />
      <group ref={particleGroupRef}>
        <MeaningParticles data={data} pixelRatio={MEANING_CONFIG.dpr[tier]} progressRef={progressRef} />
      </group>
      <group ref={spatialGroupRef}>
        <LightTrails count={MEANING_CONFIG.trails[tier]} progressRef={progressRef} />
        <FlowRibbons count={MEANING_CONFIG.ribbons[tier]} progressRef={progressRef} />
        <FutureStructures data={data} progressRef={progressRef} />
        <PulseNetwork data={data} progressRef={progressRef} />
      </group>
    </>
  );
}

export default function MeaningCanvas({ active, progressRef }: MeaningCanvasProps) {
  const tier = useDevicePerformance();

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={MEANING_CONFIG.dpr[tier]}
      camera={{ position: [0, 0, 8], fov: 42, near: 0.1, far: 40 }}
      gl={{ alpha: true, antialias: tier !== "low", powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor("#050505", 1)}
    >
      <MeaningScene progressRef={progressRef} />
    </Canvas>
  );
}
