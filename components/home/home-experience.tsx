"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { ExperienceProgress } from "@/components/experience/ExperienceProgress";
import { currentEdition, editions } from "@/lib/editions";
import { motionTokens } from "@/lib/motion/tokens";

const EntranceAtmosphere = dynamic(() => import("./entrance-atmosphere"), {
  ssr: false,
});

function Arrow({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={className}>↗</span>;
}

function Navigation({ menuOpen, onToggle }: { menuOpen: boolean; onToggle: () => void }) {
  return (
    <>
      <header data-global-navigation className="fixed inset-x-0 top-0 z-40 flex h-20 items-center justify-between px-5 md:px-10 lg:px-16">
        <a href="#top" className="text-[11px] font-semibold tracking-[0.2em] text-bone focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone">
          RUANG MERDEKA
        </a>

        <nav aria-label="Navigasi utama" className="hidden items-center gap-9 text-[10px] tracking-[0.2em] md:flex">
          <a className="text-bone/55 transition-colors hover:text-bone focus-visible:outline-2 focus-visible:outline-offset-4" href="#about">ABOUT</a>
          <a className="text-bone/55 transition-colors hover:text-bone focus-visible:outline-2 focus-visible:outline-offset-4" href="#archive">ARCHIVE</a>
          <Link className="group flex items-center gap-2 text-bone focus-visible:outline-2 focus-visible:outline-offset-4" href={currentEdition.href}>
            CURRENT
            <Arrow className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </nav>

        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={onToggle}
          className="inline-flex min-h-11 items-center text-[10px] tracking-[0.2em] text-bone focus-visible:outline-2 focus-visible:outline-offset-4 md:hidden"
        >
          {menuOpen ? "CLOSE" : "MENU"}
        </button>
      </header>

      <div
        id="mobile-menu"
        data-open={menuOpen}
        className="fixed inset-0 z-30 flex translate-y-full flex-col justify-between bg-ink-soft px-5 pb-8 pt-28 transition-transform duration-700 ease-cinematic data-[open=true]:translate-y-0 md:hidden"
      >
        <nav aria-label="Navigasi mobile" className="flex flex-col gap-2 text-[clamp(2.8rem,15vw,5.5rem)] font-semibold uppercase leading-[0.92] tracking-[-0.065em]">
          <a onClick={onToggle} className="py-3 focus-visible:outline-2" href="#about">About</a>
          <a onClick={onToggle} className="py-3 focus-visible:outline-2" href="#archive">Archive</a>
          <Link onClick={onToggle} className="py-3 text-merdeka focus-visible:outline-2" href={currentEdition.href}>
            Current <Arrow className="ml-2 text-[0.45em]" />
          </Link>
        </nav>

        <div className="flex items-end justify-between font-mono text-[9px] leading-5 tracking-[0.2em] text-bone/45">
          <p>CURRENT EDITION<br />{currentEdition.year}</p>
          <p className="text-right">EST. 2026<br />INDONESIA</p>
        </div>
      </div>
    </>
  );
}

function Entrance() {
  return (
    <section id="top" className="relative flex min-h-svh flex-col justify-between overflow-hidden px-5 pb-8 pt-28 md:px-10 md:pb-10 lg:px-16">
      <div aria-hidden="true" className="ambient-light pointer-events-none absolute inset-0 opacity-0" data-hero-atmosphere />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0" data-hero-atmosphere>
        <EntranceAtmosphere />
      </div>

      <div className="relative z-10 flex items-center justify-between font-mono text-[9px] tracking-[0.22em] text-bone/45 opacity-0" data-hero-meta>
        <p>EST. 2026</p>
        <p>INDONESIA</p>
      </div>

      <div className="relative z-10 grid grid-cols-4 gap-x-4 md:grid-cols-8 lg:grid-cols-12">
        <div className="col-span-full mb-7 h-px w-12 origin-left bg-merdeka/85" data-hero-signal />
        <h1 className="col-span-full font-semibold uppercase tracking-[-0.085em]">
          <span className="block overflow-hidden">
            <span className="block text-[clamp(4.05rem,14vw,13rem)] leading-[0.77]" data-hero-line>Ruang</span>
          </span>
          <span className="block overflow-hidden">
            <span className="block text-[clamp(4.05rem,14vw,13rem)] leading-[0.77]" data-hero-line>
              Merdeka<span className="text-merdeka">.</span>
            </span>
          </span>
        </h1>

        <p className="col-span-3 mt-8 font-mono text-[9px] leading-5 tracking-[0.22em] text-bone/55 opacity-0 md:col-span-4 md:col-start-5 lg:col-span-3 lg:col-start-7" data-hero-meta>
          AN ANNUAL DIGITAL EXPERIENCE
        </p>
      </div>

      <div className="relative z-10 flex items-end justify-between opacity-0" data-hero-meta>
        <p className="max-w-44 text-xs leading-5 text-bone/42 md:max-w-56">
          Indonesia, dilihat kembali melalui desain, teknologi, dan cerita.
        </p>
        <a href="#about" className="group flex min-h-11 items-center gap-4 font-mono text-[9px] tracking-[0.2em] text-bone/65 focus-visible:outline-2 focus-visible:outline-offset-4">
          EXPLORE
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-1">↓</span>
        </a>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-ink px-5 py-28 md:px-10 md:py-40 lg:px-16 lg:py-48">
      <div className="mt-24 grid grid-cols-4 gap-x-4 md:mt-36 md:grid-cols-8 lg:grid-cols-12">
        <div className="col-span-full overflow-hidden">
          <h2 className="text-[clamp(3.8rem,10vw,9.8rem)] font-semibold uppercase leading-[0.82] tracking-[-0.078em]" data-mask-line>Satu ruang.</h2>
        </div>
        <div className="col-span-full overflow-hidden md:text-right">
          <p className="text-[clamp(3.8rem,10vw,9.8rem)] font-semibold uppercase leading-[0.82] tracking-[-0.078em] text-bone/32" data-mask-line>Banyak perspektif.</p>
        </div>

        <p className="col-span-4 mt-24 max-w-xl text-[clamp(1.25rem,2vw,2rem)] leading-[1.35] tracking-[-0.035em] md:col-span-5 md:col-start-4 lg:col-span-5 lg:col-start-7" data-reveal>
          Ruang Merdeka adalah eksperimen digital tahunan untuk melihat kembali Indonesia melalui cerita, desain, teknologi, dan interaksi.
        </p>

        <div className="col-span-3 mt-16 font-mono text-[9px] leading-5 tracking-[0.16em] text-bone/42 md:col-span-3 md:col-start-6 lg:col-span-3 lg:col-start-10" data-reveal>
          <p>SETIAP TAHUN MEMBAWA</p>
          <p>PERTANYAAN, VISUAL, DAN</p>
          <p>PENGALAMAN YANG BERBEDA.</p>
        </div>
      </div>
    </section>
  );
}

function AnnualIdea() {
  const years = ["2026", "2027", "2028", "∞"];

  return (
    <section className="relative overflow-hidden bg-ink-soft px-5 py-28 md:min-h-[135svh] md:px-10 md:py-40 lg:px-16 lg:py-48">
      <div className="mt-24 grid grid-cols-4 gap-x-4 md:mt-36 md:grid-cols-8 lg:grid-cols-12">
        <div className="col-span-4 md:col-span-6 lg:col-span-8">
          <div className="overflow-hidden">
            <h2 className="text-[clamp(3.7rem,9vw,9rem)] font-semibold uppercase leading-[0.83] tracking-[-0.075em]" data-mask-line>Satu tahun.</h2>
          </div>
          <div className="overflow-hidden">
            <p className="text-[clamp(3.7rem,9vw,9rem)] font-semibold uppercase leading-[0.83] tracking-[-0.075em] text-merdeka" data-mask-line>Satu interpretasi baru.</p>
          </div>
        </div>

        <p className="col-span-4 mt-16 max-w-md text-base leading-7 text-bone/58 md:col-span-3 md:col-start-6 lg:col-span-3 lg:col-start-10" data-reveal>
          Indonesia terus berubah. Cara kita melihat kemerdekaan juga berubah. Karena itu, pengalaman yang sama tidak pernah diulang.
        </p>

        <div className="col-span-full mt-28 border-t border-bone/15 md:mt-44 lg:col-span-10 lg:col-start-3" data-year-track>
          {years.map((year, index) => (
            <div key={year} className="grid grid-cols-4 items-center gap-x-4 border-b border-bone/15 py-5 md:grid-cols-8 md:py-6 lg:grid-cols-10">
              <p className={`col-span-2 text-[clamp(3rem,7vw,7rem)] font-semibold leading-none tracking-[-0.07em] ${index === 0 ? "text-bone" : "text-bone/18"}`}>
                {year}
              </p>
              <p className="col-span-2 text-right font-mono text-[9px] tracking-[0.16em] text-bone/42 md:col-span-6 lg:col-span-8">
                {index === years.length - 1 ? "CONTINUES" : `INTERPRETATION ${String(index + 1).padStart(2, "0")}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section className="relative overflow-hidden bg-ink px-5 py-28 md:px-10 md:py-44 lg:px-16 lg:py-52">
      <div className="mt-28 flex flex-col gap-36 md:mt-44 md:gap-56">
        <div className="overflow-hidden">
          <h2 className="text-[clamp(3.7rem,9.5vw,9.6rem)] font-semibold uppercase leading-[0.82] tracking-[-0.078em]" data-manifesto-line>
            Kemerdekaan<br />bukan sebuah<br /><span className="text-merdeka">tanggal.</span>
          </h2>
        </div>

        <div className="overflow-hidden md:text-right">
          <p className="text-[clamp(3.7rem,9.5vw,9.6rem)] font-semibold uppercase leading-[0.82] tracking-[-0.078em]" data-manifesto-line>
            Ia adalah<br />sesuatu yang<br /><span className="text-bone/28">terus bergerak.</span>
          </p>
        </div>

        <div className="grid grid-cols-4 gap-x-4 md:grid-cols-8 lg:grid-cols-12" data-reveal>
          <p className="col-span-3 text-[11px] font-semibold tracking-[0.15em] text-merdeka md:col-span-2">RUANG MERDEKA</p>
          <p className="col-span-4 mt-16 max-w-3xl text-[clamp(1.65rem,3.3vw,3.5rem)] leading-[1.13] tracking-[-0.047em] md:col-span-6 md:col-start-3 md:mt-0 lg:col-span-7 lg:col-start-6">
            Ruang digital untuk melihat Indonesia dari perspektif yang berbeda, setiap tahun.
          </p>
        </div>
      </div>
    </section>
  );
}

function Archive() {
  return (
    <section id="archive" className="relative overflow-hidden bg-ink-soft px-5 py-28 md:px-10 md:py-40 lg:px-16 lg:py-48">
      <div className="mt-24 grid grid-cols-4 gap-x-4 md:mt-36 md:grid-cols-8 lg:grid-cols-12">
        <div className="col-span-full">
          <h2 className="text-[clamp(4.2rem,11vw,11rem)] font-semibold uppercase leading-[0.78] tracking-[-0.082em]" data-reveal>
            Annual<br /><span className="text-bone/25">Archive.</span>
          </h2>
        </div>

        <p className="col-span-3 mt-14 max-w-sm text-sm leading-6 text-bone/52 md:col-span-3 md:col-start-6 lg:col-start-10" data-reveal>
          Arsip digital yang tumbuh setiap tahun. Satu project, dengan interpretasi yang selalu berubah.
        </p>

        <div className="col-span-full mt-24 md:mt-36">
          {editions.map((edition) => (
            <Link
              key={edition.year}
              href={edition.href}
              data-archive-row
              className="group grid grid-cols-4 gap-x-4 border-y border-bone/18 py-7 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone md:grid-cols-8 md:items-center md:py-9 lg:grid-cols-12"
            >
              <div className="col-span-2 md:col-span-3 lg:col-span-4">
                <p className="text-[clamp(4.5rem,10vw,9.5rem)] font-semibold leading-[0.82] tracking-[-0.078em] transition-colors duration-500 group-hover:text-merdeka group-focus-visible:text-merdeka">{edition.year}</p>
                <p className="mt-4 font-mono text-[9px] tracking-[0.18em] text-merdeka">CURRENT EDITION</p>
              </div>

              <div className="col-span-2 flex h-full flex-col items-end justify-between text-right md:col-span-2 md:items-start md:text-left lg:col-span-2">
                <p className="font-mono text-[9px] leading-5 tracking-[0.16em] text-bone/45">
                  EDITION {String(edition.edition).padStart(2, "0")}<br />{edition.status.toUpperCase()}
                </p>
                <p className="mt-12 text-sm tracking-[-0.02em] text-bone md:mt-0 md:opacity-0 md:transition-opacity md:duration-500 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">{edition.title}</p>
              </div>

              <div aria-hidden="true" className="archive-preview relative col-span-4 mt-12 hidden aspect-[16/7] overflow-hidden bg-merdeka-deep md:col-span-3 md:mt-0 md:block lg:col-span-4 lg:col-start-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgb(244_241_234_/_0.16),transparent_24%),linear-gradient(120deg,transparent_35%,rgb(8_8_8_/_0.55))]" />
                <span className="absolute left-5 top-5 font-mono text-[8px] tracking-[0.2em] text-bone/58">EDITION {String(edition.edition).padStart(2, "0")}</span>
                <span className="absolute bottom-5 left-5 right-5 h-px origin-left bg-bone/45 transition-transform duration-700 ease-cinematic group-hover:scale-x-75" />
              </div>

              <div className="col-span-4 mt-10 flex items-center justify-between font-mono text-[9px] tracking-[0.18em] md:col-span-8 md:mt-7 lg:col-span-12">
                <span>ENTER EXPERIENCE</span>
                <Arrow className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Finale() {
  return (
    <section className="relative flex min-h-svh flex-col justify-between overflow-hidden bg-ink px-5 pb-8 pt-28 md:px-10 md:pb-10 lg:px-16">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_78%_60%,rgb(200_16_46_/_0.13),transparent_32rem)]" />
      <div className="relative z-10 overflow-hidden" data-finale-copy>
        <p className="text-[clamp(4.6rem,14.5vw,14rem)] font-semibold uppercase leading-[0.77] tracking-[-0.085em]">
          Merdeka<br /><span className="text-merdeka">Terus.</span>
        </p>
      </div>

      <footer className="relative z-10 grid grid-cols-4 gap-x-4 font-mono text-[8px] leading-5 tracking-[0.17em] text-bone/58 md:grid-cols-8 md:text-[9px] lg:grid-cols-12">
        <p className="col-span-2 md:col-span-3">RUANG MERDEKA<br />AN ANNUAL DIGITAL EXPERIENCE</p>
        <p className="col-span-2 text-right md:col-start-7 lg:col-start-11">CREATED IN INDONESIA<br />2026 — ∞</p>
      </footer>
    </section>
  );
}

export function HomeExperience() {
  const rootRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!rootRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      if (reducedMotion) {
        gsap.set("[data-hero-line], [data-mask-line], [data-manifesto-line], [data-reveal], [data-archive-row], [data-finale-copy]", {
          clearProps: "all",
          opacity: 1,
        });
        gsap.set("[data-hero-meta], [data-hero-atmosphere]", { opacity: 1 });
        gsap.set("[data-hero-signal]", { scaleX: 1 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: motionTokens.ease.reveal } })
        .fromTo("[data-hero-signal]", { scaleX: 0 }, { scaleX: 1, duration: 0.9 })
        .fromTo("[data-hero-line]", { yPercent: 112 }, { yPercent: 0, duration: 1.05, stagger: 0.13 }, 0.35)
        .to("[data-hero-meta]", { opacity: 1, duration: 0.75, stagger: 0.09 }, 0.95)
        .to("[data-hero-atmosphere]", { opacity: 1, duration: 1.5 }, 0.7);

      gsap.utils.toArray<HTMLElement>("[data-mask-line]").forEach((line) => {
        gsap.fromTo(line, { yPercent: 105 }, {
          yPercent: 0,
          duration: motionTokens.duration.cinematic,
          ease: motionTokens.ease.reveal,
          scrollTrigger: { trigger: line.parentElement, start: "top 86%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(element, { y: 42, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: motionTokens.duration.slow,
          ease: motionTokens.ease.reveal,
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });
      });

      if (window.matchMedia("(min-width: 768px)").matches) {
        gsap.to("[data-global-navigation]", {
          opacity: 0.16,
          y: -4,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: () => `+=${window.innerHeight * 0.8}`,
            scrub: 0.8,
          },
        });
      }

      gsap.utils.toArray<HTMLElement>("[data-manifesto-line]").forEach((line) => {
        gsap.fromTo(line, { yPercent: 105 }, {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: line.parentElement,
            start: "top 84%",
            end: "bottom 42%",
            scrub: 0.7,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-archive-row]").forEach((row) => {
        gsap.fromTo(row, { y: 34, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: motionTokens.duration.slow,
          ease: motionTokens.ease.reveal,
          scrollTrigger: { trigger: row, start: "top 88%", once: true },
        });
      });

      if (window.matchMedia("(min-width: 768px)").matches) {
        gsap.fromTo("[data-year-track]", { y: 55 }, {
          y: -35,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-year-track]",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        });
      }

      gsap.fromTo("[data-finale-copy]", { y: 72, opacity: 0 }, {
        y: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-finale-copy]",
          start: "top 92%",
          end: "top 55%",
          scrub: 0.7,
        },
      });
    }, rootRef);

    const handlePointer = (event: PointerEvent) => {
      rootRef.current?.style.setProperty("--pointer-x", `${(event.clientX / window.innerWidth) * 100}%`);
      rootRef.current?.style.setProperty("--pointer-y", `${(event.clientY / window.innerHeight) * 100}%`);
    };

    const desktopPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (desktopPointer && !reducedMotion) {
      window.addEventListener("pointermove", handlePointer, { passive: true });
    }

    return () => {
      window.removeEventListener("pointermove", handlePointer);
      context.revert();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <main ref={rootRef} className="relative isolate overflow-clip bg-ink text-bone antialiased">
      <div aria-hidden="true" className="film-grain pointer-events-none fixed inset-0 z-50 opacity-[0.035] mix-blend-soft-light" />
      <ExperienceProgress />
      <Navigation menuOpen={menuOpen} onToggle={() => setMenuOpen((open) => !open)} />
      <Entrance />
      <About />
      <AnnualIdea />
      <Manifesto />
      <Archive />
      <Finale />
    </main>
  );
}
