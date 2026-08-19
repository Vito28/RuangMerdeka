type TraceLabelProps = {
  index: number;
  label: string;
  statement: string;
  placement: "left" | "right";
};

const placementClasses = {
  left: "left-5 top-[30%] items-start text-left md:left-10 lg:left-16",
  right: "right-5 top-[58%] items-end text-right md:right-10 lg:right-16",
} as const;

export function TraceLabel({ index, label, statement, placement }: TraceLabelProps) {
  return (
    <div
      data-trace-label={index}
      className={`absolute flex max-w-[17rem] flex-col opacity-0 ${placementClasses[placement]}`}
    >
      <div className={`flex items-center gap-3 ${placement === "right" ? "flex-row-reverse" : ""}`}>
        <span className="font-mono text-[8px] tracking-[0.2em] text-bone/48 md:text-[9px]">{label}</span>
        <span aria-hidden="true" className="h-px w-10 origin-left bg-red-flag/75" data-trace-label-line />
      </div>
      <p className="mt-4 text-[clamp(1rem,2vw,1.55rem)] font-medium uppercase leading-[1.02] tracking-[-0.035em] text-bone/88">
        {statement}
      </p>
    </div>
  );
}
