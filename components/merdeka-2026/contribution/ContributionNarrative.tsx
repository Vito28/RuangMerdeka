export function ContributionNarrative() {
  return (
    <div className="pointer-events-none absolute inset-x-5 bottom-8 top-36 z-20 md:inset-x-10 md:bottom-10 md:top-40 lg:inset-x-16">
      <h2
        data-contribution-kita
        className="absolute inset-0 flex items-center justify-center text-[clamp(6.5rem,24vw,22rem)] font-semibold uppercase leading-none tracking-[-0.09em]"
      >
        KITA<span className="text-red-flag">.</span>
      </h2>

      <p
        data-contribution-saya
        className="absolute inset-0 flex items-center justify-end text-[clamp(6rem,21vw,20rem)] font-semibold uppercase leading-none tracking-[-0.085em] opacity-0"
      >
        SAYA<span className="text-red-flag">.</span>
      </p>

      <div data-contribution-question className="absolute inset-0 flex flex-col justify-center opacity-0">
        <p className="mb-5 font-mono text-[8px] tracking-[0.24em] text-bone/42 md:text-[9px]">SEBUAH ARAH PERSONAL</p>
        <p className="text-[clamp(4.3rem,13vw,12.5rem)] font-semibold uppercase leading-[0.78] tracking-[-0.082em]">
          <span className="block overflow-hidden"><span className="block" data-contribution-question-line>UNTUK</span></span>
          <span className="block overflow-hidden text-right"><span className="block text-red-flag" data-contribution-question-line>INDONESIA,</span></span>
        </p>
      </div>

      <div data-contribution-intention className="absolute inset-0 flex flex-col justify-center opacity-0">
        <p className="text-[clamp(5rem,15vw,14rem)] font-semibold uppercase leading-[0.77] tracking-[-0.086em]">
          <span className="block overflow-hidden"><span className="block" data-contribution-intention-line>SAYA</span></span>
          <span className="block overflow-hidden text-right"><span className="block text-red-flag" data-contribution-intention-line>AKAN...</span></span>
        </p>
      </div>
    </div>
  );
}
