import type { CuratedVoice, SeedWord } from "../types";

export const SEED_WORDS: readonly SeedWord[] = [
  { word: "AMAN", placement: "left-[7%] top-[19%]", accent: true },
  { word: "BELAJAR", placement: "right-[7%] top-[16%]" },
  { word: "PULANG", placement: "left-[18%] top-[36%]" },
  { word: "MEMILIH", placement: "right-[20%] top-[33%]", accent: true },
  { word: "BERBICARA", placement: "left-[5%] bottom-[31%]" },
  { word: "BERKARYA", placement: "right-[8%] bottom-[35%]" },
  { word: "BERBEDA", placement: "left-[30%] bottom-[15%]" },
  { word: "TUMBUH", placement: "right-[29%] bottom-[17%]", accent: true },
  { word: "BERMIMPI", placement: "left-[44%] top-[13%]" },
  { word: "HIDUP", placement: "right-[44%] bottom-[9%]" },
] as const;

export const CURATED_VOICES: readonly CuratedVoice[] = [
  {
    id: "choice",
    lines: ["BISA MENENTUKAN", "PILIHAN SENDIRI."],
    placement: "left-[7%] top-[22%] items-start text-left",
  },
  {
    id: "home",
    lines: ["BISA PULANG", "DENGAN TENANG."],
    placement: "right-[7%] top-[31%] items-end text-right",
  },
  {
    id: "learn",
    lines: ["MENDAPAT", "KESEMPATAN", "UNTUK BELAJAR."],
    placement: "left-[13%] bottom-[19%] items-start text-left",
  },
  {
    id: "self",
    lines: ["BERANI", "MENJADI", "DIRI SENDIRI."],
    placement: "right-[11%] bottom-[17%] items-end text-right",
  },
] as const;
