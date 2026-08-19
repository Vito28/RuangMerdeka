"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import type { CollectiveQuality } from "../types";
import { easeInOut, mapRange, QUALITY_CONFIG, seededRandom } from "./field-utils";

type ResonanceFieldProps = {
  progressRef: MutableRefObject<number>;
  quality: CollectiveQuality;
  active: boolean;
};

export function ResonanceField({ progressRef, quality, active }: ResonanceFieldProps) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  const elapsedRef = useRef(0);
  const { waves, wavePoints } = QUALITY_CONFIG[quality];

  const data = useMemo(() => {
    const random = seededRandom(170807);
    const segmentsPerWave = wavePoints - 1;
    const positions = new Float32Array(waves * segmentsPerWave * 2 * 3);
    const colors = new Float32Array(positions.length);
    const frequencies = new Float32Array(waves);
    const amplitudes = new Float32Array(waves);
    const phases = new Float32Array(waves);
    const depths = new Float32Array(waves);
    const bases = new Float32Array(waves);
    const bone = new THREE.Color("#c9c6c0");
    const deepRed = new THREE.Color("#65101b");
    const red = new THREE.Color("#e60012");
    for (let wave = 0; wave < waves; wave += 1) {
      frequencies[wave] = 0.72 + random() * 1.45;
      amplitudes[wave] = 0.08 + random() * 0.22;
      phases[wave] = random() * Math.PI * 2;
      depths[wave] = (random() - 0.5) * 4.5;
      bases[wave] = -1.7 + random() * 2.8;
      const selector = random();
      const color = selector < 0.15 ? red : selector < 0.4 ? deepRed : bone;
      const waveOffset = wave * segmentsPerWave * 2 * 3;
      for (let cursor = waveOffset; cursor < waveOffset + segmentsPerWave * 2 * 3; cursor += 3) {
        colors[cursor] = color.r;
        colors[cursor + 1] = color.g;
        colors[cursor + 2] = color.b;
      }
    }
    return { positions, colors, frequencies, amplitudes, phases, depths, bases };
  }, [wavePoints, waves]);

  useFrame((_, delta) => {
    if (!active || !linesRef.current || !materialRef.current) return;
    elapsedRef.current += Math.min(delta, 0.05);
    const progress = progressRef.current;
    const reveal = easeInOut(mapRange(progress, 0.18, 0.38));
    const landscape = easeInOut(mapRange(progress, 0.36, 0.56));
    const corridor = easeInOut(mapRange(progress, 0.67, 0.75));
    const pulseProgress = mapRange(progress, 0.76, 0.91);
    const sweepX = THREE.MathUtils.lerp(-7.5, 7.5, pulseProgress);
    const horizon = easeInOut(mapRange(progress, 0.9, 1));
    const positions = (linesRef.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    let cursor = 0;

    for (let wave = 0; wave < waves; wave += 1) {
      const amplitude = data.amplitudes[wave] * reveal * (1 - horizon * 0.92);
      const baseY = THREE.MathUtils.lerp(data.bases[wave], -1.74, landscape * 0.62 + horizon * 0.38);
      const spread = 1 + corridor * 0.12;
      for (let point = 0; point < wavePoints - 1; point += 1) {
        for (let endpoint = 0; endpoint < 2; endpoint += 1) {
          const normalized = (point + endpoint) / (wavePoints - 1);
          const x = THREE.MathUtils.lerp(-6.8, 6.8, normalized) * spread;
          const pulseReaction = Math.max(0, 1 - Math.abs(x - sweepX) / 0.82) * (pulseProgress > 0 && pulseProgress < 1 ? 1 : 0);
          const softNoise = Math.sin(normalized * 7.3 + data.phases[wave] * 0.3) * 0.028;
          const y = baseY + Math.sin(x * data.frequencies[wave] + data.phases[wave] + elapsedRef.current * 0.24) * amplitude * (1 + pulseReaction * 0.32) + softNoise * reveal;
          positions[cursor] = x;
          positions[cursor + 1] = y;
          positions[cursor + 2] = data.depths[wave] - horizon * 4;
          cursor += 3;
        }
      }
    }
    (linesRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    materialRef.current.opacity = THREE.MathUtils.damp(
      materialRef.current.opacity,
      reveal * (0.13 + landscape * 0.17) * (1 - horizon * 0.42),
      7,
      delta,
    );
  });

  return (
    <lineSegments ref={linesRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[data.colors, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        ref={materialRef}
        vertexColors
        transparent
        opacity={0}
        depthWrite={false}
        toneMapped={false}
      />
    </lineSegments>
  );
}
