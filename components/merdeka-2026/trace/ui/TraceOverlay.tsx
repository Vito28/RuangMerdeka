import { TRACE_LABEL_MEDIA } from "../data/trace-media";
import { TraceLabel } from "./TraceLabel";

const mosaicWords = ["BELAJAR", "MEMBANGUN", "MENJAGA"] as const;
const wordPlacements = [
  "left-[8%] top-[18%]",
  "right-[11%] top-[28%]",
  "left-[21%] bottom-[18%]",
] as const;

function MaskedLine({ children, red = false }: { children: React.ReactNode; red?: boolean }) {
  return (
    <span className={`block overflow-hidden pb-[0.08em] ${red ? "text-red-flag" : ""}`}>
      <span className="block" data-trace-copy-line>{children}</span>
    </span>
  );
}

export function TraceOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 text-bone">
      <div data-trace-entry-copy className="absolute inset-x-5 top-[18%] opacity-0 md:inset-x-10 lg:inset-x-16">
        <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-bone/44 md:text-[10px]">GERAK MENJADI JEJAK</p>
        <h2 className="mt-6 max-w-[10ch] text-[clamp(3.4rem,9vw,9rem)] font-semibold uppercase leading-[0.79] tracking-[-0.078em]">
          <MaskedLine>DAN JEJAK ITU</MaskedLine>
          <MaskedLine>ADA DI SEKITAR</MaskedLine>
          <MaskedLine red>KITA.</MaskedLine>
        </h2>
      </div>

      {TRACE_LABEL_MEDIA.map((item, index) => (
        <TraceLabel
          key={item.id}
          index={index}
          label={item.label}
          statement={item.statement}
          placement={index % 2 === 0 ? "left" : "right"}
        />
      ))}

      <div data-trace-silence className="absolute inset-x-5 bottom-[13%] opacity-0 md:inset-x-10 lg:inset-x-16">
        <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-bone/48 md:text-[10px]">DARI GERAK KECIL,</p>
        <p className="mt-5 max-w-[8ch] text-[clamp(3rem,7.5vw,7.8rem)] font-semibold uppercase leading-[0.8] tracking-[-0.075em]">
          LAHIR<br /><span className="text-red-flag">PERUBAHAN</span><br />BESAR.
        </p>
      </div>

      <div aria-hidden="true" data-trace-mosaic-words className="absolute inset-0 opacity-0">
        {mosaicWords.map((word, index) => (
          <span
            key={word}
            data-trace-mosaic-word
            className={`absolute ${wordPlacements[index]} font-mono text-[8px] tracking-[0.2em] text-bone/38 md:text-[10px]`}
          >
            {word}
          </span>
        ))}
      </div>

      <div data-trace-inheritance className="absolute inset-x-5 top-[15%] isolate opacity-0 md:inset-x-10 lg:inset-x-16">
        <span aria-hidden="true" className="absolute -inset-x-8 -inset-y-12 -z-10 bg-[radial-gradient(ellipse_at_left,rgba(5,5,5,0.72),rgba(5,5,5,0.26)_58%,transparent_78%)]" />
        <p className="max-w-[12ch] text-[clamp(3.4rem,8vw,8rem)] font-semibold uppercase leading-[0.8] tracking-[-0.075em]">
          KITA TIDAK<br />HANYA MEWARISI<br />KEMERDEKAAN.
        </p>
      </div>

      <div data-trace-finale className="absolute inset-x-5 bottom-[14%] isolate text-right opacity-0 md:inset-x-10 lg:inset-x-16">
        <span aria-hidden="true" className="absolute -inset-x-8 -inset-y-12 -z-10 bg-[radial-gradient(ellipse_at_right,rgba(5,5,5,0.7),rgba(5,5,5,0.22)_58%,transparent_80%)]" />
        <p className="text-[clamp(3.3rem,16vw,15rem)] font-semibold uppercase leading-[0.76] tracking-[-0.088em]">
          KITA<br /><span className="text-red-flag">MENGISINYA.</span>
        </p>
      </div>

      <span
        data-trace-year-dot
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-flag opacity-0 shadow-[0_0_16px_rgba(231,0,17,0.32)]"
      />
    </div>
  );
}
