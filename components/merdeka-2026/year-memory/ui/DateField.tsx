type DateFieldProps = {
  id: string;
  date: string;
};

export function DateField({ id, date }: DateFieldProps) {
  const parts = date.split(".");

  return (
    <div
      data-memory-date={id}
      aria-label={date}
      className="flex items-end gap-2 text-[clamp(4.4rem,13vw,12rem)] font-semibold leading-[0.7] tracking-[-0.085em] text-bone/90 opacity-0 md:gap-4"
    >
      {parts.map((part, index) => (
        <span
          key={`${part}-${index}`}
          aria-hidden="true"
          className={index === 1 ? "translate-y-[0.22em] text-bone/48" : index === 2 ? "translate-y-[0.42em] text-[0.38em] tracking-[-0.04em] text-red-flag" : ""}
        >
          {part}
        </span>
      ))}
    </div>
  );
}
