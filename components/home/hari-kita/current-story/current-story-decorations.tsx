import Image from "next/image";
import type { ActiveStory } from "@/lib/home/story-calendar";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export function StoryBoardBackground({ story }: { story: ActiveStory }) {
  return (
    <>
      <div aria-hidden="true" className="hari-paper-grain pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply" />
      <p data-board-year aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[48%] font-display text-[clamp(15rem,43vw,42rem)] leading-none tracking-[-0.09em] text-transparent [-webkit-text-stroke:1px_rgba(29,28,26,0.1)]">
        {story.year}
      </p>
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1600 900" fill="none" preserveAspectRatio="xMidYMid slice">
        <path data-story-thread pathLength="1" d="M-60 166C218 190 276 84 493 139C720 197 833 277 1015 231C1199 185 1375 72 1672 158" stroke="var(--story-accent)" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M-55 700C305 668 407 793 698 732C1020 665 1128 539 1652 620" stroke="#1D1C1A" strokeWidth="1" strokeDasharray="7 12" opacity=".18" />
        <circle cx="497" cy="140" r="5" fill="#EEE8DE" stroke="var(--story-accent)" strokeWidth="2" />
        <circle cx="1017" cy="231" r="5" fill="#EEE8DE" stroke="var(--story-accent)" strokeWidth="2" />
        <text x="463" y="123" fill="#1D1C1A" fontSize="13" fontFamily="monospace" letterSpacing="3" opacity=".34">1945</text>
        <text x="1034" y="214" fill="#1D1C1A" fontSize="13" fontFamily="monospace" letterSpacing="3" opacity=".34">{story.year}</text>
      </svg>
    </>
  );
}

export function StoryBoardDecorations({ story }: { story: ActiveStory }) {
  return (
    <>
      <div data-story-label className="absolute left-5 top-8 z-10 md:left-10 md:top-10 lg:left-16">
        <div className="flex items-center gap-3">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--story-accent)] opacity-45 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-[var(--story-accent)]" />
          </span>
          <p className="font-mono text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-[var(--story-accent)]">{story.eyebrow}</p>
        </div>
        <p className="mt-3 font-mono text-[0.48rem] uppercase tracking-[0.18em] text-hari-ink/44">{story.dateLabel}</p>
        <span className="mt-4 block h-px w-28 bg-hari-ink/25 md:w-44" />
      </div>

      <div data-calendar-tear className="absolute bottom-[12%] left-[4%] z-10 hidden -rotate-6 bg-[#fffaf0] px-5 py-4 text-hari-ink shadow-[0_20px_45px_rgba(68,45,28,0.18)] md:block lg:left-[7%]">
        <span aria-hidden="true" className="absolute inset-x-0 -top-1 h-2 bg-[radial-gradient(circle_at_4px_0,transparent_4px,#fffaf0_4.5px)] bg-[length:12px_8px]" />
        <p className="font-mono text-[0.52rem] tracking-[0.22em] text-[var(--story-accent)]">{MONTHS[story.month - 1]}</p>
        <p className="mt-2 font-display text-6xl font-semibold leading-[0.7]">{story.day}</p>
        <p className="mt-4 border-t border-hari-ink/18 pt-2 font-mono text-[0.48rem] tracking-[0.2em] text-hari-ink/48">{story.year}</p>
      </div>

      <div data-photo-strip className="absolute right-[3%] top-[16%] z-10 hidden w-24 rotate-3 bg-[#171614] p-2 pb-4 shadow-[0_25px_55px_rgba(68,45,28,0.26)] md:block lg:right-[6%] lg:w-28">
        {[
          ["/2026/17-08/section-04/images/generation.webp", "Generasi"],
          ["/2026/17-08/section-04/images/connectivity.webp", "Koneksi"],
          ["/2026/17-08/section-04/images/transition-city.webp", "Kota"],
        ].map(([src, alt]) => (
          <div key={src} className="relative mb-2 aspect-[4/3] overflow-hidden bg-hari-ink last:mb-0">
            <Image src={src} alt={alt} fill sizes="7rem" className="object-cover grayscale-[.2]" />
          </div>
        ))}
        <p className="mt-3 text-center font-mono text-[0.38rem] tracking-[0.2em] text-[#f8f3ea]/52">HK · ARCHIVE</p>
      </div>

      <div data-story-note className="absolute right-[5%] top-[68%] z-10 hidden rotate-[-5deg] lg:block">
        <p className="font-display text-2xl italic text-hari-ink/54">{story.id === "kemerdekaan" ? `${story.year - 1945} tahun.` : "kisah tahun ini."}</p>
        <svg aria-hidden="true" className="ml-3 mt-1 h-9 w-24" viewBox="0 0 96 36" fill="none">
          <path d="M2 4c29 1 51 10 82 25" stroke="var(--story-accent)" strokeWidth="1.4" strokeLinecap="round" />
          <path d="m76 28 10 2-3-9" stroke="var(--story-accent)" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>

      <div data-story-metadata className="absolute bottom-7 right-5 z-10 flex gap-8 border-t border-hari-ink/20 pt-3 font-mono text-[0.44rem] uppercase leading-5 tracking-[0.16em] text-hari-ink/48 md:bottom-10 md:right-10 md:text-[0.5rem] lg:right-16">
        <p>{story.name}<br />{story.numericDate}<br />{story.region}</p>
        <p>Story length<br />{story.duration}<br />Visual / Interactive</p>
      </div>

      <div data-story-stamp className="absolute bottom-[8%] left-[19%] hidden -rotate-6 border-2 border-[var(--story-accent)]/55 px-3 py-2 font-mono text-[0.48rem] font-semibold uppercase tracking-[0.18em] text-[var(--story-accent)]/70 md:block">
        Hari Kita · Archive / {story.year}
      </div>
    </>
  );
}
