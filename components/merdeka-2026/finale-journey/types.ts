import type { PerformanceTier } from "../hero/types";

export type FinaleJourneyQuality = PerformanceTier;

export type FinaleJourneyGate = {
  id: string;
  progress: number;
  holdMs: number;
};
