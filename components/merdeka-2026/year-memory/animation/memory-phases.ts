export const YEAR_MEMORY_PHASES = {
  year: [0, 0.07],
  ntt: [0.07, 0.19],
  together: [0.19, 0.31],
  environment: [0.31, 0.42],
  digital: [0.42, 0.54],
  everyday: [0.54, 0.67],
  archive: [0.67, 0.79],
  reflection: [0.79, 0.89],
  hope: [0.89, 0.97],
  exit: [0.97, 1],
} as const;

export const MEMORY_MOTION = {
  scrub: 0.55,
  reveal: 0.024,
  copyReveal: 0.02,
  exit: 0.024,
} as const;

export const MEMORY_SNAP_POINTS = [
  0.03,
  0.053,
  0.135,
  0.255,
  0.37,
  0.49,
  0.615,
  0.735,
  0.845,
  0.935,
  0.985,
] as const;
