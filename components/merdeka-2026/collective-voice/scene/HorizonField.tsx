"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { easeInOut, mapRange } from "./field-utils";

type HorizonFieldProps = {
  progressRef: MutableRefObject<number>;
  active: boolean;
};

export function HorizonField({ progressRef, active }: HorizonFieldProps) {
  const lineRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const redLineRef = useRef<THREE.Mesh>(null);
  const redMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((_, delta) => {
    if (!active || !lineRef.current || !materialRef.current || !redLineRef.current || !redMaterialRef.current) return;
    const horizon = easeInOut(mapRange(progressRef.current, 0.91, 1));
    const scale = THREE.MathUtils.damp(lineRef.current.scale.x, Math.max(0.001, horizon), 7, delta);
    lineRef.current.scale.x = scale;
    redLineRef.current.scale.x = scale * 0.42;
    materialRef.current.opacity = THREE.MathUtils.damp(materialRef.current.opacity, horizon * 0.34, 7, delta);
    redMaterialRef.current.opacity = THREE.MathUtils.damp(redMaterialRef.current.opacity, horizon * 0.24, 7, delta);
  });

  return (
    <group position={[0, -1.02, -3.2]}>
      <mesh ref={lineRef} scale={[0.001, 1, 1]}>
        <planeGeometry args={[12, 0.014]} />
        <meshBasicMaterial ref={materialRef} color="#f2efe9" transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={redLineRef} position={[1.2, 0.012, 0.01]} scale={[0.001, 1, 1]}>
        <planeGeometry args={[6, 0.018]} />
        <meshBasicMaterial ref={redMaterialRef} color="#e60012" transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}
