"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mapTraceProgress, traceWindow } from "../animation/trace-phases";
import { TRACE_MEDIA_BY_ID } from "../data/trace-media";
import type { TraceProgressRef } from "../types";

const SLICE_RATIOS = [0.11, 0.15, 0.12, 0.18, 0.14, 0.16, 0.14] as const;
const SLICE_DEPTH = [0.45, -0.18, 0.22, -0.42, 0.3, -0.14, 0.52] as const;
const SLICE_Y = [0.08, -0.04, 0.02, 0, -0.03, 0.05, -0.02] as const;
const CENTER_OUT_ORDER = [5, 3, 1, 0, 2, 4, 6] as const;
const PLANE_GEOMETRY = new THREE.PlaneGeometry(1, 1);

type TransitionCitySlicesProps = {
  progressRef: TraceProgressRef;
  texture: THREE.Texture;
};

export function TransitionCitySlices({ progressRef, texture }: TransitionCitySlicesProps) {
  const refs = useRef<Array<THREE.Mesh | null>>([]);
  const { size } = useThree();
  const isMobile = size.width < 768;
  const imageWidth = isMobile ? 7.9 : 9.4;
  const imageHeight = imageWidth / TRACE_MEDIA_BY_ID["transition-city"].aspect;

  const sliceMeta = useMemo(() => {
    return SLICE_RATIOS.map((ratio, index) => {
      const offset = SLICE_RATIOS.slice(0, index).reduce((sum, value) => sum + value, 0);
      const cloned = texture.clone();
      cloned.repeat.set(ratio, 1);
      cloned.offset.set(offset, 0);
      cloned.wrapS = THREE.ClampToEdgeWrapping;
      cloned.wrapT = THREE.ClampToEdgeWrapping;
      cloned.needsUpdate = true;
      const center = offset + ratio * 0.5 - 0.5;
      return { texture: cloned, ratio, center, index };
    });
  }, [texture]);

  useEffect(() => () => {
    sliceMeta.forEach(({ texture: sliceTexture }) => sliceTexture.dispose());
  }, [sliceMeta]);

  useFrame(() => {
    const progress = progressRef.current;
    const visibility = traceWindow(progress, 0.025, 0.295, 0.018);
    const gapProgress = mapTraceProgress(progress, 0.15, 0.255);
    const exit = mapTraceProgress(progress, 0.25, 0.295);

    refs.current.forEach((mesh, index) => {
      if (!mesh) return;
      const order = CENTER_OUT_ORDER[index];
      const sliceProgress = mapTraceProgress(
        progress,
        0.15 + order * 0.006,
        0.25 + order * 0.003,
      );
      const material = mesh.material as THREE.MeshBasicMaterial;
      const meta = sliceMeta[index];
      const gap = (isMobile ? 0.014 : 0.02) * gapProgress;

      material.opacity = visibility;
      mesh.visible = visibility > 0.002;
      mesh.position.set(
        meta.center * imageWidth + (index - 3) * gap + SLICE_DEPTH[index] * exit * 0.08,
        SLICE_Y[index] * sliceProgress,
        SLICE_DEPTH[index] * sliceProgress * 0.48 + exit * 0.72,
      );
      mesh.rotation.set(
        SLICE_Y[index] * sliceProgress * 0.12,
        SLICE_DEPTH[index] * sliceProgress * 0.026,
        0,
      );
      mesh.scale.set(imageWidth * meta.ratio * 1.001, imageHeight, 1);
    });
  });

  return (
    <group position={[0, 0, 0]}>
      {sliceMeta.map((slice, index) => (
        <mesh
          key={slice.index}
          ref={(mesh) => { refs.current[index] = mesh; }}
          geometry={PLANE_GEOMETRY}
          visible={false}
        >
          <meshBasicMaterial
            map={slice.texture}
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
