import type { ReactNode } from "react";

function MaskLine({ children, red = false }: { children: ReactNode; red?: boolean }) {
  return (
    <span className="block overflow-hidden">
      <span data-meaning-line className={red ? "block text-merdeka" : "block"}>
        {children}
      </span>
    </span>
  );
}

function ChapterMarker({ index, label }: { index: string; label: string }) {
  return (
    <p className="font-mono text-[8px] tracking-[0.22em] text-bone/42 md:text-[9px]">
      <span className="mr-3 text-merdeka">{index}</span>
      {label}
    </p>
  );
}

export function MeaningContent() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 px-5 pb-16 pt-20 md:px-10 md:pb-[6vh] md:pt-24 lg:px-16">
      <header className="relative flex items-center justify-between border-b border-bone/12 pb-4 font-mono text-[8px] tracking-[0.22em] text-bone/42 md:text-[9px]">
        <p><span className="mr-3 text-merdeka">02</span>SECTION</p>
        <p>DENYUT SEBUAH BANGSA</p>
        <span
          data-meaning-scroll-progress
          aria-hidden="true"
          className="absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-merdeka"
        />
      </header>

      <div className="absolute inset-x-5 bottom-16 top-32 md:inset-x-10 md:bottom-[6vh] md:top-36 lg:inset-x-16">
        <div data-meaning-entry className="absolute inset-0 flex items-end justify-between pb-[8vh] opacity-0">
          <div>
            <p className="font-mono text-[8px] tracking-[0.22em] text-bone/38 md:text-[9px]">BENTUK → GERAK</p>
            <p className="mt-3 max-w-[24rem] text-xs uppercase leading-relaxed tracking-[0.12em] text-bone/32">
              Indonesia tidak hanya terbentuk. Indonesia hidup.
            </p>
          </div>
          <p className="hidden font-mono text-[8px] tracking-[0.2em] text-bone/26 md:block">MASUK KE DALAM DENYUT</p>
        </div>

        <article data-meaning-direction className="absolute inset-0 flex flex-col justify-end opacity-0">
          <ChapterMarker index="00" label="ARAH" />
          <h2 className="mt-8 text-[clamp(2.2rem,6.6vw,6.8rem)] font-semibold uppercase leading-[0.78] tracking-[-0.07em]">
            <MaskLine>MERDEKA</MaskLine>
            <MaskLine>ADALAH MAMPU</MaskLine>
            <MaskLine>MENENTUKAN</MaskLine>
            <MaskLine red>ARAH.</MaskLine>
          </h2>
        </article>

        <article data-meaning-sovereign className="absolute inset-0 flex flex-col opacity-0">
          <ChapterMarker index="01" label="BERDAULAT" />
          <div className="mt-auto grid items-end gap-9 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.42fr)] md:gap-16">
            <h2 className="text-[clamp(3.7rem,10vw,9.8rem)] font-semibold uppercase leading-[0.76] tracking-[-0.085em]">
              <MaskLine>BERDAULAT<span className="text-merdeka">.</span></MaskLine>
            </h2>
            <div data-meaning-copy className="border-t border-bone/16 pt-5 opacity-0">
              <p className="text-[clamp(1.15rem,2vw,2rem)] font-medium uppercase leading-[1.08] tracking-[-0.04em]">
                MAMPU MENENTUKAN<br />ARAH SENDIRI.
              </p>
            </div>
          </div>
        </article>

        <article data-meaning-movement className="absolute inset-0 flex flex-col opacity-0">
          <div className="flex justify-end"><ChapterMarker index="02" label="BERGERAK" /></div>
          <h2 className="my-auto text-center text-[clamp(4.3rem,15vw,14rem)] font-semibold uppercase leading-[0.72] tracking-[-0.09em] text-bone/58">
            <MaskLine>BERGERAK<span className="text-merdeka">.</span></MaskLine>
          </h2>
          <div data-meaning-copy className="ml-auto max-w-[31rem] border-t border-bone/16 pt-5 text-right opacity-0">
            <p className="text-[clamp(1rem,1.8vw,1.75rem)] font-medium uppercase leading-[1.12] tracking-[-0.04em]">
              KARENA KEMERDEKAAN BUKAN<br />KEADAAN YANG DIAM.
            </p>
          </div>
        </article>

        <article data-meaning-creation className="absolute inset-0 flex flex-col opacity-0">
          <div className="flex items-start justify-between gap-8">
            <ChapterMarker index="03" label="MENCIPTA" />
            <p data-meaning-copy className="max-w-[18rem] text-right font-mono text-[8px] uppercase leading-relaxed tracking-[0.18em] text-bone/42 opacity-0 md:text-[9px]">
              MASA DEPAN TIDAK DATANG<br />DENGAN SENDIRINYA.
            </p>
          </div>
          <h2 className="mt-auto max-w-none text-[clamp(2.4rem,10vw,9.8rem)] font-semibold uppercase leading-[0.78] tracking-[-0.082em]">
            <MaskLine>KITA</MaskLine>
            <MaskLine red>MENCIPTAKANNYA.</MaskLine>
          </h2>
        </article>

        <article data-meaning-pulse className="absolute inset-0 flex flex-col opacity-0">
          <div className="grid grid-cols-3 gap-4 font-mono text-[8px] tracking-[0.18em] text-bone/28 md:text-[9px]">
            <p>BERDAULAT.</p><p className="text-center">BERGERAK.</p><p className="text-right">MENCIPTA.</p>
          </div>
          <div
            data-meaning-symbol
            className="ml-auto mt-8 max-w-[15rem] border-r border-merdeka/55 pr-4 text-right opacity-0 md:mt-10 md:max-w-[18rem]"
          >
            <p className="font-mono text-[8px] tracking-[0.2em] text-bone/58 md:text-[9px]">
              <span className="mr-2 text-merdeka">✦</span>BINTANG HARAPAN
            </p>
            <p className="mt-3 text-[10px] font-medium uppercase leading-relaxed tracking-[0.12em] text-bone/42 md:text-xs">
              LIMA NILAI PANCASILA.<br />SATU HARAPAN BANGSA.
            </p>
          </div>
          <h2 className="mt-auto max-w-[10ch] text-[clamp(3.7rem,9vw,8.8rem)] font-semibold uppercase leading-[0.78] tracking-[-0.08em]">
            <MaskLine>81 TAHUN</MaskLine>
            <MaskLine red>DAN KITA MASIH</MaskLine>
            <MaskLine>BERGERAK.</MaskLine>
          </h2>
          <div data-meaning-copy className="mt-6 grid gap-3 border-t border-bone/16 pt-4 font-mono text-[7px] uppercase leading-relaxed tracking-[0.17em] text-bone/42 opacity-0 sm:grid-cols-2 md:text-[9px]">
            <p>KEMERDEKAAN BUKAN GARIS AKHIR.</p>
            <p className="sm:text-right">IA ADALAH RUANG UNTUK TERUS MELANGKAH.</p>
          </div>
        </article>
      </div>
    </div>
  );
}

export function ReducedMeaningContent() {
  const chapters = [
    { index: "01", title: "BERDAULAT.", copy: "MAMPU MENENTUKAN ARAH SENDIRI." },
    { index: "02", title: "BERGERAK.", copy: "KARENA KEMERDEKAAN BUKAN KEADAAN YANG DIAM." },
    { index: "03", title: "KITA MENCIPTAKANNYA.", copy: "MASA DEPAN TIDAK DATANG DENGAN SENDIRINYA." },
  ];

  return (
    <section id="meaning" aria-label="Denyut sebuah bangsa" className="bg-night px-5 py-24 text-bone md:px-10 md:py-32 lg:px-16">
      <header className="flex items-center justify-between border-b border-bone/15 pb-4 font-mono text-[9px] tracking-[0.2em] text-bone/45">
        <p><span className="mr-3 text-merdeka">02</span>SECTION</p><p>DENYUT SEBUAH BANGSA</p>
      </header>
      <h2 className="py-28 text-[clamp(3.4rem,8vw,8rem)] font-semibold uppercase leading-[0.8] tracking-[-0.075em]">
        MERDEKA ADALAH MAMPU<br />MENENTUKAN <span className="text-merdeka">ARAH.</span>
      </h2>
      <div className="flex flex-col gap-28">
        {chapters.map((chapter) => (
          <article key={chapter.index} className="border-t border-bone/15 pt-5">
            <p className="font-mono text-[9px] tracking-[0.2em] text-merdeka">{chapter.index} / 03</p>
            <h3 className="mt-10 text-[clamp(3.6rem,9vw,8.5rem)] font-semibold uppercase leading-[0.8] tracking-[-0.078em]">{chapter.title}</h3>
            <p className="mt-14 max-w-2xl text-[clamp(1.15rem,2.1vw,2rem)] font-medium uppercase leading-[1.12] tracking-[-0.04em]">{chapter.copy}</p>
          </article>
        ))}
      </div>
      <p className="mt-36 border-t border-bone/15 pt-10 text-[clamp(3.6rem,8vw,8rem)] font-semibold uppercase leading-[0.8] tracking-[-0.078em]">
        81 TAHUN<br /><span className="text-merdeka">DAN KITA MASIH BERGERAK.</span>
      </p>
      <p className="mt-8 max-w-xl font-mono text-xs uppercase leading-relaxed tracking-[0.16em] text-bone/50">
        Kemerdekaan bukan garis akhir. Ia adalah ruang untuk terus melangkah.
      </p>
      <p className="mt-5 max-w-xl font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-bone/40">
        Bintang Harapan — lima nilai Pancasila, satu harapan bangsa.
      </p>
    </section>
  );
}
