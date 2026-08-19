"use client";

import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { TRACE_ASSET_PATHS, TRACE_MEDIA } from "../data/trace-media";
import type { TraceMediaId, TraceTextureMap } from "../types";

export function useTraceTextures(quality: "high" | "medium" | "low") {
  const loaded = useTexture([...TRACE_ASSET_PATHS]);
  const { gl } = useThree();
  const anisotropy = quality === "high" ? Math.min(4, gl.capabilities.getMaxAnisotropy()) : 2;

  useEffect(() => {
    loaded.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = anisotropy;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.needsUpdate = true;
    });
  }, [anisotropy, loaded]);

  return useMemo(
    () => Object.fromEntries(
      TRACE_MEDIA.map((item, index) => [item.id, loaded[index]]),
    ) as Record<TraceMediaId, THREE.Texture> as TraceTextureMap,
    [loaded],
  );
}
