"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { createIndonesiaPointData } from "../../hero/data/indonesia-points";
import { FINALE_JOURNEY_CONFIG } from "../animation/finale-journey-phases";
import type { FinaleJourneyQuality } from "../types";
import type { MutableRefObject } from "react";

type Props = {
  progressRef: MutableRefObject<number>;
  quality: FinaleJourneyQuality;
  active: boolean;
  hasUserSignal: boolean;
};

type Targets = {
  current: Float32Array;
  horizon: Float32Array;
  digits: Float32Array;
  flow: Float32Array;
  wings: Float32Array;
  indonesia: Float32Array;
  ascent: Float32Array;
  colors: Float32Array;
  seeds: Float32Array;
};

const RED = new THREE.Color("#f20d24");
const BONE = new THREE.Color("#eee9df");
const ASH = new THREE.Color("#665f59");

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function smooth(value: number) {
  const clamped = THREE.MathUtils.clamp(value, 0, 1);
  return clamped * clamped * (3 - 2 * clamped);
}

function phase(progress: number, start: number, end: number) {
  return smooth((progress - start) / (end - start));
}

function createTargets(count: number, hasUserSignal: boolean): Targets {
  const random = seededRandom(810817 + count);
  const map = createIndonesiaPointData(count);
  const horizon = new Float32Array(count * 3);
  const digits = new Float32Array(count * 3);
  const flow = new Float32Array(count * 3);
  const wings = new Float32Array(count * 3);
  const indonesia = new Float32Array(count * 3);
  const ascent = new Float32Array(count * 3);
  const current = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const seeds = new Float32Array(count);

  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;
    const seed = random();
    const secondary = random();
    seeds[index] = seed;

    horizon[offset] = (seed - 0.5) * 12;
    horizon[offset + 1] = -0.82 + (secondary - 0.5) * 0.08;
    horizon[offset + 2] = (random() - 0.5) * 0.55;

    if (index < count * 0.62) {
      const upper = random() > 0.5;
      const angle = random() * Math.PI * 2;
      digits[offset] = -1.18 + Math.cos(angle) * 0.78;
      digits[offset + 1] = (upper ? 0.72 : -0.72) + Math.sin(angle) * 0.68;
      digits[offset + 2] = (random() - 0.5) * 0.22;
    } else {
      const stroke = random();
      if (stroke < 0.72) {
        digits[offset] = 1.25 + (random() - 0.5) * 0.13;
        digits[offset + 1] = -1.42 + random() * 2.86;
      } else if (stroke < 0.86) {
        const t = random();
        digits[offset] = 0.73 + t * 0.56;
        digits[offset + 1] = 0.92 + t * 0.5;
      } else {
        digits[offset] = 0.68 + random() * 1.16;
        digits[offset + 1] = -1.43 + (random() - 0.5) * 0.12;
      }
      digits[offset + 2] = (random() - 0.5) * 0.22;
    }

    const t = seed;
    flow[offset] = -5.4 + t * 10.8;
    flow[offset + 1] = Math.sin((t - 0.08) * Math.PI * 2) * 1.18 + (secondary - 0.5) * 0.72;
    flow[offset + 2] = Math.cos(t * Math.PI * 2) * 0.72 + (random() - 0.5) * 0.45;

    const side = index % 2 === 0 ? -1 : 1;
    const feather = random();
    wings[offset] = side * (0.32 + feather * 5.15);
    wings[offset + 1] = -0.46 + Math.sin(feather * Math.PI) * (2.05 - feather * 0.42) + (secondary - 0.5) * 0.36;
    wings[offset + 2] = -0.25 + feather * 0.62 + (random() - 0.5) * 0.38;

    indonesia[offset] = map.positions[offset] * 1.08;
    indonesia[offset + 1] = map.positions[offset + 1] * 1.08;
    indonesia[offset + 2] = map.positions[offset + 2] + map.groupOffsets[offset + 2] * 0.4;

    ascent[offset] = indonesia[offset] * (1.05 + secondary * 0.2);
    ascent[offset + 1] = indonesia[offset + 1] + 1.2 + seed * 4.4;
    ascent[offset + 2] = indonesia[offset + 2] - 0.8 - random() * 2.8;

    const tint = hasUserSignal && index === 0 ? RED : seed < 0.11 ? RED : seed < 0.74 ? BONE : ASH;
    colors[offset] = tint.r;
    colors[offset + 1] = tint.g;
    colors[offset + 2] = tint.b;
  }

  current.set(horizon);
  return { current, horizon, digits, flow, wings, indonesia, ascent, colors, seeds };
}

function interpolateTarget(progress: number, targets: Targets, index: number, offset: number) {
  let from = targets.horizon;
  let to = targets.horizon;
  let mix = 0;

  if (progress < 0.31) {
    const callbackEnergy = phase(progress, 0.08, 0.3);
    targets.current[offset] = targets.horizon[offset] + Math.sin(targets.seeds[index] * 18 + progress * 24) * 0.08 * callbackEnergy;
    targets.current[offset + 1] = targets.horizon[offset + 1] + Math.sin(targets.seeds[index] * 30 + progress * 36) * 0.13 * callbackEnergy;
    targets.current[offset + 2] = targets.horizon[offset + 2];
    return;
  }

  if (progress < 0.4) {
    to = targets.digits;
    mix = phase(progress, 0.31, 0.4);
  } else if (progress < 0.51) {
    from = targets.digits;
    to = targets.digits;
    mix = 0;
  } else if (progress < 0.62) {
    from = targets.digits;
    to = targets.flow;
    mix = phase(progress, 0.51, 0.62);
  } else if (progress < 0.71) {
    from = targets.flow;
    to = targets.wings;
    mix = phase(progress, 0.62, 0.71);
  } else if (progress < 0.82) {
    from = targets.wings;
    to = targets.indonesia;
    mix = phase(progress, 0.71, 0.82);
  } else if (progress < 0.89) {
    from = targets.indonesia;
    to = targets.indonesia;
    mix = 0;
  } else {
    from = targets.indonesia;
    to = targets.ascent;
    mix = phase(progress, 0.89, 0.955);
  }

  const breath = progress >= 0.4 && progress < 0.51 ? Math.sin(progress * 90 + targets.seeds[index] * 8) * 0.018 : 0;
  targets.current[offset] = THREE.MathUtils.lerp(from[offset], to[offset], mix) + breath;
  targets.current[offset + 1] = THREE.MathUtils.lerp(from[offset + 1], to[offset + 1], mix) + breath;
  targets.current[offset + 2] = THREE.MathUtils.lerp(from[offset + 2], to[offset + 2], mix);
}

export function JourneyParticleField({ progressRef, quality, active, hasUserSignal }: Props) {
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const count = FINALE_JOURNEY_CONFIG.particleCount[quality];
  const targets = useMemo(() => createTargets(count, hasUserSignal), [count, hasUserSignal]);

  useFrame((_, delta) => {
    if (!active) return;
    const progress = progressRef.current;
    for (let index = 0; index < count; index += 1) {
      interpolateTarget(progress, targets, index, index * 3);
    }
    const position = geometryRef.current?.getAttribute("position") as THREE.BufferAttribute | undefined;
    if (position) position.needsUpdate = true;
    if (materialRef.current) {
      const targetOpacity = progress < 0.985 ? 0.9 : THREE.MathUtils.clamp(1 - (progress - 0.985) / 0.012, 0, 1);
      materialRef.current.opacity = THREE.MathUtils.damp(materialRef.current.opacity, targetOpacity, 10, delta);
    }
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach="attributes-position" args={[targets.current, 3]} />
        <bufferAttribute attach="attributes-color" args={[targets.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color="#ffffff"
        size={quality === "low" ? 0.036 : 0.028}
        sizeAttenuation
        transparent
        opacity={0.9}
        vertexColors
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function FinalSignal({ progressRef, active }: Pick<Props, "progressRef" | "active">) {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!active || !materialRef.current || !meshRef.current) return;
    const reveal = phase(progressRef.current, 0.975, 0.993);
    materialRef.current.opacity = THREE.MathUtils.damp(materialRef.current.opacity, reveal, 9, delta);
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.1) * 0.08;
    meshRef.current.scale.setScalar(pulse * (0.72 + reveal * 0.28));
  });

  return (
    <mesh ref={meshRef} position={[0, 0.45, 0.3]}>
      <sphereGeometry args={[0.055, 18, 18]} />
      <meshBasicMaterial ref={materialRef} color="#ff1730" transparent opacity={0} />
    </mesh>
  );
}
