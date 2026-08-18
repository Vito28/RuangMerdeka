import { EditorialCorners, outlineProps, type CharacterVectorProps } from "./CharacterParts";

export function GuardianVector(props: CharacterVectorProps) {
  return (
    <svg viewBox="0 0 420 520" role="img" aria-label="Ilustrasi penjaga kehidupan dan aliran air" {...props}>
      <EditorialCorners />
      <g data-guardian-flow fill="none" strokeLinecap="round">
        <path d="M35 388c71-48 117-12 176-21 65-10 88-70 176-30" stroke="var(--story-secondary)" strokeWidth="8" opacity="0.82" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
        <path d="M28 420c77-43 134-9 192-18 71-12 95-60 178-29" stroke="#f2efe9" strokeOpacity="0.42" strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
        <path d="M50 449c68-29 123-5 179-14 61-10 99-42 161-24" stroke="var(--story-primary)" strokeWidth="5" opacity="0.72" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
      </g>
      <g data-character-fill>
        <ellipse cx="209" cy="126" rx="37" ry="43" fill="#dfceb9" />
        <path d="M173 123c2-34 20-52 45-48 23 4 34 22 28 49-20-14-45-15-73-1z" fill="#1d2527" />
        <path d="M151 185c36-25 83-24 116 5l11 150H141z" fill="var(--story-primary)" />
        <path d="M174 189l34 47 34-47 20 7-7 139h-93l-8-139z" fill="var(--story-secondary)" opacity="0.86" />
        <path d="M141 340h67v108h-61z" fill="#314b55" />
        <path d="M208 340h70l-6 108h-58z" fill="#314b55" />
      </g>
      <g data-character-draw {...outlineProps} pathLength="1" strokeDasharray="1" strokeDashoffset="1">
        <ellipse cx="209" cy="126" rx="37" ry="43" />
        <path d="M151 185c36-25 83-24 116 5l11 150H141z" />
        <path data-guardian-arm d="M154 204c-37 30-45 71-20 104 24 31 51 17 75-9" style={{ transformOrigin: "154px 204px" }} />
        <path data-guardian-arm d="M265 207c34 31 40 72 15 102-23 28-49 13-71-10" style={{ transformOrigin: "265px 207px" }} />
        <path d="M141 340l6 108M208 340v108M208 340l6 108M278 340l-6 108" />
      </g>
      <g data-guardian-life>
        <path d="M209 302v-54" fill="none" stroke="#86a85d" strokeLinecap="round" strokeWidth="5" />
        <path d="M207 268c-24-25-44-17-50-4 15 14 32 17 50 4z" fill="#86a85d" />
        <path d="M211 253c19-23 38-19 47-7-12 15-28 20-47 7z" fill="#a4bc70" />
        <circle cx="209" cy="302" r="8" fill="var(--story-accent)" />
      </g>
      <g data-guardian-particle fill="#7faec2"><circle cx="92" cy="351" r="4" /><circle cx="316" cy="310" r="3" /><circle cx="347" cy="327" r="5" /></g>
      <path data-character-exit data-character-draw d="M278 309C321 292 357 263 395 219" fill="none" stroke="var(--story-accent)" strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
    </svg>
  );
}
