"use client";

import { Canvas } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import type { CollectiveQuality } from "../types";
import { CollectiveCameraRig } from "./CollectiveCameraRig";
import { QUALITY_CONFIG } from "./field-utils";
import { FirstResonance } from "./FirstResonance";
import { HorizonField } from "./HorizonField";
import { ResonanceField } from "./ResonanceField";
import { VoiceLandscape } from "./VoiceLandscape";
import { VoiceSignals } from "./VoiceSignals";

type CollectiveVoiceCanvasProps = {
  progressRef: MutableRefObject<number>;
  quality: CollectiveQuality;
  active: boolean;
  hasUserSignal: boolean;
};

export default function CollectiveVoiceCanvas(props: CollectiveVoiceCanvasProps) {
  return (
    <Canvas
      dpr={QUALITY_CONFIG[props.quality].dpr}
      camera={{ position: [0, 0.15, 7.2], fov: 46, near: 0.1, far: 45 }}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
    >
      <fog attach="fog" args={["#050505", 8, 25]} />
      <VoiceSignals {...props} />
      <FirstResonance progressRef={props.progressRef} active={props.active} />
      <ResonanceField progressRef={props.progressRef} quality={props.quality} active={props.active} />
      <VoiceLandscape {...props} />
      <HorizonField progressRef={props.progressRef} active={props.active} />
      <CollectiveCameraRig progressRef={props.progressRef} active={props.active} />
    </Canvas>
  );
}
