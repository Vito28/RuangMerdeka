"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { MovementSceneData } from "../data/movement-scene-data";
import type { MovementProgressRef } from "../types";

const signalVertexShader = `
  attribute float aSeed;
  attribute float aTint;
  attribute float aSize;
  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelRatio;
  varying float vAlpha;
  varying float vTint;

  void main() {
    float field = smoothstep(0.10, 0.34, uProgress) * (1.0 - smoothstep(0.91, 0.99, uProgress));
    float people = smoothstep(0.47, 0.52, uProgress) * (1.0 - smoothstep(0.70, 0.75, uProgress));
    float beat = 0.5 + 0.5 * sin(uTime * (0.45 + aSeed * 0.65) + aSeed * 23.0);
    vec3 transformed = position;
    transformed.x += sin(uTime * 0.18 + aSeed * 17.0) * (0.025 + people * 0.035);
    transformed.y += cos(uTime * 0.15 + aSeed * 11.0) * (0.02 + people * 0.03);
    transformed.z += sin(uTime * 0.11 + aSeed * 7.0) * 0.035;
    vec4 viewPosition = viewMatrix * modelMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = min(7.0, (1.8 + aSize * 2.2 + beat * 0.8) * uPixelRatio * (5.0 / max(2.5, -viewPosition.z)));
    vAlpha = field * (0.32 + beat * 0.46) * (1.0 - people * 0.2);
    vTint = aTint;
  }
`;

const signalFragmentShader = `
  varying float vAlpha;
  varying float vTint;
  void main() {
    float distanceToCenter = length(gl_PointCoord - 0.5);
    if (distanceToCenter > 0.5) discard;
    float edge = 1.0 - smoothstep(0.22, 0.5, distanceToCenter);
    vec3 red = vec3(0.902, 0.0, 0.071);
    vec3 bone = vec3(0.949, 0.937, 0.906);
    vec3 darkRed = vec3(0.42, 0.025, 0.055);
    vec3 color = vTint < 0.70 ? red : (vTint < 0.90 ? bone : darkRed);
    gl_FragColor = vec4(color, edge * vAlpha);
  }
`;

const dustVertexShader = `
  attribute float aSeed;
  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelRatio;
  varying float vAlpha;

  void main() {
    float field = smoothstep(0.04, 0.28, uProgress) * (1.0 - smoothstep(0.94, 1.0, uProgress));
    vec3 transformed = position;
    transformed.x += sin(uTime * 0.045 + aSeed * 18.0) * 0.055;
    transformed.y += cos(uTime * 0.038 + aSeed * 12.0) * 0.045;
    vec4 viewPosition = viewMatrix * modelMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = min(2.2, (0.65 + aSeed * 1.0) * uPixelRatio * (4.5 / max(3.0, -viewPosition.z)));
    vAlpha = field * (0.035 + aSeed * 0.065);
  }
`;

const dustFragmentShader = `
  varying float vAlpha;
  void main() {
    float distanceToCenter = length(gl_PointCoord - 0.5);
    if (distanceToCenter > 0.5) discard;
    float edge = 1.0 - smoothstep(0.12, 0.5, distanceToCenter);
    gl_FragColor = vec4(0.92, 0.88, 0.82, edge * vAlpha);
  }
`;

type MovementAtmosphereProps = {
  data: MovementSceneData;
  pixelRatio: number;
  progressRef: MovementProgressRef;
};

export function MovementAtmosphere({ data, pixelRatio, progressRef }: MovementAtmosphereProps) {
  const signalMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const dustMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const elapsedRef = useRef(0);
  const signalUniforms = useMemo(
    () => ({ uTime: { value: 0 }, uProgress: { value: 0 }, uPixelRatio: { value: pixelRatio } }),
    [pixelRatio],
  );
  const dustUniforms = useMemo(
    () => ({ uTime: { value: 0 }, uProgress: { value: 0 }, uPixelRatio: { value: pixelRatio } }),
    [pixelRatio],
  );

  useFrame((_, delta) => {
    elapsedRef.current += delta;
    for (const material of [signalMaterialRef.current, dustMaterialRef.current]) {
      if (!material) continue;
      material.uniforms.uTime.value = elapsedRef.current;
      material.uniforms.uProgress.value = THREE.MathUtils.damp(
        material.uniforms.uProgress.value,
        progressRef.current,
        7,
        delta,
      );
    }
  });

  return (
    <>
      <points renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.dustPositions, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[data.dustSeeds, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={dustMaterialRef}
          vertexShader={dustVertexShader}
          fragmentShader={dustFragmentShader}
          uniforms={dustUniforms}
          transparent
          depthWrite={false}
        />
      </points>
      <points renderOrder={2}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.signalPositions, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[data.signalSeeds, 1]} />
          <bufferAttribute attach="attributes-aTint" args={[data.signalTints, 1]} />
          <bufferAttribute attach="attributes-aSize" args={[data.signalSizes, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={signalMaterialRef}
          vertexShader={signalVertexShader}
          fragmentShader={signalFragmentShader}
          uniforms={signalUniforms}
          transparent
          depthWrite={false}
        />
      </points>
    </>
  );
}
