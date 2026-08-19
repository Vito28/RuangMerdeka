"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mapTraceProgress, traceWindow } from "../animation/trace-phases";
import { CORRIDOR_LAYOUT, TRACE_MEDIA_BY_ID } from "../data/trace-media";
import type { TraceProgressRef, TraceTextureMap } from "../types";
import { getTraceWorldX } from "./TraceCameraRig";
import { createTraceMaskMaterial } from "./trace-mask-material";

const PLANE_GEOMETRY = new THREE.PlaneGeometry(1, 1);
const OCCLUDER_LAYOUT = [
  [-2.65, 0.78], [-0.92, 1.04], [0.88, 0.66], [2.55, 1.18],
] as const;

function setBasicOpacity(mesh: THREE.Mesh | null, opacity: number) {
  if (!mesh) return;
  const material = mesh.material as THREE.MeshBasicMaterial;
  material.opacity = opacity;
  mesh.visible = opacity > 0.002;
}

type PhotographicJourneyProps = {
  progressRef: TraceProgressRef;
  textures: TraceTextureMap;
};

export function PhotographicJourney({ progressRef, textures }: PhotographicJourneyProps) {
  const educationRef = useRef<THREE.Mesh>(null);
  const panganRef = useRef<THREE.Mesh>(null);
  const connectivityRef = useRef<THREE.Mesh>(null);
  const technologyRef = useRef<THREE.Mesh>(null);
  const cultureRef = useRef<THREE.Mesh>(null);
  const generationRef = useRef<THREE.Mesh>(null);
  const quietRef = useRef<THREE.Mesh>(null);
  const occluderRefs = useRef<Array<THREE.Mesh | null>>([]);
  const corridorRefs = useRef<Array<THREE.Mesh | null>>([]);
  const { size } = useThree();
  const isMobile = size.width < 768;

  const panganMaterial = useMemo(
    () => createTraceMaskMaterial(textures.pangan, "horizon"),
    [textures.pangan],
  );
  const cultureMaterial = useMemo(
    () => createTraceMaskMaterial(textures.culture, "fabric"),
    [textures.culture],
  );

  useEffect(() => () => {
    panganMaterial.dispose();
    cultureMaterial.dispose();
  }, [cultureMaterial, panganMaterial]);

  useFrame((state) => {
    const progress = progressRef.current;
    const mobileScale = isMobile ? 0.8 : 1;

    const educationVisibility = traceWindow(progress, ...TRACE_MEDIA_BY_ID.education.phase, 0.022);
    const educationApproach = mapTraceProgress(progress, 0.27, 0.355);
    setBasicOpacity(educationRef.current, educationVisibility);
    if (educationRef.current) {
      const width = THREE.MathUtils.lerp(6.05, 7.75, educationApproach) * mobileScale;
      educationRef.current.position.set(getTraceWorldX(0.55, isMobile), 0.18, -5);
      educationRef.current.rotation.set(
        -0.012,
        THREE.MathUtils.lerp(-0.122, -0.026, educationApproach),
        0,
      );
      educationRef.current.scale.set(width, width / TRACE_MEDIA_BY_ID.education.aspect, 1);
    }

    const panganVisibility = traceWindow(progress, ...TRACE_MEDIA_BY_ID.pangan.phase, 0.022);
    const panganReveal = mapTraceProgress(progress, 0.355, 0.415);
    if (panganRef.current) {
      const material = panganRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uReveal.value = panganReveal;
      material.uniforms.uOpacity.value = panganVisibility;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      panganRef.current.visible = panganVisibility > 0.002;
      const width = 8.15 * mobileScale;
      panganRef.current.position.set(getTraceWorldX(-0.15, isMobile), -0.22, -10);
      panganRef.current.rotation.set(-0.014, 0.018, 0);
      panganRef.current.scale.set(width, width / TRACE_MEDIA_BY_ID.pangan.aspect, 1);
    }

    const connectivityVisibility = traceWindow(progress, ...TRACE_MEDIA_BY_ID.connectivity.phase, 0.024);
    const connectivityTravel = mapTraceProgress(progress, 0.435, 0.545);
    setBasicOpacity(connectivityRef.current, connectivityVisibility);
    if (connectivityRef.current) {
      const width = THREE.MathUtils.lerp(8.35, 8.85, connectivityTravel) * mobileScale;
      connectivityRef.current.position.set(
        getTraceWorldX(0.25 + connectivityTravel * 0.62, isMobile),
        0.04,
        -15,
      );
      connectivityRef.current.rotation.set(
        -0.008,
        THREE.MathUtils.lerp(-0.045, 0.012, connectivityTravel),
        0,
      );
      connectivityRef.current.scale.set(width, width / TRACE_MEDIA_BY_ID.connectivity.aspect, 1);
    }

    const technologyVisibility = traceWindow(progress, ...TRACE_MEDIA_BY_ID.technology.phase, 0.021);
    const technologyReveal = mapTraceProgress(progress, 0.515, 0.585);
    setBasicOpacity(technologyRef.current, technologyVisibility);
    if (technologyRef.current) {
      const width = 7.35 * mobileScale;
      technologyRef.current.position.set(getTraceWorldX(0.45, isMobile), 0, -20);
      technologyRef.current.rotation.set(0, -0.012, 0);
      technologyRef.current.scale.set(width, width / TRACE_MEDIA_BY_ID.technology.aspect, 1);
    }
    occluderRefs.current.forEach((mesh, index) => {
      if (!mesh) return;
      const [baseX, width] = OCCLUDER_LAYOUT[index];
      const direction = index < 2 ? -1 : 1;
      mesh.visible = technologyVisibility > 0.002 && technologyReveal < 0.99;
      mesh.position.set(
        getTraceWorldX(0.45 + baseX + direction * technologyReveal * (1.25 + index * 0.12), isMobile),
        0,
        -19.88,
      );
      mesh.scale.set(width * mobileScale, 5.45 * mobileScale, 1);
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity = technologyVisibility * (1 - technologyReveal * 0.25);
    });

    const cultureVisibility = traceWindow(progress, ...TRACE_MEDIA_BY_ID.culture.phase, 0.018);
    const cultureReveal = mapTraceProgress(progress, 0.585, 0.635);
    if (cultureRef.current) {
      const material = cultureRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uReveal.value = cultureReveal;
      material.uniforms.uOpacity.value = cultureVisibility;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      cultureRef.current.visible = cultureVisibility > 0.002;
      const width = 7.2 * mobileScale;
      cultureRef.current.position.set(getTraceWorldX(0.95, isMobile), 0.05, -24.2);
      cultureRef.current.rotation.set(-0.012, 0.026, THREE.MathUtils.lerp(-0.014, 0.008, cultureReveal));
      cultureRef.current.scale.set(width, width / TRACE_MEDIA_BY_ID.culture.aspect, 1);
    }

    const corridorVisibility = traceWindow(progress, 0.635, 0.725, 0.014);
    CORRIDOR_LAYOUT.forEach((item, index) => {
      const mesh = corridorRefs.current[index];
      if (!mesh) return;
      const material = mesh.material as THREE.MeshBasicMaterial;
      const focusCenter = 0.648 + index * 0.015;
      const focus = Math.max(0, 1 - Math.abs(progress - focusCenter) / 0.027);
      const drift = index % 2 === 0 ? Math.sin(state.clock.elapsedTime * 0.18 + index) * 0.025 : 0;
      const width = item.scale[0] * mobileScale * (1 + focus * 0.055);
      const height = item.scale[1] * mobileScale * (1 + focus * 0.055);

      mesh.visible = corridorVisibility > 0.002;
      material.opacity = corridorVisibility * (0.58 + focus * 0.42);
      material.color.setScalar(0.68 + focus * 0.32);
      mesh.position.set(getTraceWorldX(item.position[0], isMobile), item.position[1] + drift, item.position[2]);
      mesh.rotation.set(item.rotation[0], item.rotation[1], item.rotation[2]);
      mesh.scale.set(width, height, 1);
    });

    const generationVisibility = traceWindow(progress, ...TRACE_MEDIA_BY_ID.generation.phase, 0.016);
    const generationExpansion = mapTraceProgress(progress, 0.695, 0.77);
    setBasicOpacity(generationRef.current, generationVisibility);
    if (generationRef.current) {
      const width = THREE.MathUtils.lerp(5.7, 7.35, generationExpansion) * mobileScale;
      generationRef.current.position.set(
        getTraceWorldX(10.45 + generationExpansion * 0.18, isMobile),
        0.12,
        -43,
      );
      generationRef.current.rotation.set(-0.008, THREE.MathUtils.lerp(-0.025, -0.008, generationExpansion), 0);
      generationRef.current.scale.set(width, width / TRACE_MEDIA_BY_ID.generation.aspect, 1);
    }

    const quietVisibility = traceWindow(progress, ...TRACE_MEDIA_BY_ID["quiet-human"].phase, 0.014);
    const quietPush = mapTraceProgress(progress, 0.755, 0.83);
    setBasicOpacity(quietRef.current, quietVisibility);
    if (quietRef.current) {
      const width = 5.05 * mobileScale * THREE.MathUtils.lerp(1, 1.018, quietPush);
      quietRef.current.position.set(getTraceWorldX(isMobile ? 9.6 : 11.3, isMobile), 0.12, -48);
      quietRef.current.rotation.set(-0.006, -0.018, 0);
      quietRef.current.scale.set(width, width / TRACE_MEDIA_BY_ID["quiet-human"].aspect, 1);
    }
  });

  return (
    <group dispose={null}>
      <mesh ref={educationRef} geometry={PLANE_GEOMETRY} visible={false}>
        <meshBasicMaterial map={textures.education} transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>

      <mesh ref={panganRef} geometry={PLANE_GEOMETRY} material={panganMaterial} visible={false} />

      <mesh ref={connectivityRef} geometry={PLANE_GEOMETRY} visible={false}>
        <meshBasicMaterial map={textures.connectivity} transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>

      <mesh ref={technologyRef} geometry={PLANE_GEOMETRY} visible={false}>
        <meshBasicMaterial map={textures.technology} transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>

      {OCCLUDER_LAYOUT.map((_, index) => (
        <mesh
          key={index}
          ref={(mesh) => { occluderRefs.current[index] = mesh; }}
          geometry={PLANE_GEOMETRY}
          visible={false}
        >
          <meshBasicMaterial color="#070707" transparent opacity={0} depthWrite={false} toneMapped={false} />
        </mesh>
      ))}

      <mesh ref={cultureRef} geometry={PLANE_GEOMETRY} material={cultureMaterial} visible={false} />

      {CORRIDOR_LAYOUT.map((item, index) => (
        <mesh
          key={item.id}
          ref={(mesh) => { corridorRefs.current[index] = mesh; }}
          geometry={PLANE_GEOMETRY}
          visible={false}
        >
          <meshBasicMaterial map={textures[item.id]} transparent opacity={0} depthWrite={false} toneMapped={false} />
        </mesh>
      ))}

      <mesh ref={generationRef} geometry={PLANE_GEOMETRY} visible={false}>
        <meshBasicMaterial map={textures.generation} transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>

      <mesh ref={quietRef} geometry={PLANE_GEOMETRY} visible={false}>
        <meshBasicMaterial map={textures["quiet-human"]} transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}
