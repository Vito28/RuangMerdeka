import type { VoiceGate } from "../types";

export const VOICE_PHASES = {
  opening: [0, 0.1],
  question: [0.1, 0.25],
  words: [0.25, 0.4],
  stories: [0.4, 0.55],
  prompt: [0.55, 0.68],
  input: [0.68, 0.82],
  answer: [0.82, 0.91],
  collective: [0.91, 1],
} as const;

export const VOICE_GATES: readonly VoiceGate[] = [
  { id: "question", progress: 0.16, holdMs: 1000 },
  { id: "words", progress: 0.32, holdMs: 900 },
  { id: "prompt", progress: 0.6, holdMs: 1000 },
  { id: "input", progress: 0.71, holdMs: 850 },
  { id: "answer", progress: 0.86, holdMs: 1100 },
  { id: "voices", progress: 0.95, holdMs: 1000 },
] as const;
