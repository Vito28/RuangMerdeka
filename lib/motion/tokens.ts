export const motionTokens = {
  duration: {
    normal: 0.6,
    slow: 1,
    cinematic: 1.5,
  },
  ease: {
    ui: "power2.out",
    reveal: "power3.out",
    cinematic: "power3.inOut",
    ambient: "sine.inOut",
  },
} as const;
