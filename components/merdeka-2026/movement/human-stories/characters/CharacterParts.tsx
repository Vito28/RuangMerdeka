import type { SVGProps } from "react";

export type CharacterVectorProps = SVGProps<SVGSVGElement>;

export const outlineProps = {
  fill: "none",
  stroke: "#f2efe9",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 3,
  vectorEffect: "non-scaling-stroke" as const,
};

export function EditorialCorners() {
  return (
    <g data-character-frame data-character-draw {...outlineProps} stroke="#f2efe9" strokeOpacity="0.28" strokeWidth="1.4" pathLength="1" strokeDasharray="1" strokeDashoffset="1">
      <path d="M34 120V54h74" />
      <path d="M386 400v66h-74" />
      <path d="M52 470h38" />
      <path d="M368 50h-38" />
    </g>
  );
}

export function CharacterGround({ d = "M62 444C154 431 274 432 360 446" }: { d?: string }) {
  return <path data-character-draw d={d} {...outlineProps} stroke="#f2efe9" strokeOpacity="0.22" strokeWidth="1.5" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />;
}
