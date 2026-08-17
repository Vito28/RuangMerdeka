import type { PerformanceTier } from "../../hero/types";

export const MOVEMENT_PHASES = {
  seed: [0, 0.12],
  opening: [0.12, 0.3],
  millions: [0.3, 0.48],
  people: [0.48, 0.72],
  directions: [0.72, 0.8],
  together: [0.8, 0.9],
  pulse: [0.9, 0.97],
  exit: [0.97, 1],
} as const;

export const MOVEMENT_CONFIG: Record<
  "paths" | "tracers" | "ambient" | "stories" | "dpr",
  Record<PerformanceTier, number>
> = {
  paths: { high: 148, medium: 92, low: 48 },
  tracers: { high: 126, medium: 76, low: 38 },
  ambient: { high: 96, medium: 58, low: 28 },
  stories: { high: 6, medium: 6, low: 4 },
  dpr: { high: 1.5, medium: 1.25, low: 1 },
};

export function mapMovementProgress(
  progress: number,
  inputStart: number,
  inputEnd: number,
  outputStart = 0,
  outputEnd = 1,
) {
  const normalized = Math.min(1, Math.max(0, (progress - inputStart) / (inputEnd - inputStart)));
  return outputStart + normalized * (outputEnd - outputStart);
}

export function movementWindow(
  progress: number,
  phase: readonly [number, number],
  edge = 0.025,
) {
  const enter = mapMovementProgress(progress, phase[0], phase[0] + edge);
  const leave = 1 - mapMovementProgress(progress, phase[1] - edge, phase[1]);
  return Math.min(enter, leave);
}
