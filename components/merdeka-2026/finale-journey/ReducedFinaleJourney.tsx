"use client";

import { useState } from "react";
import { useLenis } from "lenis/react";
import Link from "next/link";
import { useVoiceExperience } from "../voice/VoiceExperienceContext";

function StaticIndonesia() {
  return (
    <svg aria-hidden="true" viewBox="0 0 900 330" className="mt-16 w-full overflow-visible text-bone/68">
      <g fill="currentColor">
        <path d="M66 76c36 10 93 55 145 113 17 18 25 38 15 46-11 9-31-5-48-25C127 151 79 111 54 98c-18-9-8-28 12-22Z" />
        <path d="M251 219c59-11 143-10 210 2 17 3 17 19-1 20-70 5-143 4-207-1-16-1-18-18-2-21Z" />
        <path d="M325 69c35-20 111-35 157-19 25 9 40 45 22 67-18 23-50 30-72 55-16 18-43 10-38-14 5-26 30-40 35-63-33 5-61 11-88 17-28 6-39-29-16-43Z" />
        <path d="M526 102c20-22 44-35 70-35 15 1 20 15 9 26l-27 27 42 20c14 7 11 25-5 27l-42 4 16 37c6 15-13 26-25 15l-28-28-10 42c-4 17-28 18-31 0-8-43 5-96 31-135Z" />
        <path d="M690 74c42-27 112-17 146 18 13 14 8 34-10 38-29 7-54 2-76 17-21 14-43 36-66 42-17 5-28-12-17-26 20-24 33-70 23-89Z" />
        <path d="M497 257c18-7 38-5 52 4 12 8 4 22-9 19l-43-9c-9-2-9-11 0-14Zm76 7c15-8 32-8 47 0 10 6 6 18-6 18h-38c-11 0-13-13-3-18Zm68 8c16-9 36-8 52 2 9 6 3 18-8 16l-42-6c-8-1-10-8-2-12Z" />
      </g>
      <circle cx="451" cy="237" r="4" className="fill-red-highlight" />
    </svg>
  );
}

export function ReducedFinaleJourney() {
  const lenis = useLenis();
  const { status, submittedVoice, resetExperience } = useVoiceExperience();
  const [shareLabel, setShareLabel] = useState("BAGIKAN");
  const replay = () => {
    window.dispatchEvent(new Event("ruang-merdeka:replay"));
    resetExperience();
    if (lenis) lenis.scrollTo(0, { duration: 1.1, force: true });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareLabel("TAUTAN DISALIN");
      window.setTimeout(() => setShareLabel("BAGIKAN"), 1600);
    } catch { setShareLabel("BAGIKAN"); }
  };

  return (
    <section id="finale-journey" aria-label="Penutup perjalanan 81 tahun" className="relative overflow-hidden bg-night px-5 py-24 text-bone md:px-10 md:py-36 lg:px-16">
      <p className="font-mono text-[9px] tracking-[0.26em] text-bone/38">1945 ───────── 2026</p>
      <div className="mt-28 text-center">
        <h2 className="px-4 text-[clamp(9rem,36vw,28rem)] font-semibold leading-[0.82] tracking-[-0.1em]">81</h2>
        <p className="mt-5 text-xl font-medium tracking-[0.26em] text-red-highlight">TAHUN.</p>
      </div>
      <StaticIndonesia />
      <h2 className="mt-20 text-[clamp(3rem,9vw,8rem)] font-semibold uppercase leading-[0.82] tracking-[-0.07em]">DARI SATU PROKLAMASI,<br />MENJADI <span className="text-red-highlight">JUTAAN</span><br />PERJALANAN.</h2>
      <p className="mt-24 text-[clamp(2.4rem,7vw,6rem)] font-semibold uppercase leading-[0.86] tracking-[-0.06em]">SATU BANGSA.<br />RIBUAN PULAU.<br /><span className="text-red-highlight">JUTAAN CERITA.</span></p>
      {status === "submitted" && submittedVoice && <blockquote className="mt-20 max-w-2xl border-l border-red-highlight/50 pl-6 text-xl text-bone/70">“{submittedVoice}”</blockquote>}
      <div className="mt-36 text-center">
        <p className="font-mono text-[9px] tracking-[0.3em] text-bone/42">17 · 08 · 2026</p>
        <p className="mt-6 px-3 text-[clamp(3.65rem,12vw,10rem)] font-semibold uppercase leading-[0.84] tracking-[-0.07em]">81 TAHUN<br /><span className="text-red-highlight">MERDEKA.</span></p>
      </div>
      <div className="mt-40 text-center">
        <p className="text-[clamp(2.8rem,8vw,7rem)] font-semibold uppercase leading-[0.82] tracking-[-0.07em]">TAPI PERJALANAN<br /><span className="text-red-highlight">BELUM SELESAI.</span></p>
        <p className="mx-auto mt-20 max-w-3xl text-[clamp(2.4rem,7vw,6rem)] font-semibold uppercase leading-[0.84] tracking-[-0.06em]">SELAMA KITA TERUS <span className="text-red-highlight">MENGISINYA.</span></p>
      </div>
      <footer className="mt-44 border-t border-bone/10 pt-16 text-center">
        <p className="font-mono text-[8px] tracking-[0.3em] text-red-highlight">17.08.2026</p>
        <h2 className="mt-4 text-[clamp(3rem,9vw,8rem)] font-semibold uppercase tracking-[-0.07em]">RUANG MERDEKA</h2>
        <p className="mt-4 font-mono text-[9px] tracking-[0.24em] text-bone/42">2026 / 81 TAHUN</p>
        <nav aria-label="Navigasi penutup" className="mt-14 flex flex-wrap justify-center gap-x-7 gap-y-3 font-mono text-[9px] tracking-[0.18em] text-bone/55">
          <button type="button" onClick={replay} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-highlight">LIHAT KEMBALI ↑</button>
          <button type="button" onClick={share} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-highlight">{shareLabel}</button>
          <Link href="/#tentang" className="inline-flex min-h-11 items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-highlight">TENTANG</Link>
          <Link href="/#arsip" className="inline-flex min-h-11 items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-highlight">ARSIP</Link>
        </nav>
      </footer>
    </section>
  );
}
