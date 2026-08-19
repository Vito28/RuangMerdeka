"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { MutableRefObject } from "react";

export function FinaleJourneyCamera({ progressRef, active }: { progressRef: MutableRefObject<number>; active: boolean }) {
  const { camera, size } = useThree();
  const targetPosition = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (!active) return;
    const progress = progressRef.current;
    let targetZ = 8.2;
    if (progress >= 0.4 && progress < 0.62) targetZ = THREE.MathUtils.lerp(8, 5.4, (progress - 0.4) / 0.22);
    else if (progress >= 0.62 && progress < 0.71) targetZ = THREE.MathUtils.lerp(5.4, 8.2, (progress - 0.62) / 0.09);
    else if (progress >= 0.71 && progress < 0.89) targetZ = THREE.MathUtils.lerp(8.2, 9.1, (progress - 0.71) / 0.18);
    else if (progress >= 0.89) targetZ = THREE.MathUtils.lerp(9.1, 10.8, Math.min(1, (progress - 0.89) / 0.1));

    const aspect = size.width / Math.max(1, size.height);
    if (progress >= 0.62 && aspect < 1) targetZ *= aspect < 0.72 ? 2 : 1.55;

    targetPosition.current.set(
      progress > 0.5 && progress < 0.7 ? 0.22 : 0,
      progress > 0.88 ? 0.32 : 0,
      targetZ,
    );
    camera.position.lerp(targetPosition.current, 1 - Math.exp(-delta * 5.5));
    lookTarget.current.set(0, 0, 0);
    camera.lookAt(lookTarget.current);
  });

  return null;
}
