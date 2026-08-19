"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

export function ExperienceProgress() {
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const signalRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!rootRef.current || !fillRef.current || !signalRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.9,
          invalidateOnRefresh: true,
        },
      })
        .to(fillRef.current, { scaleY: 1, duration: 1, ease: "none" }, 0)
        .to(
          signalRef.current,
          {
            y: () => Math.max(0, (rootRef.current?.clientHeight ?? 112) - 6),
            duration: 1,
            ease: "none",
          },
          0,
        );
    }, rootRef);

    return () => context.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      data-experience-progress
      aria-hidden="true"
      className="pointer-events-none fixed right-5 top-1/2 z-40 hidden h-28 w-px -translate-y-1/2 bg-bone/8 motion-reduce:hidden md:block lg:right-7"
    >
      <span ref={fillRef} className="absolute inset-0 origin-top scale-y-0 bg-red-flag/28" />
      <span
        ref={signalRef}
        className="absolute -left-0.5 top-0 size-1.5 rounded-full bg-red-flag shadow-[0_0_12px_rgba(230,0,18,0.55)]"
      />
    </div>
  );
}
