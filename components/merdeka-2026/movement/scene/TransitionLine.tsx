"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { MovementSceneData } from "../data/movement-scene-data";
import type { MovementProgressRef } from "../types";

const vertexShader = `
  attribute vec3 aPathPosition;
  attribute float aAlong;
  uniform float uProgress;
  uniform float uTime;
  varying float vAlpha;
  varying float vEnergy;

  void main() {
    float travel = smoothstep(0.105, 0.16, uProgress);
    vec3 transformed = mix(position, aPathPosition, travel);
    vec4 viewPosition = viewMatrix * modelMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    vAlpha = 1.0 - smoothstep(0.105, 0.155, uProgress);
    float breath = 0.76 + sin(uTime * 2.24399) * 0.16;
    vEnergy = (1.0 - smoothstep(0.0, 0.12, uProgress)) * (1.0 - smoothstep(0.03, 0.17, abs(aAlong - 0.5))) * breath;
  }
`;

const fragmentShader = `
  varying float vAlpha;
  varying float vEnergy;
  void main() {
    vec3 color = mix(vec3(0.82, 0.0, 0.055), vec3(1.0, 0.1, 0.18), vEnergy);
    gl_FragColor = vec4(color, vAlpha * (0.76 + vEnergy * 0.24));
  }
`;

export function TransitionLine({ data, progressRef }: { data: MovementSceneData; progressRef: MovementProgressRef }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const elapsedRef = useRef(0);
  const uniforms = useMemo(() => ({ uProgress: { value: 0 }, uTime: { value: 0 } }), []);
  const geometry = useMemo(() => {
    const samples = 48;
    const segmentVertexCount = (samples - 1) * 2;
    const positions = new Float32Array(segmentVertexCount * 3);
    const pathPositions = new Float32Array(segmentVertexCount * 3);
    const along = new Float32Array(segmentVertexCount);
    const route = data.routes[0].points;
    let p = 0;
    let a = 0;
    for (let index = 1; index < samples; index += 1) {
      for (const step of [index - 1, index]) {
        const t = step / (samples - 1);
        positions[p] = THREE.MathUtils.lerp(-5.8, 5.8, t);
        positions[p + 1] = 0;
        positions[p + 2] = 1.3;
        pathPositions[p] = route[step * 3];
        pathPositions[p + 1] = route[step * 3 + 1];
        pathPositions[p + 2] = route[step * 3 + 2];
        p += 3;
        along[a] = t;
        a += 1;
      }
    }
    return { positions, pathPositions, along };
  }, [data]);

  useFrame((_, delta) => {
    if (!materialRef.current) return;
    elapsedRef.current += delta;
    materialRef.current.uniforms.uTime.value = elapsedRef.current;
    materialRef.current.uniforms.uProgress.value = THREE.MathUtils.damp(
      materialRef.current.uniforms.uProgress.value,
      progressRef.current,
      10,
      delta,
    );
  });

  return (
    <lineSegments renderOrder={4}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[geometry.positions, 3]} />
        <bufferAttribute attach="attributes-aPathPosition" args={[geometry.pathPositions, 3]} />
        <bufferAttribute attach="attributes-aAlong" args={[geometry.along, 1]} />
      </bufferGeometry>
      <shaderMaterial ref={materialRef} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} transparent depthWrite={false} />
    </lineSegments>
  );
}
