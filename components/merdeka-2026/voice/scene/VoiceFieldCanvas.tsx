"use client";

import { Canvas } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import VoiceSignalField from "./VoiceSignalField";

type VoiceFieldCanvasProps = {
  progressRef: MutableRefObject<number>;
  submitted: boolean;
  active: boolean;
};

export default function VoiceFieldCanvas(props: VoiceFieldCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.35]}
      camera={{ position: [0, 0, 7], fov: 46, near: 0.1, far: 30 }}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
    >
      <VoiceSignalField {...props} />
    </Canvas>
  );
}
