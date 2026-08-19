export type SoundtrackCue = {
  selector: string;
  volume: number;
  bed: number;
  accent: number;
  accentFrequency: number;
};

export const SOUNDTRACK_CUES: SoundtrackCue[] = [
  { selector: "#opening", volume: 0.34, bed: 0.94, accent: 0.018, accentFrequency: 2_400 },
  { selector: "#meaning", volume: 0.3, bed: 0.98, accent: 0.014, accentFrequency: 2_600 },
  { selector: "#movement", volume: 0.4, bed: 0.92, accent: 0.032, accentFrequency: 2_050 },
  { selector: "#trace", volume: 0.34, bed: 0.96, accent: 0.024, accentFrequency: 2_300 },
  { selector: "#year-memory", volume: 0.37, bed: 0.95, accent: 0.026, accentFrequency: 2_200 },
  { selector: "#voice", volume: 0.27, bed: 1, accent: 0.01, accentFrequency: 2_900 },
  { selector: "#collective-voice", volume: 0.41, bed: 0.92, accent: 0.038, accentFrequency: 1_950 },
  { selector: "#finale-journey", volume: 0.48, bed: 0.9, accent: 0.052, accentFrequency: 1_750 },
];
