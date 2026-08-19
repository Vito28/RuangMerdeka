"use client";

import { CollectiveVoiceSection } from "./collective-voice/CollectiveVoiceSection";
import { FinaleJourneySection } from "./finale-journey/FinaleJourneySection";
import { VoiceSection } from "./voice/VoiceSection";
import { VoiceExperienceProvider } from "./voice/VoiceExperienceContext";

export function VoiceExperience() {
  return (
    <VoiceExperienceProvider>
      <VoiceSection />
      <CollectiveVoiceSection />
      <FinaleJourneySection />
    </VoiceExperienceProvider>
  );
}
