import gsap from "gsap";
import type { MeaningProgressRef } from "../types";

export function createMeaningTimeline(section: HTMLElement, progressRef: MeaningProgressRef) {
  const select = gsap.utils.selector(section);
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.9,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    },
  });

  gsap.set(select("[data-meaning-line]"), {
    yPercent: 110,
    rotateX: 7,
    transformOrigin: "50% 100%",
  });
  gsap.set(select("[data-meaning-copy]"), { opacity: 0, y: 18 });
  gsap.set(select("[data-meaning-symbol]"), { opacity: 0, y: 10 });
  gsap.set(
    select(
      "[data-meaning-entry], [data-meaning-direction], [data-meaning-sovereign], [data-meaning-movement], [data-meaning-creation], [data-meaning-pulse]",
    ),
    { opacity: 0 },
  );

  const revealLines = (scope: string, at: number, duration = 0.055, stagger = 0.012) => {
    timeline.to(
      select(`${scope} [data-meaning-line]`),
      { yPercent: 0, rotateX: 0, duration, stagger, ease: "none" },
      at,
    );
  };

  timeline
    .to(select("[data-meaning-scroll-progress]"), { scaleX: 1, duration: 1, ease: "none" }, 0)
    .fromTo(
      select("[data-meaning-entry]"),
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.035, ease: "none" },
      0.025,
    )
    .to(select("[data-meaning-entry]"), { opacity: 0, y: -12, duration: 0.03, ease: "none" }, 0.125)
    .fromTo(
      select("[data-meaning-direction]"),
      { opacity: 0, x: -18 },
      { opacity: 1, x: 0, duration: 0.035, ease: "none" },
      0.255,
    );

  revealLines("[data-meaning-direction]", 0.275, 0.05, 0.013);
  timeline
    .to(select("[data-meaning-direction]"), { opacity: 0, x: -16, duration: 0.035, ease: "none" }, 0.405)
    .fromTo(
      select("[data-meaning-sovereign]"),
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.035, ease: "none" },
      0.345,
    );

  revealLines("[data-meaning-sovereign]", 0.365, 0.05);
  timeline
    .to(select("[data-meaning-sovereign] [data-meaning-copy]"), { opacity: 1, y: 0, duration: 0.04, ease: "none" }, 0.39)
    .to(select("[data-meaning-sovereign]"), { opacity: 0, y: -16, duration: 0.035, ease: "none" }, 0.455)
    .fromTo(
      select("[data-meaning-movement]"),
      { opacity: 0, x: 16 },
      { opacity: 1, x: 0, duration: 0.04, ease: "none" },
      0.46,
    );

  revealLines("[data-meaning-movement]", 0.48, 0.06);
  timeline
    .to(select("[data-meaning-movement] [data-meaning-copy]"), { opacity: 1, y: 0, duration: 0.045, ease: "none" }, 0.525)
    .to(select("[data-meaning-movement]"), { opacity: 0, x: -18, duration: 0.04, ease: "none" }, 0.605)
    .fromTo(
      select("[data-meaning-creation]"),
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.04, ease: "none" },
      0.6,
    )
    .to(select("[data-meaning-creation] [data-meaning-copy]"), { opacity: 1, y: 0, duration: 0.04, ease: "none" }, 0.625);

  revealLines("[data-meaning-creation]", 0.655, 0.065, 0.018);
  timeline
    .to(select("[data-meaning-creation]"), { opacity: 0, y: -14, duration: 0.04, ease: "none" }, 0.88)
    .fromTo(
      select("[data-meaning-pulse]"),
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.04, ease: "none" },
      0.905,
    );

  revealLines("[data-meaning-pulse]", 0.92, 0.045, 0.012);
  timeline
    .to(select("[data-meaning-symbol]"), { opacity: 1, y: 0, duration: 0.035, ease: "none" }, 0.925)
    .to(select("[data-meaning-pulse] [data-meaning-copy]"), { opacity: 1, y: 0, duration: 0.035, ease: "none" }, 0.955)
    .to(select("[data-meaning-light]"), { xPercent: 12, opacity: 0.3, duration: 0.18, ease: "none" }, 0.1)
    .to(select("[data-meaning-light]"), { xPercent: -14, opacity: 0.2, duration: 0.24, ease: "none" }, 0.34)
    .to(select("[data-meaning-light]"), { xPercent: 6, opacity: 0.42, duration: 0.23, ease: "none" }, 0.6)
    .to(select("[data-meaning-light]"), { xPercent: 0, opacity: 0.16, duration: 0.13, ease: "none" }, 0.88);

  return timeline;
}
