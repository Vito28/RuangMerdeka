import { CURATED_VOICES, SEED_WORDS } from "../data/voice-data";
import { MerdekaInput } from "./MerdekaInput";

type VoiceOverlayProps = {
  answer: string;
  submitted: boolean;
  onAnswerChange: (value: string) => void;
  onFocusChange: (focused: boolean) => void;
  onSubmit: () => void;
  onSkip: () => void;
};

export function VoiceOverlay(props: VoiceOverlayProps) {
  const answerWords = props.answer.trim().split(/\s+/).filter(Boolean);

  return (
    <div className="absolute inset-0 z-20 overflow-hidden">
      <div data-voice-opening className="pointer-events-none absolute inset-x-5 top-1/2 -translate-y-1/2 opacity-0 md:inset-x-10 lg:inset-x-16">
        <p className="font-mono text-[9px] uppercase leading-[1.8] tracking-[0.26em] text-bone/54 md:text-[11px]">
          SETELAH SEMUA<br />YANG KITA JALANI...
        </p>
      </div>

      <span
        data-voice-caret
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-flag shadow-[0_0_18px_rgba(231,0,17,0.38)]"
      />

      <div data-voice-question className="pointer-events-none absolute inset-0 flex items-center px-5 opacity-0 md:px-10 lg:px-16">
        <h2 className="w-full text-[clamp(3.6rem,11.7vw,11.5rem)] font-semibold uppercase leading-[0.78] tracking-[-0.085em]">
          <span className="block overflow-hidden pb-[0.04em]"><span data-question-line className="block">APA ARTI</span></span>
          <span className="block overflow-hidden pb-[0.04em] text-red-flag"><span data-question-line className="block">MERDEKA</span></span>
          <span className="ml-[12vw] block overflow-hidden pb-[0.05em] md:ml-[23vw]"><span data-question-line className="block">HARI INI?</span></span>
        </h2>
      </div>

      <div data-word-field aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0">
        {SEED_WORDS.map(({ word, placement, accent }) => (
          <span
            key={word}
            data-seed-word
            className={`absolute ${placement} font-mono text-[8px] uppercase tracking-[0.22em] md:text-[11px] ${accent ? "text-red-highlight/80" : "text-bone/42"}`}
          >
            {word}
          </span>
        ))}
        <p data-word-bridge className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[clamp(1.35rem,3.1vw,3.15rem)] font-medium uppercase leading-[0.96] tracking-[-0.045em] text-bone">
          SATU KATA<br /><span className="text-bone/42">BISA BERARTI</span><br />BANYAK HAL.
        </p>
      </div>

      <div data-curated-voices className="pointer-events-none absolute inset-0 opacity-0">
        {CURATED_VOICES.map((voice) => (
          <p
            key={voice.id}
            data-curated-voice={voice.id}
            className={`absolute flex flex-col ${voice.placement} max-w-[15rem] text-[clamp(1.15rem,2.5vw,2.8rem)] font-medium uppercase leading-[0.94] tracking-[-0.045em] text-bone opacity-0 md:max-w-md`}
          >
            {voice.lines.map((line, index) => (
              <span key={line} className={index === voice.lines.length - 1 ? "text-red-highlight" : ""}>{line}</span>
            ))}
          </p>
        ))}
      </div>

      <div data-personal-prompt className="pointer-events-none absolute inset-0 flex items-center justify-center px-5 text-center opacity-0">
        <p className="text-[clamp(3.2rem,9.5vw,10rem)] font-semibold uppercase leading-[0.82] tracking-[-0.08em]">
          DAN<br /><span className="text-red-flag">BAGIMU?</span>
        </p>
      </div>

      <MerdekaInput
        value={props.answer}
        submitted={props.submitted}
        onChange={props.onAnswerChange}
        onFocusChange={props.onFocusChange}
        onSubmit={props.onSubmit}
        onSkip={props.onSkip}
      />

      <div data-user-answer className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-5 opacity-0 md:px-10">
        <p className="max-w-6xl text-center text-[clamp(2.2rem,6.8vw,7.4rem)] font-medium uppercase leading-[0.88] tracking-[-0.065em] text-bone">
          {answerWords.map((word, index) => (
            <span key={`${word}-${index}`} data-user-answer-word className="mr-[0.18em] inline-block last:mr-0">{word}</span>
          ))}
        </p>
      </div>

      <div data-collective-copy className="pointer-events-none absolute inset-0 flex items-center px-5 opacity-0 md:px-10 lg:px-16">
        <div>
          <p data-one-answer className="text-[clamp(4rem,12vw,12rem)] font-semibold uppercase leading-[0.78] tracking-[-0.085em]">
            SATU<br /><span className="text-red-flag">PERTANYAAN.</span>
          </p>
          <p data-million-answers className="absolute left-5 top-1/2 -translate-y-1/2 text-[clamp(4rem,12vw,12rem)] font-semibold uppercase leading-[0.78] tracking-[-0.085em] opacity-0 md:left-10 lg:left-16">
            JUTAAN<br /><span className="text-red-flag">JAWABAN.</span>
          </p>
        </div>
        <p data-collective-support className="absolute bottom-[12%] right-5 max-w-[14rem] text-right font-mono text-[8px] uppercase leading-[1.8] tracking-[0.2em] text-bone/48 opacity-0 md:right-10 md:max-w-xs md:text-[10px] lg:right-16">
          DAN TIDAK ADA<br />SATU JAWABAN<br />YANG HARUS SAMA.
        </p>
      </div>

      <div data-voice-handoff className="pointer-events-none absolute inset-x-5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] flex items-center justify-end opacity-0 sm:justify-between md:inset-x-10 md:bottom-7 lg:inset-x-16">
        <span className="hidden font-mono text-[8px] tracking-[0.22em] text-bone/42 sm:inline md:text-[9px]">SUARA YANG TERUS HIDUP</span>
        <span className="font-mono text-[8px] tracking-[0.22em] text-red-highlight md:text-[9px]">07 ── SUARA KITA</span>
      </div>
    </div>
  );
}
