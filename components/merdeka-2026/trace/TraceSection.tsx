"use client";

import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hero/hooks/use-reduced-motion";
import { TRACE_LABEL_MEDIA, TRACE_MEDIA } from "./data/trace-media";
import { ReducedTraceContent } from "./ReducedTraceContent";
import { TraceOverlay } from "./ui/TraceOverlay";

const TraceCanvas = dynamic(() => import("./scene/TraceCanvas"), { ssr: false });

export function TraceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const reducedMotion = useReducedMotion();
  const [canvasActive, setCanvasActive] = useState(false);

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        TRACE_MEDIA.slice(0, 2).forEach((item) => {
          const image = new window.Image();
          image.decoding = "async";
          image.src = item.src;
        });
        observer.disconnect();
      },
      { rootMargin: "120% 0px" },
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [reducedMotion]);

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
      gsap.set("[data-trace-copy-line]", { yPercent: 108 });
      gsap.set("[data-trace-label-line]", { scaleX: 0 });
      gsap.set("[data-trace-mosaic-word]", { opacity: 0, y: 8 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.82,
          invalidateOnRefresh: true,
          onUpdate: (self) => { progressRef.current = self.progress; },
        },
      });

      timeline
        .addLabel("entry", 0)
        .fromTo("[data-trace-entry-copy]", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.02, ease: "none" }, 0.085)
        .to("[data-trace-copy-line]", { yPercent: 0, duration: 0.027, stagger: 0.008, ease: "none" }, 0.09)
        .to("[data-trace-entry-copy]", { opacity: 0, y: -18, duration: 0.025, ease: "none" }, 0.19)
        .addLabel("photographic-journey", 0.27);

      TRACE_LABEL_MEDIA.forEach((item, index) => {
        const start = item.phase[0] + 0.014;
        const end = item.phase[1] - 0.014;
        const selector = `[data-trace-label="${index}"]`;
        timeline
          .fromTo(selector, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.013, ease: "none" }, start)
          .to(`${selector} [data-trace-label-line]`, { scaleX: 1, duration: 0.014, ease: "none" }, start + 0.003)
          .to(selector, { opacity: 0, y: -9, duration: 0.013, ease: "none" }, end);
      });

      timeline
        .addLabel("silence", 0.755)
        .fromTo("[data-trace-silence]", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.018, ease: "none" }, 0.765)
        .to("[data-trace-silence]", { opacity: 1, duration: 0.038, ease: "none" }, 0.783)
        .to("[data-trace-silence]", { opacity: 0, y: -12, duration: 0.016, ease: "none" }, 0.821)
        .addLabel("mosaic", 0.815)
        .to("[data-trace-mosaic-words]", { opacity: 1, duration: 0.012, ease: "none" }, 0.825)
        .to("[data-trace-mosaic-word]", { opacity: 1, y: 0, duration: 0.012, stagger: 0.01, ease: "none" }, 0.83)
        .to("[data-trace-mosaic-words]", { opacity: 0, duration: 0.015, ease: "none" }, 0.905)
        .addLabel("collective", 0.9)
        .fromTo("[data-trace-inheritance]", { opacity: 0, scale: 0.975 }, { opacity: 1, scale: 1, duration: 0.022, ease: "none" }, 0.925)
        .to("[data-trace-inheritance]", { opacity: 0, scale: 0.95, duration: 0.018, ease: "none" }, 0.958)
        .fromTo("[data-trace-finale]", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.02, ease: "none" }, 0.955)
        .to("[data-trace-finale]", { opacity: 1, duration: 0.02, ease: "none" }, 0.975)
        .to("[data-trace-finale]", { opacity: 0, scale: 0.985, duration: 0.008, ease: "none" }, 0.988)
        .fromTo("[data-trace-year-dot]", { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.01, ease: "sine.inOut" }, 0.988);
    }, sectionRef);

    return () => {
      context.revert();
      progressRef.current = 0;
    };
  }, [reducedMotion]);

  if (reducedMotion) return <ReducedTraceContent />;

  return (
    <section
      ref={sectionRef}
      id="trace"
      aria-label="Jejak yang kita bangun"
      className="relative min-h-[500svh] bg-night text-bone md:min-h-[680svh] lg:min-h-[820svh]"
    >
      <div className="sticky top-0 h-svh overflow-hidden bg-night">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
          {canvasActive && <TraceCanvas active={canvasActive} progressRef={progressRef} />}
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(5,5,5,0.28),transparent_22%,transparent_76%,rgba(5,5,5,0.5))]" />
        <TraceOverlay />
        <div aria-hidden="true" className="film-grain pointer-events-none absolute inset-0 z-30 opacity-[0.04] mix-blend-soft-light" />
      </div>
    </section>
  );
}
