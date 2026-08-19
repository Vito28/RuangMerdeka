import type { PerformanceTier } from "../../hero/types";

export const MOVEMENT_PHASES = {
  seed: [0, 0.12],
  opening: [0.12, 0.3],
  millions: [0.3, 0.48],
  people: [0.48, 0.72],
  directions: [0.72, 0.8],
  together: [0.8, 0.875],
  collective: [0.865, 0.955],
  trace: [0.93, 0.985],
  exit: [0.978, 1],
} as const;

export const MOVEMENT_CONFIG: Record<
  "majorPaths" | "secondaryPaths" | "signals" | "dust" | "tracers" | "dpr",
  Record<PerformanceTier, number>
> = {
  majorPaths: { high: 12, medium: 10, low: 8 },
  secondaryPaths: { high: 20, medium: 14, low: 10 },
  signals: { high: 380, medium: 270, low: 170 },
  dust: { high: 1100, medium: 760, low: 440 },
  tracers: { high: 34, medium: 26, low: 18 },
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
