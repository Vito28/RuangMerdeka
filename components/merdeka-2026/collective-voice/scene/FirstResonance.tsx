"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { mapRange } from "./field-utils";

type FirstResonanceProps = {
  progressRef: MutableRefObject<number>;
  active: boolean;
};

export function FirstResonance({ progressRef, active }: FirstResonanceProps) {
  const firstRef = useRef<THREE.Mesh>(null);
  const secondRef = useRef<THREE.Mesh>(null);
  const firstMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const secondMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const elapsedRef = useRef(0);

  useFrame((_, delta) => {
    if (!active || !firstRef.current || !secondRef.current || !firstMaterialRef.current || !secondMaterialRef.current) return;
    elapsedRef.current += Math.min(delta, 0.05);
    const progress = progressRef.current;
    const enter = mapRange(progress, 0.015, 0.055);
    const leave = 1 - mapRange(progress, 0.11, 0.17);
    const visibility = enter * leave;
    const cycle = (elapsedRef.current * 0.22) % 1;

    firstRef.current.scale.set(1.25 + cycle * 1.35, 0.72 + cycle * 0.78, 1);
    secondRef.current.scale.set(1.75 + cycle * 1.7, 0.92 + cycle * 0.9, 1);
    firstMaterialRef.current.opacity = visibility * (1 - cycle) * 0.15;
    secondMaterialRef.current.opacity = visibility * (1 - cycle) * 0.08;
  });

  return (
    <group position={[0.18, 0.16, 0.12]}>
      <mesh ref={firstRef}>
        <ringGeometry args={[0.074, 0.078, 64]} />
        <meshBasicMaterial ref={firstMaterialRef} color="#e60012" transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={secondRef}>
        <ringGeometry args={[0.074, 0.077, 64]} />
        <meshBasicMaterial ref={secondMaterialRef} color="#f2efe9" transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}
