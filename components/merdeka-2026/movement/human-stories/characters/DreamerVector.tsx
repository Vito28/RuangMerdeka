import { CharacterGround, EditorialCorners, outlineProps, type CharacterVectorProps } from "./CharacterParts";

export function DreamerVector(props: CharacterVectorProps) {
  return (
    <svg viewBox="0 0 420 520" role="img" aria-label="Ilustrasi generasi muda melihat cahaya yang naik" {...props}>
      <EditorialCorners />
      <CharacterGround d="M48 452C147 440 280 442 374 452" />
      <g data-dreamer-constellation fill="none" stroke="var(--story-secondary)" strokeLinecap="round" strokeWidth="2.5">
        <path d="M244 120l46-45 48 25 40-48" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
        <path d="M290 75l29 70 59-93" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
      </g>
      <g data-dreamer-star fill="#d7ad52"><circle cx="244" cy="120" r="4" /><circle cx="290" cy="75" r="5" /><circle cx="338" cy="100" r="3" /><circle cx="378" cy="52" r="6" /><circle cx="319" cy="145" r="3" /></g>
      <g data-character-fill>
        <ellipse cx="162" cy="157" rx="34" ry="40" fill="#dfcbb8" transform="rotate(7 162 157)" />
        <path d="M130 151c5-31 24-46 47-40 20 5 29 22 22 45-18-14-40-17-69-5z" fill="#211d27" />
        <path d="M111 211c32-25 78-24 109 6l9 128H99z" fill="var(--story-primary)" />
        <path d="M129 217l33 42 34-42 19 8-5 117h-96l-4-117z" fill="var(--story-secondary)" opacity="0.86" />
        <path d="M99 345h62l-8 102H103z" fill="#3d405c" />
        <path d="M161 345h68l13 102h-55z" fill="#3d405c" />
      </g>
      <g data-character-draw {...outlineProps} pathLength="1" strokeDasharray="1" strokeDashoffset="1">
        <ellipse cx="162" cy="157" rx="34" ry="40" transform="rotate(7 162 157)" />
        <path d="M111 211c32-25 78-24 109 6l9 128H99z" />
        <path d="M111 227c-25 30-27 67-6 96M217 228c22 22 32 49 35 78l31-54" />
        <path d="M99 345l4 102M161 345l-8 102M161 345l26 102M229 345l13 102" />
        <path d="M183 160c14-1 25-7 34-18" />
      </g>
      <g data-dreamer-light style={{ transformOrigin: "284px 250px" }}>
        <circle cx="284" cy="250" r="9" fill="var(--story-accent)" />
        <circle cx="284" cy="250" r="24" fill="var(--story-accent)" opacity="0.12" />
        <path d="M284 250C292 214 303 184 319 145" fill="none" stroke="var(--story-accent)" strokeWidth="3" />
      </g>
      <path data-character-exit data-character-draw d="M319 145C347 115 370 84 400 43" fill="none" stroke="var(--story-accent)" strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
    </svg>
  );
}
