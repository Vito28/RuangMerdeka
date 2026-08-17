"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { mapMovementProgress } from "../animation/movement-progress";
import type { MovementSceneData } from "../data/movement-scene-data";
import type { MovementProgressRef } from "../types";

type MovementTrailsProps = {
  data: MovementSceneData;
  pixelRatio: number;
  progressRef: MovementProgressRef;
};

function routePoint(route: MovementSceneData["routes"][number], progress: number, target: Float32Array, offset: number) {
  const pointCount = route.points.length / 3;
  const scaled = progress * (pointCount - 1);
  const current = Math.floor(scaled);
  const next = Math.min(pointCount - 1, current + 1);
  const mix = scaled - current;
  const currentOffset = current * 3;
  const nextOffset = next * 3;
  target[offset] = THREE.MathUtils.lerp(route.points[currentOffset], route.points[nextOffset], mix);
  target[offset + 1] = THREE.MathUtils.lerp(route.points[currentOffset + 1], route.points[nextOffset + 1], mix);
  target[offset + 2] = THREE.MathUtils.lerp(route.points[currentOffset + 2], route.points[nextOffset + 2], mix);
}

export function MovementTrails({ data, pixelRatio, progressRef }: MovementTrailsProps) {
  const trailMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  const pulseMaterialRef = useRef<THREE.PointsMaterial>(null);
  const pulseAttributeRef = useRef<THREE.BufferAttribute>(null);
  const pulsePositions = useMemo(() => new Float32Array(data.routes.length * 3), [data.routes.length]);

  useFrame(({ clock }, delta) => {
    const progress = progressRef.current;
    const rise = mapMovementProgress(progress, 0.39, 0.5);
    const settle = 1 - mapMovementProgress(progress, 0.78, 0.9);
    const openingFlow = 1 - mapMovementProgress(progress, 0.08, 0.18);
    const intensity = Math.max(openingFlow * 0.32, rise * settle);

    if (trailMaterialRef.current) {
      trailMaterialRef.current.opacity = THREE.MathUtils.damp(
        trailMaterialRef.current.opacity,
        0.025 + intensity * 0.17,
        7,
        delta,
      );
    }
    if (pulseMaterialRef.current) {
      pulseMaterialRef.current.opacity = THREE.MathUtils.damp(
        pulseMaterialRef.current.opacity,
        0.06 + intensity * 0.9,
        7,
        delta,
      );
      pulseMaterialRef.current.size = (0.027 + intensity * 0.017) * pixelRatio;
    }

    for (let index = 0; index < data.routes.length; index += 1) {
      const route = data.routes[index];
      const direction = index % 3 === 0 ? -1 : 1;
      let routeProgress = route.offset + direction * clock.elapsedTime * route.speed + progress * 0.54;
      routeProgress = ((routeProgress % 1) + 1) % 1;
      routePoint(route, routeProgress, pulsePositions, index * 3);
    }
    if (pulseAttributeRef.current) pulseAttributeRef.current.needsUpdate = true;
  });

  return (
    <>
      <lineSegments renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.trailPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={trailMaterialRef}
          color="#e70011"
          transparent
          opacity={0.03}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      <points renderOrder={2}>
        <bufferGeometry>
          <bufferAttribute ref={pulseAttributeRef} attach="attributes-position" args={[pulsePositions, 3]} usage={THREE.DynamicDrawUsage} />
        </bufferGeometry>
        <pointsMaterial
          ref={pulseMaterialRef}
          color="#ff2738"
          size={0.03 * pixelRatio}
          sizeAttenuation
          transparent
          opacity={0.1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}
