export const HERO_PHASES = {
  opening: [0, 0.18],
  oneNation: [0.18, 0.34],
  islands: [0.34, 0.5],
  stories: [0.5, 0.66],
  freedom: [0.66, 0.84],
  closing: [0.84, 1],
} as const;

export const HERO_CONFIG = {
  particles: {
    high: 10000,
    medium: 6500,
    low: 2800,
  },
  ambientParticles: {
    high: 180,
    medium: 100,
    low: 50,
  },
  dpr: {
    high: 1.65,
    medium: 1.35,
    low: 1,
  },
} as const;

export function mapProgress(
  progress: number,
  inputStart: number,
  inputEnd: number,
  outputStart = 0,
  outputEnd = 1,
) {
  const normalized = Math.min(1, Math.max(0, (progress - inputStart) / (inputEnd - inputStart)));
  return outputStart + normalized * (outputEnd - outputStart);
}
