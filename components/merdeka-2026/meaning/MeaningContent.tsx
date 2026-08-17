function ChapterLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[8px] tracking-[0.22em] text-bone/42 md:text-[9px]">
      <span className="text-red-flag">{index}</span>
      <span>{label}</span>
    </div>
  );
}

export function MeaningContent() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 px-5 pb-8 pt-24 md:px-10 md:pb-10 md:pt-28 lg:px-16">
      <div className="flex items-center justify-between border-b border-bone/12 pb-4 font-mono text-[8px] tracking-[0.22em] text-bone/42 md:text-[9px]" data-meaning-meta>
        <p>SECTION 02</p>
        <p>MAKNA HARI INI</p>
      </div>

      <div className="absolute inset-x-5 bottom-8 top-36 md:inset-x-10 md:bottom-10 md:top-40 lg:inset-x-16">
        <div className="absolute inset-0 flex flex-col justify-center opacity-0" data-meaning-question>
          <p className="mb-8 font-mono text-[8px] tracking-[0.22em] text-bone/42 md:text-[9px]">SEBUAH PERTANYAAN</p>
          <h2 className="max-w-[10ch] text-[clamp(3.8rem,10.5vw,10rem)] font-semibold uppercase leading-[0.8] tracking-[-0.078em]">
            <span className="block overflow-hidden"><span className="block" data-question-line>APA ARTI</span></span>
            <span className="block overflow-hidden md:pl-[18vw]"><span className="block text-red-flag" data-question-line>MERDEKA</span></span>
            <span className="block overflow-hidden"><span className="block" data-question-line>HARI INI?</span></span>
          </h2>
        </div>

        <article className="absolute inset-0 flex flex-col justify-between opacity-0" data-meaning-sovereign>
          <div>
            <ChapterLabel index="01" label="BERDAULAT" />
            <h3 className="mt-8 text-[clamp(3.9rem,11vw,10.8rem)] font-semibold uppercase leading-[0.78] tracking-[-0.082em]">
              BERDAULAT<span className="text-red-flag">.</span>
            </h3>
          </div>
          <div className="ml-auto w-full max-w-[24rem] border-t border-bone/18 pt-5 md:mr-[5vw]">
            <p className="text-[clamp(1.35rem,2.5vw,2.65rem)] font-medium uppercase leading-[1.08] tracking-[-0.045em]">
              MAMPU MENENTUKAN<br />ARAH SENDIRI.
            </p>
          </div>
        </article>

        <article className="absolute inset-0 flex flex-col justify-between opacity-0" data-meaning-justice>
          <div className="flex justify-end"><ChapterLabel index="02" label="ADIL" /></div>
          <div aria-hidden="true" className="absolute inset-0 font-mono text-[8px] tracking-[0.2em] text-bone/28 md:text-[9px]">
            <span className="absolute left-0 top-[24%]">PENDIDIKAN</span>
            <span className="absolute right-0 top-[31%]">TEKNOLOGI</span>
            <span className="absolute bottom-[27%] left-[8%]">KESEHATAN</span>
            <span className="absolute bottom-[20%] right-[5%]">KESEMPATAN</span>
          </div>
          <h3 className="self-center text-[clamp(6.5rem,20vw,18rem)] font-semibold uppercase leading-none tracking-[-0.09em]">
            ADIL<span className="text-red-flag">.</span>
          </h3>
          <p className="max-w-[23rem] border-t border-bone/18 pt-5 text-[clamp(1.15rem,2vw,2rem)] font-medium uppercase leading-[1.1] tracking-[-0.04em]">
            KETIKA KESEMPATAN<br />DAPAT DIRASAKAN<br />LEBIH BANYAK ORANG.
          </p>
        </article>

        <article className="absolute inset-0 flex flex-col justify-between opacity-0" data-meaning-prosperity>
          <div className="flex justify-between">
            <ChapterLabel index="03" label="MAKMUR" />
            <p aria-hidden="true" className="font-mono text-[8px] tracking-[0.2em] text-bone/30 md:text-[9px]">MEMBANGUN · MENCIPTA</p>
          </div>
          <h3 className="self-end text-right text-[clamp(4.8rem,13vw,12rem)] font-semibold uppercase leading-[0.78] tracking-[-0.085em]">
            MAKMUR<span className="text-red-flag">.</span>
          </h3>
          <div className="max-w-[33rem] border-t border-bone/18 pt-5">
            <p className="text-[clamp(1.05rem,1.8vw,1.75rem)] font-medium uppercase leading-[1.15] tracking-[-0.035em] text-bone/68">
              KETIKA KITA BUKAN HANYA<br />MENGGUNAKAN MASA DEPAN,
            </p>
            <p className="mt-5 text-[clamp(1.45rem,2.8vw,3rem)] font-semibold uppercase leading-[1.03] tracking-[-0.05em]">
              TETAPI IKUT<br /><span className="text-red-flag">MENCIPTAKANNYA.</span>
            </p>
          </div>
        </article>

        <div className="absolute inset-0 flex flex-col justify-between opacity-0" data-meaning-forward>
          <div aria-hidden="true" className="grid grid-cols-3 gap-4 font-mono text-[8px] tracking-[0.18em] text-bone/34 md:text-[9px]">
            <p>BERDAULAT.</p><p className="text-center">ADIL.</p><p className="text-right">MAKMUR.</p>
          </div>
          <h3 className="max-w-[10ch] text-[clamp(4rem,11vw,10.8rem)] font-semibold uppercase leading-[0.8] tracking-[-0.08em]">
            INDONESIA<br /><span className="text-red-flag">TERUS</span><br />BERGERAK.
          </h3>
          <div className="flex items-end justify-between border-t border-bone/16 pt-4 font-mono text-[8px] tracking-[0.2em] text-bone/42 md:text-[9px]">
            <p>BERDAULAT · ADIL · MAKMUR</p><p>MENUJU BAB BERIKUTNYA ↓</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReducedMeaningContent() {
  const chapters = [
    { index: "01", title: "BERDAULAT.", copy: <>MAMPU MENENTUKAN<br />ARAH SENDIRI.</> },
    { index: "02", title: "ADIL.", copy: <>KETIKA KESEMPATAN DAPAT DIRASAKAN<br />LEBIH BANYAK ORANG.</> },
    { index: "03", title: "MAKMUR.", copy: <>KETIKA KITA BUKAN HANYA MENGGUNAKAN MASA DEPAN,<br /><span className="text-red-flag">TETAPI IKUT MENCIPTAKANNYA.</span></> },
  ];

  return (
    <section id="meaning" aria-label="Makna kemerdekaan hari ini" className="bg-night px-5 py-24 text-bone md:px-10 md:py-32 lg:px-16">
      <div className="flex items-center justify-between border-b border-bone/15 pb-4 font-mono text-[9px] tracking-[0.2em] text-bone/45">
        <p>SECTION 02</p><p>MAKNA HARI INI</p>
      </div>
      <h2 className="py-28 text-[clamp(3.8rem,10vw,9rem)] font-semibold uppercase leading-[0.8] tracking-[-0.078em]">
        APA ARTI<br /><span className="text-red-flag">MERDEKA</span><br />HARI INI?
      </h2>
      <div className="flex flex-col gap-28">
        {chapters.map((chapter) => (
          <article key={chapter.title} className="border-t border-bone/15 pt-5">
            <p className="font-mono text-[9px] tracking-[0.2em] text-red-flag">{chapter.index}</p>
            <h3 className="mt-10 text-[clamp(3.8rem,10vw,9rem)] font-semibold uppercase leading-[0.8] tracking-[-0.078em]">{chapter.title}</h3>
            <p className="mt-16 max-w-2xl text-[clamp(1.25rem,2.4vw,2.4rem)] font-medium uppercase leading-[1.12] tracking-[-0.04em]">{chapter.copy}</p>
          </article>
        ))}
      </div>
      <p className="mt-36 border-t border-bone/15 pt-10 text-[clamp(3.8rem,10vw,9rem)] font-semibold uppercase leading-[0.8] tracking-[-0.078em]">
        INDONESIA<br /><span className="text-red-flag">TERUS BERGERAK.</span>
      </p>
    </section>
  );
}
