import * as THREE from "three";

const PRIMARY_CURVES = [
  [
    [-5.7, -0.38, 0.32], [-3.65, 0.08, 0.18], [-1.55, 0.58, -0.12],
    [0.45, 0.04, 0.2], [2.55, 0.7, -0.18], [5.7, 0.22, 0.06],
  ],
  [
    [-5.7, 0.46, -0.32], [-3.65, -0.18, -0.1], [-1.48, -0.62, 0.2],
    [0.55, 0.22, -0.18], [2.7, -0.46, 0.24], [5.7, 0.5, -0.08],
  ],
  [
    [-5.7, -0.92, 0.02], [-3.45, -0.55, -0.28], [-1.2, 0.02, 0.1],
    [1.1, -0.22, -0.08], [3.2, 0.08, 0.15], [5.7, -0.36, -0.22],
  ],
] as const;

function toVectors(points: readonly (readonly number[])[]) {
  return points.map(([x, y, z]) => new THREE.Vector3(x, y, z));
}

export function createPrimaryRibbonCurve(index: number) {
  return new THREE.CatmullRomCurve3(
    toVectors(PRIMARY_CURVES[index % PRIMARY_CURVES.length]),
    false,
    "centripetal",
    0.35,
  );
}

export function createDirectionCurve(index: number, count: number) {
  const lane = index / Math.max(1, count - 1) - 0.5;
  const side = index % 2 === 0 ? 1 : -1;
  const family = index % 3;
  const primary = createPrimaryRibbonCurve(family);
  const points = [0, 0.22, 0.43, 0.64, 0.82, 1].map((progress, pointIndex) => {
    const point = primary.getPointAt(progress);
    const offsetStrength = 0.32 + Math.abs(lane) * 0.72;
    point.y += lane * 1.55 + Math.sin(index * 1.73 + pointIndex * 0.9) * 0.12 * offsetStrength;
    point.z += side * (0.16 + Math.abs(lane) * 0.55) + Math.cos(index * 0.91 + pointIndex) * 0.08;
    return point;
  });

  return new THREE.CatmullRomCurve3(points, false, "centripetal", 0.35);
}
