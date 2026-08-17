"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { mapMeaningProgress } from "../animation/meaning-progress";
import type { MeaningSceneData } from "../data/meaning-scene-data";
import type { MeaningProgressRef } from "../types";

type PulseNetworkProps = {
  data: MeaningSceneData;
  progressRef: MeaningProgressRef;
};

const lineVertexShader = `
  attribute float aBuild;
  attribute float aPath;
  uniform float uProgress;
  uniform float uTime;
  varying float vPulse;
  varying float vVisible;

  void main() {
    float build = smoothstep(0.875, 0.95, uProgress);
    float wave = smoothstep(0.91, 0.985, uProgress) * 1.24 - 0.12;
    float breathing = 0.88 + sin(uTime * 1.35 + aPath * 7.0) * 0.12;
    vVisible = smoothstep(aBuild - 0.08, aBuild + 0.045, build) * breathing;
    vPulse = exp(-abs(aPath - wave) * 19.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const lineFragmentShader = `
  varying float vPulse;
  varying float vVisible;

  void main() {
    vec3 ivory = vec3(0.94, 0.92, 0.88);
    vec3 red = vec3(0.91, 0.0, 0.07);
    vec3 color = mix(ivory, red, vPulse);
    gl_FragColor = vec4(color, vVisible * (0.34 + vPulse * 0.66));
  }
`;

const nodeVertexShader = `
  attribute float aDistance;
  uniform float uProgress;
  uniform float uPixelRatio;
  varying float vPulse;
  varying float vVisible;

  void main() {
    float build = smoothstep(0.88, 0.95, uProgress);
    float wave = smoothstep(0.91, 0.985, uProgress) * 1.24 - 0.12;
    float pulse = exp(-abs(aDistance - wave) * 22.0);
    float visible = smoothstep(aDistance - 0.13, aDistance + 0.045, build);
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = (3.2 + pulse * 7.0) * uPixelRatio * clamp(7.0 / max(0.7, -viewPosition.z), 0.7, 2.35);
    vPulse = pulse;
    vVisible = visible;
  }
`;

const nodeFragmentShader = `
  varying float vPulse;
  varying float vVisible;

  void main() {
    float distanceToCenter = length(gl_PointCoord - 0.5);
    if (distanceToCenter > 0.5) discard;
    float edge = 1.0 - smoothstep(0.12, 0.5, distanceToCenter);
    vec3 ivory = vec3(0.95, 0.94, 0.91);
    vec3 red = vec3(0.91, 0.0, 0.07);
    gl_FragColor = vec4(mix(ivory, red, vPulse), edge * vVisible * (0.42 + vPulse * 0.58));
  }
`;

export function PulseNetwork({ data, progressRef }: PulseNetworkProps) {
  const groupRef = useRef<THREE.Group>(null);
  const nodeMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const lineMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const exitMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  const nodeUniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uPixelRatio: { value: 1.25 },
    }),
    [],
  );
  const lineUniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
    }),
    [],
  );
  const exitLine = useMemo(() => new Float32Array([-4.5, 0, 0, 4.5, 0, 0]), []);

  useFrame(({ clock }, delta) => {
    const progress = progressRef.current;
    const compression = mapMeaningProgress(progress, 0.97, 1);

    if (nodeMaterialRef.current) {
      nodeMaterialRef.current.uniforms.uProgress.value = THREE.MathUtils.damp(
        nodeMaterialRef.current.uniforms.uProgress.value,
        progress,
        8,
        delta,
      );
    }
    if (lineMaterialRef.current) {
      lineMaterialRef.current.uniforms.uProgress.value = THREE.MathUtils.damp(
        lineMaterialRef.current.uniforms.uProgress.value,
        progress,
        8,
        delta,
      );
      lineMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
    }
    if (exitMaterialRef.current) {
      exitMaterialRef.current.opacity = THREE.MathUtils.damp(
        exitMaterialRef.current.opacity,
        compression * 0.86,
        8,
        delta,
      );
    }
    if (groupRef.current) {
      groupRef.current.scale.y = THREE.MathUtils.damp(groupRef.current.scale.y, 1 - compression * 0.975, 7, delta);
      groupRef.current.scale.z = THREE.MathUtils.damp(groupRef.current.scale.z, 1 - compression * 0.92, 7, delta);
    }
  });

  return (
    <>
      <group ref={groupRef}>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[data.pulseConnections, 3]} />
            <bufferAttribute attach="attributes-aBuild" args={[data.pulseConnectionBuild, 1]} />
            <bufferAttribute attach="attributes-aPath" args={[data.pulseConnectionPath, 1]} />
          </bufferGeometry>
          <shaderMaterial
            ref={lineMaterialRef}
            vertexShader={lineVertexShader}
            fragmentShader={lineFragmentShader}
            uniforms={lineUniforms}
            transparent
            depthWrite={false}
          />
        </lineSegments>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[data.pulsePositions, 3]} />
            <bufferAttribute attach="attributes-aDistance" args={[data.pulseDistances, 1]} />
          </bufferGeometry>
          <shaderMaterial
            ref={nodeMaterialRef}
            vertexShader={nodeVertexShader}
            fragmentShader={nodeFragmentShader}
            uniforms={nodeUniforms}
            transparent
            depthWrite={false}
          />
        </points>
      </group>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[exitLine, 3]} />
        </bufferGeometry>
        <lineBasicMaterial ref={exitMaterialRef} color="#e60012" transparent opacity={0} depthWrite={false} />
      </lineSegments>
    </>
  );
}
