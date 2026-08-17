const particles = [
  [-76, -24], [-62, 28], [-48, -44], [-35, 14], [-22, 42], [-8, -31],
  [10, 24], [24, -48], [39, 9], [54, 38], [68, -22], [82, 17],
  [-70, 48], [-55, -8], [-40, 34], [-28, -35], [-14, 8], [4, -52],
  [18, 45], [33, -18], [47, 26], [60, -42], [74, 49], [88, -5],
] as const;

export function ContributionRibbon() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      <svg className="hidden size-full md:block" viewBox="0 0 1440 900" preserveAspectRatio="none" fill="none">
        <path
          data-ribbon-red
          pathLength="1"
          d="M-120 596 C 140 486, 310 654, 525 572 C 708 502, 824 400, 1008 430 C 1198 460, 1324 588, 1560 500"
          stroke="#c8102e"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1 1"
          strokeDashoffset="1"
          vectorEffect="non-scaling-stroke"
        />
        <path
          data-ribbon-white
          pathLength="1"
          d="M-120 620 C 140 510, 310 678, 525 596 C 708 526, 824 424, 1008 454 C 1198 484, 1324 612, 1560 524"
          stroke="#f4f1ea"
          strokeWidth="10"
          opacity="0"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1 1"
          strokeDashoffset="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <svg className="size-full md:hidden" viewBox="0 0 390 844" preserveAspectRatio="none" fill="none">
        <path
          data-ribbon-red
          pathLength="1"
          d="M-35 548 C 58 502, 110 602, 192 550 C 258 508, 308 456, 425 510"
          stroke="#c8102e"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1 1"
          strokeDashoffset="1"
          vectorEffect="non-scaling-stroke"
        />
        <path
          data-ribbon-white
          pathLength="1"
          d="M-35 564 C 58 518, 110 618, 192 566 C 258 524, 308 472, 425 526"
          stroke="#f4f1ea"
          strokeWidth="7"
          opacity="0"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1 1"
          strokeDashoffset="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <span
        data-ribbon-light
        className="absolute left-0 top-[66%] size-2 rounded-full bg-bone opacity-0 shadow-[0_0_22px_rgba(244,241,234,0.7)]"
      />

      <div data-particle-field className="absolute left-1/2 top-1/2">
        {particles.map(([x, y], index) => (
          <span
            key={`${x}-${y}`}
            data-contribution-particle
            data-x={x}
            data-y={y}
            className={`absolute size-1 rounded-full opacity-0 ${index % 3 === 0 ? "bg-red-flag" : "bg-bone"}`}
          />
        ))}
      </div>

      <div data-finale-red className="absolute inset-x-0 top-0 h-1/2 origin-top scale-y-0 bg-merdeka opacity-0" />
      <div data-finale-white className="absolute inset-x-0 bottom-0 h-1/2 origin-bottom scale-y-0 bg-bone opacity-0" />
    </div>
  );
}
