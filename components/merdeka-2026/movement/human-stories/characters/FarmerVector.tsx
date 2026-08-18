import { EditorialCorners, outlineProps, type CharacterVectorProps } from "./CharacterParts";

export function FarmerVector(props: CharacterVectorProps) {
  return (
    <svg viewBox="0 0 420 520" role="img" aria-label="Ilustrasi seseorang menanam bibit" {...props}>
      <EditorialCorners />
      <path data-character-draw d="M46 433C137 413 271 426 383 432" {...outlineProps} stroke="#9d7653" strokeOpacity="0.55" strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
      <g data-character-fill>
        <ellipse cx="168" cy="151" rx="36" ry="41" fill="#dfcdb7" transform="rotate(-18 168 151)" />
        <path d="M136 139c9-31 29-45 55-35 18 7 26 23 22 42-25-12-50-14-77-7z" fill="#20201d" />
        <path d="M146 190c36-8 77 8 103 45l-49 76-101-23c8-46 20-80 47-98z" fill="var(--story-primary)" />
        <path d="M112 285l78 19-35 111-47-8z" fill="var(--story-secondary)" />
        <path d="M190 304l50 6 49 82-40 22-64-75z" fill="#7e5a43" />
        <path d="M149 201l23-9 14 93-24 8z" fill="var(--story-accent)" opacity="0.85" />
      </g>
      <g data-character-draw {...outlineProps} pathLength="1" strokeDasharray="1" strokeDashoffset="1">
        <ellipse cx="168" cy="151" rx="36" ry="41" transform="rotate(-18 168 151)" />
        <path d="M146 190c36-8 77 8 103 45l-49 76-101-23c8-46 20-80 47-98z" />
        <path d="M116 221c24 27 51 49 82 63M239 230c22 31 42 66 55 103" />
        <path d="M112 285l-4 122M190 304l-35 111M190 304l59 110M289 392l-40 22" />
      </g>
      <circle data-farmer-seed cx="313" cy="316" r="6" fill="#e60012" />
      <g data-farmer-plant style={{ transformOrigin: "313px 425px" }}>
        <path d="M313 426c1-40 0-78 0-111" fill="none" stroke="#83a85b" strokeLinecap="round" strokeWidth="6" />
        <path data-farmer-leaf d="M312 368c-28-31-51-22-58-7 19 15 39 20 58 7z" fill="#83a85b" style={{ transformOrigin: "310px 369px" }} />
        <path data-farmer-leaf d="M314 345c22-29 46-24 57-10-14 18-35 25-57 10z" fill="#a2bd68" style={{ transformOrigin: "315px 346px" }} />
        <path d="M313 426c-8 13-17 22-29 28M313 426c8 12 19 20 33 25" fill="none" stroke="#b56743" strokeLinecap="round" strokeWidth="3" />
      </g>
      <g data-farmer-growth fill="#d4a94f"><circle cx="286" cy="391" r="3" /><circle cx="341" cy="373" r="4" /><circle cx="359" cy="407" r="2.5" /></g>
      <path data-character-exit data-character-draw d="M314 316C338 286 357 264 389 241" fill="none" stroke="#e60012" strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
    </svg>
  );
}
