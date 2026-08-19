"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { mapTraceProgress, traceWindow } from "../animation/trace-phases";
import { MOSAIC_LAYOUT } from "../data/trace-media";
import type { TraceProgressRef, TraceTextureMap } from "../types";
import { getTraceWorldX } from "./TraceCameraRig";

const PLANE_GEOMETRY = new THREE.PlaneGeometry(1, 1);

type LivingMosaicProps = {
  progressRef: TraceProgressRef;
  textures: TraceTextureMap;
};

export function LivingMosaic({ progressRef, textures }: LivingMosaicProps) {
  const refs = useRef<Array<THREE.Mesh | null>>([]);
  const { size } = useThree();
  const isMobile = size.width < 768;
  const items = isMobile ? MOSAIC_LAYOUT.slice(0, 10) : MOSAIC_LAYOUT;

  useFrame((state) => {
    const progress = progressRef.current;
    const visibility = traceWindow(progress, 0.815, 0.993, 0.018);
    const reveal = mapTraceProgress(progress, 0.815, 0.865);
    const selection = mapTraceProgress(progress, 0.865, 0.925);
    const stream = mapTraceProgress(progress, 0.9, 0.972);
    const collapse = mapTraceProgress(progress, 0.965, 0.998);
    const centerX = getTraceWorldX(10.2, isMobile);
    const layoutScale = isMobile ? 0.72 : 1;

    refs.current.forEach((mesh, index) => {
      if (!mesh) return;
      const item = items[index];
      const material = mesh.material as THREE.MeshBasicMaterial;
      const selected = index === 0;
      const ambient = index % 3 === 0
        ? Math.sin(state.clock.elapsedTime * 0.18 + index) * 0.025 * (1 - selection)
        : 0;

      const editorialX = item.position[0] * layoutScale;
      const editorialY = item.position[1] * layoutScale + ambient;
      const editorialZ = item.position[2];
      const selectedX = selected ? THREE.MathUtils.lerp(editorialX, 0, selection) : editorialX * (1 + selection * 0.14);
      const selectedY = selected ? THREE.MathUtils.lerp(editorialY, 0.08, selection) : editorialY * (1 + selection * 0.12);
      const selectedZ = selected ? THREE.MathUtils.lerp(editorialZ, 1.65, selection) : editorialZ - selection * 0.2;
      const streamX = (-4.6 + index * (isMobile ? 0.95 : 0.84)) * layoutScale;
      const streamY = Math.sin(index * 0.92) * 1.18 * layoutScale;
      const streamZ = (index % 4 - 1.5) * 0.14;
      const x = THREE.MathUtils.lerp(selectedX, streamX, stream);
      const y = THREE.MathUtils.lerp(selectedY, streamY, stream);
      const z = THREE.MathUtils.lerp(selectedZ, streamZ, stream);
      const selectedScale = selected ? THREE.MathUtils.lerp(1, 1.72, selection) : 1;
      const collapseScale = Math.max(0.008, 1 - collapse);

      mesh.visible = visibility > 0.002;
      material.opacity = visibility * reveal * (1 - collapse * 0.92);
      mesh.position.set(
        THREE.MathUtils.lerp(centerX + getTraceWorldX(x, isMobile), centerX, collapse),
        THREE.MathUtils.lerp(y, 0, collapse),
        THREE.MathUtils.lerp(-54 + z, -52.8, collapse),
      );
      mesh.rotation.set(0, 0, (index % 2 === 0 ? -0.01 : 0.01) * (1 - stream));
      mesh.scale.set(
        item.scale[0] * layoutScale * selectedScale * collapseScale,
        item.scale[1] * layoutScale * selectedScale * collapseScale,
        1,
      );
    });
  });

  return (
    <group dispose={null}>
      {items.map((item, index) => (
        <mesh
          key={`${item.id}-${index}`}
          ref={(mesh) => { refs.current[index] = mesh; }}
          geometry={PLANE_GEOMETRY}
          visible={false}
        >
          <meshBasicMaterial
            map={textures[item.id]}
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
