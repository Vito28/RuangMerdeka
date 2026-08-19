"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { VoiceStatus } from "./types";

type VoiceExperienceValue = {
  draft: string;
  submittedVoice: string;
  status: VoiceStatus;
  userVoiceSignalId: string | null;
  setDraft: (value: string) => void;
  submitVoice: () => void;
  skipVoice: () => void;
  resetExperience: () => void;
};

const VoiceExperienceContext = createContext<VoiceExperienceValue | null>(null);

function createSignalId(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `user-voice-${(hash >>> 0).toString(16)}`;
}

export function VoiceExperienceProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState("");
  const [submittedVoice, setSubmittedVoice] = useState("");
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [userVoiceSignalId, setUserVoiceSignalId] = useState<string | null>(null);

  const value = useMemo<VoiceExperienceValue>(() => ({
    draft,
    submittedVoice,
    status,
    userVoiceSignalId,
    setDraft,
    submitVoice: () => {
      const voice = draft.trim();
      if (!voice) return;
      setSubmittedVoice(voice);
      setUserVoiceSignalId(createSignalId(voice));
      setStatus("submitted");
    },
    skipVoice: () => setStatus((current) => current === "submitted" ? current : "skipped"),
    resetExperience: () => {
      setDraft("");
      setSubmittedVoice("");
      setUserVoiceSignalId(null);
      setStatus("idle");
    },
  }), [draft, status, submittedVoice, userVoiceSignalId]);

  return <VoiceExperienceContext.Provider value={value}>{children}</VoiceExperienceContext.Provider>;
}

export function useVoiceExperience() {
  const context = useContext(VoiceExperienceContext);
  if (!context) throw new Error("useVoiceExperience must be used inside VoiceExperienceProvider");
  return context;
}
