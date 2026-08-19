"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef, type MutableRefObject } from "react";

type VoiceSignalFieldProps = {
  progressRef: MutableRefObject<number>;
  submitted: boolean;
  active: boolean;
};

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

export default function VoiceSignalField({ progressRef, submitted, active }: VoiceSignalFieldProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pointsMaterialRef = useRef<THREE.PointsMaterial>(null);
  const linesMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  const signalRef = useRef<THREE.Mesh>(null);
  const elapsedRef = useRef(0);

  const field = useMemo(() => {
    const random = seededRandom(17082026);
    const count = 180;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const bone = new THREE.Color("#f4f1ea");
    const red = new THREE.Color("#e70011");

    for (let index = 0; index < count; index += 1) {
      const radius = 0.45 + random() * 4.8;
      const angle = random() * Math.PI * 2;
      positions[index * 3] = Math.cos(angle) * radius * 1.45;
      positions[index * 3 + 1] = Math.sin(angle) * radius * 0.66;
      positions[index * 3 + 2] = (random() - 0.5) * 3.2;
      const color = random() < 0.19 ? red : bone;
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
    }

    const lineCount = 44;
    const linePositions = new Float32Array(lineCount * 6);
    for (let index = 0; index < lineCount; index += 1) {
      const source = Math.floor(random() * count) * 3;
      const target = Math.floor(random() * count) * 3;
      linePositions.set(
        [
          positions[source], positions[source + 1], positions[source + 2],
          positions[target], positions[target + 1], positions[target + 2],
        ],
        index * 6,
      );
    }

    return { positions, colors, linePositions };
  }, []);

  useFrame((_, delta) => {
    if (!active) return;
    elapsedRef.current += Math.min(delta, 0.05);
    const progress = progressRef.current;
    const reveal = THREE.MathUtils.smoothstep(progress, 0.82, 0.98);
    const breath = 1 + Math.sin(elapsedRef.current * 0.7) * 0.012;

    if (groupRef.current) {
      groupRef.current.scale.setScalar((0.2 + reveal * 0.8) * breath);
      groupRef.current.rotation.z = Math.sin(elapsedRef.current * 0.16) * 0.012;
      groupRef.current.position.z = -1.5 + reveal * 1.5;
    }
    if (pointsMaterialRef.current) pointsMaterialRef.current.opacity = reveal * 0.62;
    if (linesMaterialRef.current) linesMaterialRef.current.opacity = reveal * 0.09;
    if (signalRef.current) {
      const pulse = 1 + Math.sin(elapsedRef.current * 3.2) * 0.14;
      signalRef.current.scale.setScalar(pulse * (submitted ? 1.3 : 0.82));
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[field.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[field.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={pointsMaterialRef}
          vertexColors
          transparent
          opacity={0}
          size={0.034}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[field.linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={linesMaterialRef}
          color="#f4f1ea"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </lineSegments>

      <mesh ref={signalRef}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshBasicMaterial color={submitted ? "#ff2738" : "#e70011"} toneMapped={false} />
      </mesh>
    </group>
  );
}
