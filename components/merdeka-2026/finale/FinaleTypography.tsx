type FinaleTypographyProps = {
  reducedMotion?: boolean;
};

export function FinaleTypography({ reducedMotion = false }: FinaleTypographyProps) {
  const visible = reducedMotion ? "opacity-100" : "opacity-0";

  return (
    <div className="pointer-events-none absolute inset-0 z-20 px-5 md:px-10 lg:px-16">
      <div
        data-finale-anniversary
        className={`absolute bottom-[40%] left-5 font-mono text-[9px] tracking-[0.28em] text-night/70 md:bottom-auto md:left-10 md:top-[42%] md:text-[10px] md:text-bone/64 lg:left-16 ${visible}`}
      >
        81 TAHUN MERDEKA
      </div>

      <div
        data-finale-statement
        className={`absolute inset-x-5 bottom-24 md:inset-x-10 md:bottom-24 lg:inset-x-16 ${visible}`}
      >
        <h2 className="text-[clamp(4.4rem,13.5vw,12.5rem)] font-semibold uppercase leading-[0.76] tracking-[-0.085em]">
          <span className="block overflow-hidden">
            <span data-finale-statement-line className="block">MERDEKA</span>
          </span>
          <span className="block overflow-hidden text-merdeka">
            <span data-finale-statement-line className="block">TERUS.</span>
          </span>
        </h2>
      </div>

      <div
        data-finale-closing
        className={`absolute inset-x-5 bottom-5 flex items-end justify-between gap-6 md:inset-x-10 md:bottom-7 lg:inset-x-16 ${visible}`}
      >
        <div>
          <p className="text-sm font-semibold tracking-[-0.03em] md:text-base">RUANG MERDEKA</p>
          <p className="mt-1 font-mono text-[7px] tracking-[0.2em] text-bone/40 md:text-[8px]">
            AN ANNUAL DIGITAL EXPERIENCE
          </p>
        </div>
        <p className="shrink-0 font-mono text-[8px] tracking-[0.2em] text-bone/52 md:text-[9px]">2026 — ∞</p>
      </div>
    </div>
  );
}
