"use client";

import dynamic from "next/dynamic";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { useDevicePerformance } from "../hero/hooks/use-device-performance";
import { useReducedMotion } from "../hero/hooks/use-reduced-motion";
import { useCinematicScrollGate } from "../voice/hooks/use-cinematic-scroll-gate";
import { useVoiceExperience } from "../voice/VoiceExperienceContext";
import { createFinaleJourneyTimeline } from "./animation/create-finale-journey-timeline";
import { FINALE_JOURNEY_GATES } from "./animation/finale-journey-phases";
import { ReducedFinaleJourney } from "./ReducedFinaleJourney";
import { FinaleJourneyOverlay } from "./ui/FinaleJourneyOverlay";

const FinaleJourneyCanvas = dynamic(() => import("./scene/FinaleJourneyCanvas"), { ssr: false });

export function FinaleJourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const reducedMotion = useReducedMotion();
  const quality = useDevicePerformance();
  const [canvasActive, setCanvasActive] = useState(false);
  const { status, userVoiceSignalId } = useVoiceExperience();
  const hasUserSignal = status === "submitted" && Boolean(userVoiceSignalId);

  useCinematicScrollGate({ sectionRef, gates: FINALE_JOURNEY_GATES, disabled: reducedMotion });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCanvasActive(entry.isIntersecting),
      { rootMargin: "35% 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;
    const context = gsap.context(() => createFinaleJourneyTimeline(section, progressRef), section);
    return () => {
      context.revert();
      progressRef.current = 0;
    };
  }, [reducedMotion]);

  if (reducedMotion) return <ReducedFinaleJourney />;

  return (
    <section
      ref={sectionRef}
      id="finale-journey"
      aria-label="Penutup perjalanan 81 tahun"
      className="relative min-h-[500svh] bg-night text-bone md:min-h-[660svh]"
    >
      <div data-voice-stage className="sticky top-0 h-svh overflow-hidden bg-night will-change-transform">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          {canvasActive && <FinaleJourneyCanvas progressRef={progressRef} quality={quality} active={canvasActive} hasUserSignal={hasUserSignal} />}
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_24%,rgba(5,5,5,0.64)_100%)]" />
        <div data-gate-breath aria-hidden="true" className="pointer-events-none absolute -inset-[8%] z-10 opacity-0 [background:radial-gradient(circle_at_center,transparent_42%,rgba(231,0,17,0.07)_72%,rgba(5,5,5,0.38)_100%)]" />
        <FinaleJourneyOverlay />
        <div aria-hidden="true" className="film-grain pointer-events-none absolute inset-0 z-30 opacity-[0.035] mix-blend-soft-light" />
      </div>
    </section>
  );
}
