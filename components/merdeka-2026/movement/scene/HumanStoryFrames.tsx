"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { movementWindow } from "../animation/movement-progress";
import { HUMAN_STORIES, type HumanStory, type HumanStoryMotif } from "../data/human-stories";
import type { MovementProgressRef } from "../types";

function pushLine(target: number[], ax: number, ay: number, bx: number, by: number) {
  target.push(ax, ay, 0, bx, by, 0);
}

function pushRect(target: number[], x: number, y: number, width: number, height: number) {
  pushLine(target, x, y, x + width, y);
  pushLine(target, x + width, y, x + width, y + height);
  pushLine(target, x + width, y + height, x, y + height);
  pushLine(target, x, y + height, x, y);
}

function pushCircle(target: number[], x: number, y: number, radius: number, start = 0, end = Math.PI * 2) {
  const steps = 12;
  for (let index = 0; index < steps; index += 1) {
    const a = start + (end - start) * (index / steps);
    const b = start + (end - start) * ((index + 1) / steps);
    pushLine(target, x + Math.cos(a) * radius, y + Math.sin(a) * radius, x + Math.cos(b) * radius, y + Math.sin(b) * radius);
  }
}

function createFigureLines(motif: HumanStoryMotif) {
  const bone: number[] = [];
  const red: number[] = [];
  pushCircle(bone, -0.28, 0.32, 0.105);
  pushLine(bone, -0.28, 0.21, -0.28, -0.2);
  pushLine(bone, -0.28, 0.1, -0.53, -0.02);
  pushLine(bone, -0.28, 0.1, -0.02, -0.01);
  pushLine(bone, -0.28, -0.2, -0.5, -0.56);
  pushLine(bone, -0.28, -0.2, -0.04, -0.56);

  if (motif === "teacher") {
    pushRect(red, 0.1, -0.12, 0.68, 0.58);
    pushLine(red, -0.02, -0.01, 0.55, 0.28);
    pushLine(red, 0.22, 0.1, 0.42, 0.2);
  } else if (motif === "farmer") {
    pushLine(red, -0.02, -0.02, 0.6, -0.5);
    pushLine(red, 0.5, -0.41, 0.68, -0.32);
    pushLine(red, 0.35, -0.58, 0.35, -0.36);
    pushLine(red, 0.35, -0.45, 0.18, -0.32);
    pushLine(red, 0.35, -0.48, 0.52, -0.34);
  } else if (motif === "builder") {
    pushLine(red, -0.42, 0.41, -0.14, 0.41);
    pushCircle(red, -0.28, 0.33, 0.13, 0, Math.PI);
    pushRect(red, 0.14, -0.46, 0.62, 0.72);
    pushLine(red, 0.14, 0.26, 0.76, -0.46);
  } else if (motif === "creator") {
    pushRect(red, 0.08, -0.2, 0.7, 0.52);
    pushLine(red, 0.3, 0.2, 0.2, 0.06);
    pushLine(red, 0.2, 0.06, 0.3, -0.08);
    pushLine(red, 0.52, 0.2, 0.62, 0.06);
    pushLine(red, 0.62, 0.06, 0.52, -0.08);
  } else if (motif === "guardian") {
    pushLine(red, 0.02, -0.22, 0.76, -0.22);
    pushLine(red, 0.76, -0.22, 0.58, -0.48);
    pushLine(red, 0.58, -0.48, 0.15, -0.48);
    pushLine(red, 0.15, -0.48, 0.02, -0.22);
    pushLine(red, 0.4, -0.22, 0.4, 0.42);
    pushLine(red, 0.4, 0.4, 0.7, 0.04);
  } else {
    const centerX = 0.44;
    const centerY = 0.3;
    const outer = 0.2;
    const inner = 0.08;
    for (let index = 0; index < 10; index += 1) {
      const radiusA = index % 2 === 0 ? outer : inner;
      const radiusB = (index + 1) % 2 === 0 ? outer : inner;
      const angleA = -Math.PI / 2 + index * Math.PI / 5;
      const angleB = -Math.PI / 2 + (index + 1) * Math.PI / 5;
      pushLine(red, centerX + Math.cos(angleA) * radiusA, centerY + Math.sin(angleA) * radiusA, centerX + Math.cos(angleB) * radiusB, centerY + Math.sin(angleB) * radiusB);
    }
    pushLine(red, -0.02, -0.01, 0.31, 0.22);
  }

  return { bone: new Float32Array(bone), red: new Float32Array(red) };
}

const framePositions = new Float32Array([
  -1.3, -0.78, 0, 1.3, -0.78, 0,
  1.3, -0.78, 0, 1.3, 0.78, 0,
  1.3, 0.78, 0, -1.3, 0.78, 0,
  -1.3, 0.78, 0, -1.3, -0.78, 0,
  -1.3, 0.6, 0, -1.12, 0.78, 0,
  1.3, -0.6, 0, 1.12, -0.78, 0,
]);

function StoryFrame({ story, storyIndex, progressRef }: { story: HumanStory; storyIndex: number; progressRef: MovementProgressRef }) {
  const groupRef = useRef<THREE.Group>(null);
  const figureRef = useRef<THREE.Group>(null);
  const boneMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  const redMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  const frameMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  const backdropMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const elapsedRef = useRef(0);
  const lines = useMemo(() => createFigureLines(story.motif), [story.motif]);

  useFrame((_, delta) => {
    elapsedRef.current += delta;
    if (!groupRef.current || !figureRef.current || !boneMaterialRef.current || !redMaterialRef.current || !frameMaterialRef.current || !backdropMaterialRef.current) return;
    const visibility = movementWindow(progressRef.current, story.phase, 0.012);
    const targetScale = 0.9 + visibility * 0.1;
    groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 8, delta));
    groupRef.current.position.y = story.position[1] + Math.sin(elapsedRef.current * 0.7 + storyIndex) * 0.025;
    figureRef.current.rotation.z = Math.sin(elapsedRef.current * 1.15 + storyIndex * 0.8) * 0.014 * visibility;
    figureRef.current.position.y = Math.sin(elapsedRef.current * 1.4 + storyIndex) * 0.012;
    boneMaterialRef.current.opacity = visibility * 0.86;
    redMaterialRef.current.opacity = visibility;
    frameMaterialRef.current.opacity = visibility * 0.34;
    backdropMaterialRef.current.opacity = visibility * 0.32;
  });

  return (
    <group ref={groupRef} position={story.position} rotation={[0, story.rotationY, 0]} scale={0.9}>
      <mesh position={[0, 0, -0.025]}>
        <planeGeometry args={[2.6, 1.56]} />
        <meshBasicMaterial ref={backdropMaterialRef} color="#050505" transparent opacity={0} depthWrite={false} />
      </mesh>
      <lineSegments>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[framePositions, 3]} /></bufferGeometry>
        <lineBasicMaterial ref={frameMaterialRef} color="#f4f1e9" transparent opacity={0} depthWrite={false} />
      </lineSegments>
      <group ref={figureRef} scale={1.08}>
        <lineSegments>
          <bufferGeometry><bufferAttribute attach="attributes-position" args={[lines.bone, 3]} /></bufferGeometry>
          <lineBasicMaterial ref={boneMaterialRef} color="#f4f1e9" transparent opacity={0} depthWrite={false} />
        </lineSegments>
        <lineSegments>
          <bufferGeometry><bufferAttribute attach="attributes-position" args={[lines.red, 3]} /></bufferGeometry>
          <lineBasicMaterial ref={redMaterialRef} color="#e70011" transparent opacity={0} depthWrite={false} />
        </lineSegments>
      </group>
    </group>
  );
}

export function HumanStoryFrames({ progressRef, storyCount }: { progressRef: MovementProgressRef; storyCount: number }) {
  return (
    <group renderOrder={5}>
      {HUMAN_STORIES.slice(0, storyCount).map((story, index) => (
        <StoryFrame key={story.label} story={story} storyIndex={index} progressRef={progressRef} />
      ))}
    </group>
  );
}
