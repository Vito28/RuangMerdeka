"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";

type MerdekaSceneProps = {
  progressRef: MutableRefObject<number>;
};

type Island = {
  x: number;
  y: number;
  rx: number;
  ry: number;
  rotation: number;
  weight: number;
};

const islands: Island[] = [
  { x: -2.45, y: 0.45, rx: 1.3, ry: 0.34, rotation: -0.62, weight: 15 },
  { x: -0.95, y: -0.45, rx: 1.6, ry: 0.16, rotation: -0.08, weight: 17 },
  { x: -0.35, y: 0.5, rx: 0.75, ry: 0.68, rotation: 0.18, weight: 16 },
  { x: 0.85, y: 0.58, rx: 0.48, ry: 0.68, rotation: 0.22, weight: 10 },
  { x: 1.12, y: 0.85, rx: 0.65, ry: 0.15, rotation: 0.65, weight: 5 },
  { x: 1.15, y: 0.22, rx: 0.66, ry: 0.14, rotation: -0.75, weight: 5 },
  { x: 2.85, y: 0.35, rx: 1.08, ry: 0.56, rotation: -0.12, weight: 16 },
  { x: 1.15, y: -0.48, rx: 0.17, ry: 0.14, rotation: 0, weight: 2 },
  { x: 1.58, y: -0.52, rx: 0.15, ry: 0.12, rotation: 0, weight: 2 },
  { x: 2, y: -0.47, rx: 0.12, ry: 0.1, rotation: 0, weight: 2 },
  { x: 2.32, y: -0.38, rx: 0.1, ry: 0.09, rotation: 0, weight: 2 },
  { x: 1.85, y: 0.28, rx: 0.12, ry: 0.18, rotation: 0.3, weight: 2 },
  { x: 2.1, y: 0.05, rx: 0.1, ry: 0.14, rotation: -0.4, weight: 2 },
];

const vertexShader = `
  attribute vec3 aScatter;
  attribute float aTint;
  uniform float uProgress;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vTint;
  varying float vAlpha;

  void main() {
    float formation = smoothstep(0.04, 0.72, uProgress);
    vec3 formed = mix(aScatter, position, formation);
    formed.z += sin(uTime * 0.32 + position.x * 1.8) * 0.035 * formation;
    vec4 modelPosition = modelMatrix * vec4(formed, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = (2.2 + aTint * 1.2) * uPixelRatio * (7.0 / -viewPosition.z);
    vTint = aTint;
    vAlpha = mix(0.0, 0.92, smoothstep(0.0, 0.26, uProgress));
  }
`;

const fragmentShader = `
  varying float vTint;
  varying float vAlpha;

  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    if (dist > 0.5) discard;
    float softEdge = 1.0 - smoothstep(0.24, 0.5, dist);
    vec3 ivory = vec3(0.957, 0.945, 0.918);
    vec3 red = vec3(0.784, 0.063, 0.18);
    vec3 color = mix(ivory, red, step(0.72, vTint));
    gl_FragColor = vec4(color, softEdge * vAlpha);
  }
`;

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function createPointData(count: number) {
  const random = seededRandom(17081945);
  const positions = new Float32Array(count * 3);
  const scatter = new Float32Array(count * 3);
  const tint = new Float32Array(count);
  const totalWeight = islands.reduce((sum, island) => sum + island.weight, 0);

  for (let index = 0; index < count; index += 1) {
    let pick = random() * totalWeight;
    let island = islands[0];

    for (const candidate of islands) {
      pick -= candidate.weight;
      if (pick <= 0) {
        island = candidate;
        break;
      }
    }

    const radius = Math.sqrt(random());
    const angle = random() * Math.PI * 2;
    const localX = Math.cos(angle) * radius * island.rx;
    const localY = Math.sin(angle) * radius * island.ry;
    const cos = Math.cos(island.rotation);
    const sin = Math.sin(island.rotation);
    const offset = index * 3;

    positions[offset] = island.x + localX * cos - localY * sin;
    positions[offset + 1] = island.y + localX * sin + localY * cos;
    positions[offset + 2] = (random() - 0.5) * 0.22;

    const scatterRadius = 2.8 + random() * 3.8;
    const scatterAngle = random() * Math.PI * 2;
    scatter[offset] = Math.cos(scatterAngle) * scatterRadius;
    scatter[offset + 1] = Math.sin(scatterAngle) * scatterRadius;
    scatter[offset + 2] = (random() - 0.5) * 5;
    tint[index] = random();
  }

  return { positions, scatter, tint };
}

function Archipelago({ progressRef }: MerdekaSceneProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { size, pointer, gl } = useThree();
  const [reducedMotion, setReducedMotion] = useState(false);
  const count = size.width < 768 ? 900 : 3200;
  const data = useMemo(() => createPointData(count), [count]);
  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 1.5) },
    }),
    [gl],
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useFrame(({ clock }, delta) => {
    if (!materialRef.current || !groupRef.current) return;

    const progress = reducedMotion ? 1 : progressRef.current;
    materialRef.current.uniforms.uProgress.value = THREE.MathUtils.damp(
      materialRef.current.uniforms.uProgress.value,
      progress,
      5,
      delta,
    );
    materialRef.current.uniforms.uTime.value = reducedMotion ? 0 : clock.elapsedTime;

    const targetX = reducedMotion ? 0 : pointer.y * 0.025;
    const targetY = reducedMotion ? 0 : pointer.x * 0.045 + progress * 0.08;
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetX, 3, delta);
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetY, 3, delta);
  });

  return (
    <group ref={groupRef} scale={size.width < 768 ? 0.76 : 1}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
          <bufferAttribute attach="attributes-aScatter" args={[data.scatter, 3]} />
          <bufferAttribute attach="attributes-aTint" args={[data.tint, 1]} />
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
    </group>
  );
}

export default function MerdekaScene({ progressRef }: MerdekaSceneProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7], fov: 46, near: 0.1, far: 30 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor("#101010", 1)}
    >
      <Archipelago progressRef={progressRef} />
    </Canvas>
  );
}
