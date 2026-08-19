import type { VoiceGate } from "../../voice/types";

export const COLLECTIVE_VOICE_PHASES = {
  entry: [0, 0.1],
  voices: [0.1, 0.25],
  resonance: [0.25, 0.42],
  landscape: [0.42, 0.62],
  philosophy: [0.62, 0.76],
  pulse: [0.76, 0.91],
  horizon: [0.91, 1],
} as const;

export const COLLECTIVE_VOICE_GATES: readonly VoiceGate[] = [
  { id: "first-field", progress: 0.2, holdMs: 800 },
  { id: "landscape", progress: 0.5, holdMs: 1000 },
  { id: "not-one-voice", progress: 0.69, holdMs: 1050 },
  { id: "collective-pulse", progress: 0.84, holdMs: 950 },
] as const;

export const COLLECTIVE_VOICE_MOTION = {
  scrub: 0.72,
  voiceStarts: [0.105, 0.14, 0.175, 0.21],
  voiceVisible: 0.042,
} as const;
