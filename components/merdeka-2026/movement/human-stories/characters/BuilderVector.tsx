import { CharacterGround, EditorialCorners, outlineProps, type CharacterVectorProps } from "./CharacterParts";

export function BuilderVector(props: CharacterVectorProps) {
  return (
    <svg viewBox="0 0 420 520" role="img" aria-label="Ilustrasi perancang yang membangun struktur" {...props}>
      <EditorialCorners />
      <CharacterGround d="M40 450C139 439 282 441 389 451" />
      <g data-builder-structure fill="none" strokeLinecap="round">
        <path data-builder-beam d="M250 432V156" stroke="var(--story-secondary)" strokeWidth="12" style={{ transformOrigin: "250px 432px" }} />
        <path data-builder-beam d="M356 432V112" stroke="var(--story-secondary)" strokeWidth="12" style={{ transformOrigin: "356px 432px" }} />
        <path data-builder-beam-horizontal d="M246 257H360" stroke="var(--story-primary)" strokeWidth="10" style={{ transformOrigin: "250px 257px" }} />
        <path data-builder-beam-horizontal d="M246 157H360" stroke="var(--story-primary)" strokeWidth="10" style={{ transformOrigin: "250px 157px" }} />
        <path data-character-draw d="M250 112l53-42 53 42" stroke="var(--story-accent)" strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
      </g>
      <g data-character-fill>
        <ellipse cx="143" cy="156" rx="34" ry="40" fill="#e4d1ba" />
        <path d="M108 154c2-31 19-48 42-45 21 3 33 19 29 43-22-11-45-11-71 2z" fill="#252526" />
        <path d="M100 205c30-22 72-21 101 4l9 129-119 2z" fill="var(--story-primary)" />
        <path d="M116 203l21 51 21-51 20 2 18 132H99z" fill="var(--story-primary)" />
        <path d="M90 338h55l-8 108H91z" fill="var(--story-secondary)" />
        <path d="M145 338h60l13 108h-51z" fill="var(--story-secondary)" />
        <path d="M121 211h75l-7 29h-61z" fill="#f2efe9" opacity="0.88" />
        <path d="M130 211l9 29M178 211l-7 29" stroke="var(--story-accent)" strokeWidth="5" />
      </g>
      <g data-character-draw {...outlineProps} pathLength="1" strokeDasharray="1" strokeDashoffset="1">
        <ellipse cx="143" cy="156" rx="34" ry="40" />
        <path d="M100 205c30-22 72-21 101 4l9 129-119 2z" />
        <path data-builder-arm d="M103 221c-23 30-23 66 1 91M198 218c22 15 37 38 45 66l31-28" style={{ transformOrigin: "198px 218px" }} />
        <path d="M91 340v106M145 340l-8 106M145 340l22 106M205 340l13 106" />
      </g>
      <g data-builder-spark fill="var(--story-accent)"><circle cx="276" cy="256" r="5" /><circle cx="292" cy="242" r="3" /><circle cx="286" cy="273" r="2.5" /></g>
      <path data-character-exit data-character-draw d="M356 112C376 92 389 76 401 53" fill="none" stroke="var(--story-accent)" strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
    </svg>
  );
}
