import type { MutableRefObject } from "react";

export type MeaningProgressRef = MutableRefObject<number>;

export type MeaningCanvasProps = {
  active: boolean;
  progressRef: MeaningProgressRef;
};
