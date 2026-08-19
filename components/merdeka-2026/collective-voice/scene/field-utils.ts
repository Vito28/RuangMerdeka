import type { CollectiveQuality } from "../types";

export function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

export const QUALITY_CONFIG: Record<CollectiveQuality, {
  signals: number;
  waves: number;
  wavePoints: number;
  filaments: number;
  dpr: [number, number];
}> = {
  high: { signals: 220, waves: 30, wavePoints: 72, filaments: 520, dpr: [1, 1.5] },
  medium: { signals: 160, waves: 24, wavePoints: 64, filaments: 360, dpr: [1, 1.35] },
  low: { signals: 82, waves: 14, wavePoints: 48, filaments: 140, dpr: [1, 1.15] },
};

export function mapRange(value: number, start: number, end: number) {
  if (end <= start) return value >= end ? 1 : 0;
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

export function easeInOut(value: number) {
  return value * value * (3 - 2 * value);
}
