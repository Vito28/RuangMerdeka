"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { ActiveStory } from "@/lib/home/story-calendar";
import {
  ChristmasCluster,
  CodexCompanion,
  CrescentStar,
  Ketupat,
  Lantern,
  LunarDragon,
  Mooncake,
} from "./cultural-objects";
import { HomeNavigation } from "./home-navigation";
import { CurrentStorySection } from "./current-story/current-story-section";
import { useActiveStory } from "./hooks/use-active-story";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function StoryPaths() {
  return (
    <>
      <svg
        data-depth="0.18"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible md:block"
        viewBox="0 0 1600 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          data-draw-path
          data-story-thread
          pathLength="1"
          d="M82 80C184 112 254 136 273 222C294 322 190 408 280 512C385 634 557 568 710 454C902 311 985 204 1196 250C1364 287 1413 449 1625 381"
          stroke="#A53F35"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity=".52"
        />
        <path d="M82 80C184 112 254 136 273 222" stroke="#D1A04E" strokeWidth="5" strokeLinecap="round" opacity=".22" />
        <circle cx="82" cy="80" r="5" fill="#D1A04E" />
        <circle cx="1196" cy="250" r="4" fill="#A53F35" />
      </svg>

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible md:hidden"
        viewBox="0 0 390 844"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          data-draw-path
          data-story-thread
          pathLength="1"
          d="M54 61C133 92 322 70 326 164C330 249 224 301 254 401C284 500 347 522 311 612C286 676 222 715 246 853"
          stroke="#A53F35"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity=".46"
        />
        <circle cx="54" cy="61" r="4" fill="#D1A04E" />
        <circle cx="311" cy="612" r="3" fill="#A53F35" />
      </svg>
    </>
  );
}

function PrimaryPolaroid({ story }: { story: ActiveStory }) {
  return (
    <div
      data-primary-polaroid
      className="absolute bottom-[3.5vh] right-[-0.9rem] z-20 w-[10.4rem] rotate-[4deg] opacity-0 min-[430px]:right-[3vw] min-[430px]:w-[11.25rem] sm:w-[12.5rem] md:bottom-[8vh] md:right-[5vw] md:w-[15.5rem] lg:right-[8vw] lg:w-[17.5rem]"
    >
      <div data-depth="0.62" className="relative">
        <div aria-hidden="true" className="absolute inset-0 translate-x-1.5 translate-y-2 rotate-1 bg-[#dfd3c2] shadow-[0_12px_24px_rgba(79,54,31,0.12)]" />
        <div
          data-polaroid-tape
          aria-hidden="true"
          className="absolute -top-3 left-1/2 z-10 h-7 w-[4.75rem] -translate-x-1/2 -rotate-2 border-x border-white/20 bg-[#d9c79e]/68 shadow-[0_2px_6px_rgba(80,56,34,0.14)] backdrop-blur-[1px] [clip-path:polygon(4%_5%,96%_0,100%_88%,6%_100%,0_18%)] md:-top-4 md:h-8 md:w-24"
        />
        <Link
          href={story.href ?? "#cerita"}
          aria-label={story.href ? `Buka cerita ${story.name} ${story.year}` : `Lihat pratinjau cerita ${story.name} ${story.year}`}
          className="group relative block bg-[#fffaf0] p-2.5 pb-4 shadow-[0_24px_50px_rgba(79,54,31,0.2),0_2px_5px_rgba(79,54,31,0.14)] transition-transform duration-500 after:absolute after:bottom-0 after:right-0 after:size-5 after:bg-[linear-gradient(135deg,rgba(217,199,158,0)_48%,rgba(217,199,158,0.48)_50%)] hover:-translate-y-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hari-red md:p-3.5 md:pb-5"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-hari-red">
            <Image
              src="/2026/17-08/section-04/images/culture.webp"
              alt="Cuplikan arsip budaya Hari Kita"
              fill
              priority
              sizes="(max-width: 767px) 11rem, 18rem"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_56%,rgba(92,24,20,0.56))]" />
            <span className="absolute bottom-2 left-2 bg-hari-paper px-2 py-1 font-mono text-[0.48rem] tracking-[0.18em] text-hari-ink">
              CERITA TERKINI
            </span>
          </div>
          <div className="mt-3 flex items-end justify-between gap-3 text-hari-ink">
            <div>
              <p className="font-mono text-[0.54rem] tracking-[0.18em] text-hari-red">{story.numericDate.replaceAll("/", "·")}</p>
              <p className="mt-1 font-display text-[1.12rem] font-semibold leading-none md:text-[1.5rem]">{story.name}</p>
            </div>
            <span aria-hidden="true" className="pb-1 text-lg transition-transform group-hover:translate-x-1">↗</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

function WoodenClip({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute z-20 h-7 w-3 rounded-[1px] bg-[#a57649] shadow-[1px_2px_3px_rgba(55,35,21,0.28)] ${className}`}
    >
      <span className="absolute left-1/2 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5f412c]" />
    </span>
  );
}

function HangingMemories({ story }: { story: ActiveStory }) {
  return (
    <div
      data-memory-rope
      className="pointer-events-none absolute right-0 top-10 z-10 hidden h-[43vh] w-[70vw] md:block lg:w-[67vw]"
    >
      <svg aria-hidden="true" className="absolute inset-x-0 top-0 h-28 w-full overflow-visible" viewBox="0 0 1000 120" fill="none" preserveAspectRatio="none">
        <path
          data-rope-path
          pathLength="1"
          d="M-30 22C198 67 402 28 567 50C746 73 862 72 1034 31"
          stroke="#6D4F36"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path d="M-30 25C198 70 402 31 567 53C746 76 862 75 1034 34" stroke="#C9A16B" strokeWidth="1" opacity=".56" />
      </svg>

      <div data-hanging-item className="absolute left-[12%] top-[3.8rem] opacity-0 lg:left-[16%]">
        <div data-depth="0.42">
          <div data-sway className="origin-top">
            <span className="absolute -top-12 left-1/2 h-14 w-px -translate-x-1/2 bg-[#6D4F36]" />
            <WoodenClip className="-top-2 left-1/2 -translate-x-1/2" />
            <Lantern className="mt-3 h-28 w-auto drop-shadow-[0_12px_10px_rgba(88,45,31,0.18)] lg:h-32" />
          </div>
        </div>
      </div>

      <div data-hanging-item className="absolute left-[42%] top-[5rem] hidden opacity-0 md:block">
        <div data-depth="0.5">
          <div data-sway className="origin-top">
            <span className="absolute -top-14 left-1/2 h-16 w-px -translate-x-1/2 bg-[#6D4F36]" />
            <WoodenClip className="-top-1 left-1/2 -translate-x-1/2" />
            <div className="mt-4 w-28 -rotate-3 bg-[#fffaf0] p-2 pb-4 shadow-[0_15px_28px_rgba(78,53,31,0.2)] lg:w-32">
              <div className="relative aspect-square overflow-hidden bg-hari-terracotta">
                <Image src="/2026/17-08/section-04/images/generation.webp" alt="" fill sizes="8rem" className="object-cover" />
              </div>
              <p className="mt-2 font-mono text-[0.42rem] tracking-[0.16em] text-hari-ink/65">SATU GENERASI</p>
            </div>
          </div>
        </div>
      </div>

      <div
        data-hanging-item
        data-transition-memory
        className="absolute right-[8%] top-[4.5rem] opacity-0 md:right-[13%]"
      >
        <div data-depth="0.54">
          <div data-sway className="origin-top">
            <span className="absolute -top-14 left-1/2 h-16 w-px -translate-x-1/2 bg-[#6D4F36]" />
            <WoodenClip className="-top-1 left-1/2 -translate-x-1/2" />
            <div className="mt-4 w-[5.8rem] rotate-3 bg-[#fffaf0] px-3 py-3 text-hari-ink shadow-[0_15px_28px_rgba(78,53,31,0.2)] lg:w-28">
              <p className="font-mono text-[0.4rem] tracking-[0.18em] text-hari-red">{MONTHS[story.month - 1]} / {story.year}</p>
              <p className="mt-3 font-display text-4xl font-semibold leading-[0.7] lg:text-5xl">{story.day}</p>
              <div className="mt-3 h-1.5 bg-hari-red" />
              <div className="mt-1 h-1.5 bg-hari-paper-deep" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileFestiveCollage({ story }: { story: ActiveStory }) {
  const snow = [
    [8, 15, 4], [21, 4, 3], [36, 18, 5], [53, 8, 3], [66, 20, 4], [83, 6, 3], [94, 24, 5],
  ] as const;

  return (
    <div data-mobile-collage className="pointer-events-none absolute inset-x-0 bottom-0 top-[48svh] z-10 md:hidden">
      <svg aria-hidden="true" className="absolute inset-x-0 top-0 h-20 w-full overflow-visible" viewBox="0 0 390 82" fill="none" preserveAspectRatio="none">
        <path d="M-18 13C70 33 132 17 196 31C267 46 321 46 408 18" stroke="#4F3928" strokeWidth="2.1" strokeLinecap="round" />
        <path d="M-18 15C70 35 132 19 196 33C267 48 321 48 408 20" stroke="#C9A16B" strokeWidth=".8" opacity=".58" />
      </svg>

      <div data-hanging-item className="absolute left-[7%] top-9 opacity-0">
        <div data-sway className="origin-top">
          <span className="absolute -top-10 left-1/2 h-11 w-px -translate-x-1/2 bg-[#6D4F36]" />
          <WoodenClip className="-top-1 left-1/2 -translate-x-1/2 scale-90" />
          <Lantern className="mt-3 h-[5.6rem] w-auto drop-shadow-[0_10px_8px_rgba(88,45,31,0.2)]" />
        </div>
      </div>

      <div data-hanging-item className="absolute left-[43%] top-[3.2rem] opacity-0">
        <div data-sway className="origin-top">
          <span className="absolute -top-11 left-1/2 h-12 w-px -translate-x-1/2 bg-[#6D4F36]" />
          <WoodenClip className="-top-1 left-1/2 -translate-x-1/2 scale-75" />
          <Ketupat className="mt-2 w-[3.45rem] rotate-[-5deg] drop-shadow-[0_8px_7px_rgba(62,75,55,0.18)]" />
        </div>
      </div>

      <div data-hanging-item className="absolute right-[12%] top-[2.65rem] opacity-0">
        <div data-sway className="origin-top">
          <span className="absolute -top-10 left-1/2 h-11 w-px -translate-x-1/2 bg-[#6D4F36]" />
          <WoodenClip className="-top-1 left-1/2 -translate-x-1/2 scale-75" />
          <Mooncake className="mt-3 w-[3.8rem] rotate-[4deg] drop-shadow-[0_8px_7px_rgba(107,70,37,0.18)]" />
        </div>
      </div>

      <div data-festive-object className="absolute -bottom-5 -left-2 w-[7.8rem] opacity-0 min-[430px]:w-[8.8rem]">
        <div className="relative" data-depth="0.72">
          {snow.map(([left, top, size], index) => (
            <span
              key={`${left}-${top}`}
              data-snowflake
              className="absolute rounded-full bg-white/90 shadow-[0_1px_2px_rgba(74,51,31,0.15)]"
              style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, opacity: 0.55 + (index % 3) * 0.15 }}
            />
          ))}
          <ChristmasCluster className="w-full drop-shadow-[0_14px_12px_rgba(55,63,45,0.2)]" />
        </div>
      </div>

      <div data-codex-companion className="absolute bottom-1 left-[34%] w-[4.4rem] -rotate-3 opacity-0 min-[430px]:left-[36%] min-[430px]:w-[4.9rem]">
        <CodexCompanion className="w-full drop-shadow-[0_13px_10px_rgba(39,73,95,0.2)]" />
      </div>

      <div data-mobile-date className="absolute bottom-[10.75rem] right-[1.2rem] rotate-2 bg-[#fffaf0] px-2.5 py-2 text-hari-ink shadow-[0_10px_22px_rgba(78,53,31,0.17)] min-[430px]:right-[7vw]">
        <p className="font-mono text-[0.38rem] tracking-[0.16em] text-hari-red">{MONTHS[story.month - 1]} · {story.year}</p>
        <p className="mt-1 font-display text-2xl font-semibold leading-none">{story.day}</p>
      </div>
    </div>
  );
}

function EditorialDetails() {
  return (
    <>
      <div data-festive-object className="absolute -left-5 bottom-[-2rem] z-10 hidden rotate-[-5deg] opacity-0 md:block">
        <div data-depth="0.76" className="relative">
          <ChristmasCluster className="w-36 drop-shadow-[0_20px_16px_rgba(55,63,45,0.18)] lg:w-44" />
          <span data-snowflake className="absolute left-[14%] top-[8%] size-1.5 rounded-full bg-white/85" />
          <span data-snowflake className="absolute left-[78%] top-[20%] size-1 rounded-full bg-white/85" />
          <span data-snowflake className="absolute left-[50%] top-0 size-1 rounded-full bg-white/85" />
        </div>
      </div>
      <div data-festive-object className="absolute bottom-[8vh] left-[16%] z-10 hidden rotate-[-12deg] opacity-0 lg:block">
        <div data-depth="0.68"><Ketupat className="w-24 drop-shadow-[0_16px_13px_rgba(62,75,55,0.16)]" /></div>
      </div>
      <div data-festive-object className="absolute -right-9 bottom-[38%] z-10 hidden rotate-12 opacity-0 lg:block">
        <div data-depth="0.82"><Mooncake className="w-28 drop-shadow-[0_20px_16px_rgba(107,70,37,0.17)]" /></div>
      </div>
      <div data-festive-object className="absolute bottom-[3vh] left-[42%] z-10 hidden rotate-6 opacity-0 md:block">
        <div data-depth="0.7"><CrescentStar className="w-20 drop-shadow-[0_14px_10px_rgba(101,75,32,0.16)] lg:w-24" /></div>
      </div>
      <div data-festive-object data-lunar-dragon className="absolute right-[17%] top-[20%] z-10 hidden w-36 rotate-[-4deg] opacity-0 lg:block">
        <div data-depth="0.52"><LunarDragon className="w-full drop-shadow-[0_12px_10px_rgba(101,48,40,0.16)]" /></div>
      </div>
      <div data-codex-companion className="absolute bottom-[4vh] left-[29%] z-10 hidden w-[4.75rem] rotate-2 opacity-0 md:block lg:w-[5.5rem]">
        <div data-depth="0.64"><CodexCompanion className="w-full drop-shadow-[0_16px_12px_rgba(39,73,95,0.2)]" /></div>
      </div>
    </>
  );
}

export function HomeExperience() {
  const rootRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const story = useActiveStory();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    const hero = heroRef.current;
    if (!root || !hero) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

        gsap.set("[data-home-nav]", { autoAlpha: 0, y: 8 });
        gsap.set("[data-draw-path]", { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set("[data-headline-line]", { yPercent: 112 });
        gsap.set("[data-hero-copy]", { autoAlpha: 0, y: 12 });
        gsap.set("[data-primary-polaroid]", { autoAlpha: 0, x: 54, y: -28, rotation: -9 });
        gsap.set("[data-hanging-item]", { autoAlpha: 0, y: -42, rotation: -2 });
        gsap.set("[data-festive-object], [data-codex-companion]", { autoAlpha: 0, scale: 0.72 });
        gsap.set("[data-mobile-date]", { autoAlpha: 0, y: 14, rotation: -3 });
        gsap.set("[data-paper-curtain]", { yPercent: 100 });
        intro
          .to("[data-home-nav]", { autoAlpha: 1, y: 0, duration: 0.55 }, 0.08)
          .to("[data-draw-path]", { strokeDashoffset: 0, duration: 1.15, stagger: 0.1, ease: "power2.inOut" }, 0.12)
          .to("[data-headline-line]", { yPercent: 0, duration: 0.76, stagger: 0.11 }, 0.38)
          .to("[data-hero-copy]", { autoAlpha: 1, y: 0, duration: 0.58, stagger: 0.08 }, 0.72)
          .to("[data-primary-polaroid]", { autoAlpha: 1, x: 0, y: 0, rotation: 5, duration: 0.72, ease: "back.out(1.25)" }, 0.8)
          .fromTo("[data-polaroid-tape]", { scaleX: 0, rotation: -7 }, { scaleX: 1, rotation: -2, duration: 0.35 }, 1.34)
          .to("[data-hanging-item]", { autoAlpha: 1, y: 0, rotation: 0, duration: 0.66, stagger: 0.12, ease: "back.out(1.65)" }, 0.92)
          .to("[data-festive-object], [data-codex-companion]", { autoAlpha: 1, scale: 1, duration: 0.45, stagger: 0.08, ease: "back.out(1.5)" }, 1.25)
          .to("[data-mobile-date]", { autoAlpha: 1, y: 0, rotation: 2, duration: 0.42 }, 1.42);

        gsap.to("[data-sway]", {
          rotation: (index) => (index % 2 === 0 ? 1.4 : -1.2),
          duration: (index) => 2.8 + index * 0.45,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: 0.22,
        });

        gsap.to("[data-snowflake]", {
          y: 9,
          x: (index) => (index % 2 === 0 ? 3 : -3),
          autoAlpha: 0.2,
          duration: (index) => 2.1 + index * 0.18,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: 0.12,
        });

        gsap.to("[data-lunar-dragon]", {
          x: 11,
          y: -5,
          rotation: 1.5,
          duration: 3.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to("[data-codex-companion]", {
          y: -4,
          rotation: -1,
          duration: 2.7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

      });

      media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const transition = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        transition
          .to("[data-hero-headline]", { yPercent: -18, autoAlpha: 0.12, ease: "none" }, 0)
          .to("[data-primary-polaroid]", { yPercent: -22, scale: 1.08, rotation: 0, ease: "none" }, 0)
          .to("[data-memory-rope]", { xPercent: -7, scaleX: 1.1, transformOrigin: "right top", ease: "none" }, 0)
          .to("[data-transition-memory]", { xPercent: -126, yPercent: 56, scale: 1.85, rotation: -2, transformOrigin: "top center", ease: "power2.inOut" }, 0.16)
          .to("[data-paper-curtain]", { yPercent: 0, ease: "power2.inOut" }, 0.66);
      });

      media.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        const transition = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.72,
            invalidateOnRefresh: true,
          },
        });

        transition
          .to("[data-hero-headline]", { yPercent: -13, autoAlpha: 0.08, ease: "none" }, 0)
          .to("[data-mobile-collage]", { yPercent: -17, ease: "none" }, 0.04)
          .to("[data-primary-polaroid]", { yPercent: -38, xPercent: -7, scale: 1.14, rotation: -1, ease: "power1.inOut" }, 0.12)
          .to("[data-mobile-date]", { yPercent: -36, xPercent: -28, rotation: -4, ease: "none" }, 0.16)
          .to("[data-paper-curtain]", { yPercent: 0, ease: "power2.inOut" }, 0.62);
      });

      media.add("(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const depthLayers = gsap.utils.toArray<HTMLElement>("[data-depth]");
        const movers = depthLayers.map((element) => {
          const depth = Number(element.dataset.depth ?? 0.3);
          return {
            x: gsap.quickTo(element, "x", { duration: 0.8, ease: "power3.out" }),
            y: gsap.quickTo(element, "y", { duration: 0.8, ease: "power3.out" }),
            depth,
          };
        });

        const move = (event: PointerEvent) => {
          const x = event.clientX / window.innerWidth - 0.5;
          const y = event.clientY / window.innerHeight - 0.5;
          movers.forEach((mover) => {
            mover.x(x * 24 * mover.depth);
            mover.y(y * 18 * mover.depth);
          });
        };
        const reset = () => movers.forEach((mover) => { mover.x(0); mover.y(0); });
        hero.addEventListener("pointermove", move);
        hero.addEventListener("pointerleave", reset);
        return () => {
          hero.removeEventListener("pointermove", move);
          hero.removeEventListener("pointerleave", reset);
        };
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          "[data-home-nav], [data-headline-line], [data-hero-copy], [data-primary-polaroid], [data-hanging-item], [data-festive-object], [data-codex-companion], [data-mobile-date]",
          { clearProps: "transform", autoAlpha: 1, x: 0, y: 0 },
        );
        gsap.set("[data-paper-curtain]", { yPercent: 100 });
      });
    }, root);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <main ref={rootRef} className="hari-home overflow-clip bg-hari-paper text-hari-ink antialiased [color-scheme:light]">
      <section
        id="top"
        ref={heroRef}
        className="relative min-h-[148svh] bg-hari-paper motion-reduce:min-h-svh md:min-h-[168svh] lg:min-h-[184svh]"
      >
        <div className="sticky top-0 h-svh overflow-hidden bg-hari-paper">
          <div aria-hidden="true" className="hari-paper-grain pointer-events-none absolute inset-0 z-[1] opacity-[0.07] mix-blend-multiply" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(255,251,227,0.95),transparent_34%),radial-gradient(circle_at_13%_82%,rgba(200,121,82,0.12),transparent_30%)]" />
          <StoryPaths />
          <HomeNavigation />
          <HangingMemories story={story} />
          <MobileFestiveCollage story={story} />

          <div
            data-hero-headline
            className="absolute left-5 top-[15.5svh] z-20 w-[min(88vw,46rem)] md:left-10 md:top-[24vh] md:w-[min(56vw,43rem)] lg:left-16 lg:top-[25vh] lg:w-[min(52vw,48rem)]"
          >
            <div className="mb-3 flex items-center gap-3 opacity-0 md:mb-5" data-hero-copy>
              <span className="h-px w-10 bg-hari-red" />
              <p className="font-mono text-[0.56rem] font-semibold uppercase tracking-[0.2em] text-hari-red">Cerita yang kita rayakan</p>
            </div>
            <h1 className="font-display leading-[0.76] tracking-[-0.065em] text-hari-ink">
              <span className="block overflow-hidden pb-[0.08em]"><span data-headline-line className="block text-[clamp(3.9rem,17.5vw,8.9rem)] font-semibold">Setiap hari</span></span>
              <span className="block overflow-hidden pb-[0.14em]"><span data-headline-line className="block text-[clamp(3.45rem,15.7vw,8rem)] font-medium italic text-hari-red">punya cerita.</span></span>
            </h1>
            <div className="mt-3 flex max-w-md flex-col items-start gap-3 md:mt-6 md:gap-4">
              <p data-hero-copy className="max-w-[19rem] translate-y-3 text-sm leading-[1.55] text-hari-ink/72 opacity-0 md:max-w-sm md:text-base md:leading-7">
                Perayaan, budaya, dan momen yang kita bagi bersama.
              </p>
              <a data-hero-copy href="#cerita" className="group w-fit translate-y-3 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-hari-ink opacity-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hari-red">
                Jelajahi Hari Kita <span aria-hidden="true" className="ml-2 inline-block transition-transform group-hover:translate-y-1">↓</span>
                <span className="mt-2 block h-px origin-left bg-hari-red transition-transform duration-500 group-hover:scale-x-75" />
              </a>
            </div>
          </div>

          <div data-hero-copy className="absolute bottom-6 left-5 z-20 hidden translate-y-3 opacity-0 md:left-10 md:block lg:left-16">
            <p className="font-mono text-[0.5rem] uppercase tracking-[0.2em] text-hari-ink/45">Simpan yang hangat · ceritakan kembali</p>
          </div>

          <div data-hero-copy className="absolute bottom-[33%] right-[28%] z-10 hidden -rotate-6 translate-y-3 opacity-0 lg:block">
            <p className="font-display text-xl italic text-hari-ink/55">sebuah ingatan kecil</p>
            <svg aria-hidden="true" className="ml-14 mt-1 h-10 w-20" viewBox="0 0 80 40" fill="none">
              <path d="M2 4c21 0 42 9 68 27" stroke="#1D1C1A" strokeWidth="1.3" strokeLinecap="round" />
              <path d="m61 31 10 1-2-10" stroke="#1D1C1A" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </div>

          <PrimaryPolaroid story={story} />
          <EditorialDetails />

          <div
            data-paper-curtain
            aria-hidden="true"
            className="hari-paper-grain pointer-events-none absolute inset-x-0 bottom-0 z-40 h-[54vh] bg-hari-paper-deep [clip-path:polygon(0_7%,11%_3%,22%_8%,37%_2%,51%_7%,64%_2%,76%_8%,89%_3%,100%_7%,100%_100%,0_100%)] md:h-[58vh]"
          />
        </div>
      </section>

      <CurrentStorySection story={story} />
    </main>
  );
}
