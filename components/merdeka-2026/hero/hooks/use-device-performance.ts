"use client";

import { useSyncExternalStore } from "react";
import type { PerformanceTier } from "../types";

function detectTier(): PerformanceTier {
  const width = window.innerWidth;
  const cores = navigator.hardwareConcurrency ?? 4;

  if (width < 768 || cores <= 4) return "low";
  return width >= 1280 && cores >= 8 ? "high" : "medium";
}

const subscribe = () => () => undefined;

export function useDevicePerformance() {
  return useSyncExternalStore<PerformanceTier>(subscribe, detectTier, () => "medium");
}
