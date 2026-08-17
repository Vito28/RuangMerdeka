"use client";

import type { FormEvent, RefObject } from "react";
import { ContributionForm, type ContributionStatus } from "./ContributionForm";

type ReducedContributionContentProps = {
  error: string;
  message: string;
  onMessageChange: (message: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  status: ContributionStatus;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
};

export function ReducedContributionContent(props: ReducedContributionContentProps) {
  return (
    <section id="contribution" aria-label="Niat untuk Indonesia" className="bg-night px-5 py-24 text-bone md:px-10 md:py-32 lg:px-16">
      <div className="flex items-center justify-between border-b border-bone/15 pb-4 font-mono text-[9px] tracking-[0.2em] text-bone/45">
        <p><span className="mr-3 text-red-flag">04</span>SECTION</p><p>NIAT PERSONAL</p>
      </div>

      <div className="grid gap-20 py-28 md:grid-cols-2 md:items-end">
        <p className="text-[clamp(5rem,14vw,12rem)] font-semibold uppercase leading-[0.8] tracking-[-0.08em]">KITA<span className="text-red-flag">.</span></p>
        <p className="text-right text-[clamp(5rem,14vw,12rem)] font-semibold uppercase leading-[0.8] tracking-[-0.08em]">SAYA<span className="text-red-flag">.</span></p>
      </div>

      <div className="relative mx-auto max-w-3xl border-t border-bone/15 py-24">
        {props.status === "success" ? (
          <div>
            <p className="font-mono text-[9px] tracking-[0.22em] text-bone/42">SATU NIAT TELAH BERGERAK</p>
            <p className="mt-8 text-[clamp(4.5rem,13vw,11rem)] font-semibold uppercase leading-[0.78] tracking-[-0.08em]">TERIMA<br /><span className="text-red-flag">KASIH.</span></p>
          </div>
        ) : (
          <ContributionForm {...props} />
        )}
      </div>
    </section>
  );
}
