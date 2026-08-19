import Image from "next/image";
import type { YearMemory } from "./types";

export function ReducedYearMemory({ memories }: { memories: readonly YearMemory[] }) {
  return (
    <section id="year-memory" aria-label="Tahun yang kita jalani" className="bg-night px-5 py-24 text-bone md:px-10 md:py-32 lg:px-16">
      <div className="py-16 md:py-24">
        <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-bone/48">Tahun yang kita jalani</p>
        <h2 className="mt-5 px-2 text-[clamp(5.25rem,27vw,25rem)] font-semibold leading-[0.78] tracking-[-0.09em] md:px-0 md:leading-[0.72] md:tracking-[-0.1em]">2026</h2>
        <p className="mt-10 max-w-xl text-[clamp(1.8rem,4vw,4rem)] font-medium uppercase leading-[0.94] tracking-[-0.055em]">
          Ada tahun yang kita rayakan. Ada pula yang harus kita <span className="text-red-flag">ingat.</span>
        </p>
      </div>

      <div className="flex flex-col gap-28 md:gap-36">
        {memories.map((memory) => (
          <article key={memory.id}>
            <div className="relative aspect-[4/5] overflow-hidden bg-black md:aspect-video">
              <Image src={memory.image} alt={memory.alt} fill sizes="100vw" className={`object-cover ${memory.objectPosition}`} />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
            </div>
            <div className="mt-5 md:flex md:items-start md:justify-between md:gap-12">
              <p className="font-mono text-[8px] uppercase leading-relaxed tracking-[0.2em] text-bone/46 md:w-56 md:text-[9px]">
                <span className="text-red-flag">{memory.index}</span> / {memory.date}<br />{memory.location}
              </p>
              <h3 className="mt-6 max-w-3xl text-[clamp(2.5rem,6vw,6rem)] font-semibold uppercase leading-[0.84] tracking-[-0.07em] md:mt-0 md:text-right">
                {memory.headline.join(" ")}
              </h3>
            </div>
          </article>
        ))}
      </div>

      <div className="flex min-h-[55svh] flex-col justify-end pb-8 pt-32">
        <span aria-hidden="true" className="size-2.5 rounded-full bg-red-flag" />
        <p className="mt-7 font-mono text-[9px] uppercase leading-relaxed tracking-[0.23em] text-bone/48">Setelah semua<br />yang kita jalani...</p>
      </div>
    </section>
  );
}
