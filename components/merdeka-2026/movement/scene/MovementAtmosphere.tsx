"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { MovementSceneData } from "../data/movement-scene-data";
import type { MovementProgressRef } from "../types";

const vertexShader = `
  attribute float aSeed;
  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelRatio;
  varying float vAlpha;

  void main() {
    vec3 transformed = position;
    float movement = smoothstep(0.38, 0.66, uProgress) * (1.0 - smoothstep(0.82, 0.93, uProgress));
    transformed.x += sin(uTime * (0.08 + aSeed * 0.08) + aSeed * 6.28318) * 0.08 * movement;
    transformed.y += cos(uTime * 0.07 + aSeed * 9.0) * 0.05 * movement;
    vec4 viewPosition = viewMatrix * modelMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = (1.0 + aSeed * 1.5) * uPixelRatio * (7.0 / -viewPosition.z);
    vAlpha = 0.08 + movement * 0.12;
  }
`;

const fragmentShader = `
  varying float vAlpha;
  void main() {
    float distanceToCenter = length(gl_PointCoord - 0.5);
    if (distanceToCenter > 0.5) discard;
    float edge = 1.0 - smoothstep(0.18, 0.5, distanceToCenter);
    gl_FragColor = vec4(vec3(0.957, 0.945, 0.918), edge * vAlpha);
  }
`;

export function MovementAtmosphere({ data, pixelRatio, progressRef }: MovementTrailsProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const elapsedRef = useRef(0);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uProgress: { value: 0 }, uPixelRatio: { value: pixelRatio } }),
    [pixelRatio],
  );

  useFrame((_, delta) => {
    if (!materialRef.current) return;
    elapsedRef.current += delta;
    materialRef.current.uniforms.uTime.value = elapsedRef.current;
    materialRef.current.uniforms.uProgress.value = THREE.MathUtils.damp(
      materialRef.current.uniforms.uProgress.value,
      progressRef.current,
      6,
      delta,
    );
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.ambientPositions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[data.ambientSeeds, 1]} />
      </bufferGeometry>
      <shaderMaterial ref={materialRef} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} transparent depthWrite={false} />
    </points>
  );
}

type MovementTrailsProps = {
  data: MovementSceneData;
  pixelRatio: number;
  progressRef: MovementProgressRef;
};
