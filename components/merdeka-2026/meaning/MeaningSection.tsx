"use client";

import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hero/hooks/use-reduced-motion";
import { MeaningContent, ReducedMeaningContent } from "./MeaningContent";
import { createMeaningTimeline } from "./animation/meaning-timeline";

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
      createMeaningTimeline(sectionRef.current!, progressRef);
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
      aria-label="Denyut sebuah bangsa"
      className="relative min-h-[330svh] bg-night text-bone md:min-h-[460svh] lg:min-h-[560svh]"
    >
      <div className="sticky top-0 h-svh overflow-hidden bg-night">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
          {canvasActive && <MeaningCanvas active={canvasActive} progressRef={progressRef} />}
        </div>
        <div
          data-meaning-light
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-[18%] inset-y-0 z-10 bg-[radial-gradient(circle_at_62%_50%,rgba(230,0,18,0.12),transparent_40%)] opacity-15"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(5,5,5,0.44),transparent_25%,transparent_67%,rgba(5,5,5,0.78))]" />
        <MeaningContent />
        <div aria-hidden="true" className="film-grain pointer-events-none absolute inset-0 z-30 opacity-[0.04] mix-blend-soft-light" />
      </div>
    </section>
  );
}
