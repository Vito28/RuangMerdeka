type MemoryStampProps = {
  id: string;
  index: string;
  date: string;
  label: string;
  location: string;
};

export function MemoryStamp({ id, index, date, label, location }: MemoryStampProps) {
  return (
    <div data-memory-stamp={id} className="opacity-0">
      <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-bone/42 md:text-[9px]">
        <span className="text-red-flag">{index}</span>
        <span aria-hidden="true"> / </span>
        {date}
      </p>
      <div className="mt-3 h-px w-8 bg-red-flag/65" />
      <p className="mt-3 max-w-48 font-mono text-[8px] uppercase leading-relaxed tracking-[0.2em] text-bone/52 md:text-[9px]">
        {label}<br />{location}
      </p>
    </div>
  );
}
