import type { MutableRefObject } from "react";

export type HeroPhase =
  | "opening"
  | "oneNation"
  | "islands"
  | "stories"
  | "freedom"
  | "closing";

export type PerformanceTier = "low" | "medium" | "high";

export type HeroProgressRef = MutableRefObject<number>;

export type PointerRef = MutableRefObject<{ x: number; y: number }>;

export type HeroSectionProps = {
  onExitProgress?: (progress: number) => void;
};
