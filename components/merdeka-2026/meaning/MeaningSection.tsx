"use client";

import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hero/hooks/use-reduced-motion";
import { MEANING_PHASES } from "./animation/meaning-progress";
import { MeaningContent, ReducedMeaningContent } from "./MeaningContent";

const MeaningCanvas = dynamic(() => import("./scene/MeaningCanvas"), { ssr: false });

export function MeaningSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const reducedMotion = useReducedMotion();
  const [canvasActive, setCanvasActive] = useState(false);

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCanvasActive(entry.isIntersecting),
      { rootMargin: "50% 0px" },
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.set("[data-meaning-question]", { opacity: 1 });
      gsap.set("[data-question-line]", { yPercent: 105 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          onUpdate: (self) => { progressRef.current = self.progress; },
        },
      });

      timeline
        .to("[data-question-line]", { yPercent: 0, duration: 0.035, stagger: 0.009, ease: "none" }, 0.005)
        .to("[data-meaning-question]", { opacity: 0, y: -36, scale: 0.97, duration: 0.03, ease: "none" }, 0.09)
        .fromTo("[data-meaning-sovereign]", { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.045, ease: "none" }, MEANING_PHASES.sovereign[0] - 0.01)
        .to("[data-meaning-sovereign]", { opacity: 0, y: -24, duration: 0.04, ease: "none" }, MEANING_PHASES.sovereign[1] - 0.04)
        .fromTo("[data-meaning-justice]", { opacity: 0, scale: 0.975 }, { opacity: 1, scale: 1, duration: 0.045, ease: "none" }, MEANING_PHASES.justice[0] - 0.01)
        .to("[data-meaning-justice]", { opacity: 0, scale: 1.025, duration: 0.04, ease: "none" }, MEANING_PHASES.justice[1] - 0.04)
        .fromTo("[data-meaning-prosperity]", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.05, ease: "none" }, MEANING_PHASES.prosperity[0] - 0.01)
        .to("[data-meaning-ambient]", { opacity: 0.42, duration: 0.18, ease: "none" }, MEANING_PHASES.prosperity[0])
        .to("[data-meaning-prosperity]", { opacity: 0, y: -22, duration: 0.04, ease: "none" }, MEANING_PHASES.prosperity[1] - 0.04)
        .fromTo("[data-meaning-forward]", { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.055, ease: "none" }, MEANING_PHASES.movingForward[0] - 0.01)
        .to("[data-meaning-ambient]", { opacity: 0.22, duration: 0.16, ease: "none" }, MEANING_PHASES.movingForward[0])
        .to("[data-meaning-forward]", { opacity: 1, duration: 0.01 }, 0.99);
    }, sectionRef);

    return () => {
      context.revert();
      progressRef.current = 0;
    };
  }, [reducedMotion]);

  if (reducedMotion) return <ReducedMeaningContent />;

  return (
    <section
      ref={sectionRef}
      id="meaning"
      aria-label="Makna kemerdekaan hari ini"
      className="relative min-h-[300svh] bg-night text-bone md:min-h-[380svh] lg:min-h-[460svh]"
    >
      <div className="sticky top-0 h-svh overflow-hidden bg-night">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
          {canvasActive && <MeaningCanvas active={canvasActive} progressRef={progressRef} />}
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_62%_58%,rgba(231,0,17,0.15),transparent_42%)] opacity-10" data-meaning-ambient />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(5,5,5,0.28),transparent_28%,transparent_70%,rgba(5,5,5,0.52))]" />
        <MeaningContent />
        <div aria-hidden="true" className="film-grain pointer-events-none absolute inset-0 z-30 opacity-[0.04] mix-blend-soft-light" />
      </div>
    </section>
  );
}
