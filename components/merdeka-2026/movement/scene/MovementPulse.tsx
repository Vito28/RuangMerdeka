"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { mapMovementProgress } from "../animation/movement-progress";
import type { MovementSceneData } from "../data/movement-scene-data";
import type { MovementProgressRef } from "../types";

export function MovementPulse({ data, progressRef }: { data: MovementSceneData; progressRef: MovementProgressRef }) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.MeshBasicMaterial>(null);
  const haloRef = useRef<THREE.MeshBasicMaterial>(null);
  const point = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    if (!groupRef.current || !coreRef.current || !haloRef.current) return;
    const pulse = mapMovementProgress(progressRef.current, 0.9, 0.97);
    const route = data.routes[0].alignedPoints;
    const count = route.length / 3;
    const scaled = (0.42 + pulse * 0.58) * (count - 1);
    const current = Math.floor(scaled);
    const next = Math.min(count - 1, current + 1);
    const mix = scaled - current;
    point.set(
      THREE.MathUtils.lerp(route[current * 3], route[next * 3], mix),
      THREE.MathUtils.lerp(route[current * 3 + 1], route[next * 3 + 1], mix),
      THREE.MathUtils.lerp(route[current * 3 + 2], route[next * 3 + 2], mix),
    );
    groupRef.current.position.lerp(point, 1 - Math.exp(-delta * 16));
    const visible = mapMovementProgress(progressRef.current, 0.895, 0.91) * (1 - mapMovementProgress(progressRef.current, 0.985, 1));
    const scale = 0.8 + pulse * 4.2;
    groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, scale, 9, delta));
    coreRef.current.opacity = visible;
    haloRef.current.opacity = visible * 0.18;
  });

  return (
    <group ref={groupRef} renderOrder={8}>
      <mesh>
        <sphereGeometry args={[0.055, 14, 14]} />
        <meshBasicMaterial ref={coreRef} color="#ff2033" transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh scale={3.2}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshBasicMaterial ref={haloRef} color="#e70011" transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
