"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type AmbientParticlesProps = {
  count: number;
  reducedMotion: boolean;
};

function createAmbientPositions(count: number) {
  let seed = 810026;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;
    positions[offset] = (random() - 0.5) * 12;
    positions[offset + 1] = (random() - 0.5) * 7;
    positions[offset + 2] = -1.5 - random() * 5;
  }

  return positions;
}

export function AmbientParticles({ count, reducedMotion }: AmbientParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => createAmbientPositions(count), [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current || reducedMotion) return;
    pointsRef.current.rotation.z += delta * 0.006;
    pointsRef.current.position.y = Math.sin(pointsRef.current.rotation.z * 18) * 0.025;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#f4f1ea" size={0.016} transparent opacity={0.22} depthWrite={false} />
    </points>
  );
}
