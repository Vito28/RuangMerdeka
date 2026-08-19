"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { easeInOut, mapRange } from "./field-utils";

type CollectiveCameraRigProps = {
  progressRef: MutableRefObject<number>;
  active: boolean;
};

export function CollectiveCameraRig({ progressRef, active }: CollectiveCameraRigProps) {
  const camera = useThree((state) => state.camera);
  const targetPosition = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());
  const elapsedRef = useRef(0);

  useFrame((_, delta) => {
    if (!active) return;
    elapsedRef.current += Math.min(delta, 0.05);
    const progress = progressRef.current;
    const landscape = easeInOut(mapRange(progress, 0.36, 0.62));
    const philosophy = easeInOut(mapRange(progress, 0.62, 0.76));
    const horizon = easeInOut(mapRange(progress, 0.9, 1));
    const lateral = Math.sin(elapsedRef.current * 0.12) * 0.08 * (1 - horizon);

    targetPosition.current.set(
      lateral + THREE.MathUtils.lerp(-0.24, 0.18, philosophy),
      THREE.MathUtils.lerp(0.15, 2.35, landscape) + horizon * 2.8,
      THREE.MathUtils.lerp(7.2, 10.4, landscape) + horizon * 9.2,
    );
    camera.position.lerp(targetPosition.current, 1 - Math.exp(-delta * 3.8));
    lookTarget.current.set(0, THREE.MathUtils.lerp(-0.35, -1.25, landscape) + horizon * 0.72, -horizon * 2.2);
    camera.lookAt(lookTarget.current);
  });

  return null;
}
