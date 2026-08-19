import { COLLECTIVE_VOICES } from "../data/curated-voices";

const entryFragments = [
  ["AMAN", "left-[12%] top-[23%]"],
  ["—", "left-[31%] top-[39%] text-red-highlight/62"],
  ["·", "right-[24%] top-[21%] text-red-highlight"],
  ["PULANG", "right-[9%] top-[43%]"],
  ["—", "left-[17%] bottom-[29%]"],
  ["BELAJAR", "right-[27%] bottom-[20%]"],
  ["·", "left-[48%] bottom-[13%] text-red-highlight"],
  ["BERBEDA", "right-[7%] bottom-[34%]"],
] as const;

const horizonWords = [
  ["AMAN", "left-[12%] top-[44%]"],
  ["BELAJAR", "left-[31%] top-[47%]"],
  ["PULANG", "right-[30%] top-[45%]"],
  ["BERBEDA", "right-[11%] top-[48%]"],
] as const;

export function CollectiveVoiceOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <div data-collective-chapter className="absolute left-5 top-[12%] flex items-center gap-3 opacity-0 md:left-10 lg:left-16">
        <span className="font-mono text-[9px] tracking-[0.24em] text-red-highlight md:text-[10px]">07</span>
        <span className="h-px w-12 bg-bone/28" />
        <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-bone/42 md:text-[10px]">SUARA KITA</span>
      </div>

      <div data-collective-entry aria-hidden="true" className="absolute inset-0 opacity-0">
        {entryFragments.map(([fragment, placement], index) => (
          <span
            key={`${fragment}-${index}`}
            data-entry-fragment
            className={`absolute ${placement} font-mono text-[7px] uppercase tracking-[0.22em] text-bone/36 md:text-[9px]`}
          >
            {fragment}
          </span>
        ))}
      </div>

      {COLLECTIVE_VOICES.map((voice, index) => (
        <article
          key={voice.id}
          data-voice-selection={index}
          className={`absolute flex max-w-[88vw] flex-col opacity-0 ${voice.placement} md:max-w-[68vw]`}
        >
          <div className="mb-5 flex items-center gap-3 font-mono text-[8px] tracking-[0.22em] text-bone/38 md:text-[9px]">
            <span data-selected-signal className={`size-1.5 rounded-full ${voice.accent ? "bg-red-highlight" : "bg-bone/62"}`} />
            <span data-selected-dash className="h-px w-10 bg-bone/24" />
            <span>SUARA / {voice.index}</span>
          </div>
          <div data-selected-voice-copy>
            <p className="mb-3 font-mono text-[7px] uppercase tracking-[0.2em] text-bone/34 md:text-[9px]">MERDEKA ADALAH</p>
            <h3 className="text-[clamp(2.45rem,7vw,7.4rem)] font-medium uppercase leading-[0.83] tracking-[-0.07em]">
              {voice.lines.map((line, lineIndex) => (
                <span key={line} className="block overflow-hidden pb-[0.05em]">
                  <span data-selected-voice-line className={`block ${lineIndex === voice.lines.length - 1 ? "text-red-highlight" : ""}`}>{line}</span>
                </span>
              ))}
            </h3>
          </div>
          <span data-selected-resonance aria-hidden="true" className="mt-5 h-px w-[min(62vw,34rem)] bg-gradient-to-r from-bone/45 via-red-flag/28 to-transparent" />
        </article>
      ))}

      <p data-landscape-caption className="absolute left-1/2 top-[18%] -translate-x-1/2 text-center font-mono text-[8px] uppercase leading-[1.8] tracking-[0.24em] text-bone/42 opacity-0 md:text-[10px]">
        SETIAP SUARA<br />MEMILIKI GELOMBANGNYA SENDIRI
      </p>

      <div data-philosophy="different" className="absolute inset-x-5 top-1/2 -translate-y-1/2 opacity-0 md:inset-x-10 lg:inset-x-16">
        <p className="text-[clamp(5rem,18vw,18rem)] font-semibold uppercase leading-[0.76] tracking-[-0.09em]">BERBEDA.</p>
      </div>

      <div data-philosophy="heard" className="absolute inset-x-5 top-1/2 -translate-y-1/2 opacity-0 md:inset-x-10 lg:inset-x-16">
        <p className="text-[clamp(1rem,2vw,1.8rem)] font-medium uppercase tracking-[0.12em] text-bone/48">TETAPI</p>
        <p className="mt-3 text-[clamp(4rem,12vw,12rem)] font-semibold uppercase leading-[0.78] tracking-[-0.085em]">
          <span className="block overflow-hidden"><span data-philosophy-line className="block">TETAP</span></span>
          <span className="block overflow-hidden text-red-highlight"><span data-philosophy-line className="block">DIDENGAR.</span></span>
        </p>
      </div>

      <div data-philosophy="not-one" className="absolute inset-x-5 top-1/2 -translate-y-1/2 opacity-0 md:inset-x-10 lg:inset-x-16">
        <h2 className="text-[clamp(3.5rem,10.5vw,10.5rem)] font-semibold uppercase leading-[0.8] tracking-[-0.08em]">
          <span className="block overflow-hidden"><span data-philosophy-line className="block">MERDEKA BUKAN</span></span>
          <span className="block overflow-hidden"><span data-philosophy-line className="block text-red-highlight">SATU SUARA.</span></span>
        </h2>
      </div>

      <div data-philosophy="space" className="absolute inset-x-5 top-1/2 -translate-y-1/2 opacity-0 md:inset-x-10 lg:inset-x-16">
        <p className="text-[clamp(3.1rem,9.4vw,9.5rem)] font-semibold uppercase leading-[0.8] tracking-[-0.08em]">
          <span className="block overflow-hidden"><span data-philosophy-line className="block">MERDEKA ADALAH</span></span>
          <span className="block overflow-hidden"><span data-philosophy-line className="block text-red-highlight">RUANG</span></span>
          <span className="ml-[8vw] block overflow-hidden md:ml-[19vw]"><span data-philosophy-line className="block">UNTUK SEMUANYA.</span></span>
        </p>
      </div>

      <div data-climax="answer" className="absolute inset-x-5 top-1/2 -translate-y-1/2 opacity-0 md:inset-x-10 lg:inset-x-16">
        <p className="text-[clamp(3.8rem,11vw,11rem)] font-semibold uppercase leading-[0.8] tracking-[-0.08em]">
          <span className="block overflow-hidden"><span data-climax-line className="block">BUKAN SATU</span></span>
          <span className="block overflow-hidden"><span data-climax-line className="block text-red-highlight">JAWABAN.</span></span>
        </p>
      </div>

      <div data-climax="journey" className="absolute inset-x-5 top-1/2 -translate-y-1/2 opacity-0 md:inset-x-10 lg:inset-x-16">
        <p className="text-[clamp(3.6rem,10.8vw,10.8rem)] font-semibold uppercase leading-[0.78] tracking-[-0.085em]">
          <span className="block overflow-hidden"><span data-climax-line className="block">TAPI SATU</span></span>
          <span className="block overflow-hidden"><span data-climax-line className="block">PERJALANAN</span></span>
          <span className="block overflow-hidden"><span data-climax-line className="block text-red-highlight">BERSAMA.</span></span>
        </p>
      </div>

      <div data-horizon-copy aria-hidden="true" className="absolute inset-0 opacity-0">
        {horizonWords.map(([word, placement]) => (
          <span key={word} data-horizon-word className={`absolute ${placement} font-mono text-[7px] tracking-[0.22em] text-bone/36 md:text-[9px]`}>{word}</span>
        ))}
        <span data-horizon-rule className="absolute left-[8%] top-1/2 h-px w-[84%] bg-gradient-to-r from-transparent via-bone/48 to-transparent" />
      </div>

    </div>
  );
}
