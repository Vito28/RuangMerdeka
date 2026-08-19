"use client";

import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hero/hooks/use-reduced-motion";
import { VOICE_GATES } from "./animation/voice-phases";
import { useCinematicScrollGate } from "./hooks/use-cinematic-scroll-gate";
import { ReducedVoiceContent } from "./ReducedVoiceContent";
import { VoiceOverlay } from "./ui/VoiceOverlay";
import { useVoiceExperience } from "./VoiceExperienceContext";

const VoiceFieldCanvas = dynamic(() => import("./scene/VoiceFieldCanvas"), { ssr: false });

export function VoiceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const reducedMotion = useReducedMotion();
  const [canvasActive, setCanvasActive] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const { draft: answer, setDraft: setAnswer, status, submitVoice, skipVoice } = useVoiceExperience();
  const submitted = status === "submitted";
  const { captureGate } = useCinematicScrollGate({
    sectionRef,
    gates: VOICE_GATES,
    disabled: reducedMotion || inputFocused,
  });

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
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.set("[data-question-line]", { yPercent: 108 });
      gsap.set("[data-seed-word]", { opacity: 0, y: 16, scale: 0.9 });
      gsap.set("[data-word-bridge]", { opacity: 0, scale: 0.94 });
      gsap.set("[data-voice-form]", { pointerEvents: "none" });
      gsap.set("[data-input-rule]", { scaleX: 0 });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.58,
          invalidateOnRefresh: true,
          onUpdate: (self) => { progressRef.current = self.progress; },
        },
      });

      timeline
        .fromTo("[data-voice-opening]", { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.035 }, 0.008)
        .to("[data-voice-caret]", { width: 2, height: 64, borderRadius: 0, duration: 0.035, ease: "power2.inOut" }, 0.035)
        .to("[data-voice-opening]", { clipPath: "inset(0 0 0 100%)", opacity: 0, duration: 0.035, ease: "power2.in" }, 0.065)
        .to("[data-voice-caret]", { height: 16, opacity: 0, duration: 0.02 }, 0.085)
        .to("[data-voice-question]", { opacity: 1, duration: 0.018 }, 0.105)
        .to("[data-question-line]", { yPercent: 0, duration: 0.052, stagger: 0.022, ease: "power3.out" }, 0.11)
        .to("[data-voice-question]", { scale: 0.72, yPercent: -7, opacity: 0.13, duration: 0.055, ease: "power2.in" }, 0.235)
        .to("[data-word-field]", { opacity: 1, duration: 0.02 }, 0.255)
        .to("[data-seed-word]", { opacity: 1, y: 0, scale: 1, duration: 0.045, stagger: 0.008, ease: "power2.out" }, 0.26)
        .to("[data-word-bridge]", { opacity: 1, scale: 1, duration: 0.045, ease: "power2.out" }, 0.295)
        .to("[data-word-field]", { opacity: 0.1, scale: 1.035, duration: 0.045 }, 0.385)
        .to("[data-curated-voices]", { opacity: 1, duration: 0.012 }, 0.4)
        .fromTo("[data-curated-voice=\"choice\"]", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.025 }, 0.405)
        .to("[data-curated-voice=\"choice\"]", { opacity: 0, y: -9, duration: 0.018 }, 0.438)
        .fromTo("[data-curated-voice=\"home\"]", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.025 }, 0.435)
        .to("[data-curated-voice=\"home\"]", { opacity: 0, y: -9, duration: 0.018 }, 0.472)
        .fromTo("[data-curated-voice=\"learn\"]", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.025 }, 0.47)
        .to("[data-curated-voice=\"learn\"]", { opacity: 0, y: -9, duration: 0.018 }, 0.51)
        .fromTo("[data-curated-voice=\"self\"]", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.025 }, 0.505)
        .to("[data-curated-voice=\"self\"]", { opacity: 0, y: -9, duration: 0.018 }, 0.545)
        .to("[data-word-field], [data-curated-voices]", { opacity: 0, duration: 0.018 }, 0.545)
        .fromTo("[data-personal-prompt]", { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.06, ease: "power3.out" }, 0.56)
        .fromTo("[data-voice-caret]", { opacity: 0, height: 12, width: 2 }, { opacity: 1, height: 72, duration: 0.035 }, 0.585)
        .to("[data-personal-prompt]", { opacity: 0.16, scale: 0.8, yPercent: -24, duration: 0.045, ease: "power2.in" }, 0.665)
        .to("[data-voice-caret]", { opacity: 0, duration: 0.016 }, 0.665)
        .to("[data-voice-form]", { opacity: 1, pointerEvents: "auto", duration: 0.035 }, 0.685)
        .to("[data-input-rule]", { scaleX: 1, duration: 0.04, ease: "power2.out" }, 0.69)
        .to("[data-personal-prompt]", { opacity: 0, duration: 0.025 }, 0.78)
        .to("[data-voice-form]", { opacity: 0.08, pointerEvents: "none", duration: 0.035 }, 0.815)
        .fromTo("[data-user-answer]", { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, duration: 0.045, ease: "power2.out" }, 0.82)
        .to("[data-user-answer]", { opacity: 0, scale: 0.18, duration: 0.055, ease: "power3.in" }, 0.86)
        .to("[data-collective-copy]", { opacity: 1, duration: 0.025 }, 0.915)
        .fromTo("[data-one-answer]", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.025 }, 0.92)
        .to("[data-one-answer]", { opacity: 0, y: -12, duration: 0.02 }, 0.952)
        .fromTo("[data-million-answers]", { opacity: 0, yPercent: 8 }, { opacity: 1, yPercent: 0, duration: 0.026, ease: "power2.out" }, 0.95)
        .to("[data-collective-support]", { opacity: 1, duration: 0.022 }, 0.963)
        .to("[data-voice-handoff]", { opacity: 1, duration: 0.012 }, 0.986);
    }, section);

    return () => {
      context.revert();
      progressRef.current = 0;
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (status !== "submitted" || reducedMotion) return;
    captureGate("answer");
    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-user-answer-word]",
        { opacity: 0, y: 28, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, stagger: 0.055, ease: "power3.out" },
      );
    }, sectionRef);
    return () => context.revert();
  }, [captureGate, reducedMotion, status]);

  if (reducedMotion) return <ReducedVoiceContent />;

  const submitAnswer = () => {
    if (!answer.trim()) return;
    setInputFocused(false);
    submitVoice();
  };

  const skipAnswer = () => {
    setInputFocused(false);
    skipVoice();
    captureGate("voices");
  };

  return (
    <section
      ref={sectionRef}
      id="voice"
      aria-label="Apa arti merdeka hari ini?"
      className="relative min-h-[560svh] bg-night text-bone md:min-h-[700svh]"
    >
      <div data-voice-stage className="sticky top-0 h-svh overflow-hidden bg-night will-change-transform">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 opacity-90">
          {canvasActive && (
            <VoiceFieldCanvas active={canvasActive} progressRef={progressRef} submitted={submitted} />
          )}
        </div>
        <div
          data-typing-glow
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-500"
          style={{
            opacity: Math.min(0.38, answer.length / 260),
            background: "radial-gradient(circle at 50% 64%, rgba(231,0,17,0.22), transparent 36%)",
          }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_24%,rgba(5,5,5,0.58)_100%)]" />
        <div
          data-gate-breath
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[8%] z-10 opacity-0 [background:radial-gradient(circle_at_center,transparent_42%,rgba(231,0,17,0.07)_72%,rgba(5,5,5,0.34)_100%)]"
        />
        <VoiceOverlay
          answer={answer}
          submitted={submitted}
          onAnswerChange={setAnswer}
          onFocusChange={setInputFocused}
          onSubmit={submitAnswer}
          onSkip={skipAnswer}
        />
        <p className="sr-only" aria-live="polite">
          {submitted ? "Jawabanmu menjadi bagian dari visual suara bersama pada layar ini." : status === "skipped" ? "Pertanyaan dilewati." : ""}
        </p>
        <div aria-hidden="true" className="film-grain pointer-events-none absolute inset-0 z-40 opacity-[0.045] mix-blend-soft-light" />
      </div>
    </section>
  );
}
