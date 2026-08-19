import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type StoryTimelineOptions = {
  root: HTMLElement;
  section: HTMLElement;
  poster: HTMLElement;
};

const PHASES = {
  APPROACH: 0.18,
  RELEASE_PAPER: 0.34,
  ENTER_PORTAL: 0.4,
  PORTAL_ALIVE: 0.62,
  CONTINUE: 0.84,
} as const;

function portalScale(poster: HTMLElement) {
  return Math.max(
    window.innerWidth / poster.offsetWidth,
    window.innerHeight / poster.offsetHeight,
  ) * 1.06;
}

export function createCurrentStoryTimeline({ root, section, poster }: StoryTimelineOptions) {
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  const context = gsap.context(() => {
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set("[data-story-thread]", { strokeDasharray: 1, strokeDashoffset: 0.58 });
      gsap.set("[data-portal-cta]", { autoAlpha: 0, y: 12 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.85,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .fromTo(poster, { rotation: 1.35, scale: 0.94 }, { rotation: 1.2, scale: 1, duration: PHASES.APPROACH, ease: "power2.out" }, 0)
        .to("[data-story-thread]", { strokeDashoffset: 0, duration: 0.42, ease: "none" }, 0)
        .to("[data-board-year]", { xPercent: -4, autoAlpha: 0.55, duration: 0.46, ease: "none" }, 0)
        .to("[data-photo-strip]", { xPercent: -72, rotation: -2, duration: 0.35, ease: "power2.inOut" }, PHASES.APPROACH)
        .to("[data-story-note]", { xPercent: 95, autoAlpha: 0, duration: 0.28, ease: "power2.in" }, PHASES.APPROACH)
        .to("[data-calendar-tear]", { xPercent: -42, yPercent: -18, rotation: -11, duration: 0.3, ease: "power2.inOut" }, PHASES.APPROACH)
        .to("[data-story-label]", { xPercent: 14, duration: 0.26, ease: "none" }, PHASES.APPROACH)
        .to(poster, { rotation: 0, scale: 1.12, duration: 0.2, ease: "power3.inOut" }, PHASES.APPROACH)
        .to("[data-story-tape]", { yPercent: (index) => index === 0 ? -130 : 145, xPercent: (index) => index === 0 ? -38 : 42, rotation: (index) => index === 0 ? -11 : 9, autoAlpha: 0, duration: 0.2, ease: "power2.in" }, PHASES.RELEASE_PAPER)
        .to("[data-story-paperclip]", { xPercent: 180, yPercent: -80, rotation: 28, autoAlpha: 0, duration: 0.18, ease: "power2.in" }, PHASES.RELEASE_PAPER)
        .to("[data-story-shadow]", { autoAlpha: 0, duration: 0.18, ease: "none" }, PHASES.RELEASE_PAPER)
        .to("[data-story-label], [data-story-metadata], [data-story-stamp], [data-calendar-tear], [data-photo-strip]", { autoAlpha: 0, duration: 0.18, ease: "none" }, PHASES.ENTER_PORTAL)
        .to(poster, { scale: () => portalScale(poster), rotation: 0, duration: 0.3, ease: "power3.inOut" }, PHASES.ENTER_PORTAL)
        .to("[data-story-paper]", { backgroundColor: "rgba(255,250,240,0)", boxShadow: "0 0 0 rgba(0,0,0,0)", duration: 0.2, ease: "none" }, PHASES.ENTER_PORTAL)
        .to("[data-story-particle]", {
          x: (index) => ((index % 7) - 3) * 13,
          y: (index) => ((index % 5) - 2) * 11,
          scale: (index) => 1 + (index % 4) * 0.22,
          autoAlpha: (index) => 0.35 + (index % 5) * 0.12,
          stagger: 0.003,
          duration: 0.3,
          ease: "sine.inOut",
        }, PHASES.PORTAL_ALIVE - 0.06)
        .to("[data-portal-copy]", { yPercent: -3, duration: 0.24, ease: "none" }, PHASES.PORTAL_ALIVE)
        .to("[data-portal-cta]", { autoAlpha: 1, y: 0, duration: 0.18, ease: "power2.out" }, PHASES.PORTAL_ALIVE)
        .to(poster, { xPercent: 13, scale: () => portalScale(poster) * 0.88, duration: 0.16, ease: "power2.inOut" }, PHASES.CONTINUE)
        .to("[data-story-thread-exit]", { strokeDashoffset: 0, duration: 0.16, ease: "none" }, PHASES.CONTINUE);
    });

    media.add("(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const tilt = poster.querySelector<HTMLElement>("[data-story-tilt]");
      const cursorThread = poster.querySelector<HTMLElement>("[data-cursor-thread]");
      if (!tilt || !cursorThread) return;

      const rotateX = gsap.quickTo(tilt, "rotationX", { duration: 0.55, ease: "power3.out" });
      const rotateY = gsap.quickTo(tilt, "rotationY", { duration: 0.55, ease: "power3.out" });
      const threadX = gsap.quickTo(cursorThread, "x", { duration: 0.35, ease: "power2.out" });
      const threadY = gsap.quickTo(cursorThread, "y", { duration: 0.35, ease: "power2.out" });

      const move = (event: PointerEvent) => {
        const rect = poster.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        rotateX(-y * 2.4);
        rotateY(x * 2.8);
        threadX(event.clientX - rect.left);
        threadY(event.clientY - rect.top);
        gsap.to(cursorThread, { autoAlpha: 0.62, scaleX: 1 + Math.abs(x), duration: 0.2 });
      };
      const leave = () => {
        rotateX(0);
        rotateY(0);
        gsap.to(cursorThread, { autoAlpha: 0, duration: 0.3 });
      };

      poster.addEventListener("pointermove", move);
      poster.addEventListener("pointerleave", leave);
      return () => {
        poster.removeEventListener("pointermove", move);
        poster.removeEventListener("pointerleave", leave);
      };
    });

    media.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set("[data-portal-cta]", { autoAlpha: 1, y: 0 });
      gsap.set(poster, { clearProps: "transform" });
    });

    gsap.from("[data-calendar-continuation] > *", {
      y: 34,
      autoAlpha: 0,
      duration: 0.72,
      stagger: 0.09,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "[data-calendar-continuation]",
        start: "top 82%",
        once: true,
      },
    });
  }, root);

  return () => {
    media.revert();
    context.revert();
  };
}
