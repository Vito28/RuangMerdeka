import { COLLECTIVE_VOICES } from "./data/curated-voices";

export function ReducedCollectiveVoice({ hasUserSignal }: { hasUserSignal: boolean }) {
  return (
    <section id="collective-voice" aria-label="Suara kita" className="relative overflow-hidden bg-night px-5 py-24 text-bone md:px-10 lg:px-16">
      <div aria-hidden="true" className="absolute inset-x-0 top-20 h-px bg-gradient-to-r from-transparent via-red-flag/26 to-transparent" />
      <p className="font-mono text-[9px] tracking-[0.24em] text-bone/42"><span className="text-red-highlight">07</span> ── SUARA KITA</p>
      {hasUserSignal && <span aria-hidden="true" className="mt-12 block size-2 rounded-full bg-red-highlight shadow-[0_0_18px_rgba(255,27,49,0.34)]" />}
      <div className="mt-24 grid gap-20 md:grid-cols-2">
        {COLLECTIVE_VOICES.map((voice) => (
          <article key={voice.id}>
            <p className="font-mono text-[8px] tracking-[0.2em] text-bone/34">SUARA / {voice.index}</p>
            <p className="mt-4 text-3xl font-medium uppercase leading-[0.9] tracking-[-0.05em] md:text-5xl">
              {voice.lines.map((line) => <span key={line} className="block">{line}</span>)}
            </p>
          </article>
        ))}
      </div>
      <h2 className="mt-36 text-[clamp(3.5rem,10vw,9rem)] font-semibold uppercase leading-[0.8] tracking-[-0.08em]">
        MERDEKA BUKAN<br /><span className="text-red-highlight">SATU SUARA.</span>
      </h2>
      <p className="mt-28 text-[clamp(3rem,9vw,8rem)] font-semibold uppercase leading-[0.8] tracking-[-0.08em]">
        MERDEKA ADALAH<br /><span className="text-red-highlight">RUANG</span><br />UNTUK SEMUANYA.
      </p>
      <p className="mt-28 text-[clamp(3rem,9vw,8rem)] font-semibold uppercase leading-[0.8] tracking-[-0.08em]">
        TAPI SATU<br />PERJALANAN<br /><span className="text-red-highlight">BERSAMA.</span>
      </p>
      <div aria-hidden="true" className="mt-28 h-px w-full bg-gradient-to-r from-transparent via-bone/52 to-transparent" />
    </section>
  );
}
