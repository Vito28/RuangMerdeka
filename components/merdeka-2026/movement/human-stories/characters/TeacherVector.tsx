import { CharacterGround, EditorialCorners, outlineProps, type CharacterVectorProps } from "./CharacterParts";

export function TeacherVector(props: CharacterVectorProps) {
  return (
    <svg viewBox="0 0 420 520" role="img" aria-label="Ilustrasi seorang pengajar dengan buku terbuka" {...props}>
      <EditorialCorners />
      <CharacterGround />
      <g data-character-fill>
        <path d="M175 175C154 190 144 233 142 294l18 92h104l14-100c-3-54-16-91-38-111z" fill="var(--story-primary)" />
        <path d="M180 182l30 42 30-42-10-14h-40z" fill="#f2efe9" />
        <path d="M160 379l13 68h34l4-68z" fill="var(--story-secondary)" />
        <path d="M213 379l7 68h35l10-68z" fill="var(--story-secondary)" />
        <ellipse cx="209" cy="124" rx="38" ry="43" fill="#e7d8c6" />
        <path d="M172 120c2-37 19-57 47-52 21 4 34 20 31 45-18-13-46-18-78 7z" fill="#181719" />
      </g>
      <g data-teacher-book data-character-fill style={{ transformOrigin: "210px 308px" }}>
        <path d="M132 289c30-9 55-3 78 17v76c-22-16-47-21-78-12z" fill="#f2efe9" />
        <path d="M210 306c23-20 49-26 79-17v81c-31-9-57-4-79 12z" fill="#f2efe9" />
        <path d="M210 306v76" stroke="var(--story-accent)" strokeWidth="4" />
        <path d="M148 316c18-2 33 2 46 11M226 327c15-10 31-13 48-10" fill="none" stroke="var(--story-primary)" strokeLinecap="round" strokeWidth="3" />
      </g>
      <g data-character-draw {...outlineProps} pathLength="1" strokeDasharray="1" strokeDashoffset="1">
        <ellipse cx="209" cy="124" rx="38" ry="43" />
        <path d="M175 175c-22 19-30 65-31 111M240 175c25 22 34 66 36 111" />
        <path d="M177 190l-24 86 40 34M240 191l30 78-41 35" />
        <path d="M160 379l13 68M211 381l-4 66M219 381l1 66M265 379l-10 68" />
        <path d="M132 289c30-9 55-3 78 17 23-20 49-26 79-17v81c-31-9-57-4-79 12-22-16-47-21-78-12z" />
      </g>
      <g data-teacher-knowledge fill="var(--story-accent)">
        <circle cx="112" cy="250" r="5" /><circle cx="102" cy="226" r="3" /><circle cx="308" cy="244" r="5" /><circle cx="320" cy="219" r="3" />
      </g>
      <path data-character-exit data-character-draw d="M291 333C338 318 363 290 386 248" fill="none" stroke="var(--story-accent)" strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
    </svg>
  );
}
