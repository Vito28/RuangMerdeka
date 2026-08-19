"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useDevicePerformance } from "../../hero/hooks/use-device-performance";
import type { TraceCanvasProps, TraceProgressRef } from "../types";
import { LivingMosaic } from "./LivingMosaic";
import { PhotographicJourney } from "./PhotographicJourney";
import { RedSignal } from "./RedSignal";
import { TraceCameraRig } from "./TraceCameraRig";
import { TransitionCitySlices } from "./TransitionCitySlices";
import { useTraceTextures } from "./use-trace-textures";

function TraceScene({ progressRef, quality }: { progressRef: TraceProgressRef; quality: "high" | "medium" | "low" }) {
  const textures = useTraceTextures(quality);

  return (
    <>
      <fog attach="fog" args={["#050505", 7, 58]} />
      <TraceCameraRig progressRef={progressRef} />
      <TransitionCitySlices progressRef={progressRef} texture={textures["transition-city"]} />
      <PhotographicJourney progressRef={progressRef} textures={textures} />
      <LivingMosaic progressRef={progressRef} textures={textures} />
      <RedSignal progressRef={progressRef} />
    </>
  );
}

export default function TraceCanvas({ active, progressRef }: TraceCanvasProps) {
  const tier = useDevicePerformance();
  const dpr = tier === "high" ? 1.5 : tier === "medium" ? 1.25 : 1;

  return (
    <Canvas
      aria-hidden="true"
      frameloop={active ? "always" : "never"}
      dpr={dpr}
      camera={{ position: [0, 0.04, 7], fov: tier === "low" ? 50 : 43, near: 0.1, far: 85 }}
      gl={{ alpha: false, antialias: tier !== "low", powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor("#050505", 1)}
    >
      <Suspense fallback={null}>
        <TraceScene progressRef={progressRef} quality={tier} />
      </Suspense>
    </Canvas>
  );
}
