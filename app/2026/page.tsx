import type { Metadata } from "next";
import { ExperienceProgress } from "@/components/experience/ExperienceProgress";
import { MerdekaSoundtrack } from "@/components/merdeka-2026/audio/MerdekaSoundtrack";
import { HeroSection } from "@/components/merdeka-2026/hero/HeroSection";
import { MeaningSection } from "@/components/merdeka-2026/MeaningSection";
import { MovementSection } from "@/components/merdeka-2026/MovementSection";
import { FinaleSection } from "@/components/merdeka-2026/FinaleSection";
import { TraceSection } from "@/components/merdeka-2026/TraceSection";
import { VoiceExperience } from "@/components/merdeka-2026/VoiceExperience";

export const metadata: Metadata = {
  title: {
    absolute: "HariKita | Perjalanan Belum Usai",
  },
  description:
    "HariKita memperingati 81 tahun kemerdekaan Indonesia melalui perjalanan interaktif tentang arti merdeka yang terus kita isi bersama.",
};

export default function Merdeka2026Page() {
  return (
    <main className="overflow-clip bg-night text-bone antialiased">
      <ExperienceProgress />
      <MerdekaSoundtrack />
      <HeroSection />
      <MeaningSection />
      <MovementSection />
      <TraceSection />
      <FinaleSection />
      <VoiceExperience />
    </main>
  );
}
