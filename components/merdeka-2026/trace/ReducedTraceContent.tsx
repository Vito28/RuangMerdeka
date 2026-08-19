import Image from "next/image";
import { TRACE_MEDIA } from "./data/trace-media";

export function ReducedTraceContent() {
  return (
    <section
      id="trace"
      aria-label="Jejak yang kita bangun"
      className="bg-night px-5 py-24 text-bone md:px-10 md:py-32 lg:px-16"
    >
      <h2 className="max-w-[11ch] py-20 text-[clamp(3.7rem,9vw,8.5rem)] font-semibold uppercase leading-[0.8] tracking-[-0.078em] md:py-28">
        DAN JEJAK ITU<br />ADA DI SEKITAR <span className="text-red-flag">KITA.</span>
      </h2>

      <div className="flex flex-col gap-24 md:gap-32">
        {TRACE_MEDIA.map((item, index) => (
          <article
            key={item.id}
            className={index % 2 === 0 ? "md:mr-auto md:w-4/5" : "md:ml-auto md:w-4/5"}
          >
            <div
              className="relative w-full overflow-hidden bg-black"
              style={{ aspectRatio: item.aspect }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 768px) 80vw, 100vw"
                className="object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
            </div>
            <p className="mt-4 font-mono text-[9px] tracking-[0.2em] text-bone/48">{item.label}</p>
            <h3 className="mt-5 max-w-2xl text-[clamp(1.8rem,4vw,3.7rem)] font-medium uppercase leading-[0.95] tracking-[-0.045em]">
              {item.statement}
            </h3>
          </article>
        ))}
      </div>

      <p className="py-32 text-[clamp(3.5rem,8vw,8rem)] font-semibold uppercase leading-[0.8] tracking-[-0.075em]">
        DARI GERAK KECIL,<br />LAHIR <span className="text-red-flag">PERUBAHAN BESAR.</span>
      </p>
      <p className="text-[clamp(4.5rem,13vw,12rem)] font-semibold uppercase leading-[0.77] tracking-[-0.085em]">
        KITA<br /><span className="text-red-flag">MENGISINYA.</span>
      </p>
      <span aria-hidden="true" className="mx-auto mt-32 block size-2.5 rounded-full bg-red-flag" />
    </section>
  );
}
