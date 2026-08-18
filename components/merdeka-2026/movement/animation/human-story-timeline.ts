import gsap from "gsap";
import { HUMAN_STORIES, type HumanStoryMotif } from "../data/human-stories";

function addSignatureMotion(
  timeline: gsap.core.Timeline,
  root: string,
  motif: HumanStoryMotif,
  start: number,
) {
  if (motif === "teacher") {
    timeline
      .fromTo(`${root} [data-teacher-book]`, { scale: 0.84, rotate: -3 }, { scale: 1, rotate: 0, duration: 0.013, ease: "none" }, start)
      .fromTo(`${root} [data-teacher-knowledge] > *`, { opacity: 0, scale: 0, y: 8 }, { opacity: 1, scale: 1, y: -3, duration: 0.01, stagger: 0.0015, ease: "none" }, start + 0.006);
  } else if (motif === "farmer") {
    timeline
      .fromTo(`${root} [data-farmer-seed]`, { opacity: 0, y: -72 }, { opacity: 1, y: 0, duration: 0.01, ease: "none" }, start - 0.004)
      .fromTo(`${root} [data-farmer-plant]`, { scaleY: 0 }, { scaleY: 1, duration: 0.016, transformOrigin: "50% 100%", ease: "none" }, start + 0.003)
      .fromTo(`${root} [data-farmer-leaf]`, { scale: 0 }, { scale: 1, duration: 0.009, stagger: 0.002, ease: "none" }, start + 0.011)
      .fromTo(`${root} [data-farmer-growth] > *`, { opacity: 0, scale: 0, y: 10 }, { opacity: 0.9, scale: 1, y: -10, duration: 0.011, stagger: 0.0015, ease: "none" }, start + 0.014);
  } else if (motif === "builder") {
    timeline
      .fromTo(`${root} [data-builder-beam]`, { scaleY: 0 }, { scaleY: 1, duration: 0.014, stagger: 0.003, ease: "none" }, start)
      .fromTo(`${root} [data-builder-beam-horizontal]`, { scaleX: 0 }, { scaleX: 1, duration: 0.012, stagger: 0.003, ease: "none" }, start + 0.009)
      .fromTo(`${root} [data-builder-arm]`, { rotate: -7 }, { rotate: 0, duration: 0.012, ease: "none" }, start + 0.005)
      .fromTo(`${root} [data-builder-spark] > *`, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.007, stagger: 0.001, ease: "none" }, start + 0.017);
  } else if (motif === "creator") {
    timeline
      .fromTo(`${root} [data-creator-cursor]`, { opacity: 0, scale: 0.6, x: -16, y: 10 }, { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.011, ease: "none" }, start - 0.003)
      .fromTo(`${root} [data-creator-node] > *`, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.012, stagger: 0.0015, transformOrigin: "center", ease: "none" }, start + 0.003)
      .to(`${root} [data-creator-connection]`, { strokeDashoffset: 0, duration: 0.016, stagger: 0.002, ease: "none" }, start + 0.009);
  } else if (motif === "guardian") {
    timeline
      .to(`${root} [data-guardian-flow] path`, { strokeDashoffset: 0, duration: 0.017, stagger: 0.002, ease: "none" }, start - 0.004)
      .fromTo(`${root} [data-guardian-arm]`, { rotate: (armIndex: number) => armIndex === 0 ? -6 : 6 }, { rotate: 0, duration: 0.014, ease: "none" }, start + 0.003)
      .fromTo(`${root} [data-guardian-life]`, { opacity: 0, scale: 0.76 }, { opacity: 1, scale: 1, duration: 0.014, transformOrigin: "50% 100%", ease: "none" }, start + 0.008)
      .fromTo(`${root} [data-guardian-particle] > *`, { opacity: 0, scale: 0, y: 10 }, { opacity: 0.9, scale: 1, y: -8, duration: 0.011, stagger: 0.0015, ease: "none" }, start + 0.014);
  } else {
    timeline
      .fromTo(`${root} [data-dreamer-light]`, { opacity: 0, y: 36, scale: 0.72 }, { opacity: 1, y: 0, scale: 1, duration: 0.014, ease: "none" }, start)
      .to(`${root} [data-dreamer-light]`, { y: -24, duration: 0.015, ease: "none" }, start + 0.014)
      .to(`${root} [data-dreamer-constellation] path`, { strokeDashoffset: 0, duration: 0.016, stagger: 0.002, ease: "none" }, start + 0.009)
      .fromTo(`${root} [data-dreamer-star] > *`, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.011, stagger: 0.0015, transformOrigin: "center", ease: "none" }, start + 0.014);
  }
}

export function prepareHumanStoryStates() {
  gsap.set("[data-movement-story]", { autoAlpha: 0 });
  gsap.set("[data-movement-story] [data-character-draw]", { strokeDashoffset: 1 });
  gsap.set("[data-movement-story] [data-character-fill]", { opacity: 0 });
  gsap.set("[data-movement-story] [data-creator-connection]", { strokeDashoffset: 1 });
  gsap.set("[data-movement-story] [data-guardian-flow] path", { strokeDashoffset: 1 });
  gsap.set("[data-movement-story] [data-dreamer-constellation] path", { strokeDashoffset: 1 });
}

export function addHumanStoryTimelines(timeline: gsap.core.Timeline, isMobile: boolean) {
  HUMAN_STORIES.forEach((story, index) => {
    if (isMobile && index >= 4) return;
    const phase = isMobile
      ? [0.48 + index * 0.06, 0.48 + (index + 1) * 0.06] as const
      : story.phase;
    const root = `[data-movement-story="${index}"]`;
    const characterDirection = index % 2 === 0 ? 24 : -24;
    const copyDirection = index % 2 === 0 ? -18 : 18;
    const signatureStart = phase[0] + 0.012;

    timeline
      .set(root, { autoAlpha: 1 }, phase[0])
      .to(`${root} [data-story-trajectory]`, { strokeDashoffset: 0, duration: 0.011, ease: "none" }, phase[0])
      .fromTo(`${root} [data-movement-character]`, { x: characterDirection, scale: 0.965 }, { x: 0, scale: 1, duration: 0.018, ease: "none" }, phase[0] + 0.004)
      .to(`${root} [data-character-draw]:not([data-character-exit])`, { strokeDashoffset: 0, duration: 0.018, stagger: 0.00055, ease: "none" }, phase[0] + 0.006)
      .to(`${root} [data-character-fill]`, { opacity: 1, duration: 0.014, stagger: 0.0008, ease: "none" }, phase[0] + 0.009)
      .fromTo(`${root} [data-movement-story-copy]`, { opacity: 0, x: copyDirection, y: 10 }, { opacity: 1, x: 0, y: 0, duration: 0.015, ease: "none" }, phase[0] + 0.01);

    addSignatureMotion(timeline, root, story.motif, signatureStart);

    timeline
      .to(`${root} [data-character-exit]`, { strokeDashoffset: 0, duration: 0.012, ease: "none" }, phase[1] - 0.014)
      .to(`${root} [data-movement-story-copy]`, { opacity: 0, x: -copyDirection * 0.6, duration: 0.008, ease: "none" }, phase[1] - 0.009)
      .to(`${root} [data-movement-character]`, { opacity: 0, x: -characterDirection * 0.55, scale: 0.98, duration: 0.009, ease: "none" }, phase[1] - 0.009)
      .set(root, { autoAlpha: 0 }, phase[1]);
  });
}
