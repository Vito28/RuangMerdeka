import * as THREE from "three";

import { createIndonesiaPointData, type IndonesiaPointData } from "../../hero/data/indonesia-points";

export type MeaningSceneData = {
  particles: IndonesiaPointData;
  flowTargets: Float32Array;
  flowAngles: Float32Array;
  flowAccents: Float32Array;
  flowPhases: Float32Array;
  structurePositions: Float32Array;
  structureHeights: Float32Array;
  structureKinds: Float32Array;
  pulsePositions: Float32Array;
  pulseConnections: Float32Array;
  pulseConnectionBuild: Float32Array;
  pulseConnectionPath: Float32Array;
  pulseDistances: Float32Array;
};

type FrameworkPiece = readonly [x: number, y: number, z: number, length: number, kind: number];
type ScenePoint = readonly [x: number, y: number, z: number];

const FRAMEWORK_BLUEPRINT: FrameworkPiece[] = [
  [-3.45, -1.2, 0.2, 1.55, 0],
  [-2.9, -1.2, -0.2, 2.25, 0],
  [-3.18, -0.56, 0.02, 0.72, 1],
  [-2.25, -1.2, 0.32, 1.78, 0],
  [-2.58, 0.2, 0.06, 0.82, 1],
  [-1.45, -1.2, -0.12, 2.65, 0],
  [-0.7, -1.2, 0.26, 1.96, 0],
  [-1.08, -0.12, 0.04, 0.95, 1],
  [0.05, -1.2, -0.24, 2.35, 0],
  [0.75, -1.2, 0.2, 1.62, 0],
  [0.38, 0.02, -0.02, 0.9, 1],
  [1.5, -1.2, -0.08, 2.55, 0],
  [2.18, -1.2, 0.27, 1.88, 0],
  [1.84, -0.35, 0.06, 0.82, 1],
  [2.86, -1.2, -0.18, 2.25, 0],
  [3.45, -1.2, 0.18, 1.48, 0],
  [3.16, 0.05, 0, 0.76, 1],
  [0.02, 0.83, -0.18, 2.95, 2],
];

const HOPE_STAR_BLUEPRINT: ScenePoint[] = [
  ...Array.from({ length: 10 }, (_, index): ScenePoint => {
    const angle = Math.PI / 2 + index * (Math.PI / 5);
    const radius = index % 2 === 0 ? 1.6 : 0.68;
    return [
      0.85 + Math.cos(angle) * radius,
      0.45 + Math.sin(angle) * radius,
      index % 2 === 0 ? 0.04 : -0.04,
    ];
  }),
  [0.85, 0.45, 0.16],
];

const HOPE_STAR_EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
  [5, 6], [6, 7], [7, 8], [8, 9], [9, 0],
  [10, 0], [10, 2], [10, 4], [10, 6], [10, 8],
] as const;

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function createPulseConnections(positions: Float32Array) {
  const pointCount = positions.length / 3;
  const validEdges = HOPE_STAR_EDGES.filter(([start, end]) => start < pointCount && end < pointCount);
  const connectionPositions: number[] = [];
  const connectionBuild: number[] = [];
  const connectionPath: number[] = [];
  const samples = 14;

  validEdges.forEach(([startIndex, endIndex], edgeIndex) => {
    const startOffset = startIndex * 3;
    const endOffset = endIndex * 3;
    const start = new THREE.Vector3(
      positions[startOffset],
      positions[startOffset + 1],
      positions[startOffset + 2],
    );
    const end = new THREE.Vector3(
      positions[endOffset],
      positions[endOffset + 1],
      positions[endOffset + 2],
    );
    const points = Array.from({ length: samples + 1 }, (_, index) => (
      start.clone().lerp(end, index / samples)
    ));

    for (let index = 0; index < points.length - 1; index += 1) {
      const localProgress = index / (points.length - 1);
      const nextProgress = (index + 1) / (points.length - 1);
      const buildStart = edgeIndex / Math.max(1, validEdges.length - 1);
      const startPath = THREE.MathUtils.clamp((points[index].x + 0.85) / 3.4, 0, 1);
      const endPath = THREE.MathUtils.clamp((points[index + 1].x + 0.85) / 3.4, 0, 1);

      connectionPositions.push(...points[index].toArray(), ...points[index + 1].toArray());
      connectionBuild.push(
        buildStart * 0.7 + localProgress * 0.3,
        buildStart * 0.7 + nextProgress * 0.3,
      );
      connectionPath.push(startPath, endPath);
    }
  });

  return {
    positions: new Float32Array(connectionPositions),
    build: new Float32Array(connectionBuild),
    path: new Float32Array(connectionPath),
  };
}

export function createMeaningSceneData(particleCount: number, structureCount: number): MeaningSceneData {
  const random = seededRandom(17081945 + particleCount + structureCount);
  const particles = createIndonesiaPointData(particleCount);
  const flowTargets = new Float32Array(particleCount * 3);
  const flowAngles = new Float32Array(particleCount);
  const flowAccents = new Float32Array(particleCount);
  const flowPhases = new Float32Array(particleCount);

  for (let index = 0; index < particleCount; index += 1) {
    const offset = index * 3;
    const sourceX = particles.positions[offset];
    const sourceY = particles.positions[offset + 1];
    const side = Math.abs(sourceX) > 0.12 ? Math.sign(sourceX) : index % 2 === 0 ? 1 : -1;
    const reach = 0.9 + Math.pow(random(), 0.72) * 4.25;
    const upperFlow = index % 5 !== 0;
    const arc = Math.pow(reach / 5.15, 0.78) * (upperFlow ? 2.25 : -1.05);
    const targetX = side * reach;
    const targetY = -0.22 + arc + (random() - 0.5) * 0.38 + side * 0.07;
    const targetZ = (random() - 0.5) * (2.2 + reach * 0.42);

    flowTargets[offset] = targetX;
    flowTargets[offset + 1] = targetY;
    flowTargets[offset + 2] = targetZ;
    flowAngles[index] = Math.atan2(targetY - sourceY, targetX - sourceX);
    flowAccents[index] = random() < (reach > 3.5 ? 0.31 : 0.15) ? 1 : 0;
    flowPhases[index] = random();
  }

  const selectedPieces = FRAMEWORK_BLUEPRINT.slice(0, Math.min(structureCount, FRAMEWORK_BLUEPRINT.length));
  const structurePositions = new Float32Array(selectedPieces.length * 3);
  const structureHeights = new Float32Array(selectedPieces.length);
  const structureKinds = new Float32Array(selectedPieces.length);

  selectedPieces.forEach(([x, y, z, length, kind], index) => {
    const offset = index * 3;
    structurePositions[offset] = x;
    structurePositions[offset + 1] = y;
    structurePositions[offset + 2] = z;
    structureHeights[index] = length;
    structureKinds[index] = kind;
  });

  const nodeCount = HOPE_STAR_BLUEPRINT.length;
  const pulsePositions = new Float32Array(nodeCount * 3);
  const pulseDistances = new Float32Array(nodeCount);

  HOPE_STAR_BLUEPRINT.forEach(([x, y, z], index) => {
    const offset = index * 3;
    pulsePositions[offset] = x;
    pulsePositions[offset + 1] = y;
    pulsePositions[offset + 2] = z;
    pulseDistances[index] = THREE.MathUtils.clamp((x + 0.85) / 3.4, 0, 1);
  });

  const connections = createPulseConnections(pulsePositions);

  return {
    particles,
    flowTargets,
    flowAngles,
    flowAccents,
    flowPhases,
    structurePositions,
    structureHeights,
    structureKinds,
    pulsePositions,
    pulseConnections: connections.positions,
    pulseConnectionBuild: connections.build,
    pulseConnectionPath: connections.path,
    pulseDistances,
  };
}
