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
  attribute vec3 aFlowTarget;
  attribute float aFlowAngle;
  attribute float aFlowAccent;
  attribute float aFlowPhase;
  attribute float aTint;
  attribute float aSize;

  uniform float uProgress;
  uniform float uTime;
  uniform float uPixelRatio;

  varying float vAlpha;
  varying float vAngle;
  varying float vFlowAccent;
  varying float vPulse;
  varying float vShape;
  varying float vTint;

  void main() {
    float wing = smoothstep(0.10, 0.245, uProgress);
    float streak = smoothstep(0.22, 0.32, uProgress);
    float mapVisibility = 1.0 - smoothstep(0.31, 0.40, uProgress);
    float wingCycle = sin(uTime * 1.55 + abs(aFlowTarget.x) * 0.78 + aFlowPhase * 6.28318);

    float pulsePosition = mix(-4.7, 4.7, smoothstep(0.012, 0.115, uProgress));
    float westEastPulse = exp(-abs(position.x - pulsePosition) * 1.55)
      * (1.0 - smoothstep(0.118, 0.145, uProgress));

    vec3 direction = normalize(aFlowTarget - position + vec3(0.0001));
    vec3 transformed = mix(position, aFlowTarget, wing);
    transformed.y += wingCycle * 0.055 * wing * (1.0 - streak * 0.55);
    transformed.z += cos(uTime * 0.95 + aFlowPhase * 8.0) * 0.065 * wing;
    transformed += direction * streak * (0.35 + aFlowPhase * 0.46);

    vec4 modelPosition = modelMatrix * vec4(transformed, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    float perspective = clamp(7.0 / max(0.7, -viewPosition.z), 0.62, 2.25);
    float featherSize = mix(1.7 + aSize * 1.1, 8.0 + aSize * 2.7, wing);
    gl_PointSize = featherSize * uPixelRatio * perspective;

    vAlpha = mapVisibility * (0.42 + wing * 0.42 + westEastPulse * 0.5);
    vAngle = aFlowAngle;
    vFlowAccent = aFlowAccent;
    vPulse = westEastPulse;
    vShape = clamp(wing + streak * 0.65, 0.0, 1.65);
    vTint = aTint;
  }
`;

const fragmentShader = `
  varying float vAlpha;
  varying float vAngle;
  varying float vFlowAccent;
  varying float vPulse;
  varying float vShape;
  varying float vTint;

  void main() {
    vec2 point = gl_PointCoord - 0.5;
    float cosine = cos(vAngle);
    float sine = sin(vAngle);
    vec2 shaped = mat2(cosine, -sine, sine, cosine) * point;
    float feather = smoothstep(0.03, 0.82, vShape);
    float aspect = mix(1.0, 3.45 + max(0.0, vShape - 1.0) * 4.4, feather);
    shaped.y *= aspect;
    shaped.y += shaped.x * shaped.x * 0.85 * feather * sign(shaped.x + 0.001);
    float taper = max(0.34, 1.0 - abs(shaped.x) * 1.12 * feather);
    shaped.y /= taper;

    float distanceToShape = length(shaped);
    if (distanceToShape > 0.5) discard;

    float softEdge = 1.0 - smoothstep(0.31, 0.5, distanceToShape);
    float openingRed = step(0.89, vTint);
    float directionalRed = mix(openingRed, vFlowAccent, feather);
    vec3 ivory = vec3(0.952, 0.941, 0.918);
    vec3 red = vec3(0.91, 0.0, 0.07);
    vec3 color = mix(ivory, red, directionalRed);
    color = mix(color, vec3(1.0, 0.22, 0.18), vPulse * 0.45);
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
      8,
      delta,
    );
    materialRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.particles.positions, 3]} />
        <bufferAttribute attach="attributes-aFlowTarget" args={[data.flowTargets, 3]} />
        <bufferAttribute attach="attributes-aFlowAngle" args={[data.flowAngles, 1]} />
        <bufferAttribute attach="attributes-aFlowAccent" args={[data.flowAccents, 1]} />
        <bufferAttribute attach="attributes-aFlowPhase" args={[data.flowPhases, 1]} />
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
