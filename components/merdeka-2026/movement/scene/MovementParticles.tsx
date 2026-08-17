"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { MovementSceneData } from "../data/movement-scene-data";
import type { MovementProgressRef } from "../types";

type MovementParticlesProps = {
  data: MovementSceneData;
  pixelRatio: number;
  progressRef: MovementProgressRef;
};

const vertexShader = `
  attribute float aGroupId;
  attribute float aTint;
  attribute float aSize;
  attribute float aActivation;
  attribute vec3 aMovementDirection;

  uniform float uProgress;
  uniform float uTime;
  uniform float uPixelRatio;

  varying float vTint;
  varying float vAlpha;
  varying float vEnergy;

  void main() {
    float onePerson = smoothstep(0.14, 0.18, uProgress) * (1.0 - smoothstep(0.24, 0.28, uProgress));
    float onePlace = smoothstep(0.27, 0.31, uProgress) * (1.0 - smoothstep(0.38, 0.42, uProgress));
    float movement = smoothstep(0.40, 0.49, uProgress) * (1.0 - smoothstep(0.83, 0.90, uProgress));
    float together = smoothstep(0.78, 0.83, uProgress) * (1.0 - smoothstep(0.90, 0.95, uProgress));
    float closing = smoothstep(0.90, 0.97, uProgress);

    float individualWave = 1.0 - smoothstep(0.035, 0.11, abs(aActivation - fract(uProgress * 4.8)));
    float groupWave = 1.0 - smoothstep(0.09, 0.24, abs(aGroupId / 8.0 - fract(uProgress * 2.2)));
    float rhythm = sin(uTime * 1.15 + position.x * 1.4 + position.y * 2.1 + aActivation * 6.28318);
    float creativeWave = sin(position.x * 2.0 + uTime * 0.32) * cos(position.y * 2.5 - uTime * 0.24);

    vec3 transformed = position;
    transformed += aMovementDirection * movement * (0.45 + rhythm * 0.28);
    transformed.x += creativeWave * movement * smoothstep(0.57, 0.66, uProgress) * 0.018;
    transformed.z += individualWave * onePerson * 0.13;
    transformed.z += groupWave * onePlace * 0.09;
    transformed.z += sin(uTime * 0.24 + position.x) * 0.012 * (1.0 - closing);
    transformed.xy = mix(transformed.xy, position.xy, together * 0.78 + closing);
    transformed.z = mix(transformed.z, position.z, closing);

    vec4 modelPosition = modelMatrix * vec4(transformed, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    float pulse = max(individualWave * onePerson, groupWave * onePlace);
    float sizeBoost = pulse * 1.6 + movement * max(0.0, rhythm) * 0.35 + together * 0.25;
    gl_PointSize = (1.65 + aSize * 1.4 + sizeBoost) * uPixelRatio * (7.0 / -viewPosition.z);

    vTint = aTint;
    vEnergy = max(pulse, movement * smoothstep(0.68, 1.0, aActivation));
    vAlpha = 0.64 + pulse * 0.28 + movement * 0.1 + closing * 0.08;
  }
`;

const fragmentShader = `
  varying float vTint;
  varying float vAlpha;
  varying float vEnergy;

  void main() {
    vec2 point = gl_PointCoord - 0.5;
    float distanceToCenter = length(point);
    if (distanceToCenter > 0.5) discard;

    float softEdge = 1.0 - smoothstep(0.19, 0.5, distanceToCenter);
    vec3 ivory = vec3(0.957, 0.945, 0.918);
    vec3 warmWhite = vec3(1.0, 0.976, 0.92);
    vec3 flagRed = vec3(0.906, 0.0, 0.067);
    float redMask = step(mix(0.82, 0.67, vEnergy), vTint);
    vec3 color = mix(mix(ivory, warmWhite, vEnergy * 0.45), flagRed, redMask);
    gl_FragColor = vec4(color, softEdge * vAlpha);
  }
`;

export function MovementParticles({ data, pixelRatio, progressRef }: MovementParticlesProps) {
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
        <bufferAttribute attach="attributes-aGroupId" args={[data.particles.groupIds, 1]} />
        <bufferAttribute attach="attributes-aTint" args={[data.particles.tints, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[data.particles.sizes, 1]} />
        <bufferAttribute attach="attributes-aActivation" args={[data.activations, 1]} />
        <bufferAttribute attach="attributes-aMovementDirection" args={[data.movementDirections, 3]} />
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
