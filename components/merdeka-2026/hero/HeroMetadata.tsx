import Link from "next/link";

export function HeroMetadata() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex h-20 items-center justify-between border-b border-white/10 px-5 font-mono text-[8px] tracking-[0.2em] text-white/45 md:px-10 md:text-[9px] lg:px-16">
      <Link
        href="/"
        className="pointer-events-auto text-bone transition-colors hover:text-red-flag focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone"
      >
        RUANG MERDEKA
      </Link>
      <div aria-hidden="true" className="flex items-center gap-5 md:gap-10">
        <p>06° N — 11° S</p>
        <p className="hidden sm:block">95° E — 141° E</p>
        <p>01 / 2026</p>
      </div>
    </div>
  );
}
