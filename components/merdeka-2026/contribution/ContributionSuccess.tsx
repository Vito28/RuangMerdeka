export function ContributionSuccess({ active }: { active: boolean }) {
  return (
    <div
      data-contribution-success
      aria-hidden={!active}
      className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-center opacity-0"
    >
      <p className="mb-7 font-mono text-[8px] tracking-[0.24em] text-bone/42 md:text-[9px]">SATU NIAT TELAH BERGERAK</p>
      <p className="text-[clamp(5.2rem,16vw,15rem)] font-semibold uppercase leading-[0.77] tracking-[-0.087em]">
        TERIMA<br /><span className="text-red-flag">KASIH.</span>
      </p>
    </div>
  );
}
