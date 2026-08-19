import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MutableRefObject } from "react";
import { COLLECTIVE_VOICE_MOTION } from "./collective-voice-phases";

export function createCollectiveVoiceTimeline(
  section: HTMLElement,
  progressRef: MutableRefObject<number>,
) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.set(
    "[data-collective-chapter], [data-collective-entry], [data-voice-selection], [data-landscape-caption], [data-philosophy], [data-climax], [data-horizon-copy]",
    { autoAlpha: 0 },
  );
  gsap.set("[data-selected-voice-line]", { yPercent: 112 });
  gsap.set("[data-selected-signal]", { scale: 0, transformOrigin: "center" });
  gsap.set("[data-selected-dash], [data-selected-resonance]", { scaleX: 0, transformOrigin: "left center" });
  gsap.set("[data-philosophy-line], [data-climax-line]", { yPercent: 108 });
  gsap.set("[data-horizon-rule]", { scaleX: 0, transformOrigin: "center" });

  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: COLLECTIVE_VOICE_MOTION.scrub,
      invalidateOnRefresh: true,
      onUpdate: (self) => { progressRef.current = self.progress; },
    },
  });

  timeline
    .fromTo("[data-collective-entry]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.018 }, 0)
    .fromTo("[data-collective-chapter]", { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.025 }, 0.012)
    .fromTo("[data-entry-fragment]", { opacity: 0, scale: 0.72 }, { opacity: 1, scale: 1, duration: 0.032, stagger: 0.003, ease: "power2.out" }, 0.015)
    .to("[data-collective-chapter]", { autoAlpha: 0, y: -6, duration: 0.018 }, 0.078)
    .to("[data-collective-entry]", { autoAlpha: 0.2, duration: 0.02 }, 0.09)
    .to("[data-collective-entry]", { autoAlpha: 0, duration: 0.02 }, 0.24);

  COLLECTIVE_VOICE_MOTION.voiceStarts.forEach((start, index) => {
    const selector = `[data-voice-selection="${index}"]`;
    const end = start + COLLECTIVE_VOICE_MOTION.voiceVisible;
    timeline
      .set(selector, { autoAlpha: 1 }, start)
      .to(`${selector} [data-selected-signal]`, { scale: 1, duration: 0.009, ease: "power2.out" }, start)
      .to(`${selector} [data-selected-dash]`, { scaleX: 1, duration: 0.012, ease: "power2.inOut" }, start + 0.006)
      .to(`${selector} [data-selected-voice-line]`, { yPercent: 0, duration: 0.022, stagger: 0.005, ease: "power3.out" }, start + 0.011)
      .to(`${selector} [data-selected-resonance]`, { scaleX: 1, duration: 0.018, ease: "power2.inOut" }, end - 0.012)
      .to(`${selector} [data-selected-voice-copy]`, { opacity: 0, letterSpacing: "0.025em", duration: 0.015 }, end - 0.007)
      .to(selector, { autoAlpha: 0, duration: 0.01 }, end + 0.006);
  });

  timeline
    .fromTo("[data-landscape-caption]", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.026 }, 0.285)
    .to("[data-landscape-caption]", { autoAlpha: 0, y: -10, duration: 0.02 }, 0.4)
    .fromTo("[data-philosophy=\"different\"]", { autoAlpha: 0, xPercent: -3 }, { autoAlpha: 1, xPercent: 0, duration: 0.03, ease: "power3.out" }, 0.43)
    .to("[data-philosophy=\"different\"]", { autoAlpha: 0, xPercent: 2, duration: 0.022 }, 0.49)
    .fromTo("[data-philosophy=\"heard\"]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.018 }, 0.495)
    .to("[data-philosophy=\"heard\"] [data-philosophy-line]", { yPercent: 0, duration: 0.035, stagger: 0.012, ease: "power3.out" }, 0.5)
    .to("[data-philosophy=\"heard\"]", { autoAlpha: 0, scale: 0.91, duration: 0.03 }, 0.585)
    .fromTo("[data-philosophy=\"not-one\"]", { autoAlpha: 0, scale: 1.07 }, { autoAlpha: 1, scale: 1, duration: 0.035, ease: "power3.out" }, 0.625)
    .to("[data-philosophy=\"not-one\"] [data-philosophy-line]", { yPercent: 0, duration: 0.032, stagger: 0.012, ease: "power3.out" }, 0.628)
    .to("[data-philosophy=\"not-one\"]", { autoAlpha: 0, yPercent: -5, duration: 0.024 }, 0.7)
    .fromTo("[data-philosophy=\"space\"]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.018 }, 0.705)
    .to("[data-philosophy=\"space\"] [data-philosophy-line]", { yPercent: 0, duration: 0.027, stagger: 0.009, ease: "power3.out" }, 0.708)
    .to("[data-philosophy=\"space\"]", { autoAlpha: 0, scale: 0.9, duration: 0.022 }, 0.758)
    .fromTo("[data-climax=\"answer\"]", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.026 }, 0.775)
    .to("[data-climax=\"answer\"] [data-climax-line]", { yPercent: 0, duration: 0.026, stagger: 0.01, ease: "power3.out" }, 0.778)
    .to("[data-climax=\"answer\"]", { autoAlpha: 0, y: -12, duration: 0.022 }, 0.82)
    .fromTo("[data-climax=\"journey\"]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.018 }, 0.82)
    .to("[data-climax=\"journey\"] [data-climax-line]", { yPercent: 0, duration: 0.028, stagger: 0.009, ease: "power3.out" }, 0.824)
    .to("[data-climax=\"journey\"]", { autoAlpha: 0.26, scale: 0.78, duration: 0.042 }, 0.88)
    .fromTo("[data-horizon-copy]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.025 }, 0.92)
    .to("[data-horizon-rule]", { scaleX: 1, duration: 0.055, ease: "power2.inOut" }, 0.925)
    .fromTo("[data-horizon-word]", { opacity: 0 }, { opacity: 0.36, duration: 0.025, stagger: 0.006 }, 0.932)
    .to("[data-horizon-word]", { opacity: 0, duration: 0.026, stagger: 0.004 }, 0.965);

  return timeline;
}
