import type { CSSProperties } from "react";
import { HUMAN_STORIES, type HumanStoryLayout } from "../data/human-stories";
import { CharacterVector } from "./characters";

const layoutClasses: Record<HumanStoryLayout, { character: string; copy: string }> = {
  "text-left": {
    character: "left-1/2 top-[8%] -translate-x-1/2 md:left-auto md:right-[3%] md:top-1/2 md:-translate-y-1/2 md:translate-x-0",
    copy: "left-0 bottom-[7%] text-left md:bottom-auto md:top-1/2 md:w-[46%] md:-translate-y-1/2",
  },
  "text-right": {
    character: "left-1/2 top-[7%] -translate-x-1/2 md:left-[3%] md:top-1/2 md:-translate-y-1/2",
    copy: "right-0 bottom-[7%] text-right md:bottom-auto md:top-1/2 md:w-[46%] md:-translate-y-1/2",
  },
  "text-low-left": {
    character: "left-1/2 top-[5%] -translate-x-1/2 md:left-auto md:right-[9%] md:top-[42%] md:-translate-y-1/2 md:translate-x-0",
    copy: "left-0 bottom-[6%] text-left md:bottom-[7%] md:w-[50%]",
  },
  "text-high-right": {
    character: "left-1/2 top-[8%] -translate-x-1/2 md:left-[8%] md:top-[57%] md:-translate-y-1/2",
    copy: "right-0 bottom-[7%] text-right md:bottom-auto md:top-[24%] md:w-[48%]",
  },
};

function storyStyle(primary: string, secondary: string, accent: string) {
  return {
    "--story-primary": primary,
    "--story-secondary": secondary,
    "--story-accent": accent,
  } as CSSProperties;
}

export function HumanStoryScene() {
  return (
    <ol className="absolute inset-x-5 bottom-10 top-36 md:inset-x-10 md:bottom-12 md:top-40 lg:inset-x-16" aria-label="Kisah gerak manusia Indonesia">
      {HUMAN_STORIES.map((story, index) => {
        const layout = layoutClasses[story.layout];
        const trajectory = index % 2 === 0
          ? "M10 330C180 330 210 120 450 188S760 392 990 228"
          : "M990 330C820 330 790 120 550 188S240 392 10 228";
        return (
          <li
            key={story.motif}
            className={`absolute inset-0 opacity-0 ${index >= 4 ? "hidden md:block" : "block"}`}
            data-movement-story={index}
            data-story-motif={story.motif}
            style={storyStyle(story.palette.primary, story.palette.secondary, story.palette.accent)}
          >
            <svg className="absolute inset-0 size-full overflow-visible" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
              <path
                data-story-trajectory
                d={trajectory}
                fill="none"
                stroke="var(--story-accent)"
                strokeOpacity="0.42"
                strokeWidth="1.4"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset="1"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            <div className={`absolute ${layout.character}`} data-movement-character>
              <CharacterVector
                motif={story.motif}
                data-character-svg
                className="h-[min(42vh,29rem)] w-auto max-w-[88vw] overflow-visible md:h-[min(44vh,32rem)] md:max-w-[44vw]"
              />
            </div>

            <div className={`absolute w-full ${layout.copy}`} data-movement-story-copy>
              <p className="mb-2 font-mono text-[8px] tracking-[0.22em] text-bone/56 md:text-[9px]">
                <span className="text-red-flag">{story.index}</span>
                <span className="mx-2 text-bone/22">/</span>
                {story.category}
              </p>
              <p className="mb-4 font-mono text-[7px] tracking-[0.2em] text-bone/34 md:text-[8px]">{story.microcopy}</p>
              <p className={`text-[clamp(3rem,6.5vw,7rem)] font-semibold uppercase leading-[0.86] tracking-[-0.06em] ${index % 2 === 0 ? "max-w-[10ch]" : "ml-auto max-w-[10ch]"}`}>
                {story.label.slice(0, -1)}<span className="text-red-flag">.</span>
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function ReducedHumanStories() {
  return (
    <ol className="divide-y divide-bone/15 border-y border-bone/15">
      {HUMAN_STORIES.map((story, index) => (
        <li
          key={story.motif}
          className="grid items-center gap-8 py-14 md:grid-cols-2 md:gap-14"
          style={storyStyle(story.palette.primary, story.palette.secondary, story.palette.accent)}
        >
          <CharacterVector
            motif={story.motif}
            className={`mx-auto h-72 w-auto max-w-full [&_[data-character-draw]]:[stroke-dashoffset:0] [&_[data-creator-connection]]:[stroke-dashoffset:0] [&_[data-guardian-flow]_path]:[stroke-dashoffset:0] [&_[data-dreamer-constellation]_path]:[stroke-dashoffset:0] ${index % 2 === 1 ? "md:order-2" : ""}`}
          />
          <div className={index % 2 === 1 ? "md:text-right" : ""}>
            <p className="mb-3 font-mono text-[8px] tracking-[0.2em] text-bone/48">
              <span className="text-red-flag">{story.index}</span><span className="mx-2 text-bone/25">/</span>{story.category}
            </p>
            <p className="mb-5 font-mono text-[8px] tracking-[0.18em] text-bone/34">{story.microcopy}</p>
            <p className="text-[clamp(2.6rem,5vw,5rem)] font-semibold uppercase leading-[0.86] tracking-[-0.06em]">{story.label}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
