"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import type { CollectiveQuality } from "../types";
import { easeInOut, mapRange, QUALITY_CONFIG, seededRandom } from "./field-utils";

type VoiceSignalsProps = {
  progressRef: MutableRefObject<number>;
  quality: CollectiveQuality;
  active: boolean;
  hasUserSignal: boolean;
};

export function VoiceSignals({ progressRef, quality, active, hasUserSignal }: VoiceSignalsProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const userSignalRef = useRef<THREE.Mesh>(null);
  const userSignalMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const elapsedRef = useRef(0);
  const count = QUALITY_CONFIG[quality].signals;

  const data = useMemo(() => {
    const random = seededRandom(702026);
    const base = new Float32Array(count * 3);
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const bone = new THREE.Color("#f2efe9");
    const deepRed = new THREE.Color("#72101d");
    const red = new THREE.Color("#e60012");

    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;
      base[offset] = (random() - 0.5) * 12;
      base[offset + 1] = (random() - 0.5) * 6.2;
      base[offset + 2] = (random() - 0.5) * 5;
      positions.set(base.subarray(offset, offset + 3), offset);
      phases[index] = random() * Math.PI * 2;
      const selector = random();
      const color = selector < 0.15 ? red : selector < 0.4 ? deepRed : bone;
      colors[offset] = color.r;
      colors[offset + 1] = color.g;
      colors[offset + 2] = color.b;
    }
    return { base, positions, phases, colors };
  }, [count]);

  useFrame((_, delta) => {
    if (!active || !pointsRef.current || !materialRef.current) return;
    elapsedRef.current += Math.min(delta, 0.05);
    const progress = progressRef.current;
    const resonance = easeInOut(mapRange(progress, 0.02, 0.34));
    const landscape = easeInOut(mapRange(progress, 0.34, 0.58));
    const horizon = easeInOut(mapRange(progress, 0.91, 1));
    const positionAttribute = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const positions = positionAttribute.array as Float32Array;

    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;
      const phase = data.phases[index];
      positions[offset] = data.base[offset] + Math.sin(elapsedRef.current * 0.17 + phase) * 0.055 * (1 - horizon);
      positions[offset + 1] = THREE.MathUtils.lerp(
        data.base[offset + 1] + Math.cos(elapsedRef.current * 0.14 + phase) * 0.04,
        -1.66,
        landscape * 0.58 + horizon * 0.42,
      );
      positions[offset + 2] = data.base[offset + 2] - resonance * 0.45 - horizon * 3.5;
    }
    positionAttribute.needsUpdate = true;
    pointsRef.current.geometry.setDrawRange(0, Math.max(24, Math.floor(THREE.MathUtils.lerp(24, count, resonance))));
    materialRef.current.opacity = THREE.MathUtils.damp(
      materialRef.current.opacity,
      (0.22 + resonance * 0.38) * (1 - landscape * 0.68) * (1 - horizon * 0.8),
      7,
      delta,
    );

    if (userSignalRef.current) {
      const pulse = 1 + Math.sin(elapsedRef.current * 2.8) * 0.1;
      userSignalRef.current.scale.setScalar((hasUserSignal ? 1.12 : 0.92) * pulse * (1 - horizon * 0.55));
      userSignalRef.current.position.y = THREE.MathUtils.lerp(0.16, -1.66, landscape * 0.58 + horizon * 0.42);
      userSignalRef.current.position.z = -horizon * 3.5;
    }
    if (userSignalMaterialRef.current) {
      userSignalMaterialRef.current.opacity = THREE.MathUtils.damp(
        userSignalMaterialRef.current.opacity,
        (1 - landscape) * (1 - horizon) * 0.92,
        7,
        delta,
      );
    }
  });

  return (
    <group>
      <points ref={pointsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[data.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={materialRef}
          vertexColors
          transparent
          opacity={0.2}
          size={quality === "low" ? 0.048 : 0.036}
          sizeAttenuation
          depthWrite={false}
          toneMapped={false}
        />
      </points>
      <mesh ref={userSignalRef} position={[0.18, 0.16, 0.15]}>
        <sphereGeometry args={[0.052, 14, 14]} />
        <meshBasicMaterial ref={userSignalMaterialRef} color={hasUserSignal ? "#ff1b31" : "#e60012"} transparent opacity={0.92} toneMapped={false} />
      </mesh>
    </group>
  );
}
