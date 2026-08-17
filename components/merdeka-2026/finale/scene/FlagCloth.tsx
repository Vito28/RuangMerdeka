"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useDevicePerformance } from "../../hero/hooks/use-device-performance";
import { FINALE_CONFIG, mapFinaleProgress } from "../animation/finale-progress";
import type { FinaleProgressRef } from "../types";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uAmplitude;

  varying vec2 vUv;
  varying vec3 vNormalView;
  varying float vFold;

  vec3 deformPosition(vec3 base, vec2 uv) {
    float freeEdge = smoothstep(0.0, 0.22, uv.x);
    float primary = sin(uv.x * 5.3 - uTime * 0.72) * 0.22;
    float secondary = sin(uv.x * 10.2 + uv.y * 2.4 - uTime * 0.38) * 0.065;
    float vertical = sin(uv.x * 3.4 + uTime * 0.25) * 0.035;
    float breath = sin(uTime * 0.18 + uv.x * 1.8) * 0.025;

    base.z += (primary + secondary + breath) * uAmplitude * freeEdge;
    base.y += vertical * uAmplitude * freeEdge;
    return base;
  }

  void main() {
    vUv = uv;
    vec3 displaced = deformPosition(position, uv);
    float epsilon = 0.008;
    vec3 displacedX = deformPosition(
      position + vec3(6.0 * epsilon, 0.0, 0.0),
      uv + vec2(epsilon, 0.0)
    );
    vec3 displacedY = deformPosition(
      position + vec3(0.0, 3.0 * epsilon, 0.0),
      uv + vec2(0.0, epsilon)
    );
    vec3 localNormal = normalize(cross(displacedX - displaced, displacedY - displaced));

    vNormalView = normalize(normalMatrix * localNormal);
    vFold = displaced.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uLight;

  varying vec2 vUv;
  varying vec3 vNormalView;
  varying float vFold;

  void main() {
    vec3 red = vec3(0.5776, 0.0052, 0.0272);
    vec3 white = vec3(0.9047, 0.8796, 0.8228);
    vec3 baseColor = vUv.y >= 0.5 ? red : white;

    vec3 keyDirection = normalize(vec3(-0.35, 0.48, 1.0));
    vec3 surfaceNormal = normalize(vNormalView);
    float diffuse = max(dot(surfaceNormal, keyDirection), 0.0);
    float directionalFold = clamp(-surfaceNormal.x * 0.9 + surfaceNormal.y * 0.3, -0.24, 0.24);
    float softLight = (0.8 + diffuse * 0.12 + directionalFold * 0.7) * uLight;
    float foldShade = 1.0 + clamp(vFold * 0.52, -0.1, 0.12);
    float edgeFalloff = 1.0 - smoothstep(0.82, 1.0, abs(vUv.x * 2.0 - 1.0)) * 0.08;
    vec3 color = baseColor * softLight * foldShade * edgeFalloff;

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

type FlagClothProps = {
  progressRef: FinaleProgressRef;
  reducedMotion: boolean;
};

export function FlagCloth({ progressRef, reducedMotion }: FlagClothProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const tier = useDevicePerformance();
  const { size } = useThree();
  const isMobile = size.width < 768;
  const segments = FINALE_CONFIG.segments[tier];
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmplitude: { value: reducedMotion ? 0.08 : 0.1 },
      uLight: { value: 0.86 },
    }),
    [reducedMotion],
  );

  useFrame((_, delta) => {
    if (!groupRef.current || !materialRef.current) return;
    const progress = reducedMotion ? 0.76 : progressRef.current;
    const reveal = mapFinaleProgress(progress, 0.08, 0.5);
    const settle = mapFinaleProgress(progress, 0.82, 1);
    const targetAmplitude = reducedMotion ? 0.08 : (0.1 + reveal * 0.6) * (1 - settle * 0.32);
    const openingScale = isMobile ? 1.72 : 1.64;
    const finalScale = isMobile ? 0.98 : 1.25;
    const targetScale = THREE.MathUtils.lerp(openingScale, finalScale, reveal);
    const targetX = isMobile ? 0 : THREE.MathUtils.lerp(0, 0.56, reveal);
    const targetY = THREE.MathUtils.lerp(0, isMobile ? 0.72 : 0.48, reveal);

    materialRef.current.uniforms.uTime.value += delta * (reducedMotion ? 0.11 : 0.52);
    materialRef.current.uniforms.uAmplitude.value = THREE.MathUtils.damp(
      materialRef.current.uniforms.uAmplitude.value,
      targetAmplitude,
      4.5,
      delta,
    );
    materialRef.current.uniforms.uLight.value = THREE.MathUtils.damp(
      materialRef.current.uniforms.uLight.value,
      THREE.MathUtils.lerp(0.84, 1, reveal),
      4,
      delta,
    );

    const nextScale = THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 5, delta);
    groupRef.current.scale.setScalar(nextScale);
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 5, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 5, delta);
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, -0.025 * reveal, 4, delta);
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, -0.07 * reveal, 4, delta);
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <planeGeometry args={[6, 3, segments[0], segments[1]]} />
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          toneMapped
        />
      </mesh>
    </group>
  );
}
