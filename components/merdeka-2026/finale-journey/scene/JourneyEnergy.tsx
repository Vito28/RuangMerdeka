"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { MutableRefObject, RefObject } from "react";

type Props = { progressRef: MutableRefObject<number>; active: boolean };

function fade(progress: number, start: number, peak: number, end: number) {
  if (progress <= start || progress >= end) return 0;
  return progress < peak ? (progress - start) / (peak - start) : 1 - (progress - peak) / (end - peak);
}

function createFlowLines() {
  const positions: number[] = [];
  for (let line = 0; line < 12; line += 1) {
    for (let step = 0; step < 56; step += 1) {
      const offset = line / 11;
      const write = (t: number) => {
        positions.push(
          -5.8 + t * 11.6,
          Math.sin(t * Math.PI * 2 + offset * 0.9) * (0.78 + offset * 0.5) + (offset - 0.5) * 0.8,
          -0.55 + offset * 0.8,
        );
      };
      write(step / 56);
      write((step + 1) / 56);
    }
  }
  return new Float32Array(positions);
}

function createWingLines() {
  const positions: number[] = [];
  for (const side of [-1, 1]) {
    for (let feather = 0; feather < 13; feather += 1) {
      const height = feather / 12;
      for (let step = 0; step < 28; step += 1) {
        const write = (t: number) => {
          positions.push(
            side * (0.28 + t * (4.4 + height * 0.8)),
            -0.6 + Math.sin(t * Math.PI) * (1.15 + height * 1.05) - t * height * 0.42,
            -0.35 + height * 0.42,
          );
        };
        write(step / 28);
        write((step + 1) / 28);
      }
    }
  }
  return new Float32Array(positions);
}

function EnergyLine({ positions, color, opacityRef }: { positions: Float32Array; color: string; opacityRef: RefObject<THREE.LineBasicMaterial | null> }) {
  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial ref={opacityRef} color={color} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
    </lineSegments>
  );
}

export function JourneyEnergy({ progressRef, active }: Props) {
  const redRef = useRef<THREE.LineBasicMaterial>(null);
  const whiteRef = useRef<THREE.LineBasicMaterial>(null);
  const wingRef = useRef<THREE.LineBasicMaterial>(null);
  const flowLines = useMemo(() => createFlowLines(), []);
  const wingLines = useMemo(() => createWingLines(), []);

  useFrame((_, delta) => {
    if (!active) return;
    const progress = progressRef.current;
    const flowOpacity = 0.28 * Math.max(fade(progress, 0.16, 0.26, 0.33), fade(progress, 0.5, 0.57, 0.65));
    const wingOpacity = 0.56 * fade(progress, 0.6, 0.68, 0.735);
    if (redRef.current) redRef.current.opacity = THREE.MathUtils.damp(redRef.current.opacity, flowOpacity, 9, delta);
    if (whiteRef.current) whiteRef.current.opacity = THREE.MathUtils.damp(whiteRef.current.opacity, flowOpacity * 0.68, 9, delta);
    if (wingRef.current) wingRef.current.opacity = THREE.MathUtils.damp(wingRef.current.opacity, wingOpacity, 9, delta);
  });

  return (
    <group>
      <EnergyLine positions={flowLines} color="#f20d24" opacityRef={redRef} />
      <group rotation={[0, 0, 0.035]} scale={[0.98, 0.92, 1]}>
        <EnergyLine positions={flowLines} color="#eee9df" opacityRef={whiteRef} />
      </group>
      <EnergyLine positions={wingLines} color="#f7f1e7" opacityRef={wingRef} />
    </group>
  );
}
