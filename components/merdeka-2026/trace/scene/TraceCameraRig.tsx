"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { sampleTraceKeyframes, type TraceKeyframe } from "../animation/trace-phases";
import type { TraceProgressRef } from "../types";

const CAMERA_X: readonly TraceKeyframe[] = [
  [0, 0], [0.24, 0.15], [0.32, -0.35], [0.47, 0.2], [0.55, 0.8],
  [0.585, -0.2], [0.625, 0.7], [0.675, 1.2], [0.715, 10], [0.775, 10.2], [1, 10.2],
];

const CAMERA_Y: readonly TraceKeyframe[] = [
  [0, 0.04], [0.35, 0.08], [0.44, -0.25], [0.55, 0.1], [0.625, 0],
  [0.715, 0.16], [0.835, 0.04], [1, 0],
];

const CAMERA_Z: readonly TraceKeyframe[] = [
  [0, 7], [0.1, 6], [0.18, 4.5], [0.28, 0.7], [0.32, -2.1],
  [0.39, -7], [0.47, -12], [0.55, -16.8], [0.625, -21], [0.675, -24],
  [0.715, -38], [0.775, -41.2], [0.835, -46], [0.9, -49.8], [1, -50.4],
];

export function getTraceCameraPosition(progress: number, isMobile: boolean) {
  const xScale = isMobile ? 0.58 : 1;
  return {
    x: sampleTraceKeyframes(progress, CAMERA_X) * xScale,
    y: sampleTraceKeyframes(progress, CAMERA_Y),
    z: sampleTraceKeyframes(progress, CAMERA_Z),
  };
}

export function getTraceWorldX(x: number, isMobile: boolean) {
  return x * (isMobile ? 0.58 : 1);
}

export function TraceCameraRig({ progressRef }: { progressRef: TraceProgressRef }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);
  const { size } = useThree();
  const isMobile = size.width < 768;

  useFrame((_, delta) => {
    const camera = cameraRef.current;
    if (!camera) return;

    const progress = progressRef.current;
    const target = getTraceCameraPosition(progress, isMobile);
    const quietFocus = sampleTraceKeyframes(progress, [[0.74, 0], [0.78, 1], [0.835, 1], [0.87, 0]]);
    const finalePullback = sampleTraceKeyframes(progress, [[0.91, 0], [1, 1]]);

    camera.position.x = THREE.MathUtils.damp(camera.position.x, target.x, 6.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, target.y, 6.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, target.z, 6.5, delta);
    camera.rotation.z = THREE.MathUtils.damp(
      camera.rotation.z,
      isMobile ? 0 : Math.sin(progress * Math.PI * 3) * 0.006 * (1 - quietFocus),
      6,
      delta,
    );
    camera.fov = THREE.MathUtils.damp(
      camera.fov,
      (isMobile ? 50 : 43) - quietFocus * 1.5 + finalePullback * 2.5,
      6,
      delta,
    );
    camera.updateProjectionMatrix();

    lookTarget.set(
      camera.position.x + (isMobile ? 0 : 0.08),
      camera.position.y * 0.08,
      camera.position.z - 6,
    );
    camera.lookAt(lookTarget);
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 0.04, 7]}
      fov={isMobile ? 50 : 43}
      near={0.1}
      far={85}
    />
  );
}
