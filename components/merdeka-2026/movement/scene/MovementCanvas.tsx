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
import { MovementPulse } from "./MovementPulse";
import { MovementTrails } from "./MovementTrails";
import { TransitionLine } from "./TransitionLine";

function MovementCamera({ progressRef }: { progressRef: MovementProgressRef }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);
  const { size } = useThree();
  const isMobile = size.width < 768;

  useFrame((state, delta) => {
    const camera = cameraRef.current;
    if (!camera) return;
    const progress = progressRef.current;
    const openingPush = mapMovementProgress(progress, 0.12, 0.3);
    const wideReveal = mapMovementProgress(progress, 0.3, 0.48);
    const people = mapMovementProgress(progress, 0.48, 0.72);
    const together = mapMovementProgress(progress, 0.8, 0.9);
    const pulse = mapMovementProgress(progress, 0.9, 0.97);
    const pointerWeight = isMobile ? 0 : 0.11 * (1 - people) * (1 - together);
    const openingZ = THREE.MathUtils.lerp(isMobile ? 7.6 : 6.7, isMobile ? 6.8 : 4.8, openingPush);
    const peopleZ = THREE.MathUtils.lerp(openingZ + wideReveal * 0.5, -9.3, people);
    const targetZ = THREE.MathUtils.lerp(peopleZ, -17.4, pulse);
    const followX = people > 0 && people < 1 ? Math.sin(people * Math.PI * 5) * (isMobile ? 0.1 : 0.28) : 0;
    const targetX = followX + state.pointer.x * pointerWeight;
    const targetY = (isMobile ? 0.08 : 0.12) + Math.sin(people * Math.PI * 3) * 0.06 + state.pointer.y * pointerWeight * 0.45;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 6, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 6, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 6, delta);
    camera.fov = THREE.MathUtils.damp(camera.fov, (isMobile ? 47 : 42) + together * 12 + pulse * 3, 6, delta);
    camera.updateProjectionMatrix();

    lookTarget.set(
      camera.position.x * 0.3,
      camera.position.y * 0.22,
      camera.position.z - THREE.MathUtils.lerp(5.6, 8.5, together + pulse * 0.35),
    );
    camera.lookAt(lookTarget);
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, isMobile ? 0.08 : 0.12, isMobile ? 7.6 : 6.7]}
      fov={isMobile ? 47 : 42}
      near={0.08}
      far={55}
    />
  );
}

function MovementScene({ progressRef }: Pick<MovementCanvasProps, "progressRef">) {
  const tier = useDevicePerformance();
  const data = useMemo(
    () => createMovementSceneData(
      MOVEMENT_CONFIG.majorPaths[tier],
      MOVEMENT_CONFIG.secondaryPaths[tier],
      MOVEMENT_CONFIG.signals[tier],
      MOVEMENT_CONFIG.dust[tier],
    ),
    [tier],
  );

  return (
    <>
      <MovementCamera progressRef={progressRef} />
      <MovementAtmosphere data={data} pixelRatio={MOVEMENT_CONFIG.dpr[tier]} progressRef={progressRef} />
      <TransitionLine data={data} progressRef={progressRef} />
      <MovementTrails
        data={data}
        pixelRatio={MOVEMENT_CONFIG.dpr[tier]}
        progressRef={progressRef}
        tracerCount={MOVEMENT_CONFIG.tracers[tier]}
      />
      <MovementPulse data={data} pixelRatio={MOVEMENT_CONFIG.dpr[tier]} progressRef={progressRef} />
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
      camera={{ position: [0, 0.12, 6.7], fov: 42, near: 0.08, far: 55 }}
      gl={{ alpha: true, antialias: tier !== "low", powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor("#050505", 1)}
    >
      <MovementScene progressRef={progressRef} />
    </Canvas>
  );
}
