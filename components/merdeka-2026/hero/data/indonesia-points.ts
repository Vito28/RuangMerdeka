import { INDONESIA_PARTICLE_SOURCE } from "./indonesia-particle-source.generated";

export const ISLAND_GROUPS = {
  sumatra: 0,
  java: 1,
  kalimantan: 2,
  sulawesi: 3,
  papua: 4,
  nusaTenggara: 5,
  maluku: 6,
  smallerIslands: 7,
} as const;

export type IslandGroupId = (typeof ISLAND_GROUPS)[keyof typeof ISLAND_GROUPS];

export type IndonesiaPointData = {
  positions: Float32Array;
  startPositions: Float32Array;
  groupIds: Float32Array;
  groupOffsets: Float32Array;
  detachOffsets: Float32Array;
  tints: Float32Array;
  sizes: Float32Array;
};

const groupSeparation: ReadonlyArray<readonly [number, number, number]> = [
  [-0.1, 0.015, 0.035],
  [-0.025, -0.04, 0.025],
  [-0.012, 0.04, 0.055],
  [0.1, 0.025, 0.075],
  [0.12, 0.012, 0.04],
  [0.025, -0.04, 0.055],
  [0.06, 0.012, 0.08],
  [0.035, -0.008, 0.07],
];

let decodedSource: Uint8Array | undefined;

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function getDecodedSource() {
  if (decodedSource) return decodedSource;

  const binary = atob(INDONESIA_PARTICLE_SOURCE.encoded);
  decodedSource = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    decodedSource[index] = binary.charCodeAt(index);
  }

  return decodedSource;
}

export function createIndonesiaPointData(count: number): IndonesiaPointData {
  if (count > INDONESIA_PARTICLE_SOURCE.count) {
    throw new Error(
      `Requested ${count} Indonesia particles, but only ${INDONESIA_PARTICLE_SOURCE.count} were generated.`,
    );
  }

  const source = getDecodedSource();
  const random = seededRandom(17081945 + count);
  const positions = new Float32Array(count * 3);
  const startPositions = new Float32Array(count * 3);
  const groupIds = new Float32Array(count);
  const groupOffsets = new Float32Array(count * 3);
  const detachOffsets = new Float32Array(count * 3);
  const tints = new Float32Array(count);
  const sizes = new Float32Array(count);

  for (let index = 0; index < count; index += 1) {
    const sourceOffset = index * INDONESIA_PARTICLE_SOURCE.bytesPerPoint;
    const quantizedX = source[sourceOffset] | (source[sourceOffset + 1] << 8);
    const quantizedY = source[sourceOffset + 2] | (source[sourceOffset + 3] << 8);
    const group = source[sourceOffset + 4] as IslandGroupId;
    const offset = index * 3;

    positions[offset] = (quantizedX / 65535 - 0.5) * INDONESIA_PARTICLE_SOURCE.sceneWidth;
    positions[offset + 1] = (quantizedY / 65535 - 0.5) * INDONESIA_PARTICLE_SOURCE.sceneHeight;
    positions[offset + 2] = (random() - 0.5) * 0.1;

    const startRadius = 2.5 + random() * 4;
    const startAngle = random() * Math.PI * 2;
    startPositions[offset] = Math.cos(startAngle) * startRadius;
    startPositions[offset + 1] = Math.sin(startAngle) * startRadius * 0.58;
    startPositions[offset + 2] = (random() - 0.5) * 4.2;

    const separation = groupSeparation[group];
    groupOffsets[offset] = separation[0];
    groupOffsets[offset + 1] = separation[1];
    groupOffsets[offset + 2] = separation[2];
    groupIds[index] = group;

    if (random() < 0.1) {
      detachOffsets[offset] = (random() - 0.5) * 0.28;
      detachOffsets[offset + 1] = 0.08 + random() * 0.18;
      detachOffsets[offset + 2] = 0.3 + random() * 0.55;
    }

    tints[index] = random();
    sizes[index] = 0.7 + random() * 0.65;
  }

  return { positions, startPositions, groupIds, groupOffsets, detachOffsets, tints, sizes };
}
