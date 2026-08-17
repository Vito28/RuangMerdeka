type ValueWordProps = {
  children: string;
  index: string;
  phase: string;
  className: string;
  textClassName?: string;
};

function ValueWord({ children, index, phase, className, textClassName = "" }: ValueWordProps) {
  return (
    <li className={`absolute inset-0 flex opacity-0 ${className}`} data-movement-phase={phase}>
      <div>
        <p className="mb-4 font-mono text-[8px] tracking-[0.24em] text-bone/38 md:text-[9px]">
          <span className="mr-3 text-red-flag">{index}</span>
          NILAI GERAK
        </p>
        <div className="overflow-hidden">
          <h3
            className={`text-[clamp(4.4rem,14vw,13rem)] font-semibold uppercase leading-[0.78] tracking-[-0.085em] ${textClassName}`}
            data-movement-word-text
          >
            {children}<span className="text-red-flag">.</span>
          </h3>
        </div>
      </div>
    </li>
  );
}

export function MovementContent() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 px-5 pb-8 pt-24 md:px-10 md:pb-10 md:pt-28 lg:px-16">
      <div className="flex items-center justify-between border-b border-bone/12 pb-4 font-mono text-[8px] tracking-[0.22em] text-bone/42 md:text-[9px]">
        <p><span className="mr-3 text-red-flag">03</span>SECTION</p>
        <p>GERAK KITA</p>
      </div>

      <div className="absolute inset-x-5 bottom-8 top-36 md:inset-x-10 md:bottom-10 md:top-40 lg:inset-x-16">
        <article className="absolute inset-0 flex flex-col justify-center" data-movement-opening>
          <p className="mb-7 font-mono text-[8px] tracking-[0.24em] text-bone/42 md:text-[9px]">MELANJUTKAN PERJALANAN</p>
          <h2 className="max-w-[9ch] text-[clamp(4rem,11vw,10.8rem)] font-semibold uppercase leading-[0.8] tracking-[-0.08em]">
            INDONESIA<br /><span className="text-red-flag">TERUS</span><br />BERGERAK.
          </h2>
        </article>

        <p
          className="absolute inset-0 flex w-full max-w-[10ch] items-center text-[clamp(3.35rem,10vw,9.5rem)] font-semibold uppercase leading-[0.82] tracking-[-0.078em] opacity-0"
          data-movement-person
        >
          <span>BUKAN KARENA<br /><span className="text-red-flag">SATU ORANG.</span></span>
        </p>

        <p
          className="absolute inset-0 ml-auto flex w-full max-w-[10ch] items-center text-right text-[clamp(3.35rem,10vw,9.5rem)] font-semibold uppercase leading-[0.82] tracking-[-0.078em] opacity-0"
          data-movement-place
        >
          <span>BUKAN KARENA<br /><span className="text-red-flag">SATU TEMPAT.</span></span>
        </p>

        <div className="absolute inset-0 flex items-end justify-center pb-[14vh] text-center opacity-0 md:items-center md:pb-0" data-movement-bridge>
          <p className="max-w-[22ch] text-[clamp(1.45rem,3.4vw,3.7rem)] font-medium uppercase leading-[1.02] tracking-[-0.045em]">
            TETAPI KARENA <span className="text-red-flag">JUTAAN GERAK</span><br />YANG TERJADI BERSAMA.
          </p>
        </div>

        <ul className="absolute inset-0" aria-label="Nilai gerak Indonesia">
          <ValueWord index="01" phase="brave" className="items-start pt-[12vh] md:items-center md:pt-0">
            BERANI
          </ValueWord>
          <ValueWord index="02" phase="diverse" className="items-center justify-end text-right">
            BERAGAM
          </ValueWord>
          <ValueWord index="03" phase="creative" className="items-center justify-center text-center">
            KREATIF
          </ValueWord>
          <ValueWord index="04" phase="empowered" className="items-end pb-[12vh] md:pb-[8vh]">
            BERDAYA
          </ValueWord>
          <ValueWord index="05" phase="moving" className="items-center justify-end text-right" textClassName="text-[clamp(4.2rem,15vw,14rem)]">
            BERGERAK
          </ValueWord>
          <ValueWord index="06" phase="together" className="items-center justify-center text-center" textClassName="text-[clamp(4.9rem,18vw,17rem)]">
            BERSAMA
          </ValueWord>
        </ul>

        <div className="absolute inset-0 flex flex-col justify-end opacity-0" data-movement-closing>
          <p className="mb-auto font-mono text-[8px] tracking-[0.24em] text-bone/42 md:text-[9px]">SATU GERAK · SATU INDONESIA</p>
          <p className="max-w-[9ch] text-[clamp(4.2rem,11.5vw,11rem)] font-semibold uppercase leading-[0.79] tracking-[-0.082em]">
            INDONESIA<br />ADALAH <span className="text-red-flag">KITA.</span>
          </p>
          <div className="mt-8 hidden items-end justify-between border-t border-bone/16 pt-4 font-mono text-[8px] tracking-[0.2em] text-bone/42 md:flex md:text-[9px]">
            <p>BERANI · BERAGAM · KREATIF</p>
            <p>BERDAYA · BERGERAK · BERSAMA</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const values = ["BERANI.", "BERAGAM.", "KREATIF.", "BERDAYA.", "BERGERAK.", "BERSAMA."];

export function ReducedMovementContent() {
  return (
    <section id="movement" aria-label="Indonesia adalah gerak kita" className="bg-night px-5 py-24 text-bone md:px-10 md:py-32 lg:px-16">
      <div className="flex items-center justify-between border-b border-bone/15 pb-4 font-mono text-[9px] tracking-[0.2em] text-bone/45">
        <p><span className="mr-3 text-red-flag">03</span>SECTION</p><p>GERAK KITA</p>
      </div>

      <h2 className="py-28 text-[clamp(3.9rem,10vw,9rem)] font-semibold uppercase leading-[0.8] tracking-[-0.078em]">
        INDONESIA<br /><span className="text-red-flag">TERUS</span><br />BERGERAK.
      </h2>

      <div className="grid gap-24 border-y border-bone/15 py-24 md:grid-cols-2">
        <p className="text-[clamp(2.8rem,6vw,6rem)] font-semibold uppercase leading-[0.84] tracking-[-0.065em]">BUKAN KARENA<br /><span className="text-red-flag">SATU ORANG.</span></p>
        <p className="text-right text-[clamp(2.8rem,6vw,6rem)] font-semibold uppercase leading-[0.84] tracking-[-0.065em]">BUKAN KARENA<br /><span className="text-red-flag">SATU TEMPAT.</span></p>
      </div>

      <p className="mx-auto max-w-[22ch] py-28 text-center text-[clamp(1.5rem,3vw,3rem)] font-medium uppercase leading-[1.05] tracking-[-0.04em]">
        TETAPI KARENA <span className="text-red-flag">JUTAAN GERAK</span><br />YANG TERJADI BERSAMA.
      </p>

      <ul className="border-t border-bone/15">
        {values.map((value, index) => (
          <li key={value} className={`border-b border-bone/15 py-12 text-[clamp(3.7rem,11vw,10rem)] font-semibold uppercase leading-none tracking-[-0.08em] ${index % 2 === 1 ? "text-right" : ""}`}>
            {value.slice(0, -1)}<span className="text-red-flag">.</span>
          </li>
        ))}
      </ul>

      <p className="mt-32 border-t border-bone/15 pt-12 text-[clamp(4rem,11vw,10rem)] font-semibold uppercase leading-[0.8] tracking-[-0.08em]">
        INDONESIA<br />ADALAH <span className="text-red-flag">KITA.</span>
      </p>
    </section>
  );
}
