"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { mapMovementProgress } from "../animation/movement-progress";
import type { MovementSceneData } from "../data/movement-scene-data";
import type { MovementProgressRef } from "../types";

const ORIGIN_POINT = new Float32Array([0, 0, 0]);

const pointVertexShader = `
  uniform float uSize;
  void main() {
    vec4 viewPosition = viewMatrix * modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = uSize;
  }
`;

const coreFragmentShader = `
  uniform float uOpacity;
  void main() {
    float radius = length(gl_PointCoord - 0.5);
    if (radius > 0.5) discard;
    float edge = 1.0 - smoothstep(0.31, 0.5, radius);
    gl_FragColor = vec4(1.0, 0.08, 0.16, edge * uOpacity);
  }
`;

const haloFragmentShader = `
  uniform float uOpacity;
  void main() {
    float radius = length(gl_PointCoord - 0.5);
    if (radius > 0.5) discard;
    float halo = pow(max(0.0, 1.0 - radius * 2.0), 2.8);
    gl_FragColor = vec4(0.91, 0.0, 0.07, halo * uOpacity);
  }
`;

function samplePosition(points: Float32Array, t: number, target: THREE.Vector3) {
  const count = points.length / 3;
  const scaled = Math.min(0.9999, Math.max(0, t)) * (count - 1);
  const current = Math.floor(scaled);
  const next = Math.min(count - 1, current + 1);
  const mix = scaled - current;
  target.set(
    THREE.MathUtils.lerp(points[current * 3], points[next * 3], mix),
    THREE.MathUtils.lerp(points[current * 3 + 1], points[next * 3 + 1], mix),
    THREE.MathUtils.lerp(points[current * 3 + 2], points[next * 3 + 2], mix),
  );
}

export function MovementPulse({
  data,
  pixelRatio,
  progressRef,
}: {
  data: MovementSceneData;
  pixelRatio: number;
  progressRef: MovementProgressRef;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const coreMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const haloMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const elapsedRef = useRef(0);
  const point = useMemo(() => new THREE.Vector3(), []);
  const coreUniforms = useMemo(
    () => ({ uSize: { value: 8 * pixelRatio }, uOpacity: { value: 0 } }),
    [pixelRatio],
  );
  const haloUniforms = useMemo(
    () => ({ uSize: { value: 38 * pixelRatio }, uOpacity: { value: 0 } }),
    [pixelRatio],
  );

  useFrame((_, delta) => {
    const group = groupRef.current;
    const core = coreMaterialRef.current;
    const halo = haloMaterialRef.current;
    if (!group || !core || !halo) return;
    elapsedRef.current += delta;
    const progress = progressRef.current;
    const route = data.routes[0];
    let routeProgress = 0;
    let aligned = false;

    if (progress < 0.12) {
      routeProgress = 0;
    } else if (progress < 0.48) {
      routeProgress = mapMovementProgress(progress, 0.12, 0.48, 0, 0.2);
    } else if (progress < 0.72) {
      const people = mapMovementProgress(progress, 0.48, 0.72);
      const observationPause = Math.sin(people * Math.PI * 12) * 0.006;
      routeProgress = 0.2 + (people - observationPause) * 0.55;
    } else if (progress < 0.9) {
      routeProgress = mapMovementProgress(progress, 0.72, 0.9, 0.75, 0.9);
      aligned = progress > 0.8;
    } else {
      routeProgress = mapMovementProgress(progress, 0.9, 0.97, 0.42, 1);
      aligned = true;
    }

    samplePosition(aligned ? route.alignedPoints : route.points, routeProgress, point);
    group.position.lerp(point, 1 - Math.exp(-delta * 18));

    const breath = 0.82 + Math.sin(elapsedRef.current * (Math.PI * 2 / 2.8)) * 0.12;
    const finalEnergy = mapMovementProgress(progress, 0.9, 0.97);
    const exit = 1 - mapMovementProgress(progress, 0.985, 1);
    const visible = exit;
    core.uniforms.uSize.value = (7.2 * breath + finalEnergy * 3.2) * pixelRatio;
    core.uniforms.uOpacity.value = visible;
    halo.uniforms.uSize.value = (34 * breath + finalEnergy * 18) * pixelRatio;
    halo.uniforms.uOpacity.value = visible * (progress < 0.12 ? 0.24 : 0.16 + finalEnergy * 0.08);
  });

  return (
    <group ref={groupRef} renderOrder={9}>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[ORIGIN_POINT, 3]} /></bufferGeometry>
        <shaderMaterial
          ref={haloMaterialRef}
          vertexShader={pointVertexShader}
          fragmentShader={haloFragmentShader}
          uniforms={haloUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[ORIGIN_POINT, 3]} /></bufferGeometry>
        <shaderMaterial
          ref={coreMaterialRef}
          vertexShader={pointVertexShader}
          fragmentShader={coreFragmentShader}
          uniforms={coreUniforms}
          transparent
          depthWrite={false}
        />
      </points>
    </group>
  );
}
