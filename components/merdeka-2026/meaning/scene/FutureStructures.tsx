"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mapMeaningProgress } from "../animation/meaning-progress";
import type { MeaningSceneData } from "../data/meaning-scene-data";
import type { MeaningProgressRef } from "../types";

type FutureStructuresProps = {
  data: MeaningSceneData;
  progressRef: MeaningProgressRef;
};

export function FutureStructures({ data, progressRef }: FutureStructuresProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const transformRef = useRef(new THREE.Object3D());
  const count = data.structureHeights.length;
  const ivory = useMemo(() => new THREE.Color("#f2efe9"), []);
  const paleRed = useMemo(() => new THREE.Color("#df7c84"), []);

  useEffect(() => {
    if (!meshRef.current) return;
    for (let index = 0; index < count; index += 1) {
      const kind = data.structureKinds[index];
      meshRef.current.setColorAt(index, kind === 1 || index % 4 !== 0 ? ivory : paleRed);
    }
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [count, data.structureKinds, ivory, paleRed]);

  useFrame((_, delta) => {
    if (!meshRef.current || !groupRef.current) return;
    const transform = transformRef.current;
    const progress = progressRef.current;
    const construction = mapMeaningProgress(progress, 0.76, 0.93);
    const structureFade = mapMeaningProgress(progress, 0.88, 0.94);
    const compression = mapMeaningProgress(progress, 0.97, 1);

    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;
      const baseX = data.structurePositions[offset];
      const delay = THREE.MathUtils.clamp((baseX + 3.6) / 7.2, 0, 1) * 0.72;
      const reveal = THREE.MathUtils.smoothstep(
        THREE.MathUtils.clamp((construction - delay) / 0.3, 0, 1),
        0,
        1,
      );
      const kind = data.structureKinds[index];
      const height = data.structureHeights[index];
      const baseY = data.structurePositions[offset + 1];
      const baseZ = data.structurePositions[offset + 2];

      transform.position.set(baseX, baseY + height * reveal * 0.5, baseZ);
      transform.rotation.set(0, 0, 0);

      if (kind === 0) {
        transform.scale.set(0.024, Math.max(0.001, height * reveal), 0.024);
      } else if (kind === 1) {
        transform.position.y = baseY;
        transform.position.x = baseX - (1 - reveal) * height * 0.5;
        transform.scale.set(Math.max(0.001, height * reveal), 0.022, 0.022);
      } else if (kind === 2) {
        transform.position.y = baseY;
        transform.position.x = baseX - (1 - reveal) * height * 0.5;
        transform.rotation.z = THREE.MathUtils.lerp(-0.18, 0.08, reveal);
        transform.scale.set(Math.max(0.001, height * reveal), 0.018, 0.018);
      }

      transform.updateMatrix();
      meshRef.current.setMatrixAt(index, transform.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (materialRef.current) {
      materialRef.current.opacity = THREE.MathUtils.damp(
        materialRef.current.opacity,
        construction * (1 - structureFade) * (1 - compression * 0.72) * 0.36,
        7,
        delta,
      );
    }

    groupRef.current.scale.y = THREE.MathUtils.damp(groupRef.current.scale.y, 1 - compression * 0.975, 7, delta);
    groupRef.current.scale.z = THREE.MathUtils.damp(groupRef.current.scale.z, 1 - compression * 0.92, 7, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, compression * 0.1, 7, delta);
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          ref={materialRef}
          vertexColors
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
}
