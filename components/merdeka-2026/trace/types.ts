import type { MutableRefObject } from "react";
import type * as THREE from "three";

export type TraceProgressRef = MutableRefObject<number>;

export type TraceMediaId =
  | "transition-city"
  | "education"
  | "pangan"
  | "connectivity"
  | "technology"
  | "culture"
  | "generation"
  | "quiet-human";

export type TraceTreatment =
  | "slice"
  | "approach"
  | "horizon"
  | "travel"
  | "occlusion"
  | "fabric"
  | "expansion"
  | "silence";

export type TraceMediaItem = {
  id: TraceMediaId;
  src: string;
  alt: string;
  label: string;
  statement: string;
  treatment: TraceTreatment;
  aspect: number;
  phase: readonly [number, number];
};

export type TraceTextureMap = Record<TraceMediaId, THREE.Texture>;

export type TraceCanvasProps = {
  active: boolean;
  progressRef: TraceProgressRef;
};
