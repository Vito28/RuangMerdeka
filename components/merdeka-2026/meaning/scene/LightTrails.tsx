"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { createDirectionCurve, createPrimaryRibbonCurve } from "./meaning-curves";
import type { MeaningProgressRef } from "../types";

type LightTrailsProps = {
  count: number;
  progressRef: MeaningProgressRef;
};

function createTrailGeometry(count: number) {
  const segments = 96;
  const verticesPerSegment = 6;
  const vertexCount = count * segments * verticesPerSegment;
  const positions = new Float32Array(vertexCount * 3);
  const offsets = new Float32Array(vertexCount * 3);
  const ribbonTargets = new Float32Array(vertexCount * 3);
  const along = new Float32Array(vertexCount);
  const seeds = new Float32Array(vertexCount);
  const weights = new Float32Array(vertexCount);
  const colors = new Float32Array(vertexCount);
  let vertex = 0;

  for (let trail = 0; trail < count; trail += 1) {
    const seed = trail / Math.max(1, count - 1);
    const directionCurve = createDirectionCurve(trail, count);
    const ribbonCurve = createPrimaryRibbonCurve(trail % 2);
    const hierarchy = trail < 2 ? 1 : trail % 4 === 0 ? 0.56 : 0.3;
    const color = trail % 5 === 0 ? 2 : trail % 2;
    const halfWidth = trail < 2 ? 0.018 : trail % 4 === 0 ? 0.011 : 0.0065;

    for (let segment = 0; segment < segments; segment += 1) {
      const t0 = segment / segments;
      const t1 = (segment + 1) / segments;
      const p0 = directionCurve.getPointAt(t0);
      const p1 = directionCurve.getPointAt(t1);
      const target0 = ribbonCurve.getPointAt(t0);
      const target1 = ribbonCurve.getPointAt(t1);
      const tangent0 = directionCurve.getTangentAt(t0);
      const tangent1 = directionCurve.getTangentAt(t1);
      const normal0 = new THREE.Vector3(-tangent0.y, tangent0.x, 0.12).normalize().multiplyScalar(halfWidth);
      const normal1 = new THREE.Vector3(-tangent1.y, tangent1.x, 0.12).normalize().multiplyScalar(halfWidth);
      const centers = [p0, p0, p1, p0, p1, p1];
      const targets = [target0, target0, target1, target0, target1, target1];
      const sides = [-1, 1, 1, -1, 1, -1];
      const times = [t0, t0, t1, t0, t1, t1];

      for (let corner = 0; corner < verticesPerSegment; corner += 1) {
        const center = centers[corner];
        const target = targets[corner];
        const normal = times[corner] === t0 ? normal0 : normal1;
        positions.set(center.toArray(), vertex * 3);
        ribbonTargets.set(target.toArray(), vertex * 3);
        offsets.set(normal.clone().multiplyScalar(sides[corner]).toArray(), vertex * 3);
        along[vertex] = times[corner];
        seeds[vertex] = seed;
        weights[vertex] = hierarchy;
        colors[vertex] = color;
        vertex += 1;
      }
    }
  }

  return { positions, offsets, ribbonTargets, along, seeds, weights, colors };
}

const vertexShader = `
  attribute vec3 aOffset;
  attribute vec3 aRibbonTarget;
  attribute float aAlong;
  attribute float aSeed;
  attribute float aWeight;
  attribute float aColor;
  uniform float uProgress;
  uniform float uTime;
  varying float vAlong;
  varying float vColor;
  varying float vSeed;
  varying float vVisible;
  varying float vWeight;

  void main() {
    float enter = smoothstep(0.22, 0.31, uProgress);
    float merge = smoothstep(0.45, 0.62, uProgress);
    float leave = 1.0 - smoothstep(0.69, 0.8, uProgress);
    vec3 transformed = mix(position, aRibbonTarget, merge);
    transformed += aOffset * mix(1.0, 0.58, merge);
    transformed.y += sin(aAlong * 8.0 + uTime * 0.42 + aSeed * 9.0) * 0.028 * enter * (1.0 - merge);
    transformed.z += cos(aAlong * 5.0 + uTime * 0.3 + aSeed * 5.0) * 0.04 * enter * (1.0 - merge);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
    vAlong = aAlong;
    vColor = aColor;
    vSeed = aSeed;
    vVisible = enter * leave;
    vWeight = aWeight;
  }
`;

const fragmentShader = `
  uniform float uProgress;
  uniform float uTime;
  varying float vAlong;
  varying float vColor;
  varying float vSeed;
  varying float vVisible;
  varying float vWeight;

  void main() {
    float pulseCenter = fract(uTime * (0.11 + vSeed * 0.035) + uProgress * 1.35 + vSeed);
    float pulseDistance = abs(fract(vAlong - pulseCenter + 0.5) - 0.5);
    float signal = 1.0 - smoothstep(0.025, 0.13, pulseDistance);
    float breath = 0.74 + 0.26 * sin(uTime * (1.45 + vSeed * 0.75) + vSeed * 9.0);
    vec3 red = vec3(0.91, 0.0, 0.07);
    vec3 ivory = vec3(0.952, 0.941, 0.918);
    vec3 darkRed = vec3(0.36, 0.015, 0.04);
    vec3 color = vColor < 0.5 ? red : (vColor < 1.5 ? ivory : darkRed);
    color = mix(color * 0.58, color, signal);
    float alpha = vVisible * vWeight * (0.22 + signal * 0.64) * breath;
    gl_FragColor = vec4(color, alpha);
  }
`;

export function LightTrails({ count, progressRef }: LightTrailsProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => createTrailGeometry(count), [count]);
  const uniforms = useMemo(() => ({ uProgress: { value: 0 }, uTime: { value: 0 } }), []);

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
    <mesh>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[geometry.positions, 3]} />
        <bufferAttribute attach="attributes-aOffset" args={[geometry.offsets, 3]} />
        <bufferAttribute attach="attributes-aRibbonTarget" args={[geometry.ribbonTargets, 3]} />
        <bufferAttribute attach="attributes-aAlong" args={[geometry.along, 1]} />
        <bufferAttribute attach="attributes-aSeed" args={[geometry.seeds, 1]} />
        <bufferAttribute attach="attributes-aWeight" args={[geometry.weights, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[geometry.colors, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
