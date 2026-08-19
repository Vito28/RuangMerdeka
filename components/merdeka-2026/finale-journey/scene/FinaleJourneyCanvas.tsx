"use client";

import { Canvas } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import type { FinaleJourneyQuality } from "../types";
import { FinaleJourneyCamera } from "./FinaleJourneyCamera";
import { JourneyEnergy } from "./JourneyEnergy";
import { FinalSignal, JourneyParticleField } from "./JourneyParticleField";

type Props = {
  progressRef: MutableRefObject<number>;
  quality: FinaleJourneyQuality;
  active: boolean;
  hasUserSignal: boolean;
};

export default function FinaleJourneyCanvas(props: Props) {
  return (
    <Canvas
      dpr={props.quality === "high" ? [1, 1.5] : props.quality === "medium" ? [1, 1.3] : 1}
      camera={{ position: [0, 0, 8.2], fov: 46, near: 0.1, far: 45 }}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
    >
      <fog attach="fog" args={["#050505", 8, 28]} />
      <JourneyParticleField {...props} />
      <JourneyEnergy progressRef={props.progressRef} active={props.active} />
      <FinalSignal progressRef={props.progressRef} active={props.active} />
      <FinaleJourneyCamera progressRef={props.progressRef} active={props.active} />
    </Canvas>
  );
}
