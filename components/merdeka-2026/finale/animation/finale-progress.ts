export const FINALE_PHASES = {
  surface: [0, 0.2],
  reveal: [0.2, 0.45],
  flag: [0.45, 0.7],
  statement: [0.7, 0.88],
  closing: [0.88, 1],
} as const;

export const FINALE_CONFIG = {
  dpr: {
    low: 1,
    medium: 1.25,
    high: 1.5,
  },
  segments: {
    low: [40, 20],
    medium: [64, 32],
    high: [96, 48],
  },
} as const;

export function mapFinaleProgress(
  progress: number,
  start: number,
  end: number,
  from = 0,
  to = 1,
) {
  const normalized = Math.min(1, Math.max(0, (progress - start) / (end - start)));
  return from + (to - from) * normalized;
}
