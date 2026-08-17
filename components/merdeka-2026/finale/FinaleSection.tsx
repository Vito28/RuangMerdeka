"use client";

import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hero/hooks/use-reduced-motion";
import { FINALE_PHASES } from "./animation/finale-progress";
import { FinaleTypography } from "./FinaleTypography";

const FinaleCanvas = dynamic(() => import("./scene/FinaleCanvas"), { ssr: false });

export function FinaleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const reducedMotion = useReducedMotion();
  const [canvasActive, setCanvasActive] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCanvasActive(entry.isIntersecting),
      { rootMargin: "40% 0px" },
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion) progressRef.current = 0.76;
  }, [reducedMotion]);

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const redScale = Math.ceil(window.innerHeight / 24) + 2;
      const whiteScale = Math.ceil(window.innerHeight / 16) + 2;
      gsap.set("[data-finale-statement-line]", { yPercent: 105 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.85,
          onUpdate: (self) => { progressRef.current = self.progress; },
        },
      });

      timeline
        .to("[data-finale-transition-red]", { scaleY: redScale, duration: 0.14, ease: "none" }, FINALE_PHASES.surface[0])
        .to("[data-finale-transition-white]", { scaleY: whiteScale, duration: 0.14, ease: "none" }, FINALE_PHASES.surface[0])
        .to("[data-finale-canvas]", { opacity: 1, duration: 0.13, ease: "none" }, 0.1)
        .to("[data-finale-transition]", { opacity: 0, duration: 0.09, ease: "none" }, 0.17)
        .fromTo(
          "[data-finale-anniversary]",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.065, ease: "none" },
          0.57,
        )
        .fromTo(
          "[data-finale-statement]",
          { opacity: 0 },
          { opacity: 1, duration: 0.045, ease: "none" },
          FINALE_PHASES.statement[0] - 0.04,
        )
        .to(
          "[data-finale-statement-line]",
          { yPercent: 0, duration: 0.06, stagger: 0.025, ease: "none" },
          FINALE_PHASES.statement[0] - 0.025,
        )
        .fromTo(
          "[data-finale-closing]",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.07, ease: "none" },
          FINALE_PHASES.closing[0],
        )
        .to("[data-finale-anniversary]", { opacity: 0.46, duration: 0.06, ease: "none" }, 0.9)
        .to("[data-finale-statement]", { y: -10, duration: 0.09, ease: "none" }, 0.9);
    }, sectionRef);

    return () => {
      context.revert();
      progressRef.current = 0;
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section
        ref={sectionRef}
        id="finale"
        aria-label="Merah Putih, Merdeka Terus"
        className="relative min-h-svh overflow-hidden bg-night text-bone"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          {canvasActive && <FinaleCanvas active={canvasActive} progressRef={progressRef} reducedMotion />}
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_70%_34%,rgba(244,241,234,0.08),transparent_38%),linear-gradient(to_bottom,transparent_48%,rgba(5,5,5,0.9)_88%)]" />
        <FinaleTypography reducedMotion />
        <div aria-hidden="true" className="film-grain pointer-events-none absolute inset-0 z-30 opacity-[0.04] mix-blend-soft-light" />
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="finale"
      aria-label="Merah Putih, Merdeka Terus"
      className="relative min-h-[170svh] bg-night text-bone md:min-h-[190svh] lg:min-h-[220svh]"
    >
      <div className="sticky top-0 h-svh overflow-hidden bg-night">
        <div data-finale-canvas aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 opacity-0">
          {canvasActive && <FinaleCanvas active={canvasActive} progressRef={progressRef} />}
        </div>

        <div data-finale-transition aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
          <div data-finale-transition-red className="absolute inset-x-0 top-1/2 h-3 origin-bottom -translate-y-full bg-merdeka" />
          <div data-finale-transition-white className="absolute inset-x-0 top-1/2 h-2 origin-top bg-bone" />
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_70%_34%,rgba(244,241,234,0.08),transparent_38%),linear-gradient(to_bottom,transparent_48%,rgba(5,5,5,0.9)_88%)]" />
        <FinaleTypography />
        <div aria-hidden="true" className="film-grain pointer-events-none absolute inset-0 z-30 opacity-[0.04] mix-blend-soft-light" />
      </div>
    </section>
  );
}
