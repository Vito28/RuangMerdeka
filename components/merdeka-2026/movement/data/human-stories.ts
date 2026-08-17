export type HumanStoryMotif = "teacher" | "farmer" | "builder" | "creator" | "guardian" | "dreamer";

export type HumanStory = {
  index: string;
  label: string;
  context: string;
  motif: HumanStoryMotif;
  position: readonly [number, number, number];
  rotationY: number;
  phase: readonly [number, number];
};

export const HUMAN_STORIES: readonly HumanStory[] = [
  { index: "01", label: "ADA YANG MENGAJAR.", context: "ILMU MENJADI JALAN", motif: "teacher", position: [-1.65, 0.35, -1.1], rotationY: -0.14, phase: [0.48, 0.525] },
  { index: "02", label: "ADA YANG MENANAM.", context: "PANGAN MENJAGA HIDUP", motif: "farmer", position: [1.55, -0.18, -3.55], rotationY: 0.14, phase: [0.515, 0.56] },
  { index: "03", label: "ADA YANG MEMBANGUN.", context: "RUANG UNTUK BERTUMBUH", motif: "builder", position: [-1.55, 0.18, -6], rotationY: -0.12, phase: [0.55, 0.595] },
  { index: "04", label: "ADA YANG MENCIPTA.", context: "GAGASAN MENJADI NYATA", motif: "creator", position: [1.55, 0.28, -8.45], rotationY: 0.12, phase: [0.585, 0.635] },
  { index: "05", label: "ADA YANG MENJAGA.", context: "LAUT MENGIKAT NUSANTARA", motif: "guardian", position: [-1.55, -0.12, -10.9], rotationY: -0.12, phase: [0.625, 0.675] },
  { index: "06", label: "ADA YANG BERMIMPI.", context: "MASA DEPAN DIMULAI", motif: "dreamer", position: [1.5, 0.16, -13.35], rotationY: 0.12, phase: [0.665, 0.72] },
] as const;
