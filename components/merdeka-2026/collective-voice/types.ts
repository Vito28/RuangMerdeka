export type CollectiveVoice = {
  id: string;
  index: string;
  keyword: string;
  lines: readonly string[];
  placement: string;
  accent?: boolean;
};

export type CollectiveQuality = "high" | "medium" | "low";
