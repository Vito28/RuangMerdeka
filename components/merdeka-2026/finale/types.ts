import type { MutableRefObject } from "react";

export type FinaleProgressRef = MutableRefObject<number>;

export type FinaleCanvasProps = {
  active: boolean;
  progressRef: FinaleProgressRef;
  reducedMotion?: boolean;
};
