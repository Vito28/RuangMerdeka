"use client";

import gsap from "gsap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, type CSSProperties, type MouseEvent } from "react";
import type { ActiveStory } from "@/lib/home/story-calendar";
import { createCurrentStoryTimeline } from "./animation/create-current-story-timeline";
import { StoryBoardBackground, StoryBoardDecorations } from "./current-story-decorations";
import { CurrentStoryPoster } from "./current-story-poster";

const celebrations = ["Imlek", "Waisak", "Lebaran", "Kemerdekaan", "Mooncake", "Halloween", "Natal", "Paskah"];

function CalendarContinuation({ story }: { story: ActiveStory }) {
  return (
    <section id="kalender" className="relative scroll-mt-20 overflow-hidden bg-hari-paper-deep px-5 pb-20 pt-24 text-hari-ink md:px-10 md:pb-28 lg:px-16">
      <div aria-hidden="true" className="hari-paper-grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply" />
      <svg aria-hidden="true" className="absolute inset-x-0 top-0 h-24 w-full" viewBox="0 0 1600 100" fill="none" preserveAspectRatio="none">
        <path data-story-thread-exit pathLength="1" d="M-30 23C306 93 506 12 816 61C1080 102 1330 31 1630 65" stroke="var(--story-accent)" strokeWidth="2" strokeDasharray="1" strokeDashoffset="1" />
      </svg>

      <div data-calendar-continuation className="relative mx-auto max-w-[90rem]">
        <div className="grid gap-10 border-b border-hari-ink/20 pb-16 md:grid-cols-12 md:gap-6 md:pb-24">
          <div className="md:col-span-4">
            <p className="font-mono text-[0.56rem] uppercase tracking-[0.2em] text-[var(--story-accent)]">Kalender yang hidup</p>
            <p className="mt-5 max-w-xs text-sm leading-6 text-hari-ink/60">Mesin Hari Kita memilih cerita berdasarkan waktu Indonesia dan bergerak otomatis ke perayaan berikutnya.</p>
          </div>
          <div className="flex flex-wrap gap-x-7 gap-y-3 font-display text-[clamp(2rem,4.5vw,4.6rem)] leading-[0.94] md:col-span-8">
            {celebrations.map((celebration) => (
              <span key={celebration} className={celebration === story.name || story.name.startsWith(celebration) ? "italic text-[var(--story-accent)]" : "text-hari-ink"}>
                {celebration}<span className="ml-6 text-hari-gold">·</span>
              </span>
            ))}
          </div>
        </div>

        <footer id="tentang" className="scroll-mt-20 grid gap-10 pt-12 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-4">
            <p className="font-display text-3xl font-semibold">Hari Kita</p>
            <p className="mt-2 text-xs leading-5 text-hari-ink/55">Arsip perayaan dan budaya yang terus bertumbuh.</p>
          </div>
          <p className="max-w-xl text-lg leading-7 md:col-span-5">Setiap tahun, setiap hari besar mendapat bahasa visual dan pengalaman yang baru—karena cara kita merayakan juga selalu bergerak.</p>
          <div id="arsip" className="scroll-mt-20 self-end md:col-span-3 md:text-right">
            <p className="font-mono text-[0.5rem] uppercase tracking-[0.18em] text-hari-ink/45">Arsip tersedia</p>
            <Link href="/2026/17-08" className="mt-3 inline-flex border-b border-[var(--story-accent)] pb-1 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--story-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--story-accent)]">Kemerdekaan 2026 ↗</Link>
          </div>
        </footer>
      </div>
    </section>
  );
}

export function CurrentStorySection({ story }: { story: ActiveStory }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const posterRef = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const theme = {
    "--story-accent": story.palette.accent,
    "--story-soft": story.palette.accentSoft,
    "--story-glow": story.palette.glow,
  } as CSSProperties;

  useEffect(() => {
    const root = rootRef.current;
    const section = sectionRef.current;
    const poster = root?.querySelector<HTMLElement>("[data-story-poster]") ?? null;
    posterRef.current = poster;
    if (!root || !section || !poster) return;
    return createCurrentStoryTimeline({ root, section, poster });
  }, [story.id, story.year]);

  const enterStory = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!story.href || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    event.preventDefault();

    const curtain = rootRef.current?.querySelector<HTMLElement>("[data-route-curtain]");
    const poster = posterRef.current;
    const timeline = gsap.timeline({ onComplete: () => router.push(story.href!) });
    if (poster) timeline.to(poster, { scale: "+=0.16", duration: 0.62, ease: "power3.in" }, 0);
    if (curtain) timeline.to(curtain, { autoAlpha: 1, duration: 0.48, ease: "power2.in" }, 0.14);
  };

  return (
    <div ref={rootRef} style={theme}>
      <section id="cerita" ref={sectionRef} className="relative min-h-[158svh] scroll-mt-0 bg-[#eee8de] text-hari-ink motion-reduce:min-h-svh md:min-h-[180svh]">
        <div data-story-board className="sticky top-0 h-svh overflow-hidden bg-[#eee8de]">
          <StoryBoardBackground story={story} />
          <StoryBoardDecorations story={story} />
          <CurrentStoryPoster story={story} onEnter={enterStory} />

          <div data-route-curtain aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 bg-[#050505] opacity-0 [background-image:radial-gradient(circle_at_50%_50%,color-mix(in_srgb,var(--story-accent)_22%,transparent),transparent_42%)]" />
        </div>
      </section>
      <CalendarContinuation story={story} />
    </div>
  );
}
