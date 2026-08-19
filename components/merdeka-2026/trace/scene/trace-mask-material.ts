import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uReveal;
  uniform float uOpacity;
  uniform float uTime;
  uniform float uMode;
  varying vec2 vUv;

  void main() {
    vec4 color = texture2D(uMap, vUv);
    float mask = 1.0;

    if (uMode < 0.5) {
      float band = 0.012 + uReveal * 0.56;
      float distanceFromHorizon = abs(vUv.y - 0.52);
      mask = 1.0 - smoothstep(band - 0.025, band + 0.025, distanceFromHorizon);
    } else {
      float clothEdge = uReveal * 1.22 - 0.1;
      clothEdge += (vUv.y - 0.5) * 0.08;
      clothEdge += sin(vUv.y * 5.8 + uTime * 0.18) * 0.022;
      mask = smoothstep(-0.035, 0.035, clothEdge - vUv.x);
    }

    gl_FragColor = vec4(color.rgb, color.a * mask * uOpacity);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export function createTraceMaskMaterial(texture: THREE.Texture, mode: "horizon" | "fabric") {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: texture },
      uReveal: { value: 0 },
      uOpacity: { value: 0 },
      uTime: { value: 0 },
      uMode: { value: mode === "horizon" ? 0 : 1 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });
}
