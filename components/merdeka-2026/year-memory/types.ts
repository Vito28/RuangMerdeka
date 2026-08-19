export type MemoryTreatment =
  | "development"
  | "dual-exposure"
  | "heat"
  | "focus-scan"
  | "aperture"
  | "archive-focus"
  | "reflection"
  | "light-arrival";

export type MemoryPlacement = "left" | "right" | "center";

export type YearMemory = {
  id: string;
  index: string;
  date: string;
  shortDate: string;
  location: string;
  label: string;
  image: string;
  alt: string;
  treatment: MemoryTreatment;
  phase: readonly [number, number];
  headline: readonly string[];
  supporting?: readonly string[];
  placement: MemoryPlacement;
  objectPosition: string;
  accentLine?: number;
  background: string;
};
