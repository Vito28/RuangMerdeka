"use client";

import Image from "next/image";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { useState, type ReactNode } from "react";
import { useVoiceExperience } from "../../voice/VoiceExperienceContext";
import { FINALE_CALLBACKS, FINALE_PHOTOS } from "../data/finale-callbacks";

function CopyLine({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`block overflow-hidden py-[0.06em] ${className}`}><span data-finale-copy-line className="block">{children}</span></span>;
}

function FinalNavigation() {
  const lenis = useLenis();
  const { resetExperience } = useVoiceExperience();
  const [replaying, setReplaying] = useState(false);
  const [shareLabel, setShareLabel] = useState("BAGIKAN");

  const replay = () => {
    if (replaying) return;
    setReplaying(true);
    window.setTimeout(() => {
      window.dispatchEvent(new Event("ruang-merdeka:replay"));
      resetExperience();
      if (lenis) {
        lenis.scrollTo(0, {
          duration: 1.35,
          force: true,
          onComplete: () => window.setTimeout(() => setReplaying(false), 180),
        });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.setTimeout(() => setReplaying(false), 1400);
      }
    }, 260);
  };

  const share = async () => {
    const payload = { title: document.title, text: "81 tahun kemerdekaan—satu perjalanan yang terus kita isi.", url: window.location.href };
    try {
      let copied = false;
      if (typeof navigator.share === "function") await navigator.share(payload);
      else {
        await navigator.clipboard.writeText(window.location.href);
        copied = true;
      }
      setShareLabel(copied ? "TAUTAN DISALIN" : "TERBAGIKAN");
      window.setTimeout(() => setShareLabel("BAGIKAN"), 1800);
    } catch {
      setShareLabel("BAGIKAN");
    }
  };

  const linkClass = "group inline-flex min-h-11 items-center gap-2 font-mono text-[9px] tracking-[0.2em] text-bone/52 transition-colors duration-300 hover:text-bone focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-highlight";

  return (
    <>
      <nav data-finale-nav aria-label="Navigasi penutup" className="pointer-events-auto absolute inset-x-5 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-40 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 md:inset-x-10 md:bottom-9 md:justify-between lg:inset-x-16">
        <button type="button" onClick={replay} className={linkClass}>LIHAT KEMBALI <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5">↑</span></button>
        <div className="flex flex-wrap items-center justify-center gap-x-6">
          <button type="button" onClick={share} className={linkClass}>{shareLabel}</button>
          <Link href="/#tentang" className={linkClass}>TENTANG</Link>
          <Link href="/#arsip" className={linkClass}>ARSIP</Link>
        </div>
      </nav>
      <div aria-hidden="true" className={`pointer-events-none fixed inset-0 z-50 bg-night transition-opacity duration-300 ${replaying ? "opacity-100" : "opacity-0"}`} />
    </>
  );
}

export function FinaleJourneyOverlay() {
  const { status, submittedVoice } = useVoiceExperience();

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div data-finale-horizon className="absolute inset-x-5 top-1/2 -translate-y-1/2 md:inset-x-10 lg:inset-x-16">
        <p className="mb-7 text-center font-mono text-[8px] tracking-[0.26em] text-bone/34">YANG KITA BAWA, MENJADI ARAH</p>
        <div className="relative mx-auto flex max-w-5xl items-center gap-4 font-mono text-[10px] tracking-[0.2em] text-bone/52 md:text-xs">
          <span>1945</span>
          <div className="relative h-px flex-1 bg-bone/10">
            <span data-finale-year-rule className="absolute inset-0 bg-gradient-to-r from-bone/38 via-red-highlight/55 to-bone/38" />
            <span data-finale-year-signal className="absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-red-highlight shadow-[0_0_22px_rgba(255,23,48,0.55)]" />
          </div>
          <span>2026</span>
        </div>
      </div>

      <div className="absolute inset-x-5 top-[16%] md:inset-x-10 lg:inset-x-16">
        {FINALE_CALLBACKS.map((item, index) => (
          <div key={item.index} data-finale-callback={index} className="absolute left-0 top-0 flex items-center gap-3 font-mono uppercase md:left-[8%]">
            <span className="text-[9px] tracking-[0.18em] text-red-highlight">{item.index}</span>
            <span className="text-[10px] tracking-[0.22em] text-bone/68">{item.label}</span>
            <span className="hidden text-[8px] tracking-[0.18em] text-bone/24 sm:inline">/ {item.detail}</span>
          </div>
        ))}
      </div>

      <div aria-hidden="true" className="absolute inset-0 hidden md:block">
        {FINALE_PHOTOS.map((photo, index) => {
          const placement = index === 0 ? "left-[12%] top-[28%]" : index === 1 ? "left-[42%] top-[19%]" : "right-[12%] top-[32%]";
          return (
            <figure key={photo.src} data-finale-photo={index} className={`absolute ${placement} h-[20vh] w-[24vw] max-w-sm overflow-hidden border border-bone/8 bg-night`}>
              <Image src={photo.src} alt="" fill sizes="24vw" className="object-cover saturate-[0.6] contrast-110" />
              <span className="absolute inset-0 bg-red-highlight/10 mix-blend-color" />
            </figure>
          );
        })}
      </div>

      <div data-finale-81 className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="overflow-hidden font-mono text-[9px] tracking-[0.34em] text-bone/42"><span data-finale-81-line className="block">SATU PROKLAMASI · JUTAAN PERJALANAN</span></p>
          <h2 className="overflow-hidden px-4 text-[clamp(9rem,38vw,32rem)] font-semibold leading-[0.8] tracking-[-0.1em] text-bone/92"><span data-finale-81-line className="block py-[0.06em]">81</span></h2>
          <p className="overflow-hidden text-[clamp(1rem,2vw,1.8rem)] font-medium uppercase tracking-[0.3em] text-red-highlight"><span data-finale-81-line className="block">TAHUN.</span></p>
          <p data-finale-81-material-label className="mt-6 font-mono text-[8px] tracking-[0.24em] text-bone/28 opacity-0">PULAU · MANUSIA · INGATAN · SUARA</p>
        </div>
      </div>

      <div data-finale-flight className="absolute inset-0 grid place-items-center text-center">
        <p className="max-w-xl px-5 text-[clamp(2.6rem,7vw,6.8rem)] font-semibold uppercase leading-[0.82] tracking-[-0.07em] text-bone/88">SATU ENERGI<br /><span className="text-red-highlight">MEMBAWA KITA</span><br />MAJU.</p>
      </div>

      <p data-finale-wing-copy className="absolute inset-x-5 bottom-[16%] text-center font-mono text-[9px] uppercase tracking-[0.18em] text-bone/48">Bukan untuk terbang sendiri—tetapi untuk mengangkat yang lain.</p>

      <div data-finale-map-copy className="absolute inset-x-5 top-[18%] flex justify-end md:inset-x-10 lg:inset-x-16">
        <h2 className="max-w-[15ch] text-right text-[clamp(2.3rem,6vw,6.6rem)] font-semibold uppercase leading-[0.82] tracking-[-0.065em] text-bone">
          <CopyLine>DARI SATU</CopyLine><CopyLine>PROKLAMASI,</CopyLine><CopyLine>MENJADI</CopyLine><CopyLine className="text-red-highlight">JUTAAN</CopyLine><CopyLine>PERJALANAN.</CopyLine>
        </h2>
      </div>

      <div data-finale-map-stack className="absolute inset-x-5 bottom-[12%] md:inset-x-10 md:bottom-[15%] lg:inset-x-16">
        <p className="text-[clamp(2rem,5vw,5.4rem)] font-semibold uppercase leading-[0.86] tracking-[-0.06em] text-bone">
          <CopyLine>SATU BANGSA.</CopyLine><CopyLine>RIBUAN PULAU.</CopyLine><CopyLine className="text-red-highlight">JUTAAN CERITA.</CopyLine>
        </p>
      </div>

      {status === "submitted" && submittedVoice && (
        <blockquote data-finale-user-voice className="absolute left-1/2 top-[42%] max-w-[min(80vw,36rem)] -translate-x-1/2 text-center">
          <p className="font-mono text-[8px] tracking-[0.22em] text-bone/34">SATU SUARA DI DALAMNYA</p>
          <p className="mt-3 text-lg font-medium leading-snug text-bone/78 md:text-2xl">“{submittedVoice}”</p>
        </blockquote>
      )}

      <div data-finale-celebration className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="overflow-hidden font-mono text-[10px] tracking-[0.34em] text-bone/48"><span data-finale-copy-line className="block">17 · 08 · 2026</span></p>
          <h2 className="mt-5 px-4 text-[clamp(3.65rem,14vw,13.5rem)] font-semibold uppercase leading-[0.82] tracking-[-0.075em] text-bone"><CopyLine>81 TAHUN</CopyLine><CopyLine className="text-red-highlight">MERDEKA.</CopyLine></h2>
        </div>
      </div>

      <div data-finale-closing="past" className="absolute inset-0 grid place-items-center px-5 text-center">
        <p className="text-[clamp(3rem,9vw,9rem)] font-semibold uppercase leading-[0.82] tracking-[-0.075em] text-bone"><CopyLine>81 TAHUN</CopyLine><CopyLine>TELAH BERLALU.</CopyLine></p>
      </div>
      <div data-finale-closing="unfinished" className="absolute inset-0 grid place-items-center px-5 text-center">
        <p className="text-[clamp(3rem,9vw,9rem)] font-semibold uppercase leading-[0.82] tracking-[-0.075em] text-bone"><CopyLine>TAPI PERJALANAN</CopyLine><CopyLine className="text-red-highlight">BELUM SELESAI.</CopyLine></p>
      </div>
      <div data-finale-closing="meaning" className="absolute inset-0 grid place-items-center px-5 text-center">
        <div>
          <p className="mb-7 overflow-hidden font-mono text-[8px] uppercase tracking-[0.22em] text-bone/42"><span data-finale-copy-line className="block">KARENA ARTI MERDEKA AKAN TERUS BERUBAH.</span></p>
          <p className="text-[clamp(2.8rem,8vw,8rem)] font-semibold uppercase leading-[0.82] tracking-[-0.07em] text-bone"><CopyLine>SELAMA KITA</CopyLine><CopyLine>TERUS</CopyLine><CopyLine className="text-red-highlight">MENGISINYA.</CopyLine></p>
        </div>
      </div>

      <div data-finale-brand className="absolute inset-0 grid place-items-center px-5 text-center">
        <div>
          <span aria-hidden="true" className="mx-auto mb-8 block h-12 w-px bg-gradient-to-b from-red-highlight to-transparent" />
          <p className="font-mono text-[8px] tracking-[0.32em] text-red-highlight">17.08.2026</p>
          <h2 className="mt-3 text-[clamp(3.7rem,11vw,11rem)] font-semibold uppercase leading-none tracking-[-0.075em] text-bone">RUANG MERDEKA</h2>
          <p className="mt-5 font-mono text-[9px] tracking-[0.25em] text-bone/44">2026 / 81 TAHUN</p>
          <p className="mx-auto mt-7 max-w-md text-sm leading-relaxed text-bone/42">Satu ruang untuk mengingat, mendengar, dan terus mengisi arti kemerdekaan.</p>
        </div>
      </div>

      <FinalNavigation />
    </div>
  );
}
