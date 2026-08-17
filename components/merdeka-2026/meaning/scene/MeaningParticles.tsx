"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { MeaningSceneData } from "../data/meaning-scene-data";
import type { MeaningProgressRef } from "../types";

type MeaningParticlesProps = {
  data: MeaningSceneData;
  pixelRatio: number;
  progressRef: MeaningProgressRef;
};

const vertexShader = `
  attribute vec3 aJusticeOffset;
  attribute float aGrowth;
  attribute float aTint;
  attribute float aSize;

  uniform float uProgress;
  uniform float uTime;
  uniform float uPixelRatio;

  varying float vTint;
  varying float vAlpha;
  varying float vJustice;
  varying float vProsperity;

  void main() {
    float sovereign = smoothstep(0.10, 0.16, uProgress) * (1.0 - smoothstep(0.33, 0.38, uProgress));
    float justice = smoothstep(0.34, 0.40, uProgress) * (1.0 - smoothstep(0.57, 0.63, uProgress));
    float prosperity = smoothstep(0.58, 0.66, uProgress) * (1.0 - smoothstep(0.81, 0.87, uProgress));
    float movingForward = smoothstep(0.83, 0.90, uProgress);

    vec3 transformed = position;
    transformed += aJusticeOffset * justice;
    transformed.y += aGrowth * prosperity * 0.22;
    transformed.z += aGrowth * prosperity * 0.56;
    transformed.z += sin(uTime * 0.28 + position.x * 1.4) * 0.012 * (sovereign + justice);
    transformed.z += sin(uTime * 0.18 + position.y * 2.0) * 0.018 * movingForward;

    vec4 modelPosition = modelMatrix * vec4(transformed, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = (1.7 + aSize * 1.45 + prosperity * 0.35) * uPixelRatio * (7.0 / -viewPosition.z);

    vTint = aTint;
    vJustice = justice;
    vProsperity = prosperity;
    vAlpha = 0.12 + smoothstep(0.07, 0.16, uProgress) * 0.76 + movingForward * 0.08;
  }
`;

const fragmentShader = `
  varying float vTint;
  varying float vAlpha;
  varying float vJustice;
  varying float vProsperity;

  void main() {
    vec2 point = gl_PointCoord - 0.5;
    float distanceToCenter = length(point);
    if (distanceToCenter > 0.5) discard;

    float softEdge = 1.0 - smoothstep(0.20, 0.5, distanceToCenter);
    vec3 ivory = vec3(0.957, 0.945, 0.918);
    vec3 warmWhite = vec3(1.0, 0.972, 0.91);
    vec3 flagRed = vec3(0.906, 0.0, 0.067);
    float redMask = step(mix(0.80, 0.90, vJustice), vTint);
    vec3 base = mix(ivory, warmWhite, vProsperity * 0.48);
    vec3 color = mix(base, flagRed, redMask);
    gl_FragColor = vec4(color, softEdge * vAlpha);
  }
`;

export function MeaningParticles({ data, pixelRatio, progressRef }: MeaningParticlesProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uPixelRatio: { value: pixelRatio },
    }),
    [pixelRatio],
  );

  useFrame(({ clock }, delta) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uProgress.value = THREE.MathUtils.damp(
      materialRef.current.uniforms.uProgress.value,
      progressRef.current,
      7,
      delta,
    );
    materialRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.particles.positions, 3]} />
        <bufferAttribute attach="attributes-aJusticeOffset" args={[data.justiceOffsets, 3]} />
        <bufferAttribute attach="attributes-aGrowth" args={[data.growthValues, 1]} />
        <bufferAttribute attach="attributes-aTint" args={[data.particles.tints, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[data.particles.sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}
