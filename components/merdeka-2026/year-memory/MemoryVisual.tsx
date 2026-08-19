import Image from "next/image";
import type { YearMemory } from "./types";

function MemoryImage({ memory, sharp = false }: { memory: YearMemory; sharp?: boolean }) {
  return (
    <Image
      src={memory.image}
      alt={sharp ? "" : memory.alt}
      aria-hidden={sharp || undefined}
      fill
      sizes="100vw"
      className={`object-cover ${memory.objectPosition}`}
    />
  );
}

export function MemoryVisual({ memory }: { memory: YearMemory }) {
  return (
    <article
      data-memory-scene={memory.id}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-0"
      style={{ backgroundColor: memory.background }}
    >
      <div data-memory-image={memory.id} className="absolute inset-0 [backface-visibility:hidden] [transform:translateZ(0)] will-change-transform">
        <MemoryImage memory={memory} />
      </div>

      {memory.treatment === "development" && (
        <div
          data-memory-exposure={memory.id}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_62%_58%,transparent_0%,rgba(5,5,5,0.58)_36%,#050505_78%)] mix-blend-multiply"
        />
      )}

      {memory.treatment === "dual-exposure" && (
        <div
          data-dual-grade={memory.id}
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(149,61,24,0.24)_0%,rgba(149,61,24,0.06)_47%,rgba(5,5,5,0.58)_54%,rgba(5,5,5,0.2)_100%)]"
        />
      )}

      {memory.treatment === "heat" && (
        <>
          <div data-heat-air className="absolute inset-0 bg-[linear-gradient(180deg,rgba(186,107,50,0.11),transparent_42%,rgba(95,42,18,0.16))] mix-blend-screen" />
          <svg data-heat-thread className="absolute inset-x-0 bottom-[18%] h-20 w-full opacity-0" viewBox="0 0 1600 100" fill="none" preserveAspectRatio="none">
            <path d="M-30 63C190 37 328 74 518 54C726 32 845 76 1060 49C1267 24 1402 66 1632 38" pathLength="1" stroke="#C8102E" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </>
      )}

      {memory.treatment === "focus-scan" && (
        <div
          data-memory-sharp={memory.id}
          className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent_0%,black_42%,black_58%,transparent_100%)] [mask-position:0%_0%] [mask-size:100%_500%] [mask-repeat:no-repeat]"
        >
          <MemoryImage memory={memory} sharp />
        </div>
      )}

      {memory.treatment === "aperture" && (
        <div
          data-memory-sharp={memory.id}
          className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_38%_62%,black_0%,black_28%,transparent_70%)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:32%_32%]"
        >
          <MemoryImage memory={memory} sharp />
        </div>
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.2)_0%,transparent_28%,transparent_62%,rgba(5,5,5,0.76)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_36%,rgba(5,5,5,0.5)_100%)]" />
    </article>
  );
}
