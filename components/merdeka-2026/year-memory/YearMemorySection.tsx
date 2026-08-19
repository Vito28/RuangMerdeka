"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "../hero/hooks/use-reduced-motion";
import { MEMORY_MOTION, MEMORY_SNAP_POINTS } from "./animation/memory-phases";
import { YEAR_MEMORIES } from "./data/memories";
import { MemoryOverlay } from "./MemoryOverlay";
import { MemoryVisual } from "./MemoryVisual";
import { ReducedYearMemory } from "./ReducedYearMemory";

function addImageTreatment(timeline: gsap.core.Timeline, id: string, start: number, end: number) {
  const duration = end - start;
  const image = `[data-memory-image="${id}"]`;

  switch (id) {
    case "ntt":
      timeline
        .fromTo(image, { filter: "brightness(0.12) contrast(1.25) saturate(0.5)", scale: 1.022 }, { filter: "brightness(0.9) contrast(1.04) saturate(0.92)", scale: 1.01, duration: duration * 0.58, ease: "power2.inOut" }, start)
        .fromTo(`[data-memory-exposure="${id}"]`, { opacity: 1 }, { opacity: 0.08, duration: duration * 0.62, ease: "power2.inOut" }, start)
        .to(image, { filter: "brightness(0.3) contrast(0.76) saturate(0.12)", duration: duration * 0.2, ease: "power2.inOut" }, end - duration * 0.2);
      break;
    case "together":
      timeline
        .fromTo(image, { filter: "brightness(0.46) contrast(1.12) saturate(0.72)", scale: 1.02 }, { filter: "brightness(0.96) contrast(1.02) saturate(0.98)", scale: 1.005, duration: duration * 0.62, ease: "power2.inOut" }, start)
        .fromTo(`[data-dual-grade="${id}"]`, { opacity: 1 }, { opacity: 0.16, duration: duration * 0.7, ease: "sine.inOut" }, start)
        .fromTo("[data-memory-81]", { opacity: 0 }, { opacity: 1, duration: duration * 0.17, ease: "none" }, start + duration * 0.23)
        .to("[data-memory-81]", { opacity: 0, duration: duration * 0.16, ease: "none" }, start + duration * 0.62);
      break;
    case "environment":
      timeline
        .fromTo(image, { filter: "brightness(0.48) contrast(1.12) saturate(0.68)", scale: 1.02, xPercent: -0.3 }, { filter: "brightness(0.88) contrast(1.05) saturate(0.86)", scale: 1.008, xPercent: 0.3, duration: duration * 0.66, ease: "sine.inOut" }, start)
        .fromTo("[data-heat-thread]", { opacity: 0, strokeDasharray: 1, strokeDashoffset: 1 }, { opacity: 0.55, strokeDashoffset: 0, duration: duration * 0.54, ease: "none" }, start + duration * 0.13)
        .to(image, { filter: "brightness(0.5) contrast(1.04) saturate(0.55)", duration: duration * 0.2, ease: "sine.inOut" }, end - duration * 0.2);
      break;
    case "digital":
      timeline
        .fromTo(image, { filter: "brightness(0.55) saturate(0.62) blur(2.5px)", scale: 1.014 }, { filter: "brightness(0.74) saturate(0.76) blur(1.25px)", scale: 1.005, duration: duration * 0.7, ease: "power2.inOut" }, start)
        .fromTo(`[data-memory-sharp="${id}"]`, { WebkitMaskPosition: "0% 0%", maskPosition: "0% 0%", opacity: 0.45 }, { WebkitMaskPosition: "0% 100%", maskPosition: "0% 100%", opacity: 1, duration: duration * 0.72, ease: "power2.inOut" }, start + duration * 0.08);
      break;
    case "everyday":
      timeline
        .fromTo(image, { filter: "brightness(0.4) saturate(0.58)", scale: 1.02, xPercent: -0.55 }, { filter: "brightness(0.74) saturate(0.82)", scale: 1.01, xPercent: 0.55, duration: duration * 0.76, ease: "sine.inOut" }, start)
        .fromTo(`[data-memory-sharp="${id}"]`, { WebkitMaskSize: "30% 30%", maskSize: "30% 30%", opacity: 0.35 }, { WebkitMaskSize: "175% 175%", maskSize: "175% 175%", opacity: 1, duration: duration * 0.64, ease: "power2.inOut" }, start)
        .fromTo("[data-everyday-words]", { opacity: 0 }, { opacity: 1, duration: duration * 0.12, ease: "none" }, start + duration * 0.28)
        .fromTo("[data-everyday-word]", { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: duration * 0.1, stagger: duration * 0.025, ease: "none" }, start + duration * 0.31)
        .to("[data-everyday-words]", { opacity: 0, x: 8, duration: duration * 0.14, ease: "power1.in" }, end - duration * 0.18);
      break;
    case "archive":
      timeline
        .fromTo(image, { filter: "brightness(0.34) contrast(1.16) saturate(0.5)", scale: 1.014 }, { filter: "brightness(0.78) contrast(1.04) saturate(0.82)", scale: 1.005, duration: duration * 0.72, ease: "power2.inOut" }, start)
        .fromTo("[data-archive-dates]", { opacity: 0 }, { opacity: 1, duration: duration * 0.18, ease: "none" }, start + duration * 0.2)
        .fromTo("[data-date-fragment]", { y: 7 }, { y: -3, duration: duration * 0.64, stagger: duration * 0.025, ease: "sine.inOut" }, start + duration * 0.18)
        .to("[data-archive-dates]", { opacity: 0, duration: duration * 0.13, ease: "none" }, end - duration * 0.15);
      break;
    case "reflection":
      timeline.fromTo(image, { filter: "brightness(0.44) saturate(0.48)", scale: 1 }, { filter: "brightness(0.58) saturate(0.55)", scale: 1.01, duration: duration * 0.82, ease: "sine.inOut" }, start);
      break;
    case "hope":
      timeline.fromTo(image, { filter: "brightness(0.48) contrast(1.1) saturate(0.65)", scale: 1.03 }, { filter: "brightness(1.04) contrast(1.01) saturate(1.06)", scale: 1.006, duration: duration * 0.86, ease: "power2.inOut" }, start);
      break;
  }
}

export function YearMemorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const canMagneticallySnap = window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)").matches;
      const experienceProgress = document.querySelector<HTMLElement>("[data-experience-progress]");
      const hideExperienceProgress = () => {
        if (experienceProgress) gsap.to(experienceProgress, { autoAlpha: 0, duration: 0.24, overwrite: true });
      };
      const showExperienceProgress = () => {
        if (experienceProgress) gsap.to(experienceProgress, { autoAlpha: 1, duration: 0.24, overwrite: true });
      };
      gsap.set("[data-memory-scene], [data-memory-copy], [data-memory-stamp], [data-memory-date]", { autoAlpha: 0 });
      gsap.set("[data-memory-line]", { yPercent: 108 });
      gsap.set("[data-year-number]", { autoAlpha: 0, clipPath: "inset(49% 0 49% 0)" });
      gsap.set("[data-year-dot]", { autoAlpha: 1, scale: 1 });
      gsap.set("[data-year-thread]", { scaleX: 0, transformOrigin: "left center" });
      gsap.set("[data-chronology-line]", { scaleX: 0, transformOrigin: "left center" });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: MEMORY_MOTION.scrub,
          invalidateOnRefresh: true,
          onEnter: hideExperienceProgress,
          onEnterBack: hideExperienceProgress,
          onLeaveBack: showExperienceProgress,
          snap: canMagneticallySnap
            ? {
                snapTo: (progress: number) => MEMORY_SNAP_POINTS.reduce((closest, point) => (
                  Math.abs(point - progress) < Math.abs(closest - progress) ? point : closest
                )),
                delay: 0.08,
                duration: { min: 0.28, max: 0.58 },
                ease: "power3.inOut",
                inertia: false,
              }
            : undefined,
        },
      });

      timeline
        .addLabel("year", 0)
        .fromTo("[data-year-kicker]", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.012, ease: "none" }, 0.006)
        .to("[data-year-number]", { autoAlpha: 1, clipPath: "inset(0% 0 0% 0)", duration: 0.032, ease: "power2.inOut" }, 0.008)
        .fromTo("[data-year-red-light]", { xPercent: -180, opacity: 0 }, { xPercent: 560, opacity: 0.8, duration: 0.035, ease: "power1.inOut" }, 0.018)
        .fromTo("[data-year-copy=\"celebrate\"]", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.012, ease: "none" }, 0.024)
        .to("[data-year-copy=\"celebrate\"]", { opacity: 0, y: -8, duration: 0.01, ease: "none" }, 0.046)
        .fromTo("[data-year-copy=\"remember\"]", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.012, ease: "none" }, 0.043)
        .to("[data-year-number], [data-year-kicker], [data-year-copy]", { opacity: 0, duration: 0.014, ease: "none" }, 0.063)
        .to("[data-year-thread]", { scaleX: 1, duration: 0.04, ease: "power1.inOut" }, 0.012)
        .to("[data-year-dot]", { x: () => window.innerWidth * 0.32, duration: 0.045, ease: "power1.inOut" }, 0.012)
        .to("[data-year-thread]", { opacity: 0, duration: 0.012, ease: "none" }, 0.062)
        .to("[data-year-dot]", { x: () => window.innerWidth * -0.42, y: () => window.innerHeight * 0.34, duration: 0.018, ease: "power2.inOut" }, 0.066)
        .to("[data-chronology-line]", { scaleX: 1, duration: 0.82, ease: "none" }, 0.084)
        .to("[data-year-dot]", { x: () => window.innerWidth * 0.42, duration: 0.82, ease: "none" }, 0.084);

      YEAR_MEMORIES.forEach((memory, index) => {
        const [start, end] = memory.phase;
        const scene = `[data-memory-scene="${memory.id}"]`;
        const copy = `[data-memory-copy="${memory.id}"]`;
        const lines = `[data-memory-line="${memory.id}"]`;
        const stamp = `[data-memory-stamp="${memory.id}"]`;

        timeline
          .addLabel(memory.id, start)
          .set(scene, { zIndex: 2 }, start)
          .fromTo(scene, { autoAlpha: 0 }, { autoAlpha: 1, duration: MEMORY_MOTION.reveal, ease: "none" }, start)
          .fromTo(copy, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: MEMORY_MOTION.copyReveal, ease: "none" }, start + 0.018)
          .fromTo(stamp, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.018, ease: "none" }, start + 0.02)
          .to(lines, { yPercent: 0, duration: 0.024, stagger: 0.009, ease: "none" }, start + 0.022)
          .to(copy, { autoAlpha: 0, y: -10, duration: MEMORY_MOTION.exit, ease: "none" }, end - MEMORY_MOTION.exit);

        if (index > 0) {
          const previous = YEAR_MEMORIES[index - 1];
          timeline.to(`[data-memory-scene="${previous.id}"]`, { autoAlpha: 0, duration: MEMORY_MOTION.exit, ease: "none" }, start);
        }

        addImageTreatment(timeline, memory.id, start, end);
      });

      timeline
        .fromTo("[data-memory-date=\"ntt\"]", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.024, ease: "none" }, 0.074)
        .to("[data-memory-date=\"ntt\"]", { autoAlpha: 0, y: -8, duration: 0.016, ease: "none" }, 0.15)
        .to("[data-memory-scene=\"hope\"]", { filter: "brightness(0)", duration: 0.025, ease: "power2.inOut" }, 0.97)
        .to("[data-chronology-line]", { opacity: 0, duration: 0.018, ease: "none" }, 0.97)
        .to("[data-year-dot]", { x: 0, y: 0, scale: 1, duration: 0.024, ease: "power2.inOut" }, 0.97)
        .fromTo("[data-section-six-handoff]", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.016, ease: "none" }, 0.978)
        .to("[data-year-dot]", { scale: 1.7, duration: 0.006, ease: "sine.inOut" }, 0.989)
        .to("[data-year-dot]", { scale: 1, duration: 0.005, ease: "sine.inOut" }, 0.995);
    }, sectionRef);

    return () => {
      context.revert();
      const experienceProgress = document.querySelector<HTMLElement>("[data-experience-progress]");
      if (experienceProgress) gsap.set(experienceProgress, { clearProps: "opacity,visibility" });
    };
  }, [reducedMotion]);

  if (reducedMotion) return <ReducedYearMemory memories={YEAR_MEMORIES} />;

  return (
    <section
      ref={sectionRef}
      id="year-memory"
      aria-label="Tahun yang kita jalani"
      className="relative min-h-[550svh] bg-night text-bone md:min-h-[720svh] lg:min-h-[820svh]"
    >
      <div className="sticky top-0 h-svh overflow-hidden bg-night">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          {YEAR_MEMORIES.map((memory) => <MemoryVisual key={memory.id} memory={memory} />)}
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_28%,rgba(5,5,5,0.4)_100%)]" />
        <MemoryOverlay memories={YEAR_MEMORIES} />

        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 z-30">
          <span data-year-thread className="absolute left-0 top-1/2 h-px w-[32vw] -translate-y-1/2 bg-red-flag/48" />
          <span data-year-dot className="absolute left-0 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-flag shadow-[0_0_16px_rgba(231,0,17,0.32)]" />
        </div>

        <span
          data-chronology-line
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[16%] left-[8%] z-10 h-px w-[84%] bg-gradient-to-r from-red-flag/65 via-red-flag/32 to-red-flag/8"
        />

        <div aria-hidden="true" className="film-grain pointer-events-none absolute inset-0 z-30 opacity-[0.055] mix-blend-soft-light" />
      </div>
    </section>
  );
}
