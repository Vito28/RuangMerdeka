export type HumanStoryMotif = "teacher" | "farmer" | "builder" | "creator" | "guardian" | "dreamer";
export type HumanStoryLayout = "text-left" | "text-right" | "text-low-left" | "text-high-right";

export type HumanStory = {
  index: string;
  category: string;
  microcopy: string;
  label: string;
  motif: HumanStoryMotif;
  layout: HumanStoryLayout;
  phase: readonly [number, number];
  palette: {
    primary: string;
    secondary: string;
    accent: string;
  };
};

export const HUMAN_STORIES: readonly HumanStory[] = [
  {
    index: "01",
    category: "PENDIDIKAN",
    microcopy: "ILMU MENJADI JALAN",
    label: "ADA YANG MENGAJAR.",
    motif: "teacher",
    layout: "text-left",
    phase: [0.48, 0.525],
    palette: { primary: "#31577a", secondary: "#7aa2bd", accent: "#e60012" },
  },
  {
    index: "02",
    category: "PANGAN",
    microcopy: "MENJAGA HIDUP",
    label: "ADA YANG MENANAM.",
    motif: "farmer",
    layout: "text-right",
    phase: [0.515, 0.56],
    palette: { primary: "#64734b", secondary: "#b56743", accent: "#d4a94f" },
  },
  {
    index: "03",
    category: "RUANG",
    microcopy: "TEMPAT UNTUK BERTUMBUH",
    label: "ADA YANG MEMBANGUN.",
    motif: "builder",
    layout: "text-low-left",
    phase: [0.55, 0.595],
    palette: { primary: "#d3872d", secondary: "#596773", accent: "#e60012" },
  },
  {
    index: "04",
    category: "GAGASAN",
    microcopy: "IDE MENJADI NYATA",
    label: "ADA YANG MENCIPTA.",
    motif: "creator",
    layout: "text-high-right",
    phase: [0.585, 0.635],
    palette: { primary: "#675189", secondary: "#3f8588", accent: "#e60012" },
  },
  {
    index: "05",
    category: "MENJAGA",
    microcopy: "AGAR TETAP HIDUP",
    label: "ADA YANG MENJAGA.",
    motif: "guardian",
    layout: "text-left",
    phase: [0.625, 0.675],
    palette: { primary: "#2f7075", secondary: "#365d83", accent: "#e60012" },
  },
  {
    index: "06",
    category: "GENERASI BERIKUTNYA",
    microcopy: "ARAH BARU DIMULAI",
    label: "ADA YANG BERMIMPI.",
    motif: "dreamer",
    layout: "text-right",
    phase: [0.665, 0.72],
    palette: { primary: "#485181", secondary: "#795676", accent: "#d7ad52" },
  },
] as const;
