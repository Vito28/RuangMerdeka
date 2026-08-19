export const TRACE_PHASES = {
  entry: [0, 0.1],
  city: [0.025, 0.29],
  openingCopy: [0.09, 0.2],
  education: [0.27, 0.395],
  pangan: [0.355, 0.475],
  connectivity: [0.435, 0.555],
  technology: [0.515, 0.625],
  culture: [0.585, 0.675],
  corridor: [0.635, 0.715],
  generation: [0.695, 0.775],
  silence: [0.755, 0.835],
  mosaic: [0.815, 0.93],
  collective: [0.9, 0.975],
  closing: [0.94, 1],
} as const;

export type TraceKeyframe = readonly [progress: number, value: number];

export function clampTraceProgress(progress: number) {
  return Math.min(1, Math.max(0, progress));
}

export function mapTraceProgress(
  progress: number,
  start: number,
  end: number,
  outputStart = 0,
  outputEnd = 1,
) {
  const normalized = clampTraceProgress((progress - start) / (end - start));
  return outputStart + normalized * (outputEnd - outputStart);
}

export function traceWindow(progress: number, start: number, end: number, edge = 0.025) {
  const safeEdge = Math.min(edge, (end - start) * 0.5);
  const enter = mapTraceProgress(progress, start, start + safeEdge);
  const leave = 1 - mapTraceProgress(progress, end - safeEdge, end);
  return Math.min(enter, leave);
}

export function sampleTraceKeyframes(progress: number, keyframes: readonly TraceKeyframe[]) {
  if (progress <= keyframes[0][0]) return keyframes[0][1];

  for (let index = 1; index < keyframes.length; index += 1) {
    const previous = keyframes[index - 1];
    const current = keyframes[index];
    if (progress <= current[0]) {
      return mapTraceProgress(progress, previous[0], current[0], previous[1], current[1]);
    }
  }

  return keyframes[keyframes.length - 1][1];
}
