"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { createPrimaryRibbonCurve } from "./meaning-curves";
import type { MeaningProgressRef } from "../types";

type FlowRibbonsProps = {
  count: number;
  progressRef: MeaningProgressRef;
};

function createRibbonGeometry(count: number) {
  const segments = 96;
  const verticesPerSegment = 6;
  const vertexCount = count * segments * verticesPerSegment;
  const positions = new Float32Array(vertexCount * 3);
  const offsets = new Float32Array(vertexCount * 3);
  const along = new Float32Array(vertexCount);
  const ribbonKinds = new Float32Array(vertexCount);
  const sidesAttribute = new Float32Array(vertexCount);
  let vertex = 0;

  for (let ribbon = 0; ribbon < count; ribbon += 1) {
    const curve = createPrimaryRibbonCurve(ribbon);
    const baseWidth = ribbon === 0 ? 0.27 : ribbon === 1 ? 0.22 : 0.14;

    for (let segment = 0; segment < segments; segment += 1) {
      const t0 = segment / segments;
      const t1 = (segment + 1) / segments;
      const p0 = curve.getPointAt(t0);
      const p1 = curve.getPointAt(t1);
      const tangent0 = curve.getTangentAt(t0);
      const tangent1 = curve.getTangentAt(t1);
      const width0 = baseWidth * (0.84 + Math.sin(t0 * Math.PI * 4 + ribbon) * 0.13);
      const width1 = baseWidth * (0.84 + Math.sin(t1 * Math.PI * 4 + ribbon) * 0.13);
      const normal0 = new THREE.Vector3(
        -tangent0.y,
        tangent0.x,
        Math.sin(t0 * Math.PI * 3 + ribbon * 0.8) * 0.34,
      ).normalize().multiplyScalar(width0);
      const normal1 = new THREE.Vector3(
        -tangent1.y,
        tangent1.x,
        Math.sin(t1 * Math.PI * 3 + ribbon * 0.8) * 0.34,
      ).normalize().multiplyScalar(width1);
      const centers = [p0, p0, p1, p0, p1, p1];
      const sides = [-1, 1, 1, -1, 1, -1];
      const times = [t0, t0, t1, t0, t1, t1];

      for (let corner = 0; corner < verticesPerSegment; corner += 1) {
        const center = centers[corner];
        const normal = times[corner] === t0 ? normal0 : normal1;
        positions.set(center.toArray(), vertex * 3);
        offsets.set(normal.clone().multiplyScalar(sides[corner]).toArray(), vertex * 3);
        along[vertex] = times[corner];
        ribbonKinds[vertex] = ribbon;
        sidesAttribute[vertex] = sides[corner];
        vertex += 1;
      }
    }
  }

  return { positions, offsets, along, ribbonKinds, sides: sidesAttribute };
}

const vertexShader = `
  attribute vec3 aOffset;
  attribute float aAlong;
  attribute float aRibbonKind;
  attribute float aSide;
  uniform float uProgress;
  uniform float uTime;
  varying float vAlong;
  varying float vAlpha;
  varying float vRibbonKind;
  varying float vSide;

  void main() {
    float form = smoothstep(0.53, 0.66, uProgress);
    float leave = 1.0 - smoothstep(0.82, 0.895, uProgress);
    float surfaceLife = 1.0 - smoothstep(0.76, 0.86, uProgress) * 0.72;
    float wave = sin(aAlong * 9.0 + uTime * (0.42 + aRibbonKind * 0.08) + aRibbonKind * 2.3);
    vec3 transformed = position + aOffset * form;
    transformed.y += wave * 0.038 * form * surfaceLife;
    transformed.z += cos(aAlong * 6.0 + uTime * 0.3 + aRibbonKind) * 0.045 * form * surfaceLife;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
    vAlong = aAlong;
    vAlpha = form * leave;
    vRibbonKind = aRibbonKind;
    vSide = aSide;
  }
`;

const fragmentShader = `
  uniform float uProgress;
  uniform float uTime;
  varying float vAlong;
  varying float vAlpha;
  varying float vRibbonKind;
  varying float vSide;

  void main() {
    float speed = vRibbonKind < 0.5 ? 0.16 : (vRibbonKind < 1.5 ? 0.105 : 0.13);
    float pulseCenter = fract(uTime * speed + uProgress * 1.8 + vRibbonKind * 0.21);
    float pulseDistance = abs(fract(vAlong - pulseCenter + 0.5) - 0.5);
    float energy = 1.0 - smoothstep(0.025, 0.16, pulseDistance);
    float secondary = 1.0 - smoothstep(0.012, 0.065, abs(fract(vAlong * 2.0 - pulseCenter + 0.5) - 0.5));
    float edge = 1.0 - smoothstep(0.74, 1.0, abs(vSide));

    vec3 darkRed = vec3(0.31, 0.012, 0.035);
    vec3 red = vec3(0.91, 0.0, 0.07);
    vec3 ivory = vec3(0.88, 0.86, 0.82);
    vec3 pearl = vec3(1.0, 0.985, 0.96);
    vec3 baseColor = vRibbonKind < 0.5 ? red : (vRibbonKind < 1.5 ? ivory : darkRed);
    vec3 peakColor = vRibbonKind < 0.5 ? vec3(1.0, 0.12, 0.1) : pearl;
    vec3 color = mix(baseColor * 0.7, peakColor, energy * 0.76 + secondary * 0.16);
    float baseAlpha = vRibbonKind < 0.5 ? 0.56 : (vRibbonKind < 1.5 ? 0.36 : 0.24);
    float alpha = vAlpha * edge * (baseAlpha + energy * 0.26 + secondary * 0.08);
    gl_FragColor = vec4(color, alpha);
  }
`;

export function FlowRibbons({ count, progressRef }: FlowRibbonsProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => createRibbonGeometry(count), [count]);
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
        <bufferAttribute attach="attributes-aAlong" args={[geometry.along, 1]} />
        <bufferAttribute attach="attributes-aRibbonKind" args={[geometry.ribbonKinds, 1]} />
        <bufferAttribute attach="attributes-aSide" args={[geometry.sides, 1]} />
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
