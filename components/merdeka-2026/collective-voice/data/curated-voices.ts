import type { CollectiveVoice } from "../types";

export const COLLECTIVE_VOICES: readonly CollectiveVoice[] = [
  {
    id: "voice-014",
    index: "014",
    keyword: "PULANG",
    lines: ["BISA PULANG", "DENGAN", "TENANG."],
    placement: "left-5 top-[26%] items-start text-left md:left-[8%] md:top-[24%]",
    accent: true,
  },
  {
    id: "voice-027",
    index: "027",
    keyword: "BELAJAR",
    lines: ["PUNYA KESEMPATAN", "UNTUK", "BELAJAR."],
    placement: "right-5 top-[31%] items-end text-right md:right-[8%] md:top-[25%]",
  },
  {
    id: "voice-041",
    index: "041",
    keyword: "MEMILIH",
    lines: ["BISA MEMILIH", "JALAN", "SENDIRI."],
    placement: "left-5 bottom-[18%] items-start text-left md:left-[13%] md:bottom-[16%]",
  },
  {
    id: "voice-063",
    index: "063",
    keyword: "BERANI",
    lines: ["BERANI MENJADI", "DIRI", "SENDIRI."],
    placement: "right-5 bottom-[16%] items-end text-right md:right-[11%] md:bottom-[14%]",
    accent: true,
  },
] as const;
