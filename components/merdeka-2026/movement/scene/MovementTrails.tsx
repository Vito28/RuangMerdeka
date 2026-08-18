"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { mapMovementProgress } from "../animation/movement-progress";
import type { MovementSceneData, MovementRoute } from "../data/movement-scene-data";
import type { MovementProgressRef } from "../types";

type MovementTrailsProps = {
  data: MovementSceneData;
  pixelRatio: number;
  progressRef: MovementProgressRef;
  tracerCount: number;
};

const trailVertexShader = `
  attribute vec3 aAlignedPosition;
  attribute float aAlong;
  attribute float aBranch;
  attribute float aTier;

  uniform float uProgress;
  uniform float uTime;
  varying float vAlpha;
  varying float vRed;

  void main() {
    float alignment = smoothstep(0.80, 0.90, uProgress);
    float head = clamp((uProgress - aBranch) / 0.115, 0.0, 1.0);
    float reveal = 1.0 - smoothstep(head, head + 0.075, aAlong);
    float mainPath = 1.0 - step(0.5, aTier);
    float fieldEntry = smoothstep(0.12, 0.22, uProgress);
    float millions = smoothstep(0.30, 0.48, uProgress);
    float humanFocus = smoothstep(0.48, 0.54, uProgress) * (1.0 - smoothstep(0.70, 0.76, uProgress));
    float pulsePhase = smoothstep(0.89, 0.915, uProgress);
    float pulseHead = smoothstep(0.90, 0.97, uProgress);
    float pulse = pulsePhase * (1.0 - smoothstep(0.018, 0.08, abs(aAlong - pulseHead)));
    vec3 transformed = mix(position, aAlignedPosition, alignment);
    transformed.y += sin(uTime * 0.28 + aAlong * 13.0 + aBranch * 31.0) * 0.018 * (1.0 - alignment);

    vec4 viewPosition = viewMatrix * modelMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * viewPosition;

    float tierAlpha = mix(0.58, mix(0.13, 0.035, step(1.5, aTier)), step(0.5, aTier));
    float humanQuiet = mix(1.0, mix(0.44, 0.20, step(0.5, aTier)), humanFocus);
    vAlpha = reveal * tierAlpha * (0.72 + millions * 0.42) * humanQuiet * fieldEntry + pulse * 0.8;
    vRed = clamp(mainPath * 0.88 + pulse + millions * step(0.91, fract(aBranch * 97.0)), 0.0, 1.0);
  }
`;

const trailFragmentShader = `
  varying float vAlpha;
  varying float vRed;

  void main() {
    vec3 bone = vec3(0.957, 0.945, 0.918);
    vec3 red = vec3(0.91, 0.0, 0.067);
    gl_FragColor = vec4(mix(bone, red, vRed), vAlpha);
  }
`;

const tracerVertexShader = `
  uniform float uSize;
  void main() {
    vec4 viewPosition = viewMatrix * modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = min(7.0, uSize * (4.0 / max(2.0, -viewPosition.z)));
  }
`;

const tracerFragmentShader = `
  uniform float uOpacity;
  void main() {
    float distanceToCenter = length(gl_PointCoord - 0.5);
    if (distanceToCenter > 0.5) discard;
    float edge = 1.0 - smoothstep(0.28, 0.5, distanceToCenter);
    gl_FragColor = vec4(1.0, 0.075, 0.14, edge * uOpacity);
  }
`;

function sampleRoute(route: MovementRoute, progress: number, aligned: number, target: Float32Array, offset: number) {
  const pointCount = route.points.length / 3;
  const scaled = Math.min(0.9999, Math.max(0, progress)) * (pointCount - 1);
  const current = Math.floor(scaled);
  const next = Math.min(pointCount - 1, current + 1);
  const mix = scaled - current;
  const currentOffset = current * 3;
  const nextOffset = next * 3;

  for (let axis = 0; axis < 3; axis += 1) {
    const free = THREE.MathUtils.lerp(route.points[currentOffset + axis], route.points[nextOffset + axis], mix);
    const together = THREE.MathUtils.lerp(route.alignedPoints[currentOffset + axis], route.alignedPoints[nextOffset + axis], mix);
    target[offset + axis] = THREE.MathUtils.lerp(free, together, aligned);
  }
}

export function MovementTrails({ data, pixelRatio, progressRef, tracerCount }: MovementTrailsProps) {
  const trailMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const tracerMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const tracerTailMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  const tracerAttributeRef = useRef<THREE.BufferAttribute>(null);
  const tracerTailAttributeRef = useRef<THREE.BufferAttribute>(null);
  const elapsedRef = useRef(0);
  const tracerPositions = useMemo(() => new Float32Array(tracerCount * 3), [tracerCount]);
  const tracerTailPositions = useMemo(() => new Float32Array(tracerCount * 6), [tracerCount]);
  const uniforms = useMemo(() => ({ uProgress: { value: 0 }, uTime: { value: 0 } }), []);
  const tracerUniforms = useMemo(
    () => ({ uSize: { value: 3.8 * pixelRatio }, uOpacity: { value: 0 } }),
    [pixelRatio],
  );

  useFrame((_, delta) => {
    elapsedRef.current += delta;
    const progress = progressRef.current;
    const alignment = mapMovementProgress(progress, 0.8, 0.9);
    const millionEnergy = mapMovementProgress(progress, 0.3, 0.4);

    if (trailMaterialRef.current) {
      trailMaterialRef.current.uniforms.uProgress.value = THREE.MathUtils.damp(
        trailMaterialRef.current.uniforms.uProgress.value,
        progress,
        8,
        delta,
      );
      trailMaterialRef.current.uniforms.uTime.value = elapsedRef.current;
    }

    if (tracerMaterialRef.current) {
      const active = mapMovementProgress(progress, 0.16, 0.31) * (1 - mapMovementProgress(progress, 0.94, 1));
      tracerMaterialRef.current.uniforms.uOpacity.value = THREE.MathUtils.damp(
        tracerMaterialRef.current.uniforms.uOpacity.value,
        active * (0.54 + millionEnergy * 0.38),
        8,
        delta,
      );
      tracerMaterialRef.current.uniforms.uSize.value = (3.8 + millionEnergy * 1.4) * pixelRatio;
      if (tracerTailMaterialRef.current) {
        tracerTailMaterialRef.current.opacity = THREE.MathUtils.damp(
          tracerTailMaterialRef.current.opacity,
          active * (0.18 + millionEnergy * 0.16),
          8,
          delta,
        );
      }
    }

    const speedBoost = 1 + millionEnergy * 0.25;
    for (let index = 0; index < tracerCount; index += 1) {
      const route = data.routes[index % data.routes.length];
      const direction = index % 7 === 0 ? -1 : 1;
      const routeProgress = ((route.offset + direction * elapsedRef.current * route.speed * speedBoost + progress * 0.65) % 1 + 1) % 1;
      sampleRoute(route, routeProgress, alignment, tracerPositions, index * 3);
      const tailProgress = Math.min(
        0.9999,
        Math.max(0, routeProgress - direction * 0.026),
      );
      sampleRoute(route, tailProgress, alignment, tracerTailPositions, index * 6);
      sampleRoute(route, routeProgress, alignment, tracerTailPositions, index * 6 + 3);
    }
    if (tracerAttributeRef.current) tracerAttributeRef.current.needsUpdate = true;
    if (tracerTailAttributeRef.current) tracerTailAttributeRef.current.needsUpdate = true;
  });

  return (
    <>
      <lineSegments renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.trailPositions, 3]} />
          <bufferAttribute attach="attributes-aAlignedPosition" args={[data.alignedTrailPositions, 3]} />
          <bufferAttribute attach="attributes-aAlong" args={[data.trailAlong, 1]} />
          <bufferAttribute attach="attributes-aBranch" args={[data.trailBranches, 1]} />
          <bufferAttribute attach="attributes-aTier" args={[data.trailTiers, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={trailMaterialRef}
          vertexShader={trailVertexShader}
          fragmentShader={trailFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </lineSegments>

      <points renderOrder={3}>
        <bufferGeometry>
          <bufferAttribute
            ref={tracerAttributeRef}
            attach="attributes-position"
            args={[tracerPositions, 3]}
            usage={THREE.DynamicDrawUsage}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={tracerMaterialRef}
          vertexShader={tracerVertexShader}
          fragmentShader={tracerFragmentShader}
          uniforms={tracerUniforms}
          transparent
          depthWrite={false}
        />
      </points>
      <lineSegments renderOrder={2}>
        <bufferGeometry>
          <bufferAttribute
            ref={tracerTailAttributeRef}
            attach="attributes-position"
            args={[tracerTailPositions, 3]}
            usage={THREE.DynamicDrawUsage}
          />
        </bufferGeometry>
        <lineBasicMaterial
          ref={tracerTailMaterialRef}
          color="#ff253a"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </lineSegments>
    </>
  );
}
