"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useDevicePerformance } from "../../hero/hooks/use-device-performance";
import { MEANING_CONFIG, MEANING_PHASES, meaningPhaseStrength } from "../animation/meaning-progress";
import { createMeaningSceneData } from "../data/meaning-scene-data";
import type { MeaningCanvasProps, MeaningProgressRef } from "../types";
import { ConnectionNetwork } from "./ConnectionNetwork";
import { GrowthForms } from "./GrowthForms";
import { MeaningParticles } from "./MeaningParticles";

function MeaningCamera({ progressRef }: { progressRef: MeaningProgressRef }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { size } = useThree();
  const isMobile = size.width < 768;

  useFrame((_, delta) => {
    if (!cameraRef.current) return;
    const progress = progressRef.current;
    const sovereign = meaningPhaseStrength(progress, MEANING_PHASES.sovereign);
    const justice = meaningPhaseStrength(progress, MEANING_PHASES.justice);
    const prosperity = meaningPhaseStrength(progress, MEANING_PHASES.prosperity);
    const movingForward = Math.max(0, (progress - MEANING_PHASES.movingForward[0]) / 0.16);
    const baseZ = isMobile ? 8 : 7.7;
    const targetZ = baseZ - sovereign * 0.28 + justice * 0.2 - prosperity * 0.12 + movingForward * 0.32;
    cameraRef.current.position.z = THREE.MathUtils.damp(cameraRef.current.position.z, targetZ, 5, delta);
    cameraRef.current.position.y = THREE.MathUtils.damp(
      cameraRef.current.position.y,
      prosperity * 0.06,
      5,
      delta,
    );
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, isMobile ? 8 : 7.7]} fov={42} near={0.1} far={30} />;
}

function MeaningScene({ progressRef }: Pick<MeaningCanvasProps, "progressRef">) {
  const groupRef = useRef<THREE.Group>(null);
  const tier = useDevicePerformance();
  const { size } = useThree();
  const isMobile = size.width < 768;
  const data = useMemo(
    () =>
      createMeaningSceneData(
        MEANING_CONFIG.particles[tier],
        MEANING_CONFIG.nodes[tier],
        MEANING_CONFIG.growthForms[tier],
      ),
    [tier],
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const prosperity = meaningPhaseStrength(progressRef.current, MEANING_PHASES.prosperity);
    const movingForward = Math.max(0, (progressRef.current - MEANING_PHASES.movingForward[0]) / 0.16);
    const targetScale = isMobile ? 0.315 : size.width < 1024 ? 0.67 : 0.88;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.damp(groupRef.current.scale.x, targetScale * (1 + movingForward * 0.025), 6, delta),
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, prosperity * 0.075, 5, delta);
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, prosperity * 0.018, 5, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      isMobile ? 0.02 : -0.04,
      6,
      delta,
    );
  });

  return (
    <>
      <MeaningCamera progressRef={progressRef} />
      <group ref={groupRef}>
        <MeaningParticles
          data={data}
          pixelRatio={MEANING_CONFIG.dpr[tier]}
          progressRef={progressRef}
        />
        <ConnectionNetwork data={data} progressRef={progressRef} />
        <GrowthForms data={data} progressRef={progressRef} />
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
      camera={{ position: [0, 0, 7.7], fov: 42, near: 0.1, far: 30 }}
      gl={{ alpha: true, antialias: tier !== "low", powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor("#050505", 1)}
    >
      <MeaningScene progressRef={progressRef} />
    </Canvas>
  );
}
