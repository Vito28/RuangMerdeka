"use client";

import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hero/hooks/use-reduced-motion";
import { HUMAN_STORIES } from "./data/human-stories";
import { MovementContent, ReducedMovementContent } from "./MovementContent";

const MovementCanvas = dynamic(() => import("./scene/MovementCanvas"), { ssr: false });

export function MovementSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const reducedMotion = useReducedMotion();
  const [canvasActive, setCanvasActive] = useState(false);

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCanvasActive(entry.isIntersecting),
      { rootMargin: "45% 0px" },
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.set("[data-movement-opening]", { opacity: 0, transformPerspective: 900 });
      gsap.set("[data-movement-opening-line]", { yPercent: 112, rotateX: -16, transformOrigin: "50% 100%" });
      gsap.set("[data-movement-million-line]", { yPercent: 110 });
      gsap.set("[data-movement-together-word]", { yPercent: 108, scaleX: 0.93 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.72,
          invalidateOnRefresh: true,
          onUpdate: (self) => { progressRef.current = self.progress; },
        },
      });

      timeline
        .fromTo("[data-movement-seed-copy]", { opacity: 0, x: -18 }, { opacity: 1, x: 0, duration: 0.025, ease: "none" }, 0.02)
        .to("[data-movement-seed-copy]", { opacity: 0, x: 18, duration: 0.025, ease: "none" }, 0.095)
        .to("[data-movement-opening]", { opacity: 1, duration: 0.018, ease: "none" }, 0.12)
        .to("[data-movement-opening-line]", { yPercent: 0, rotateX: 0, duration: 0.047, stagger: 0.012, ease: "none" }, 0.122)
        .fromTo("[data-movement-opening-eyebrow]", { opacity: 0, x: -18 }, { opacity: 1, x: 0, duration: 0.035, ease: "none" }, 0.13)
        .fromTo("[data-movement-terus]", { xPercent: -18 }, { xPercent: 0, duration: 0.045, ease: "none" }, 0.155)
        .fromTo("[data-movement-bergerak]", { letterSpacing: "-0.13em" }, { letterSpacing: "-0.082em", duration: 0.055, ease: "none" }, 0.175)
        .to("[data-movement-opening]", { opacity: 0, scale: 1.08, y: -20, duration: 0.035, ease: "none" }, 0.265)
        .fromTo("[data-movement-millions]", { opacity: 0, scale: 0.965 }, { opacity: 1, scale: 1, duration: 0.04, ease: "none" }, 0.3)
        .to("[data-movement-million-line]", { yPercent: 0, duration: 0.052, ease: "none" }, 0.315)
        .to("[data-movement-millions]", { opacity: 0, scale: 1.035, duration: 0.035, ease: "none" }, 0.445);

      HUMAN_STORIES.forEach((story, index) => {
        const selector = `[data-movement-story="${index}"]`;
        timeline
          .fromTo(selector, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.014, ease: "none" }, story.phase[0])
          .to(selector, { opacity: 0, y: -18, duration: 0.013, ease: "none" }, story.phase[1] - 0.013);
      });

      timeline
        .fromTo("[data-movement-directions]", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.025, ease: "none" }, 0.72)
        .to("[data-movement-directions]", { opacity: 0, y: -14, duration: 0.02, ease: "none" }, 0.785)
        .fromTo("[data-movement-together]", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.028, ease: "none" }, 0.8)
        .to("[data-movement-together-word]", { yPercent: 0, scaleX: 1, duration: 0.045, ease: "none" }, 0.81)
        .to("[data-movement-together]", { opacity: 1, duration: 0.035, ease: "none" }, 0.855)
        .to("[data-movement-together]", { opacity: 0, duration: 0.018, ease: "none" }, 0.91)
        .fromTo("[data-movement-pulse-copy]", { opacity: 0 }, { opacity: 1, duration: 0.015, ease: "none" }, 0.9)
        .to("[data-movement-pulse-copy]", { opacity: 0, duration: 0.014, ease: "none" }, 0.962)
        .fromTo("[data-movement-exit-wipe]", { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 0.38, duration: 0.03, ease: "none" }, 0.97);
    }, sectionRef);

    return () => {
      context.revert();
      progressRef.current = 0;
    };
  }, [reducedMotion]);

  if (reducedMotion) return <ReducedMovementContent />;

  return (
    <section
      ref={sectionRef}
      id="movement"
      aria-label="Indonesia terus bergerak"
      className="relative min-h-[430svh] bg-night text-bone md:min-h-[580svh] lg:min-h-[650svh]"
    >
      <div className="sticky top-0 h-svh overflow-hidden bg-night">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
          {canvasActive && <MovementCanvas active={canvasActive} progressRef={progressRef} />}
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(231,0,17,0.075),transparent_48%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(5,5,5,0.26),transparent_23%,transparent_73%,rgba(5,5,5,0.7))]" />
        <MovementContent />
        <div
          aria-hidden="true"
          data-movement-exit-wipe
          className="pointer-events-none absolute inset-0 z-[25] origin-left scale-x-0 bg-[linear-gradient(90deg,rgba(231,0,17,0.95),rgba(231,0,17,0.72)_48%,rgba(231,0,17,0.05))] opacity-0"
        />
        <div aria-hidden="true" className="film-grain pointer-events-none absolute inset-0 z-30 opacity-[0.045] mix-blend-soft-light" />
      </div>
    </section>
  );
}
