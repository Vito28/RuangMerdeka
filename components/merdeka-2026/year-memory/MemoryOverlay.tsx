import type { YearMemory } from "./types";
import { DateField } from "./ui/DateField";
import { MemoryStamp } from "./ui/MemoryStamp";

const placementStyles = {
  left: "items-start text-left",
  right: "items-end text-right",
  center: "items-center text-center",
} as const;

const everydayWords = [
  ["BEKERJA", "left-[7%] top-[27%]"],
  ["BELAJAR", "right-[9%] top-[34%]"],
  ["PULANG", "left-[18%] bottom-[26%]"],
  ["MENOLONG", "right-[18%] bottom-[22%]"],
  ["BERTUMBUH", "left-[47%] top-[17%]"],
] as const;

function OpeningChapter() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 px-5 text-bone md:px-10 lg:px-16">
      <div data-year-kicker className="absolute left-5 top-[18%] opacity-0 md:left-10 md:top-[15%] lg:left-16">
        <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-bone/48 md:text-[10px]">Tahun yang kita jalani</p>
      </div>

      <div data-year-number className="absolute inset-x-[3vw] top-1/2 flex -translate-y-1/2 items-center justify-center p-[0.08em] text-center opacity-0">
        <p aria-label="Tahun 2026" className="px-2 text-[clamp(5.25rem,27vw,25rem)] font-semibold leading-[0.9] tracking-[-0.08em] text-[#f2efe9] md:px-0">
          <span aria-hidden="true">20</span><span aria-hidden="true" className="relative">26<span data-year-red-light className="absolute inset-y-0 left-0 w-[18%] bg-red-flag/25 blur-xl" /></span>
        </p>
      </div>

      <div data-year-copy="celebrate" className="absolute bottom-[17%] left-5 max-w-[13rem] opacity-0 md:left-10 md:max-w-sm lg:left-16">
        <p className="text-[clamp(1.65rem,4vw,4.25rem)] font-medium uppercase leading-[0.92] tracking-[-0.055em]">ADA TAHUN<br />YANG KITA RAYAKAN.</p>
      </div>
      <div data-year-copy="remember" className="absolute bottom-[17%] left-5 max-w-[14rem] text-left opacity-0 md:left-10 md:max-w-sm lg:left-16">
        <p className="text-[clamp(1.65rem,4vw,4.25rem)] font-medium uppercase leading-[0.92] tracking-[-0.055em]">ADA PULA<br />YANG HARUS KITA <span className="text-red-flag">INGAT.</span></p>
      </div>
    </div>
  );
}

function MemoryCopy({ memory }: { memory: YearMemory }) {
  const compact = memory.id === "together" || memory.id === "everyday";

  return (
    <div
      data-memory-copy={memory.id}
      className={`pointer-events-none absolute inset-x-5 bottom-[9%] z-20 flex flex-col opacity-0 md:inset-x-10 md:bottom-[10%] lg:inset-x-16 ${placementStyles[memory.placement]}`}
    >
      <MemoryStamp id={memory.id} index={memory.index} date={memory.date} label={memory.label} location={memory.location} />
      <h3 className={`mt-6 max-w-[13ch] font-semibold uppercase tracking-[-0.075em] ${compact ? "text-[clamp(2.05rem,5.8vw,6rem)] leading-[0.86]" : "text-[clamp(3rem,7.5vw,7.8rem)] leading-[0.8]"}`}>
        {memory.headline.map((line, index) => (
          <span key={line} className="block overflow-hidden pb-[0.06em]">
            <span data-memory-line={memory.id} className={`block ${memory.accentLine === index ? "text-red-flag" : ""}`}>{line}</span>
          </span>
        ))}
      </h3>
      {memory.supporting && (
        <p className="mt-5 max-w-[34rem] font-mono text-[8px] uppercase leading-[1.8] tracking-[0.17em] text-bone/62 md:text-[10px]">
          {memory.supporting.map((line) => <span key={line} className="block">{line}</span>)}
        </p>
      )}
    </div>
  );
}

export function MemoryOverlay({ memories }: { memories: readonly YearMemory[] }) {
  const ntt = memories[0];

  return (
    <>
      <OpeningChapter />

      <div className="pointer-events-none absolute inset-x-5 top-[12%] z-20 md:inset-x-10 lg:inset-x-16">
        <DateField id={ntt.id} date={ntt.date} />
      </div>

      <div data-memory-81 className="pointer-events-none absolute inset-0 z-10 grid place-items-center opacity-0">
        <span className="text-[clamp(14rem,48vw,46rem)] font-semibold leading-none tracking-[-0.12em] text-bone/[0.09]">81</span>
      </div>

      {memories.map((memory) => <MemoryCopy key={memory.id} memory={memory} />)}

      <div data-everyday-words aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 opacity-0">
        {everydayWords.map(([word, placement]) => (
          <span key={word} data-everyday-word className={`absolute ${placement} font-mono text-[7px] tracking-[0.22em] text-bone/36 md:text-[9px]`}>
            {word}
          </span>
        ))}
      </div>

      <div data-archive-dates aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 opacity-0 font-mono text-[8px] tracking-[0.2em] text-bone/28 md:text-[10px]">
        <span data-date-fragment className="absolute left-[12%] top-[21%] blur-[0.7px]">15.08</span>
        <span data-date-fragment className="absolute right-[16%] top-[31%]">17.08</span>
        <span data-date-fragment className="absolute bottom-[23%] left-[24%] blur-[1px]">28.03</span>
        <span data-date-fragment className="absolute bottom-[17%] right-[12%]">2026</span>
      </div>

      <div data-section-six-handoff className="pointer-events-none absolute inset-x-5 bottom-[14%] z-20 opacity-0 md:inset-x-10 lg:inset-x-16">
        <p className="font-mono text-[8px] uppercase leading-[1.7] tracking-[0.24em] text-bone/48 md:text-[10px]">
          SETELAH SEMUA<br />YANG KITA JALANI...
        </p>
      </div>
    </>
  );
}
