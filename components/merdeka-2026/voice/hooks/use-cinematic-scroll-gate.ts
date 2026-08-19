"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { useCallback, useEffect, useRef, type RefObject } from "react";
import type { VoiceGate } from "../types";

type GateState = "FREE" | "MAGNETIZING" | "HOLDING" | "RELEASING";

type GateOptions = {
  sectionRef: RefObject<HTMLElement | null>;
  gates: readonly VoiceGate[];
  disabled: boolean;
};

export function useCinematicScrollGate({ sectionRef, gates, disabled }: GateOptions) {
  const lenis = useLenis();
  const captureRef = useRef<(id: string) => void>(() => undefined);

  useEffect(() => {
    const section = sectionRef.current;
    const desktopFinePointer = window.matchMedia(
      "(min-width: 768px) and (hover: hover) and (pointer: fine)",
    ).matches;

    if (!section || !lenis || disabled || !desktopFinePointer) {
      captureRef.current = () => undefined;
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    let state: GateState = "FREE";
    let lastProgress: number | null = null;
    let holdTimer: ReturnType<typeof setTimeout> | undefined;
    let failsafeTimer: ReturnType<typeof setTimeout> | undefined;
    let releaseTimer: ReturnType<typeof setTimeout> | undefined;
    const visited = new Set<string>();
    const stage = section.querySelector<HTMLElement>("[data-voice-stage]");
    const gateBreath = section.querySelector<HTMLElement>("[data-gate-breath]");

    const blockInput = (event: Event) => event.preventDefault();
    const addInputShield = () => {
      window.addEventListener("wheel", blockInput, { passive: false, capture: true });
      window.addEventListener("touchmove", blockInput, { passive: false, capture: true });
    };
    const removeInputShield = () => {
      window.removeEventListener("wheel", blockInput, true);
      window.removeEventListener("touchmove", blockInput, true);
    };

    const clearTimers = () => {
      if (holdTimer) clearTimeout(holdTimer);
      if (failsafeTimer) clearTimeout(failsafeTimer);
      if (releaseTimer) clearTimeout(releaseTimer);
    };

    const release = () => {
      if (state === "FREE" || state === "RELEASING") return;
      clearTimers();
      removeInputShield();
      lenis.start();
      state = "RELEASING";
      section.dataset.gateState = state;
      gsap.to(stage, { scale: 1, duration: 0.32, ease: "power2.out", overwrite: true });
      gsap.to(gateBreath, { opacity: 0, scale: 1.035, duration: 0.28, ease: "power2.out", overwrite: true });
      releaseTimer = setTimeout(() => {
        state = "FREE";
        section.dataset.gateState = state;
      }, 90);
    };

    const activate = (gate: VoiceGate, direction: 1 | -1, force = false) => {
      const visitKey = `${direction}:${gate.id}`;
      if (state !== "FREE" || (!force && visited.has(visitKey))) return;
      visited.add(visitKey);

      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const target = sectionTop + travel * gate.progress;

      state = "MAGNETIZING";
      section.dataset.gateState = state;
      addInputShield();
      lenis.stop();
      gsap.to(stage, { scale: 0.992, duration: 0.34, ease: "power3.inOut", overwrite: true });
      gsap.fromTo(
        gateBreath,
        { opacity: 0, scale: 1.08 },
        { opacity: 0.34, scale: 1, duration: 0.34, ease: "power3.inOut", overwrite: true },
      );
      lenis.scrollTo(target, {
        duration: 0.34,
        easing: (value) => 1 - Math.pow(1 - value, 4),
        force: true,
        lock: true,
        onComplete: () => {
          if (state !== "MAGNETIZING") return;
          state = "HOLDING";
          section.dataset.gateState = state;
          gsap.to(gateBreath, {
            opacity: 0.16,
            duration: Math.min(1.1, gate.holdMs / 1000),
            ease: "sine.inOut",
            overwrite: true,
          });
          holdTimer = setTimeout(release, direction === -1 ? Math.min(650, gate.holdMs) : gate.holdMs);
          failsafeTimer = setTimeout(release, 1200);
        },
      });
    };

    captureRef.current = (id) => {
      const gate = gates.find((item) => item.id === id);
      if (gate) activate(gate, 1, true);
    };

    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const current = self.progress;
        if (lastProgress === null) {
          lastProgress = current;
          return;
        }

        if (state === "FREE") {
          const direction: 1 | -1 = self.direction >= 0 ? 1 : -1;
          const crossed = gates.find((gate) =>
            direction === 1
              ? lastProgress! < gate.progress && current >= gate.progress
              : lastProgress! > gate.progress && current <= gate.progress,
          );
          if (crossed) activate(crossed, direction);
        }

        lastProgress = current;
      },
    });

    const handleVisibility = () => {
      if (document.hidden) release();
    };
    const handleReplay = () => {
      release();
      visited.clear();
      lastProgress = null;
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("ruang-merdeka:replay", handleReplay);

    return () => {
      captureRef.current = () => undefined;
      scrollTrigger.kill();
      clearTimers();
      removeInputShield();
      lenis.start();
      gsap.killTweensOf([stage, gateBreath]);
      gsap.set([stage, gateBreath], { clearProps: "transform,opacity" });
      delete section.dataset.gateState;
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("ruang-merdeka:replay", handleReplay);
    };
  }, [disabled, gates, lenis, sectionRef]);

  const captureGate = useCallback((id: string) => captureRef.current(id), []);
  return { captureGate };
}
