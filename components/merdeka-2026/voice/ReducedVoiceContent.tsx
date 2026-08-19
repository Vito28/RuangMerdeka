"use client";

import { useVoiceExperience } from "./VoiceExperienceContext";

export function ReducedVoiceContent() {
  const { draft: answer, setDraft: setAnswer, status, submitVoice } = useVoiceExperience();
  const submitted = status === "submitted";

  return (
    <section id="voice" aria-label="Apa arti merdeka hari ini?" className="relative bg-night px-5 py-24 text-bone md:px-10 lg:px-16">
      <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-bone/44">SETELAH SEMUA YANG KITA JALANI...</p>
      <h2 className="mt-16 text-[clamp(3.7rem,12vw,10rem)] font-semibold uppercase leading-[0.8] tracking-[-0.085em]">
        APA ARTI<br /><span className="text-red-flag">MERDEKA</span><br />HARI INI?
      </h2>
      <form
        className="mt-28 max-w-5xl"
        onSubmit={(event) => {
          event.preventDefault();
          if (answer.trim()) submitVoice();
        }}
      >
        <label htmlFor="reduced-merdeka-voice" className="font-mono text-[9px] tracking-[0.22em] text-bone/48">MERDEKA ADALAH</label>
        <textarea
          id="reduced-merdeka-voice"
          maxLength={120}
          rows={3}
          readOnly={submitted}
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          className="mt-4 block w-full resize-none border-y border-bone/15 bg-transparent py-6 text-3xl uppercase outline-none placeholder:text-bone/16"
          placeholder="TULIS DENGAN KATAMU SENDIRI..."
        />
        <button className="mt-5 font-mono text-[9px] tracking-[0.2em] text-red-highlight disabled:opacity-30" disabled={!answer.trim() || submitted}>
          {submitted ? "SUARAMU TERSIMPAN DI LAYAR INI" : "KIRIM SUARAMU →"}
        </button>
      </form>
      <p className="mt-32 text-[clamp(3rem,9vw,8rem)] font-semibold uppercase leading-[0.82] tracking-[-0.075em]">
        JUTAAN<br /><span className="text-red-flag">JAWABAN.</span>
      </p>
    </section>
  );
}
