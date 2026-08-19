"use client";

import { useState } from "react";

function LogoMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 42 42" className="size-8 shrink-0 md:size-9">
      <circle cx="21" cy="21" r="18.5" fill="#A53F35" />
      <path d="M11 13v16M11 21h11M22 13v16M31 13l-9 9 10 8" stroke="#F5F0E7" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="31" cy="11" r="4" fill="#D1A04E" stroke="#F5F0E7" strokeWidth="1.5" />
    </svg>
  );
}

const links = [
  ["Cerita", "#cerita"],
  ["Kalender", "#kalender"],
  ["Arsip", "#arsip"],
  ["Tentang", "#tentang"],
] as const;

export function HomeNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <header
      data-home-nav
      className="absolute inset-x-0 top-0 z-50 flex h-20 items-center justify-between px-5 md:h-28 md:px-10 lg:px-16"
    >
      <a
        href="#top"
        aria-label="Hari Kita, kembali ke awal"
        className="group flex items-center gap-3 text-hari-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hari-red"
      >
        <LogoMark />
        <span className="font-display text-[1.45rem] font-semibold leading-none tracking-[-0.035em] md:text-[1.65rem]">
          Hari Kita
        </span>
      </a>

      <nav aria-label="Navigasi utama" className="hidden items-center gap-8 md:flex">
        {links.map(([label, href]) => (
          <a
            key={href}
            href={href}
            className="group relative py-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-hari-ink/64 transition-colors hover:text-hari-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hari-red"
          >
            {label}
            <span className="absolute inset-x-0 bottom-1 h-px origin-left scale-x-0 bg-hari-red transition-transform duration-300 group-hover:scale-x-100" />
          </a>
        ))}
      </nav>

      <button
        type="button"
        aria-expanded={open}
        aria-controls="home-mobile-menu"
        onClick={() => setOpen((value) => !value)}
        className="relative z-20 min-h-11 px-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-hari-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hari-red md:hidden"
      >
        {open ? "Tutup" : "Menu"}
      </button>

      <div
        id="home-mobile-menu"
        data-open={open}
        className="absolute inset-x-3 top-3 z-10 origin-top bg-hari-paper-deep px-5 pb-7 pt-20 shadow-[0_24px_70px_rgba(80,56,34,0.22)] transition-[opacity,transform] duration-500 ease-cinematic data-[open=false]:pointer-events-none data-[open=false]:scale-y-90 data-[open=false]:opacity-0 md:hidden"
      >
        <nav aria-label="Navigasi mobile" className="flex flex-col border-t border-hari-ink/20">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-baseline justify-between border-b border-hari-ink/20 py-4 font-display text-3xl text-hari-ink focus-visible:outline-2 focus-visible:outline-hari-red"
            >
              {label}
              <span aria-hidden="true" className="font-sans text-sm text-hari-red">↘</span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
