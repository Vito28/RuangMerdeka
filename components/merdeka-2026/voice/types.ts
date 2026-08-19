export type VoiceStatus = "idle" | "submitted" | "skipped";

export type VoiceGateId =
  | "question"
  | "words"
  | "prompt"
  | "input"
  | "answer"
  | "voices";

export type VoiceGate = {
  id: string;
  progress: number;
  holdMs: number;
};

export type SeedWord = {
  word: string;
  placement: string;
  accent?: boolean;
};

export type CuratedVoice = {
  id: string;
  lines: readonly string[];
  placement: string;
};
