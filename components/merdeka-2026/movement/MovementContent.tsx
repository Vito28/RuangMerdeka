import type { ReactNode } from "react";
import { HumanStoryScene, ReducedHumanStories } from "./human-stories/HumanStoryScene";

function MaskedLine({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`block overflow-hidden pb-[0.09em] ${className}`}>
      <span className="block will-change-transform" data-movement-opening-line>{children}</span>
    </span>
  );
}

export function MovementContent() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 px-5 pb-7 pt-20 md:px-10 md:pb-10 md:pt-24 lg:px-16">
      <div className="flex items-center justify-between border-b border-bone/12 pb-4 font-mono text-[8px] tracking-[0.22em] text-bone/42 md:text-[9px]">
        <p><span className="mr-3 text-red-flag">03</span>SECTION</p>
        <p>GERAK KITA</p>
      </div>

      <p
        className="absolute left-5 top-[48%] max-w-[20ch] -translate-y-1/2 font-mono text-[8px] uppercase tracking-[0.24em] text-bone/44 opacity-0 md:left-10 md:text-[9px] lg:left-16"
        data-movement-seed-copy
      >
        SATU GARIS. SATU ARAH AWAL.
      </p>

      <article className="absolute inset-x-5 bottom-10 top-36 flex flex-col justify-center md:inset-x-10 md:bottom-12 md:top-40 lg:inset-x-16" data-movement-opening>
        <p className="mb-6 font-mono text-[8px] tracking-[0.25em] text-bone/44 md:text-[9px]" data-movement-opening-eyebrow>
          MELANJUTKAN PERJALANAN
        </p>
        <h2 className="max-w-[9ch] text-[clamp(3.7rem,10.8vw,10.5rem)] font-semibold uppercase leading-[0.78] tracking-[-0.082em]">
          <MaskedLine>INDONESIA</MaskedLine>
          <MaskedLine className="text-red-flag"><span data-movement-terus>TERUS</span></MaskedLine>
          <MaskedLine><span data-movement-bergerak>BERGERAK.</span></MaskedLine>
        </h2>
      </article>

      <article className="absolute inset-x-5 bottom-10 top-36 flex items-center justify-center text-center opacity-0 md:inset-x-10 md:bottom-12 md:top-40 lg:inset-x-16" data-movement-millions>
        <div>
          <p className="mb-7 font-mono text-[8px] tracking-[0.24em] text-bone/42 md:text-[9px]">BUKAN SATU TOKOH. BUKAN SATU TEMPAT.</p>
          <p className="text-[clamp(2rem,5.7vw,6.2rem)] font-medium uppercase leading-[0.9] tracking-[-0.058em]">
            TETAPI KARENA<br />
            <span className="block overflow-hidden pb-[0.08em] text-red-flag"><span className="block" data-movement-million-line>JUTAAN GERAK</span></span>
            YANG TERJADI BERSAMA.
          </p>
        </div>
      </article>

      <HumanStoryScene />

      <div className="absolute inset-x-5 bottom-10 top-36 flex items-center opacity-0 md:inset-x-10 md:bottom-12 md:top-40 lg:inset-x-16" data-movement-directions>
        <div className="w-full">
          <p className="font-mono text-[8px] tracking-[0.24em] text-bone/42 md:text-[9px]">ARAH YANG BERBEDA</p>
          <div className="mt-6 grid grid-cols-2 gap-y-4 border-y border-bone/14 py-5 font-mono text-[9px] uppercase tracking-[0.2em] text-bone/58 md:grid-cols-4 md:text-[10px]">
            <p>DESA → KOTA</p><p className="text-right md:text-left">DARAT → LAUT</p>
            <p>PAGI → MALAM</p><p className="text-right">KINI → NANTI</p>
          </div>
          <p className="mt-6 ml-auto max-w-[24ch] text-right text-[clamp(1.55rem,3.2vw,3.4rem)] font-medium uppercase leading-[0.96] tracking-[-0.04em]">
            BERBEDA JALAN.<br /><span className="text-red-flag">SATU MOMENTUM.</span>
          </p>
        </div>
      </div>

      <div className="absolute inset-x-5 bottom-10 top-36 flex items-center justify-center text-center opacity-0 md:inset-x-10 md:bottom-12 md:top-40 lg:inset-x-16" data-movement-together>
        <p className="uppercase leading-[0.76] tracking-[-0.085em]">
          <span className="block text-[clamp(2.8rem,7vw,7rem)] font-medium">YANG BERGERAK</span>
          <span className="block overflow-hidden pb-[0.12em] pt-[0.05em] text-[clamp(5rem,16vw,15.5rem)] font-semibold text-red-flag">
            <span className="block" data-movement-together-word>BERSAMA.</span>
          </span>
        </p>
      </div>

      <div className="absolute inset-x-5 bottom-10 top-36 flex items-end justify-between opacity-0 md:inset-x-10 md:bottom-12 md:top-40 lg:inset-x-16" data-movement-pulse-copy>
        <p className="font-mono text-[8px] tracking-[0.24em] text-bone/48 md:text-[9px]">SATU DENYUT MENERUSKAN PERJALANAN</p>
        <p className="hidden font-mono text-[8px] tracking-[0.24em] text-red-flag/75 md:block md:text-[9px]">03 → 04</p>
      </div>

      <div className="absolute inset-x-5 bottom-7 flex justify-between border-t border-bone/12 pt-3 font-mono text-[7px] tracking-[0.2em] text-bone/40 md:inset-x-10 md:bottom-10 md:text-[8px] lg:inset-x-16">
        <p>KEMAJUAN LAHIR DARI GERAK SEHARI-HARI</p>
        <p className="hidden md:block">INDONESIA TIDAK PERNAH DIAM</p>
      </div>
    </div>
  );
}

export function ReducedMovementContent() {
  return (
    <section id="movement" aria-label="Indonesia terus bergerak" className="bg-night px-5 py-24 text-bone md:px-10 md:py-32 lg:px-16">
      <div className="flex items-center justify-between border-b border-bone/15 pb-4 font-mono text-[9px] tracking-[0.2em] text-bone/45">
        <p><span className="mr-3 text-red-flag">03</span>SECTION</p><p>GERAK KITA</p>
      </div>

      <h2 className="py-24 text-[clamp(3.8rem,10vw,9rem)] font-semibold uppercase leading-[0.78] tracking-[-0.078em]">
        INDONESIA<br /><span className="text-red-flag">TERUS</span><br />BERGERAK.
      </h2>

      <p className="border-y border-bone/15 py-20 text-center text-[clamp(1.7rem,4.5vw,4.5rem)] font-medium uppercase leading-[0.96] tracking-[-0.045em]">
        TETAPI KARENA <span className="text-red-flag">JUTAAN GERAK</span><br />YANG TERJADI BERSAMA.
      </p>

      <ReducedHumanStories />

      <p className="pt-28 text-center uppercase leading-[0.78] tracking-[-0.08em]">
        <span className="block text-[clamp(2.6rem,6vw,6rem)]">YANG BERGERAK</span>
        <span className="block text-[clamp(4.8rem,15vw,14rem)] font-semibold text-red-flag">BERSAMA.</span>
      </p>
    </section>
  );
}
