import type { FinaleJourneyGate } from "../types";

export const FINALE_JOURNEY_GATES: readonly FinaleJourneyGate[] = [
  { id: "year-2026", progress: 0.305, holdMs: 900 },
  { id: "eighty-one", progress: 0.46, holdMs: 1100 },
  { id: "wings", progress: 0.68, holdMs: 950 },
  { id: "indonesia", progress: 0.815, holdMs: 1200 },
  { id: "celebration", progress: 0.925, holdMs: 950 },
] as const;

export const FINALE_JOURNEY_CONFIG = {
  scrub: 0.78,
  particleCount: { high: 4800, medium: 3000, low: 1300 },
  dpr: { high: [1, 1.5], medium: [1, 1.3], low: 1 },
} as const;
