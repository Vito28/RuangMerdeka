import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MutableRefObject } from "react";
import { FINALE_JOURNEY_CONFIG } from "./finale-journey-phases";

export function createFinaleJourneyTimeline(section: HTMLElement, progressRef: MutableRefObject<number>) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.set(
    "[data-finale-callback], [data-finale-photo], [data-finale-81], [data-finale-flight], [data-finale-wing-copy], [data-finale-map-copy], [data-finale-map-stack], [data-finale-user-voice], [data-finale-celebration], [data-finale-closing], [data-finale-brand], [data-finale-nav]",
    { autoAlpha: 0 },
  );
  gsap.set("[data-finale-year-signal]", { left: "0%", xPercent: -50 });
  gsap.set("[data-finale-year-rule]", { scaleX: 0, transformOrigin: "left center" });
  gsap.set("[data-finale-81-line], [data-finale-copy-line]", { yPercent: 112 });
  gsap.set("[data-finale-photo]", { clipPath: "inset(48% 0 48% 0)" });

  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: FINALE_JOURNEY_CONFIG.scrub,
      invalidateOnRefresh: true,
      onUpdate: (self) => { progressRef.current = self.progress; },
    },
  });

  timeline
    .fromTo("[data-finale-horizon]", { autoAlpha: 0.25 }, { autoAlpha: 1, duration: 0.035 }, 0)
    .to("[data-finale-year-rule]", { scaleX: 1, duration: 0.055, ease: "power2.inOut" }, 0.03)
    .to("[data-finale-year-signal]", { left: "100%", duration: 0.205, ease: "power1.inOut" }, 0.082);

  for (let index = 0; index < 7; index += 1) {
    const start = 0.105 + index * 0.027;
    const selector = `[data-finale-callback="${index}"]`;
    timeline
      .fromTo(selector, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.012, ease: "power2.out" }, start)
      .to(selector, { autoAlpha: 0, y: -8, duration: 0.012 }, start + 0.021);
  }

  for (let index = 0; index < 3; index += 1) {
    const start = 0.205 + index * 0.024;
    const selector = `[data-finale-photo="${index}"]`;
    timeline
      .to(selector, { autoAlpha: 0.62, clipPath: "inset(0% 0 0% 0)", duration: 0.013, ease: "power3.out" }, start)
      .to(selector, { autoAlpha: 0, scale: 1.035, duration: 0.017 }, start + 0.018);
  }

  timeline
    .to("[data-finale-horizon]", { autoAlpha: 0, duration: 0.024 }, 0.295)
    .fromTo("[data-finale-81]", { autoAlpha: 0, scale: 1.1 }, { autoAlpha: 1, scale: 1, duration: 0.052, ease: "power3.out" }, 0.315)
    .to("[data-finale-81-line]", { yPercent: 0, duration: 0.034, stagger: 0.01, ease: "power3.out" }, 0.327)
    .to("[data-finale-81-material-label]", { opacity: 1, duration: 0.022 }, 0.385)
    .to("[data-finale-81]", { autoAlpha: 0.08, scale: 1.2, duration: 0.072, ease: "power2.in" }, 0.485)
    .fromTo("[data-finale-flight]", { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.03 }, 0.515)
    .to("[data-finale-flight]", { autoAlpha: 0, scale: 1.08, duration: 0.04 }, 0.59)
    .fromTo("[data-finale-wing-copy]", { autoAlpha: 0, letterSpacing: "0.32em" }, { autoAlpha: 1, letterSpacing: "0.18em", duration: 0.025 }, 0.635)
    .to("[data-finale-wing-copy]", { autoAlpha: 0, duration: 0.022 }, 0.695)
    .fromTo("[data-finale-map-copy]", { autoAlpha: 0, xPercent: 3 }, { autoAlpha: 1, xPercent: 0, duration: 0.032, ease: "power3.out" }, 0.745)
    .to("[data-finale-map-copy] [data-finale-copy-line]", { yPercent: 0, duration: 0.032, stagger: 0.009, ease: "power3.out" }, 0.748)
    .to("[data-finale-map-copy]", { autoAlpha: 0, yPercent: -3, duration: 0.024 }, 0.807)
    .fromTo("[data-finale-map-stack]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.018 }, 0.815)
    .to("[data-finale-map-stack] [data-finale-copy-line]", { yPercent: 0, duration: 0.026, stagger: 0.012, ease: "power3.out" }, 0.819)
    .fromTo("[data-finale-user-voice]", { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.018 }, 0.847)
    .to("[data-finale-user-voice]", { autoAlpha: 0, scale: 0.25, duration: 0.025, ease: "power2.in" }, 0.872)
    .to("[data-finale-map-stack]", { autoAlpha: 0, scale: 0.93, duration: 0.035 }, 0.875)
    .fromTo("[data-finale-celebration]", { autoAlpha: 0, yPercent: 5 }, { autoAlpha: 1, yPercent: 0, duration: 0.025, ease: "power3.out" }, 0.895)
    .to("[data-finale-celebration] [data-finale-copy-line]", { yPercent: 0, duration: 0.026, stagger: 0.009, ease: "power3.out" }, 0.898)
    .to("[data-finale-celebration]", { autoAlpha: 0, scale: 0.96, duration: 0.022 }, 0.935)
    .fromTo('[data-finale-closing="past"]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.014 }, 0.94)
    .to('[data-finale-closing="past"] [data-finale-copy-line]', { yPercent: 0, duration: 0.018, stagger: 0.006, ease: "power3.out" }, 0.942)
    .to('[data-finale-closing="past"]', { autoAlpha: 0, duration: 0.012 }, 0.956)
    .fromTo('[data-finale-closing="unfinished"]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.012 }, 0.958)
    .to('[data-finale-closing="unfinished"] [data-finale-copy-line]', { yPercent: 0, duration: 0.018, stagger: 0.006, ease: "power3.out" }, 0.96)
    .to('[data-finale-closing="unfinished"]', { autoAlpha: 0, duration: 0.012 }, 0.973)
    .fromTo('[data-finale-closing="meaning"]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.008 }, 0.974)
    .to('[data-finale-closing="meaning"] [data-finale-copy-line]', { yPercent: 0, duration: 0.012, stagger: 0.004, ease: "power3.out" }, 0.975)
    .to('[data-finale-closing="meaning"]', { autoAlpha: 0, duration: 0.006 }, 0.984)
    .fromTo("[data-finale-brand]", { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.01, ease: "power2.out" }, 0.985)
    .fromTo("[data-finale-nav]", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.009 }, 0.989)
    .set({}, {}, 1);

  return timeline;
}
