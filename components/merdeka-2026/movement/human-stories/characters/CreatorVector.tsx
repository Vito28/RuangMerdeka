import { CharacterGround, EditorialCorners, outlineProps, type CharacterVectorProps } from "./CharacterParts";

export function CreatorVector(props: CharacterVectorProps) {
  return (
    <svg viewBox="0 0 420 520" role="img" aria-label="Ilustrasi pencipta yang menghubungkan gagasan" {...props}>
      <EditorialCorners />
      <CharacterGround />
      <g data-creator-network fill="none" stroke="var(--story-secondary)" strokeLinecap="round" strokeWidth="3">
        <path data-creator-connection d="M236 122L306 78l62 48-36 69 45 61" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
        <path data-creator-connection d="M236 122l70 72 26 1" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
        <path data-creator-connection d="M306 78l26 117" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
        <path data-creator-connection d="M306 194l-34 62 61 46" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
      </g>
      <g data-creator-node fill="var(--story-accent)">
        <circle cx="236" cy="122" r="7" /><circle cx="306" cy="78" r="5" /><circle cx="368" cy="126" r="8" /><circle cx="332" cy="195" r="6" /><circle cx="377" cy="256" r="5" /><circle cx="272" cy="256" r="5" /><circle cx="333" cy="302" r="7" />
      </g>
      <g data-character-fill>
        <ellipse cx="139" cy="151" rx="35" ry="41" fill="#e2cfbd" />
        <path d="M104 148c3-33 21-49 45-45 21 4 32 22 25 48-20-13-43-14-70-3z" fill="#201d24" />
        <path d="M94 207c33-25 77-23 105 5l4 132H87z" fill="var(--story-primary)" />
        <path d="M113 211l27 38 27-38 17 5-2 126H98l-2-126z" fill="var(--story-secondary)" opacity="0.9" />
        <path d="M87 344h55l-7 103H89z" fill="#4d5266" />
        <path d="M142 344h61l13 103h-51z" fill="#4d5266" />
      </g>
      <g data-character-draw {...outlineProps} pathLength="1" strokeDasharray="1" strokeDashoffset="1">
        <ellipse cx="139" cy="151" rx="35" ry="41" />
        <path d="M94 207c33-25 77-23 105 5l4 132H87z" />
        <path d="M94 224c-22 31-19 67 7 91M194 223c20 19 29 45 34 74l44-41" />
        <path d="M87 344l2 103M142 344l-7 103M142 344l23 103M203 344l13 103" />
      </g>
      <g data-creator-cursor>
        <path d="M224 286l18 42 9-15 17 18 8-8-18-18 15-9z" fill="#f2efe9" stroke="var(--story-accent)" strokeLinejoin="round" strokeWidth="3" />
      </g>
      <path data-character-exit data-character-draw d="M333 302C354 328 374 347 403 359" fill="none" stroke="var(--story-accent)" strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
    </svg>
  );
}
