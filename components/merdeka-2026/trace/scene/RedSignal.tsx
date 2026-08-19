"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { mapTraceProgress, sampleTraceKeyframes } from "../animation/trace-phases";
import type { TraceProgressRef } from "../types";
import { getTraceCameraPosition } from "./TraceCameraRig";

const TRAIL_GEOMETRY = new THREE.PlaneGeometry(1, 1);
const DOT_GEOMETRY = new THREE.SphereGeometry(0.055, 14, 14);

const SIGNAL_VISIBILITY = [
  [0, 1], [0.14, 1], [0.18, 0], [0.255, 0], [0.28, 1],
  [0.72, 1], [0.75, 0], [0.84, 0], [0.865, 1], [1, 1],
] as const;

const SIGNAL_Y = [
  [0, -1.42], [0.28, -1.42], [0.38, -1.18], [0.47, -1.38],
  [0.56, 0.48], [0.625, -0.55], [0.69, 0.62], [0.75, 0.2],
  [0.9, -0.45], [1, 0],
] as const;

function getSignalSweep(progress: number) {
  const segments = [
    [0, 0.14], [0.26, 0.38], [0.35, 0.47], [0.43, 0.555],
    [0.515, 0.625], [0.585, 0.7], [0.84, 0.94],
  ] as const;
  const segment = segments.find(([start, end]) => progress >= start && progress <= end);
  if (!segment) return 0;
  return mapTraceProgress(progress, segment[0], segment[1], -3.45, 3.2);
}

export function RedSignal({ progressRef }: { progressRef: TraceProgressRef }) {
  const signalRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();
  const isMobile = size.width < 768;

  useFrame(() => {
    const signal = signalRef.current;
    const trail = trailRef.current;
    if (!signal || !trail) return;

    const progress = progressRef.current;
    const camera = getTraceCameraPosition(progress, isMobile);
    const visibility = sampleTraceKeyframes(progress, SIGNAL_VISIBILITY);
    const closing = mapTraceProgress(progress, 0.94, 0.998);
    const localX = THREE.MathUtils.lerp(getSignalSweep(progress), 0, closing);
    const localY = THREE.MathUtils.lerp(sampleTraceKeyframes(progress, SIGNAL_Y), 0, closing);
    const depth = closing > 0 ? THREE.MathUtils.lerp(3.15, 2.6, closing) : 3.15;
    const trailLength = THREE.MathUtils.lerp(isMobile ? 0.85 : 1.25, 0.02, closing);
    const material = trail.material as THREE.MeshBasicMaterial;

    signal.visible = visibility > 0.002;
    trail.visible = visibility > 0.002 && closing < 0.96;
    signal.position.set(camera.x + localX, camera.y + localY, camera.z - depth);
    signal.scale.setScalar(THREE.MathUtils.lerp(1, 1.9, closing));
    trail.position.set(signal.position.x - trailLength * 0.52, signal.position.y, signal.position.z - 0.01);
    trail.scale.set(trailLength, 0.016, 1);
    material.opacity = visibility * THREE.MathUtils.lerp(0.62, 0, closing);
  });

  return (
    <group>
      <mesh ref={trailRef} geometry={TRAIL_GEOMETRY} renderOrder={8}>
        <meshBasicMaterial
          color="#e70011"
          transparent
          opacity={0.62}
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={signalRef} geometry={DOT_GEOMETRY} renderOrder={9}>
        <meshBasicMaterial color="#ff1028" depthTest={false} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}
