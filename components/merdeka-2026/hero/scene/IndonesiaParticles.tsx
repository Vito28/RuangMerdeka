"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { createIndonesiaPointData } from "../data/indonesia-points";
import type { HeroProgressRef } from "../types";

type IndonesiaParticlesProps = {
  count: number;
  progressRef: HeroProgressRef;
  reducedMotion: boolean;
  pixelRatio: number;
};

const vertexShader = `
  attribute vec3 aStart;
  attribute vec3 aGroupOffset;
  attribute vec3 aDetach;
  attribute float aGroupId;
  attribute float aTint;
  attribute float aSize;

  uniform float uProgress;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uReducedMotion;

  varying float vTint;
  varying float vAlpha;

  void main() {
    float formation = smoothstep(0.02, 0.28, uProgress);
    float islandPhase = smoothstep(0.34, 0.39, uProgress) * (1.0 - smoothstep(0.48, 0.53, uProgress));
    float storiesPhase = smoothstep(0.50, 0.62, uProgress);
    float exitPhase = smoothstep(0.93, 1.0, uProgress);

    vec3 formedPosition = mix(aStart, position, formation);
    formedPosition += aGroupOffset * islandPhase;
    formedPosition += aDetach * storiesPhase;

    float drift = sin(uTime * 0.34 + position.x * 1.7 + aGroupId) * 0.015;
    formedPosition.z += drift * formation * (1.0 - uReducedMotion);
    formedPosition.xy *= 1.0 + exitPhase * 0.08;
    formedPosition.z += exitPhase * (1.4 + aSize * 0.6);

    vec4 modelPosition = modelMatrix * vec4(formedPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = (2.0 + aSize * 1.6) * uPixelRatio * (7.0 / -viewPosition.z);

    vTint = aTint;
    vAlpha = mix(0.13, 0.92, formation) * (1.0 - exitPhase * 0.72);
  }
`;

const fragmentShader = `
  varying float vTint;
  varying float vAlpha;

  void main() {
    vec2 point = gl_PointCoord - 0.5;
    float distanceToCenter = length(point);
    if (distanceToCenter > 0.5) discard;

    float softEdge = 1.0 - smoothstep(0.22, 0.5, distanceToCenter);
    vec3 ivory = vec3(0.957, 0.945, 0.918);
    vec3 flagRed = vec3(0.906, 0.0, 0.067);
    vec3 color = mix(ivory, flagRed, step(0.80, vTint));
    gl_FragColor = vec4(color, softEdge * vAlpha);
  }
`;

export function IndonesiaParticles({
  count,
  progressRef,
  reducedMotion,
  pixelRatio,
}: IndonesiaParticlesProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointData = useMemo(() => createIndonesiaPointData(count), [count]);
  const uniforms = useMemo(
    () => ({
      uProgress: { value: reducedMotion ? 0.3 : 0 },
      uTime: { value: 0 },
      uPixelRatio: { value: pixelRatio },
      uReducedMotion: { value: reducedMotion ? 1 : 0 },
    }),
    [pixelRatio, reducedMotion],
  );

  useFrame(({ clock }, delta) => {
    if (!materialRef.current) return;

    const targetProgress = reducedMotion ? 0.3 : progressRef.current;
    materialRef.current.uniforms.uProgress.value = THREE.MathUtils.damp(
      materialRef.current.uniforms.uProgress.value,
      targetProgress,
      7,
      delta,
    );
    materialRef.current.uniforms.uTime.value = reducedMotion ? 0 : clock.elapsedTime;
    materialRef.current.uniforms.uReducedMotion.value = reducedMotion ? 1 : 0;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pointData.positions, 3]} />
        <bufferAttribute attach="attributes-aStart" args={[pointData.startPositions, 3]} />
        <bufferAttribute attach="attributes-aGroupId" args={[pointData.groupIds, 1]} />
        <bufferAttribute attach="attributes-aGroupOffset" args={[pointData.groupOffsets, 3]} />
        <bufferAttribute attach="attributes-aDetach" args={[pointData.detachOffsets, 3]} />
        <bufferAttribute attach="attributes-aTint" args={[pointData.tints, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[pointData.sizes, 1]} />
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
