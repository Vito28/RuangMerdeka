"use client";

import type { FormEvent } from "react";

type MerdekaInputProps = {
  value: string;
  submitted: boolean;
  onChange: (value: string) => void;
  onFocusChange: (focused: boolean) => void;
  onSubmit: () => void;
  onSkip: () => void;
};

export function MerdekaInput({
  value,
  submitted,
  onChange,
  onFocusChange,
  onSubmit,
  onSkip,
}: MerdekaInputProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value.trim()) onSubmit();
  };

  return (
    <form
      data-voice-form
      onSubmit={handleSubmit}
      className="absolute inset-x-5 bottom-[12%] z-30 opacity-0 md:inset-x-10 md:bottom-[11%] lg:inset-x-16"
    >
      <div className="mx-auto max-w-5xl">
        <label htmlFor="merdeka-voice" className="block font-mono text-[8px] uppercase tracking-[0.25em] text-bone/46 md:text-[10px]">
          MERDEKA ADALAH
        </label>
        <div className="mt-3 h-px origin-left bg-bone/22" data-input-rule />
        <textarea
          id="merdeka-voice"
          value={value}
          maxLength={120}
          rows={2}
          readOnly={submitted}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => onFocusChange(true)}
          onBlur={() => onFocusChange(false)}
          placeholder="TULIS DENGAN KATAMU SENDIRI..."
          className="mt-4 block w-full resize-none bg-transparent text-[clamp(1.8rem,5vw,5.4rem)] font-medium uppercase leading-[0.94] tracking-[-0.055em] text-bone caret-red-flag outline-none placeholder:text-bone/16 focus-visible:placeholder:text-bone/8"
        />
        <div className="mt-5 flex items-center justify-between gap-5 border-t border-bone/10 pt-4">
          <span aria-live="polite" className="font-mono text-[8px] tracking-[0.18em] text-bone/38 md:text-[9px]">
            {String(value.length).padStart(3, "0")} / 120
          </span>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={onSkip}
              disabled={submitted}
              className="inline-flex min-h-11 items-center font-mono text-[8px] uppercase tracking-[0.2em] text-bone/44 transition-colors hover:text-bone disabled:cursor-not-allowed disabled:opacity-25 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-bone md:text-[9px]"
            >
              LEWATI
            </button>
            <button
              type="submit"
              disabled={!value.trim() || submitted}
              className="inline-flex min-h-11 items-center font-mono text-[8px] uppercase tracking-[0.2em] text-red-highlight transition-opacity disabled:cursor-not-allowed disabled:opacity-25 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-red-highlight md:text-[9px]"
            >
              KIRIM SUARAMU <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
