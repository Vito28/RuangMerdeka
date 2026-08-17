"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { MEANING_PHASES, meaningPhaseStrength } from "../animation/meaning-progress";
import type { MeaningSceneData } from "../data/meaning-scene-data";
import type { MeaningProgressRef } from "../types";

type ConnectionNetworkProps = {
  data: MeaningSceneData;
  progressRef: MeaningProgressRef;
};

export function ConnectionNetwork({ data, progressRef }: ConnectionNetworkProps) {
  const lineMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  const nodesMaterialRef = useRef<THREE.PointsMaterial>(null);

  useFrame((_, delta) => {
    const sovereign = meaningPhaseStrength(progressRef.current, MEANING_PHASES.sovereign);
    const justice = meaningPhaseStrength(progressRef.current, MEANING_PHASES.justice);

    if (lineMaterialRef.current) {
      lineMaterialRef.current.opacity = THREE.MathUtils.damp(
        lineMaterialRef.current.opacity,
        sovereign * 0.42 + justice * 0.17,
        8,
        delta,
      );
    }

    if (nodesMaterialRef.current) {
      nodesMaterialRef.current.opacity = THREE.MathUtils.damp(
        nodesMaterialRef.current.opacity,
        sovereign * 0.62 + justice * 0.95,
        8,
        delta,
      );
      nodesMaterialRef.current.size = THREE.MathUtils.damp(
        nodesMaterialRef.current.size,
        justice > sovereign ? 0.052 : 0.038,
        7,
        delta,
      );
    }
  });

  return (
    <group>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.connectionPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial ref={lineMaterialRef} color="#f4f1ea" transparent opacity={0} depthWrite={false} />
      </lineSegments>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.nodePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[data.nodeColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={nodesMaterialRef}
          vertexColors
          size={0.038}
          sizeAttenuation
          transparent
          opacity={0}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
