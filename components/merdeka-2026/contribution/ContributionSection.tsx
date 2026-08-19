"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useReducedMotion } from "../hero/hooks/use-reduced-motion";
import { CONTRIBUTION_LIMITS, CONTRIBUTION_PHASES } from "./animation/contribution-phases";
import { ContributionForm, type ContributionStatus } from "./ContributionForm";
import { ContributionNarrative } from "./ContributionNarrative";
import { ContributionSuccess } from "./ContributionSuccess";
import { ReducedContributionContent } from "./ReducedContributionContent";
import { ContributionRibbon } from "./ribbon/ContributionRibbon";

export function ContributionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const submitTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const reducedMotion = useReducedMotion();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<ContributionStatus>("idle");

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      const redRibbonWidth = isMobile ? 10 : 16;
      const whiteRibbonWidth = isMobile ? 7 : 10;
      const formRibbonY = isMobile ? 20 : 82;
      gsap.set("[data-contribution-form]", { pointerEvents: "none" });
      gsap.set("[data-contribution-question-line]", { yPercent: 105 });
      gsap.set("[data-contribution-intention-line]", { yPercent: 105 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        },
      });
      scrollTimelineRef.current = timeline;

      timeline
        .to("[data-contribution-kita]", { scale: 1.08, letterSpacing: "0.08em", duration: 0.14, ease: "none" }, CONTRIBUTION_PHASES.collective[0])
        .to("[data-contribution-kita]", { opacity: 0, xPercent: -8, duration: 0.035, ease: "none" }, CONTRIBUTION_PHASES.collective[1] - 0.02)
        .fromTo("[data-ribbon-red]", { strokeDashoffset: 1, strokeWidth: 3, opacity: 0.92 }, { strokeDashoffset: 0, duration: 0.22, ease: "none" }, 0.04)
        .to("[data-ribbon-red]", { strokeWidth: redRibbonWidth, duration: 0.12, ease: "none" }, CONTRIBUTION_PHASES.personal[0])
        .fromTo("[data-contribution-saya]", { opacity: 0, xPercent: 9 }, { opacity: 1, xPercent: 0, duration: 0.04, ease: "none" }, CONTRIBUTION_PHASES.personal[0])
        .to("[data-contribution-saya]", { opacity: 0, xPercent: -7, duration: 0.035, ease: "none" }, CONTRIBUTION_PHASES.personal[1] - 0.03)
        .fromTo("[data-contribution-question]", { opacity: 0, xPercent: 5 }, { opacity: 1, xPercent: 0, duration: 0.04, ease: "none" }, CONTRIBUTION_PHASES.question[0])
        .to("[data-contribution-question-line]", { yPercent: 0, duration: 0.04, stagger: 0.012, ease: "none" }, CONTRIBUTION_PHASES.question[0])
        .to("[data-contribution-question]", { opacity: 0, y: -26, duration: 0.04, ease: "none" }, CONTRIBUTION_PHASES.question[1] - 0.01)
        .fromTo("[data-ribbon-white]", { strokeDashoffset: 1, strokeWidth: whiteRibbonWidth, opacity: 0 }, { strokeDashoffset: 0, opacity: 0.94, duration: 0.2, ease: "none" }, 0.43)
        .fromTo("[data-contribution-intention]", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.04, ease: "none" }, CONTRIBUTION_PHASES.intention[0])
        .to("[data-contribution-intention-line]", { yPercent: 0, duration: 0.04, stagger: 0.012, ease: "none" }, CONTRIBUTION_PHASES.intention[0])
        .to("[data-contribution-intention]", { opacity: 0, scale: 0.98, duration: 0.04, ease: "none" }, CONTRIBUTION_PHASES.intention[1] - 0.02)
        .fromTo("[data-contribution-form]", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.09, ease: "none" }, CONTRIBUTION_PHASES.inputReveal[0])
        .to("[data-contribution-underline]", { scaleX: 1, duration: 0.07, ease: "none" }, 0.75)
        .set("[data-contribution-form]", { pointerEvents: "auto" }, 0.81)
        .to("[data-ribbon-red]", { y: formRibbonY, scaleY: 0.62, transformOrigin: "50% 50%", duration: 0.14, ease: "none" }, 0.7)
        .to("[data-ribbon-white]", { y: formRibbonY, scaleY: 0.62, transformOrigin: "50% 50%", duration: 0.14, ease: "none" }, 0.7)
        .to("[data-contribution-form]", { opacity: 1, duration: 0.16, ease: "none" }, CONTRIBUTION_PHASES.interaction[0]);
    }, sectionRef);

    return () => {
      context.revert();
      scrollTimelineRef.current = null;
    };
  }, [reducedMotion]);

  useEffect(() => () => {
    submitTimelineRef.current?.kill();
  }, []);

  const updateMessage = (nextMessage: string) => {
    setMessage(nextMessage);
    if (error) setError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status !== "idle") return;

    const normalizedMessage = message.trim();
    if (normalizedMessage.length < CONTRIBUTION_LIMITS.minimum) {
      setError(`TULIS SETIDAKNYA ${CONTRIBUTION_LIMITS.minimum} KARAKTER.`);
      textareaRef.current?.focus();
      return;
    }

    setError("");
    setStatus("submitting");

    if (reducedMotion || !sectionRef.current) {
      setStatus("success");
      return;
    }

    scrollTimelineRef.current?.scrollTrigger?.disable(false);
    const isMobile = window.innerWidth < 768;
    const submitRedWidth = isMobile ? 14 : 22;
    const submitWhiteWidth = isMobile ? 10 : 14;
    const scope = gsap.utils.selector(sectionRef);
    const particles = scope<HTMLElement>("[data-contribution-particle]");
    const timeline = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => setStatus("success"),
    });
    submitTimelineRef.current = timeline;

    timeline
      .set(scope("[data-contribution-capture]"), { opacity: 1, scaleX: 0, transformOrigin: "left center" })
      .to(scope("[data-contribution-capture]"), { scaleX: 1, duration: 0.55 })
      .to(scope("[data-contribution-input-content]"), { opacity: 0, y: -10, duration: 0.25 }, 0.35)
      .to(scope("[data-ribbon-red]"), { strokeWidth: submitRedWidth, duration: 0.4 }, 0.2)
      .to(scope("[data-ribbon-white]"), { strokeWidth: submitWhiteWidth, duration: 0.4 }, 0.22)
      .set(scope("[data-ribbon-light]"), { opacity: 1, x: -30, y: 0 }, 0.5)
      .to(scope("[data-ribbon-light]"), { x: window.innerWidth + 60, y: -110, duration: 1.05, ease: "power2.inOut" }, 0.5)
      .fromTo(
        particles,
        { opacity: 0, scale: 0, x: 0, y: 0 },
        {
          opacity: 0.9,
          scale: 1,
          x: (_, element) => Number((element as HTMLElement).dataset.x) * 2.4,
          y: (_, element) => Number((element as HTMLElement).dataset.y) * 2.1,
          duration: 0.5,
          stagger: 0.012,
          ease: "power2.out",
        },
        1.18,
      )
      .to(particles, { opacity: 0, scale: 0.4, duration: 0.35, stagger: 0.008 }, 1.62)
      .to(scope("[data-contribution-form]"), { opacity: 0, duration: 0.3, pointerEvents: "none" }, 1.1)
      .fromTo(scope("[data-contribution-success]"), { opacity: 0, scale: 0.97, y: 22 }, { opacity: 1, scale: 1, y: 0, duration: 0.65 }, 1.35)
      .to(scope("[data-ribbon-red]"), { opacity: 0.28, duration: 0.45 }, 1.3)
      .to(scope("[data-ribbon-white]"), { opacity: 0.22, duration: 0.45 }, 1.32)
      .to(scope("[data-contribution-capture]"), { opacity: 0, duration: 0.25 }, 1.3)
      .fromTo(scope("[data-finale-red]"), { scaleY: 0, opacity: 0 }, { scaleY: 0.22, opacity: 0.12, duration: 0.8 }, 1.7)
      .fromTo(scope("[data-finale-white]"), { scaleY: 0, opacity: 0 }, { scaleY: 0.18, opacity: 0.07, duration: 0.8 }, 1.76);
  };

  const formProps = {
    error,
    message,
    onMessageChange: updateMessage,
    onSubmit: handleSubmit,
    status,
    textareaRef,
  };

  if (reducedMotion) return <ReducedContributionContent {...formProps} />;

  return (
    <section
      ref={sectionRef}
      id="contribution"
      aria-label="Niat untuk Indonesia"
      className="relative min-h-[210svh] bg-night text-bone md:min-h-[250svh] lg:min-h-[290svh]"
    >
      <div className="sticky top-0 h-svh overflow-hidden bg-night">
        <ContributionRibbon />

        <ContributionNarrative />

        <div
          data-contribution-form
          aria-hidden={status === "success"}
          className="absolute inset-x-5 bottom-10 top-40 z-20 flex items-center justify-center opacity-0 md:inset-x-10 md:bottom-12 md:top-44 lg:inset-x-16"
        >
          <div className="relative w-full max-w-3xl">
            <ContributionForm {...formProps} />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-5 bottom-10 top-40 z-20 md:inset-x-10 md:bottom-12 md:top-44 lg:inset-x-16">
          <ContributionSuccess active={status === "success"} />
        </div>

        <p className="sr-only" aria-live="polite">
          {status === "success" ? "Terima kasih. Satu niat telah bergerak." : ""}
        </p>
        <div aria-hidden="true" className="film-grain pointer-events-none absolute inset-0 z-30 opacity-[0.04] mix-blend-soft-light" />
      </div>
    </section>
  );
}
