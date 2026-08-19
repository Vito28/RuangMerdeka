"use client";

import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { mapProgress } from "./animation/hero-progress";
import { HeroContent } from "./HeroContent";
import { HeroMetadata } from "./HeroMetadata";
import type { HeroSectionProps } from "./types";

const HeroCanvas = dynamic(() => import("./scene/HeroCanvas"), { ssr: false });

export function HeroSection({ onExitProgress }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [canvasActive, setCanvasActive] = useState(true);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCanvasActive(entry.isIntersecting),
      { rootMargin: "25% 0px" },
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      if (reducedMotion) {
        progressRef.current = 0.3;
        return;
      }

      gsap
        .timeline({ defaults: { ease: "power2.out" } })
        .to("[data-date]", { opacity: 1, duration: 0.65 }, 0.45)
        .to("[data-year-1945]", { yPercent: -100, opacity: 0, duration: 0.55 }, 1.1)
        .fromTo("[data-year-2026]", { yPercent: 100 }, { yPercent: 0, opacity: 1, duration: 0.55 }, 1.1)
        .fromTo("[data-opening-81]", { y: 45 }, { y: 0, opacity: 1, duration: 0.9 }, 1.6)
        .fromTo("[data-opening-title]", { y: 22 }, { y: 0, opacity: 1, duration: 0.7 }, 2.05)
        .to("[data-opening-support]", { opacity: 1, duration: 0.7 }, 2.35)
        .to("[data-scroll-indicator]", { opacity: 1, duration: 0.6 }, 2.7);

      gsap.to("[data-scroll-arrow]", {
        y: 6,
        duration: 1.05,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.75,
          onUpdate: (self) => {
            progressRef.current = self.progress;
            onExitProgress?.(mapProgress(self.progress, 0.84, 1));
          },
        },
      });

      scrollTimeline
        .to("[data-hero-metadata]", { opacity: 0.14, y: -8, duration: 0.09, ease: "none" }, 0.035)
        .to("[data-scroll-indicator]", { opacity: 0, duration: 0.04, ease: "none" }, 0.04)
        .to("[data-opening]", { opacity: 0, scale: 1.035, duration: 0.05, ease: "none" }, 0.13)
        .fromTo("[data-one-nation]", { y: 35 }, { opacity: 1, y: 0, duration: 0.035, ease: "none" }, 0.175)
        .to("[data-one-nation]", { opacity: 0, y: -25, duration: 0.035, ease: "none" }, 0.305)
        .fromTo("[data-islands]", { opacity: 0 }, { opacity: 1, duration: 0.035, ease: "none" }, 0.335)
        .to("[data-islands]", { opacity: 0, duration: 0.035, ease: "none" }, 0.47)
        .fromTo("[data-stories]", { y: 28 }, { opacity: 1, y: 0, duration: 0.04, ease: "none" }, 0.495)
        .to("[data-stories]", { opacity: 0, y: -18, duration: 0.035, ease: "none" }, 0.625)
        .fromTo("[data-freedom]", { scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.045, ease: "none" }, 0.655)
        .to("[data-red-ambient]", { opacity: 0.48, duration: 0.16, ease: "none" }, 0.66)
        .fromTo("[data-closing]", { y: 25 }, { opacity: 1, y: 0, duration: 0.055, ease: "none" }, 0.835)
        .to("[data-freedom]", { scale: 1.16, opacity: 0, duration: 0.07, ease: "none" }, 0.925)
        .to("[data-closing]", { scale: 1.025, opacity: 0.35, duration: 0.07, ease: "none" }, 0.93);
    }, sectionRef);

    const handlePointer = (event: PointerEvent) => {
      if (reducedMotion || window.innerWidth < 768) return;
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener("pointermove", handlePointer, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointer);
      context.revert();
      progressRef.current = 0;
    };
  }, [onExitProgress]);

  return (
    <section
      ref={sectionRef}
      id="opening"
      aria-label="Pembukaan 81 Tahun Merdeka"
      className="relative min-h-[170svh] bg-night text-bone md:min-h-[220svh] lg:min-h-[260svh]"
    >
      <div className="sticky top-0 h-svh overflow-hidden bg-night">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
          {canvasActive && (
            <HeroCanvas active={canvasActive} progressRef={progressRef} pointerRef={pointerRef} />
          )}
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_55%_50%,rgba(231,0,17,0.11),transparent_46%)] opacity-20" data-red-ambient />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(to_bottom,rgba(5,5,5,0.18),transparent_28%,transparent_70%,rgba(5,5,5,0.58))]" />

        <HeroContent />
        <HeroMetadata />

        <div className="pointer-events-none absolute bottom-6 left-5 z-50 flex items-end gap-3 font-mono text-[8px] tracking-[0.22em] text-white/45 opacity-0 md:bottom-8 md:left-10 md:text-[9px] lg:left-16" data-scroll-indicator>
          <p><span className="hidden md:inline">EXPLORE</span><span className="md:hidden">SCROLL</span></p>
          <div className="flex flex-col items-center gap-2">
            <span className="h-8 w-px bg-white/30" />
            <span data-scroll-arrow>↓</span>
          </div>
        </div>

        <div aria-hidden="true" className="film-grain pointer-events-none absolute inset-0 z-50 opacity-[0.04] mix-blend-soft-light" />
      </div>
    </section>
  );
}
