import { HUMAN_STORIES } from "./data/human-stories";

const signalPositions = [
  "left-[13%] top-[24%]",
  "left-[34%] top-[38%]",
  "left-[21%] top-[61%]",
  "left-[57%] top-[27%]",
  "left-[68%] top-[57%]",
  "left-[82%] top-[42%]",
] as const;

export function CollectiveMomentum() {
  return (
    <div
      data-movement-collective
      className="pointer-events-none absolute inset-x-5 bottom-10 top-24 opacity-0 md:inset-x-10 md:bottom-12 md:top-28 lg:inset-x-16"
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 size-full overflow-visible"
        viewBox="0 0 1200 620"
        preserveAspectRatio="none"
      >
        {[
          "M72 152 C280 112 428 232 1142 214",
          "M166 238 C354 312 556 140 1144 270",
          "M92 386 C322 330 506 446 1144 318",
          "M394 132 C548 202 730 146 1144 246",
          "M522 430 C712 358 864 382 1144 302",
          "M716 238 C842 184 982 254 1144 270",
        ].map((path, index) => (
          <path
            key={path}
            data-collective-path
            d={path}
            fill="none"
            pathLength="1"
            stroke={index === 3 ? "#e70011" : index % 2 === 0 ? "#f2efe9" : "#6d1019"}
            strokeDasharray="1"
            strokeDashoffset="1"
            strokeOpacity={index === 3 ? 0.54 : 0.17}
            strokeWidth={index === 3 ? 1.5 : 1}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      {signalPositions.map((position, index) => (
        <span
          key={position}
          data-collective-signal
          className={`absolute ${position} size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bone/70 opacity-0 shadow-[0_0_12px_rgba(242,239,233,0.32)] md:size-2`}
          style={index === 3 ? { backgroundColor: "#e70011", boxShadow: "0 0 18px rgba(231,0,17,0.58)" } : undefined}
        />
      ))}

      <aside
        data-movement-index
        aria-label="Jejak gerak hari ini"
        className="absolute bottom-6 left-0 w-48 opacity-0 md:bottom-10 md:w-56"
      >
        <p className="mb-4 font-mono text-[8px] tracking-[0.24em] text-bone/32 md:text-[9px]">GERAK HARI INI</p>
        <div className="flex flex-col gap-1.5">
          {HUMAN_STORIES.map((story) => (
            <p
              key={story.motif}
              data-movement-index-item
              className="font-mono text-[8px] tracking-[0.18em] text-bone/30 opacity-0 md:text-[10px]"
            >
              <span className="mr-3 text-red-flag/70">{story.index}</span>
              {story.label.replace("ADA YANG ", "").replace(".", "")}
            </p>
          ))}
        </div>
      </aside>

      <div className="absolute right-0 top-[18%] max-w-[18rem] text-right md:top-[22%]">
        <p data-movement-bridge-copy className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] text-bone/44 opacity-0 md:text-[11px]">
          JALANNYA BERBEDA.
        </p>
        <p data-movement-bridge-copy className="mt-3 font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] text-bone/44 opacity-0 md:text-[11px]">
          GERAKNYA BERBEDA.
        </p>
      </div>

      <h3
        data-movement-trace-statement
        className="absolute inset-0 flex flex-col justify-center text-[clamp(3.5rem,10vw,10.5rem)] font-semibold uppercase leading-[0.78] tracking-[-0.082em] opacity-0"
      >
        <span>GERAK</span>
        <span>MENINGGALKAN</span>
        <span className="text-red-flag">JEJAK.</span>
      </h3>

      <div
        aria-hidden="true"
        data-movement-chase-signal
        className="absolute left-0 top-1/2 h-px w-24 -translate-y-1/2 bg-red-flag opacity-0 shadow-[0_0_16px_rgba(231,0,17,0.72)] md:w-40"
      >
        <span className="absolute right-0 top-1/2 size-2 -translate-y-1/2 rounded-full bg-red-flag shadow-[0_0_20px_rgba(231,0,17,0.9)]" />
      </div>
    </div>
  );
}
