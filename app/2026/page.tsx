import type { Metadata } from "next";
import { HeroSection } from "@/components/merdeka-2026/hero/HeroSection";
import { MeaningSection } from "@/components/merdeka-2026/MeaningSection";
import { MovementSection } from "@/components/merdeka-2026/MovementSection";
import { ContributionSection } from "@/components/merdeka-2026/ContributionSection";
import { FinaleSection } from "@/components/merdeka-2026/FinaleSection";

export const metadata: Metadata = {
  title: "Ruang Merdeka 2026 — 81 Tahun Merdeka",
  description:
    "Sebuah pengalaman digital interaktif untuk memperingati 81 tahun kemerdekaan Indonesia dan memahami arti merdeka hari ini.",
};

export default function Merdeka2026Page() {
  return (
    <main className="overflow-clip bg-night text-bone antialiased">
      <HeroSection />
      <MeaningSection />
      <MovementSection />
      <ContributionSection />
      <FinaleSection />
    </main>
  );
}
