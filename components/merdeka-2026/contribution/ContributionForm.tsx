"use client";

import type { FormEvent, RefObject } from "react";
import { CONTRIBUTION_LIMITS } from "./animation/contribution-phases";

export type ContributionStatus = "idle" | "submitting" | "success";

type ContributionFormProps = {
  error: string;
  message: string;
  onMessageChange: (message: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  status: ContributionStatus;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
};

export function ContributionForm({
  error,
  message,
  onMessageChange,
  onSubmit,
  status,
  textareaRef,
}: ContributionFormProps) {
  const disabled = status !== "idle";

  return (
    <form className="w-full" onSubmit={onSubmit} noValidate>
      <div data-contribution-input-content>
        <p className="font-mono text-[8px] tracking-[0.24em] text-bone/42 md:text-[9px]">
          RUANG UNTUK SATU NIAT
        </p>
        <label htmlFor="contribution-message" className="mt-6 block text-[clamp(1.55rem,3.2vw,3.5rem)] font-medium uppercase leading-[1.02] tracking-[-0.045em]">
          UNTUK INDONESIA,<br /><span className="text-red-flag">SAYA AKAN...</span>
        </label>

        <div className="relative mt-12 border-b border-bone/35 focus-within:border-red-flag">
          <textarea
            ref={textareaRef}
            id="contribution-message"
            name="message"
            value={message}
            onChange={(event) => onMessageChange(event.target.value)}
            maxLength={CONTRIBUTION_LIMITS.maximum}
            rows={2}
            disabled={disabled}
            aria-describedby="contribution-help contribution-error"
            aria-invalid={Boolean(error)}
            autoComplete="off"
            placeholder="tulis sesuatu..."
            className="block min-h-24 w-full resize-none bg-transparent pb-5 pr-1 text-[clamp(1.35rem,2.8vw,2.8rem)] font-medium leading-[1.12] tracking-[-0.035em] text-bone outline-none placeholder:text-bone/24 disabled:opacity-60"
          />
          <span data-contribution-underline className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-red-flag" />
        </div>

        <div className="mt-4 flex min-h-11 items-start justify-between gap-5">
          <div className="font-mono text-[8px] leading-relaxed tracking-[0.18em] md:text-[9px]">
            <p id="contribution-help" className="text-bone/36">SATU KALIMAT · MAKS. {CONTRIBUTION_LIMITS.maximum} KARAKTER</p>
            <p id="contribution-error" className="mt-2 text-red-highlight" aria-live="polite">{error}</p>
          </div>
          <p className="shrink-0 font-mono text-[8px] tracking-[0.18em] text-bone/34 md:text-[9px]">
            {message.length.toString().padStart(3, "0")} / {CONTRIBUTION_LIMITS.maximum}
          </p>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={disabled}
            className="group inline-flex min-h-11 items-center gap-5 border-b border-bone/30 px-1 font-mono text-[10px] tracking-[0.24em] text-bone transition-colors hover:border-red-flag hover:text-red-highlight focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-red-flag active:text-red-flag disabled:cursor-wait disabled:opacity-40"
          >
            <span>{status === "submitting" ? "MENGIRIM" : "KIRIM"}</span>
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none">→</span>
          </button>
        </div>
      </div>

      <span data-contribution-capture aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[48%] h-14 origin-left scale-x-0 opacity-0 md:h-20">
        <span className="absolute inset-x-0 top-[42%] h-2 bg-merdeka md:h-3" />
        <span className="absolute inset-x-0 top-[62%] h-1.5 bg-bone md:top-[64%] md:h-2" />
      </span>
    </form>
  );
}
