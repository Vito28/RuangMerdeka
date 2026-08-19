"use client";

import dynamic from "next/dynamic";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { useDevicePerformance } from "../hero/hooks/use-device-performance";
import { useReducedMotion } from "../hero/hooks/use-reduced-motion";
import { useCinematicScrollGate } from "../voice/hooks/use-cinematic-scroll-gate";
import { useVoiceExperience } from "../voice/VoiceExperienceContext";
import { COLLECTIVE_VOICE_GATES } from "./animation/collective-voice-phases";
import { createCollectiveVoiceTimeline } from "./animation/create-collective-voice-timeline";
import { ReducedCollectiveVoice } from "./ReducedCollectiveVoice";
import { CollectiveVoiceOverlay } from "./ui/CollectiveVoiceOverlay";

const CollectiveVoiceCanvas = dynamic(() => import("./scene/CollectiveVoiceCanvas"), { ssr: false });

export function CollectiveVoiceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const reducedMotion = useReducedMotion();
  const quality = useDevicePerformance();
  const [canvasActive, setCanvasActive] = useState(false);
  const { status, userVoiceSignalId } = useVoiceExperience();
  const hasUserSignal = status === "submitted" && Boolean(userVoiceSignalId);

  useCinematicScrollGate({
    sectionRef,
    gates: COLLECTIVE_VOICE_GATES,
    disabled: reducedMotion,
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCanvasActive(entry.isIntersecting),
      { rootMargin: "30% 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;
    const context = gsap.context(() => {
      createCollectiveVoiceTimeline(section, progressRef);
    }, section);
    return () => {
      context.revert();
      progressRef.current = 0;
    };
  }, [reducedMotion]);

  if (reducedMotion) return <ReducedCollectiveVoice hasUserSignal={hasUserSignal} />;

  return (
    <section
      ref={sectionRef}
      id="collective-voice"
      aria-label="Suara kita"
      className="relative min-h-[450svh] bg-night text-bone md:min-h-[760svh]"
    >
      <div data-voice-stage className="sticky top-0 h-svh overflow-hidden bg-night will-change-transform">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          {canvasActive && (
            <CollectiveVoiceCanvas
              active={canvasActive}
              progressRef={progressRef}
              quality={quality}
              hasUserSignal={hasUserSignal}
            />
          )}
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_28%,rgba(5,5,5,0.62)_100%)]" />
        <div
          data-gate-breath
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[8%] z-10 opacity-0 [background:radial-gradient(circle_at_center,transparent_43%,rgba(231,0,17,0.065)_73%,rgba(5,5,5,0.36)_100%)]"
        />
        <CollectiveVoiceOverlay />
        <div aria-hidden="true" className="film-grain pointer-events-none absolute inset-0 z-30 opacity-[0.04] mix-blend-soft-light" />
      </div>
    </section>
  );
}
