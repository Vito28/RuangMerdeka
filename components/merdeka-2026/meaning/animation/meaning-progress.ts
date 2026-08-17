import type { PerformanceTier } from "../../hero/types";

export const MEANING_PHASES = {
  indonesia: [0, 0.12],
  feather: [0.1, 0.28],
  sovereign: [0.26, 0.45],
  merge: [0.45, 0.62],
  creation: [0.6, 0.91],
  framework: [0.78, 0.94],
  pulse: [0.91, 1],
} as const;

export const MEANING_CONFIG: Record<
  "particles" | "trails" | "ribbons" | "structures" | "dpr",
  Record<PerformanceTier, number>
> = {
  particles: { high: 2800, medium: 1800, low: 800 },
  trails: { high: 18, medium: 14, low: 10 },
  ribbons: { high: 3, medium: 2, low: 2 },
  structures: { high: 18, medium: 15, low: 12 },
  dpr: { high: 1.5, medium: 1.25, low: 1 },
};

export function mapMeaningProgress(
  progress: number,
  inputStart: number,
  inputEnd: number,
  outputStart = 0,
  outputEnd = 1,
) {
  const normalized = Math.min(1, Math.max(0, (progress - inputStart) / (inputEnd - inputStart)));
  return outputStart + normalized * (outputEnd - outputStart);
}

export function meaningPhaseStrength(
  progress: number,
  phase: readonly [number, number],
  edge = 0.04,
) {
  const enter = mapMeaningProgress(progress, phase[0], phase[0] + edge);
  const leave = 1 - mapMeaningProgress(progress, phase[1] - edge, phase[1]);
  return Math.min(enter, leave);
}
