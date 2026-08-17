import type { MutableRefObject } from "react";

export type MovementProgressRef = MutableRefObject<number>;

export type MovementCanvasProps = {
  active: boolean;
  progressRef: MovementProgressRef;
};
