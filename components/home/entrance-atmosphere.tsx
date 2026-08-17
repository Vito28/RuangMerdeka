"use client";

import { PointMaterial, Points } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";

function seededRandom(seed: number) {
  let value = seed >>> 0;

  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function createPositions(count: number) {
  const random = seededRandom(20260817);
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;
    positions[offset] = (random() - 0.5) * 9;
    positions[offset + 1] = (random() - 0.5) * 5.5;
    positions[offset + 2] = (random() - 0.5) * 3.5;
  }

  return positions;
}

function DepthField() {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => createPositions(280), []);

  useFrame(({ pointer }, delta) => {
    if (!pointsRef.current) return;

    pointsRef.current.rotation.y = THREE.MathUtils.damp(
      pointsRef.current.rotation.y,
      pointer.x * 0.035,
      2,
      delta,
    );
    pointsRef.current.rotation.x = THREE.MathUtils.damp(
      pointsRef.current.rotation.x,
      pointer.y * 0.018,
      2,
      delta,
    );
    pointsRef.current.rotation.z += delta * 0.0035;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        color="#f4f1ea"
        size={0.018}
        sizeAttenuation
        transparent
        opacity={0.3}
        depthWrite={false}
      />
    </Points>
  );
}

function subscribeToDesktopMotion(callback: () => void) {
  const desktop = window.matchMedia("(min-width: 768px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  desktop.addEventListener("change", callback);
  reducedMotion.addEventListener("change", callback);

  return () => {
    desktop.removeEventListener("change", callback);
    reducedMotion.removeEventListener("change", callback);
  };
}

function getDesktopMotionSnapshot() {
  return (
    window.matchMedia("(min-width: 768px)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function EntranceAtmosphere() {
  const shouldRender = useSyncExternalStore(
    subscribeToDesktopMotion,
    getDesktopMotionSnapshot,
    () => false,
  );

  if (!shouldRender) return null;

  return (
    <Canvas
      dpr={[1, 1.25]}
      camera={{ position: [0, 0, 5], fov: 48, near: 0.1, far: 20 }}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
    >
      <DepthField />
    </Canvas>
  );
}
