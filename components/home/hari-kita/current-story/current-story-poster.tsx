import type { CSSProperties, MouseEvent } from "react";
import Link from "next/link";
import type { ActiveStory } from "@/lib/home/story-calendar";

type CurrentStoryPosterProps = {
  story: ActiveStory;
  onEnter: (event: MouseEvent<HTMLAnchorElement>) => void;
};

const particles = Array.from({ length: 42 }, (_, index) => ({
  left: (index * 37 + 11) % 100,
  top: (index * 61 + 17) % 100,
  size: 2 + ((index * 7) % 6),
  depth: 0.35 + ((index * 13) % 60) / 100,
  accent: index % 3 !== 1,
}));

function Paperclip() {
  return (
    <svg aria-hidden="true" viewBox="0 0 34 86" className="h-16 w-7 rotate-[8deg] drop-shadow-[2px_3px_2px_rgba(29,28,26,0.2)] md:h-20">
      <path d="M24 8C11 3 4 13 7 25l9 39c2 9 13 8 11-2L18 24c-1-5-7-4-6 2l8 34" fill="none" stroke="#7A7A73" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M23 9c-3-1-6-1-8 0" stroke="#D7D4CA" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function CurrentStoryPoster({ story, onEnter }: CurrentStoryPosterProps) {
  const theme = {
    "--story-accent": story.palette.accent,
    "--story-soft": story.palette.accentSoft,
    "--story-glow": story.palette.glow,
  } as CSSProperties;

  return (
    <div data-story-poster className="absolute left-1/2 top-1/2 z-20 w-[88vw] -translate-x-1/2 -translate-y-1/2 md:w-[min(64vw,54rem)] lg:w-[min(58vw,56rem)]" style={theme}>
      <div data-story-tilt className="relative [transform-style:preserve-3d]">
        <div data-story-shadow aria-hidden="true" className="absolute inset-3 translate-x-4 translate-y-7 bg-hari-ink/24 blur-xl" />

        <article data-story-paper className="relative bg-[#fffaf0] p-2.5 shadow-[0_35px_80px_rgba(68,45,28,0.28),0_4px_10px_rgba(68,45,28,0.16)] md:p-4">
          <div data-story-tape aria-hidden="true" className="absolute -top-4 left-[13%] z-20 h-8 w-28 -rotate-3 bg-[#d7c59d]/85 shadow-[0_2px_5px_rgba(68,45,28,0.12)] [clip-path:polygon(2%_8%,98%_0,96%_94%,4%_100%)] md:h-10 md:w-36" />
          <div data-story-tape aria-hidden="true" className="absolute -bottom-3 right-[12%] z-20 h-7 w-24 rotate-2 bg-[#cbbfa5]/78 shadow-[0_2px_5px_rgba(68,45,28,0.12)] [clip-path:polygon(5%_0,100%_9%,96%_100%,0_86%)] md:w-32" />
          <div data-story-paperclip className="absolute -right-3 -top-7 z-30"><Paperclip /></div>

          <div
            data-story-screen
            className="group relative aspect-[16/10] overflow-hidden bg-[#080808] text-[#f8f3ea]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 73% 28%, color-mix(in srgb, var(--story-glow) 22%, transparent), transparent 29%), radial-gradient(circle at 18% 86%, color-mix(in srgb, var(--story-accent) 24%, transparent), transparent 32%), linear-gradient(145deg, #11100f, #050505 68%)",
            }}
          >
            <div aria-hidden="true" className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:4.5rem_4.5rem]" />
            <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
              {particles.map((particle, index) => (
                <span
                  key={index}
                  data-story-particle
                  data-depth={particle.depth}
                  className="absolute rounded-full shadow-[0_0_12px_currentColor]"
                  style={{
                    left: `${particle.left}%`,
                    top: `${particle.top}%`,
                    width: particle.size,
                    height: particle.size,
                    opacity: 0.22 + particle.depth * 0.52,
                    color: particle.accent ? "var(--story-accent)" : "var(--story-soft)",
                    backgroundColor: "currentColor",
                  }}
                />
              ))}
            </div>

            <div data-cursor-thread aria-hidden="true" className="absolute left-0 top-0 h-px w-28 origin-left bg-[var(--story-accent)] opacity-0" />
            <div aria-hidden="true" className="absolute -right-[12%] top-[24%] size-[43%] rounded-full border border-[var(--story-accent)]/30" />
            <div aria-hidden="true" className="absolute -right-[4%] top-[32%] size-[27%] rounded-full border border-[#f8f3ea]/15" />

            <div className="relative z-10 flex h-full flex-col justify-between p-5 md:p-8 lg:p-10">
              <div className="flex items-start justify-between font-mono text-[0.46rem] uppercase tracking-[0.2em] text-[#f8f3ea]/55 md:text-[0.55rem]">
                <p>HK / {story.year} / {String(story.day).padStart(2, "0")}-{String(story.month).padStart(2, "0")}</p>
                <p>{story.region}</p>
              </div>

              <div data-portal-copy>
                <div className="mb-3 flex items-center gap-3 md:mb-5">
                  <span className="h-px w-8 bg-[var(--story-accent)] md:w-12" />
                  <p className="font-mono text-[0.45rem] uppercase tracking-[0.2em] text-[var(--story-soft)] md:text-[0.55rem]">{story.name}</p>
                </div>
                <h2 className="text-[clamp(2.7rem,7vw,7rem)] font-semibold uppercase leading-[0.76] tracking-[-0.075em]">
                  <span className="block">{story.headline[0]}</span>
                  <span className="block text-[var(--story-accent)]">{story.headline[1]}</span>
                </h2>
                <p className="mt-4 max-w-md text-[0.66rem] leading-5 text-[#f8f3ea]/58 md:mt-6 md:text-sm md:leading-6">
                  {story.summary}
                </p>
              </div>

              <div className="flex items-end justify-between gap-4">
                <p className="hidden font-mono text-[0.46rem] uppercase leading-5 tracking-[0.16em] text-[#f8f3ea]/40 sm:block">
                  Visual / Interactive<br />Story length {story.duration}
                </p>
                {story.href ? (
                  <Link
                    href={story.href}
                    onClick={onEnter}
                    data-portal-cta
                    className="group/link ml-auto flex min-h-11 items-center gap-4 border-b border-[var(--story-accent)] pb-1 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#f8f3ea] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--story-accent)] md:text-[0.68rem]"
                  >
                    Masuk ke cerita
                    <span aria-hidden="true" className="text-lg text-[var(--story-accent)] transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1">↗</span>
                  </Link>
                ) : (
                  <p data-portal-cta className="ml-auto border-b border-[#f8f3ea]/25 pb-2 font-mono text-[0.5rem] uppercase tracking-[0.18em] text-[#f8f3ea]/48">
                    Cerita sedang disiapkan
                  </p>
                )}
              </div>
            </div>
          </div>

          <span aria-hidden="true" className="absolute bottom-0 right-0 size-9 bg-[linear-gradient(135deg,rgba(226,215,198,0)_48%,#d8ccba_50%,#fffaf0_78%)] shadow-[-4px_-4px_7px_rgba(46,34,23,0.12)]" />
        </article>
      </div>
    </div>
  );
}
