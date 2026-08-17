import type { PerformanceTier } from "../../hero/types";

export const MEANING_PHASES = {
  question: [0, 0.12],
  sovereign: [0.12, 0.36],
  justice: [0.36, 0.6],
  prosperity: [0.6, 0.84],
  movingForward: [0.84, 1],
} as const;

export const MEANING_CONFIG: Record<
  "particles" | "nodes" | "growthForms" | "dpr",
  Record<PerformanceTier, number>
> = {
  particles: { high: 6500, medium: 4200, low: 1800 },
  nodes: { high: 40, medium: 26, low: 16 },
  growthForms: { high: 48, medium: 32, low: 18 },
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
