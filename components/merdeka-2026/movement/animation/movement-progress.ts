import type { PerformanceTier } from "../../hero/types";

export const MOVEMENT_PHASES = {
  opening: [0, 0.14],
  notOnePerson: [0.14, 0.27],
  notOnePlace: [0.27, 0.4],
  bridge: [0.4, 0.46],
  brave: [0.46, 0.525],
  diverse: [0.525, 0.59],
  creative: [0.59, 0.655],
  empowered: [0.655, 0.72],
  moving: [0.72, 0.8],
  together: [0.8, 0.9],
  closing: [0.9, 1],
} as const;

export const MOVEMENT_CONFIG: Record<
  "particles" | "trails" | "ambient" | "dpr",
  Record<PerformanceTier, number>
> = {
  particles: { high: 7200, medium: 4600, low: 2200 },
  trails: { high: 18, medium: 11, low: 6 },
  ambient: { high: 90, medium: 56, low: 28 },
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
