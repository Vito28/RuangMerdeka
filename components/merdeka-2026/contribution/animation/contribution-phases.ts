export const CONTRIBUTION_PHASES = {
  collective: [0, 0.16],
  personal: [0.16, 0.32],
  question: [0.32, 0.52],
  intention: [0.52, 0.7],
  inputReveal: [0.7, 0.84],
  interaction: [0.84, 1],
} as const;

export const CONTRIBUTION_LIMITS = {
  minimum: 4,
  maximum: 180,
} as const;
