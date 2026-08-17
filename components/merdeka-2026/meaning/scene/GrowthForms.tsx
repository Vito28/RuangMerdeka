"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { MEANING_PHASES, meaningPhaseStrength } from "../animation/meaning-progress";
import type { MeaningSceneData } from "../data/meaning-scene-data";
import type { MeaningProgressRef } from "../types";

type GrowthFormsProps = {
  data: MeaningSceneData;
  progressRef: MeaningProgressRef;
};

export function GrowthForms({ data, progressRef }: GrowthFormsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const transform = useMemo(() => new THREE.Object3D(), []);
  const count = data.growthHeights.length;

  useFrame((_, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    const strength = meaningPhaseStrength(progressRef.current, MEANING_PHASES.prosperity, 0.055);
    materialRef.current.opacity = THREE.MathUtils.damp(
      materialRef.current.opacity,
      strength * 0.58,
      7,
      delta,
    );

    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;
      const height = Math.max(0.001, data.growthHeights[index] * strength);
      transform.position.set(
        data.growthPositions[offset],
        data.growthPositions[offset + 1] + height * 0.5,
        data.growthPositions[offset + 2] + strength * 0.08,
      );
      transform.scale.set(1, height, 1);
      transform.updateMatrix();
      meshRef.current.setMatrixAt(index, transform.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[0.026, 1, 0.026]} />
      <meshBasicMaterial ref={materialRef} color="#e70011" transparent opacity={0} depthWrite={false} />
    </instancedMesh>
  );
}
