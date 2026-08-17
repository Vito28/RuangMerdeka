export function HeroContent() {
  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <div className="absolute inset-0 flex items-center justify-center px-5 md:px-10 lg:px-16" data-opening>
        <div className="grid w-full grid-cols-4 items-center gap-x-4 md:grid-cols-8 lg:grid-cols-12">
          <div className="col-span-4 md:col-span-6 md:col-start-2 lg:col-span-8 lg:col-start-3">
            <div
              aria-label="17 Agustus 1945 menjadi 17 Agustus 2026"
              className="mb-7 flex justify-center overflow-hidden font-mono text-[10px] tracking-[0.28em] text-white/60 opacity-0 md:mb-3"
              data-date
            >
              <span aria-hidden="true">17.08.</span>
              <span aria-hidden="true" className="relative inline-block h-[1.2em] w-[4ch] overflow-hidden">
                <span className="absolute inset-0" data-year-1945>1945</span>
                <span className="absolute inset-0 opacity-0" data-year-2026>2026</span>
              </span>
            </div>

            <h1 className="text-center font-semibold uppercase tracking-[-0.085em]">
              <span className="block text-[clamp(10rem,34vw,30rem)] leading-[0.68] opacity-0" data-opening-81>
                81
              </span>
              <span className="mt-5 block text-[clamp(1.45rem,3.5vw,3.2rem)] leading-none tracking-[0.06em] opacity-0 md:mt-3" data-opening-title>
                Tahun Merdeka
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-sm text-center text-sm leading-6 text-white/55 opacity-0 md:mt-7 md:text-base md:leading-7" data-opening-support>
              Dari sebuah proklamasi,<br />menjadi perjalanan jutaan manusia.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center px-5 opacity-0 md:px-10 lg:px-16" data-one-nation>
        <p className="text-[clamp(4.4rem,14vw,13rem)] font-semibold uppercase leading-[0.76] tracking-[-0.08em]">
          Satu<br /><span className="text-red-flag">Bangsa</span>
        </p>
      </div>

      <div className="absolute inset-0 flex flex-col justify-between px-5 pb-24 pt-32 opacity-0 md:px-10 md:pb-20 lg:px-16" data-islands>
        <p className="text-[clamp(4rem,12vw,11rem)] font-semibold uppercase leading-none tracking-[-0.08em]">Ribuan</p>
        <p className="self-end text-[clamp(4rem,12vw,11rem)] font-semibold uppercase leading-none tracking-[-0.08em] text-red-flag">Pulau</p>
      </div>

      <div className="absolute inset-0 flex items-center justify-center px-5 opacity-0 md:px-10 lg:px-16" data-stories>
        <p className="text-center text-[clamp(4.4rem,13vw,12rem)] font-semibold uppercase leading-[0.78] tracking-[-0.08em]">
          Jutaan<br /><span className="text-white/38">Cerita</span>
        </p>
      </div>

      <div className="absolute inset-0 flex items-center justify-center px-4 opacity-0" data-freedom>
        <p className="text-[clamp(4.5rem,18vw,17rem)] font-semibold uppercase leading-none tracking-[-0.085em]">Merdeka</p>
      </div>

      <div className="absolute inset-0 flex items-end px-5 pb-24 opacity-0 md:px-10 md:pb-20 lg:px-16" data-closing>
        <div className="grid w-full grid-cols-4 gap-x-4 border-t border-white/20 pt-6 md:grid-cols-8 lg:grid-cols-12">
          <p className="col-span-3 text-sm leading-6 text-white/45 md:col-span-3 md:text-base">
            Bukan hanya tentang masa lalu.
          </p>
          <p className="col-span-4 mt-8 text-[clamp(1.8rem,4vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.055em] md:col-span-5 md:col-start-4 md:mt-0 lg:col-span-6 lg:col-start-7">
            Tetapi tentang apa yang<br /><span className="text-red-flag">kita lakukan hari ini.</span>
          </p>
        </div>
      </div>

      <div className="absolute inset-0 hidden items-center px-5 motion-reduce:flex md:px-10 lg:px-16">
        <div className="max-w-4xl">
          <p className="font-mono text-[10px] tracking-[0.24em] text-red-flag">17.08.2026</p>
          <h1 className="mt-5 text-[clamp(7rem,24vw,15rem)] font-semibold leading-[0.7] tracking-[-0.08em]">81</h1>
          <p className="mt-5 text-xl font-semibold tracking-[0.08em]">TAHUN MERDEKA</p>
          <p className="mt-8 max-w-sm text-sm leading-6 text-white/55">Dari sebuah proklamasi, menjadi perjalanan jutaan manusia.</p>
          <p className="mt-10 text-[clamp(1.6rem,5vw,3rem)] font-semibold uppercase leading-tight tracking-[-0.04em]">
            Satu bangsa · Ribuan pulau · Jutaan cerita · <span className="text-red-flag">Merdeka</span>
          </p>
          <p className="mt-8 max-w-md text-sm leading-6 text-white/55">Bukan hanya tentang masa lalu. Tetapi tentang apa yang kita lakukan hari ini.</p>
        </div>
      </div>
    </div>
  );
}
