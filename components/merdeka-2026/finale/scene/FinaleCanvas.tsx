"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useDevicePerformance } from "../../hero/hooks/use-device-performance";
import { FINALE_CONFIG, mapFinaleProgress } from "../animation/finale-progress";
import type { FinaleCanvasProps, FinaleProgressRef } from "../types";
import { FlagCloth } from "./FlagCloth";

function FinaleCamera({ progressRef, reducedMotion }: { progressRef: FinaleProgressRef; reducedMotion: boolean }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { size } = useThree();
  const isMobile = size.width < 768;

  useFrame((_, delta) => {
    if (!cameraRef.current) return;
    const progress = reducedMotion ? 0.76 : progressRef.current;
    const reveal = mapFinaleProgress(progress, 0.08, 0.52);
    const settle = mapFinaleProgress(progress, 0.82, 1);
    const startZ = isMobile ? 5.25 : 4.4;
    const finalZ = isMobile ? 7.7 : 7.15;
    const targetZ = THREE.MathUtils.lerp(startZ, finalZ, reveal);
    const targetX = isMobile ? 0 : settle * 0.08;

    cameraRef.current.position.z = THREE.MathUtils.damp(cameraRef.current.position.z, targetZ, 5, delta);
    cameraRef.current.position.x = THREE.MathUtils.damp(cameraRef.current.position.x, targetX, 4, delta);
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 0, isMobile ? 5.25 : 4.4]}
      fov={43}
      near={0.1}
      far={20}
    />
  );
}

function FinaleScene({ progressRef, reducedMotion }: Pick<FinaleCanvasProps, "progressRef" | "reducedMotion">) {
  return (
    <>
      <FinaleCamera progressRef={progressRef} reducedMotion={Boolean(reducedMotion)} />
      <FlagCloth progressRef={progressRef} reducedMotion={Boolean(reducedMotion)} />
    </>
  );
}

export default function FinaleCanvas({ active, progressRef, reducedMotion = false }: FinaleCanvasProps) {
  const tier = useDevicePerformance();

  return (
    <Canvas
      aria-hidden="true"
      frameloop={active ? "always" : "never"}
      dpr={FINALE_CONFIG.dpr[tier]}
      camera={{ position: [0, 0, 5], fov: 43, near: 0.1, far: 20 }}
      gl={{ alpha: true, antialias: tier !== "low", powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor("#050505", 0)}
    >
      <FinaleScene progressRef={progressRef} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
