"use client";

import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hero/hooks/use-reduced-motion";
import { MOVEMENT_PHASES } from "./animation/movement-progress";
import { MovementContent, ReducedMovementContent } from "./MovementContent";

const MovementCanvas = dynamic(() => import("./scene/MovementCanvas"), { ssr: false });

const wordMotion = {
  brave: { from: { yPercent: 105 }, to: { yPercent: 0 } },
  diverse: { from: { xPercent: 14 }, to: { xPercent: 0 } },
  creative: { from: { scale: 0.9 }, to: { scale: 1 } },
  empowered: { from: { yPercent: -70 }, to: { yPercent: 0 } },
  moving: { from: { xPercent: -12 }, to: { xPercent: 0 } },
  together: { from: { scale: 0.86 }, to: { scale: 1 } },
} as const;

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
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.75,
          onUpdate: (self) => { progressRef.current = self.progress; },
        },
      });

      timeline
        .to("[data-movement-opening]", { opacity: 0, y: -26, duration: 0.03, ease: "none" }, MOVEMENT_PHASES.opening[1] - 0.03)
        .fromTo("[data-movement-person]", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.035, ease: "none" }, MOVEMENT_PHASES.notOnePerson[0])
        .to("[data-movement-person]", { opacity: 0, y: -24, duration: 0.03, ease: "none" }, MOVEMENT_PHASES.notOnePerson[1] - 0.03)
        .fromTo("[data-movement-place]", { opacity: 0, x: 28 }, { opacity: 1, x: 0, duration: 0.035, ease: "none" }, MOVEMENT_PHASES.notOnePlace[0])
        .to("[data-movement-place]", { opacity: 0, x: -24, duration: 0.03, ease: "none" }, MOVEMENT_PHASES.notOnePlace[1] - 0.03)
        .fromTo("[data-movement-bridge]", { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.025, ease: "none" }, MOVEMENT_PHASES.bridge[0])
        .to("[data-movement-bridge]", { opacity: 0, scale: 1.02, duration: 0.02, ease: "none" }, MOVEMENT_PHASES.bridge[1] - 0.02);

      const phases = ["brave", "diverse", "creative", "empowered", "moving", "together"] as const;
      for (const phase of phases) {
        const range = MOVEMENT_PHASES[phase];
        const selector = `[data-movement-phase=\"${phase}\"]`;
        timeline
          .fromTo(selector, { opacity: 0 }, { opacity: 1, duration: 0.018, ease: "none" }, range[0])
          .fromTo(`${selector} [data-movement-word-text]`, wordMotion[phase].from, { ...wordMotion[phase].to, duration: phase === "together" ? 0.045 : 0.027, ease: "none" }, range[0])
          .to(selector, { opacity: 0, duration: phase === "together" ? 0.025 : 0.018, ease: "none" }, range[1] - (phase === "together" ? 0.025 : 0.018));
      }

      timeline.fromTo(
        "[data-movement-closing]",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.045, ease: "none" },
        MOVEMENT_PHASES.closing[0],
      ).to(
        "[data-movement-closing]",
        { opacity: 1, duration: 0.055, ease: "none" },
        0.945,
      );
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
      aria-label="Indonesia adalah gerak kita"
      className="relative min-h-[260svh] bg-night text-bone md:min-h-[310svh] lg:min-h-[360svh]"
    >
      <div className="sticky top-0 h-svh overflow-hidden bg-night">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
          {canvasActive && <MovementCanvas active={canvasActive} progressRef={progressRef} />}
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_58%_50%,rgba(231,0,17,0.12),transparent_44%)] opacity-60" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(5,5,5,0.25),transparent_24%,transparent_72%,rgba(5,5,5,0.6))]" />
        <MovementContent />
        <div aria-hidden="true" className="film-grain pointer-events-none absolute inset-0 z-30 opacity-[0.045] mix-blend-soft-light" />
      </div>
    </section>
  );
}
