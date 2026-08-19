"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import type { CollectiveQuality } from "../types";
import { easeInOut, mapRange, QUALITY_CONFIG, seededRandom } from "./field-utils";

type VoiceLandscapeProps = {
  progressRef: MutableRefObject<number>;
  quality: CollectiveQuality;
  active: boolean;
  hasUserSignal: boolean;
};

export function VoiceLandscape({ progressRef, quality, active, hasUserSignal }: VoiceLandscapeProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const tipsRef = useRef<THREE.Points>(null);
  const tipsMaterialRef = useRef<THREE.PointsMaterial>(null);
  const userTipRef = useRef<THREE.Mesh>(null);
  const transformRef = useRef(new THREE.Object3D());
  const elapsedRef = useRef(0);
  const count = QUALITY_CONFIG[quality].filaments;

  const field = useMemo(() => {
    const random = seededRandom(8172026);
    const x = new Float32Array(count);
    const z = new Float32Array(count);
    const height = new Float32Array(count);
    const width = new Float32Array(count);
    const phase = new Float32Array(count);
    const tone = new Uint8Array(count);
    const tipPositions = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      x[index] = (random() - 0.5) * 13.2;
      z[index] = (random() - 0.5) * 7.5;
      const cluster = index % 9;
      const band = cluster < 4 ? 0.62 : cluster < 7 ? 1.15 : 1.9;
      height[index] = band + random() * (cluster < 4 ? 0.48 : cluster < 7 ? 0.82 : 1.35);
      width[index] = 0.01 + random() * 0.018;
      phase[index] = random() * Math.PI * 2;
      const selector = random();
      tone[index] = selector < 0.15 ? 2 : selector < 0.4 ? 1 : 0;
    }
    return { x, z, height, width, phase, tone, tipPositions };
  }, [count]);

  const colors = useMemo(() => ({
    bone: new THREE.Color("#d8d5cf"),
    deepRed: new THREE.Color("#65101b"),
    red: new THREE.Color("#e60012"),
    hotRed: new THREE.Color("#ff1b31"),
    white: new THREE.Color("#f2efe9"),
  }), []);

  useEffect(() => {
    if (!meshRef.current) return;
    meshRef.current.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  }, []);

  useFrame((_, delta) => {
    if (!active || !meshRef.current || !materialRef.current || !tipsRef.current || !tipsMaterialRef.current) return;
    elapsedRef.current += Math.min(delta, 0.05);
    const progress = progressRef.current;
    const reveal = easeInOut(mapRange(progress, 0.32, 0.52));
    const spread = easeInOut(mapRange(progress, 0.69, 0.75));
    const pulseProgress = mapRange(progress, 0.76, 0.91);
    const horizon = easeInOut(mapRange(progress, 0.91, 1));
    const sweepX = THREE.MathUtils.lerp(-7.5, 7.5, pulseProgress);
    const whiteSweepX = sweepX - 0.92;
    const transform = transformRef.current;
    const tips = (tipsRef.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;

    for (let index = 0; index < count; index += 1) {
      const x = field.x[index] * (1 + spread * 0.14);
      const z = field.z[index] - horizon * 3.8;
      const redReaction = Math.max(0, 1 - Math.abs(x - sweepX) / 0.72) * (pulseProgress > 0 && pulseProgress < 1 ? 1 : 0);
      const whiteReaction = Math.max(0, 1 - Math.abs(x - whiteSweepX) / 0.52) * (pulseProgress > 0.06 && pulseProgress < 1 ? 1 : 0);
      const breathe = 1 + Math.sin(elapsedRef.current * (0.55 + (index % 7) * 0.035) + field.phase[index]) * 0.035;
      const userAccent = hasUserSignal && index === 17 ? 0.12 + Math.sin(elapsedRef.current * 2.4) * 0.05 : 0;
      const filamentHeight = Math.max(
        0.002,
        field.height[index] * reveal * breathe * (1 + redReaction * 0.18 + whiteReaction * 0.08 + userAccent) * (1 - horizon * 0.93),
      );
      const groundY = -2.1 + horizon * 0.35;

      transform.position.set(x, groundY + filamentHeight * 0.5, z);
      transform.rotation.set(0, 0, Math.sin(field.phase[index]) * 0.025 * (1 - horizon));
      transform.scale.set(field.width[index], filamentHeight, field.width[index]);
      transform.updateMatrix();
      meshRef.current.setMatrixAt(index, transform.matrix);

      const baseColor = field.tone[index] === 2 ? colors.red : field.tone[index] === 1 ? colors.deepRed : colors.bone;
      if (hasUserSignal && index === 17) {
        meshRef.current.setColorAt(index, colors.hotRed);
      } else if (whiteReaction > redReaction && whiteReaction > 0.05) {
        meshRef.current.setColorAt(index, colors.white);
      } else if (redReaction > 0.05) {
        meshRef.current.setColorAt(index, colors.hotRed);
      } else {
        meshRef.current.setColorAt(index, baseColor);
      }

      const tipOffset = index * 3;
      tips[tipOffset] = x;
      tips[tipOffset + 1] = groundY + filamentHeight;
      tips[tipOffset + 2] = z;

      if (index === 17 && userTipRef.current) {
        userTipRef.current.position.set(x, groundY + filamentHeight, z);
        const userPulse = 1 + Math.sin(elapsedRef.current * 2.4) * 0.12;
        userTipRef.current.scale.setScalar(userPulse * (1 - horizon * 0.6));
        userTipRef.current.visible = hasUserSignal && reveal > 0.02;
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    (tipsRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    materialRef.current.opacity = THREE.MathUtils.damp(materialRef.current.opacity, reveal * 0.68 * (1 - horizon * 0.58), 7, delta);
    tipsMaterialRef.current.opacity = THREE.MathUtils.damp(tipsMaterialRef.current.opacity, reveal * 0.42 * (1 - horizon * 0.72), 7, delta);
  });

  return (
    <group>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          ref={materialRef}
          vertexColors
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </instancedMesh>
      <points ref={tipsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[field.tipPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={tipsMaterialRef}
          color="#f2efe9"
          transparent
          opacity={0}
          size={quality === "low" ? 0.045 : 0.032}
          sizeAttenuation
          depthWrite={false}
          toneMapped={false}
        />
      </points>
      <mesh ref={userTipRef} visible={false}>
        <sphereGeometry args={[0.038, 12, 12]} />
        <meshBasicMaterial color="#ff1b31" toneMapped={false} />
      </mesh>
    </group>
  );
}
