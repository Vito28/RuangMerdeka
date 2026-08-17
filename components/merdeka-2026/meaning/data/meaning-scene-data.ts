import { createIndonesiaPointData, type IndonesiaPointData } from "../../hero/data/indonesia-points";

export type MeaningSceneData = {
  particles: IndonesiaPointData;
  justiceOffsets: Float32Array;
  growthValues: Float32Array;
  nodePositions: Float32Array;
  nodeColors: Float32Array;
  connectionPositions: Float32Array;
  growthPositions: Float32Array;
  growthHeights: Float32Array;
};

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function pickDistributedIndex(slot: number, slots: number, count: number, random: () => number) {
  const rangeStart = Math.floor((slot / slots) * count);
  const rangeEnd = Math.max(rangeStart + 1, Math.floor(((slot + 1) / slots) * count));
  return Math.min(count - 1, rangeStart + Math.floor(random() * (rangeEnd - rangeStart)));
}

function createConnections(nodePositions: Float32Array) {
  const nodeCount = nodePositions.length / 3;
  const pairs = new Set<string>();

  for (let index = 0; index < nodeCount; index += 1) {
    const distances: Array<{ index: number; distance: number }> = [];
    const offset = index * 3;

    for (let candidate = 0; candidate < nodeCount; candidate += 1) {
      if (candidate === index) continue;
      const candidateOffset = candidate * 3;
      const distance = Math.hypot(
        nodePositions[offset] - nodePositions[candidateOffset],
        nodePositions[offset + 1] - nodePositions[candidateOffset + 1],
      );
      distances.push({ index: candidate, distance });
    }

    distances.sort((a, b) => a.distance - b.distance);
    const connectionCount = index % 4 === 0 ? 2 : 1;

    for (let connection = 0; connection < connectionCount; connection += 1) {
      const candidate = distances[connection]?.index;
      if (candidate === undefined) continue;
      const low = Math.min(index, candidate);
      const high = Math.max(index, candidate);
      pairs.add(`${low}:${high}`);
    }
  }

  const positions = new Float32Array(pairs.size * 6);
  let writeIndex = 0;

  for (const pair of pairs) {
    const [start, end] = pair.split(":").map(Number);
    const startOffset = start * 3;
    const endOffset = end * 3;

    positions[writeIndex] = nodePositions[startOffset];
    positions[writeIndex + 1] = nodePositions[startOffset + 1];
    positions[writeIndex + 2] = 0.035;
    positions[writeIndex + 3] = nodePositions[endOffset];
    positions[writeIndex + 4] = nodePositions[endOffset + 1];
    positions[writeIndex + 5] = 0.035;
    writeIndex += 6;
  }

  return positions;
}

export function createMeaningSceneData(
  particleCount: number,
  nodeCount: number,
  growthCount: number,
): MeaningSceneData {
  const random = seededRandom(19452026 + particleCount);
  const particles = createIndonesiaPointData(particleCount);
  const justiceOffsets = new Float32Array(particleCount * 3);
  const growthValues = new Float32Array(particleCount);

  for (let index = 0; index < particleCount; index += 1) {
    const offset = index * 3;
    const angle = random() * Math.PI * 2;
    const radius = random() * 0.075;
    justiceOffsets[offset] = Math.cos(angle) * radius;
    justiceOffsets[offset + 1] = Math.sin(angle) * radius;
    justiceOffsets[offset + 2] = (random() - 0.5) * 0.16;
    growthValues[index] = Math.pow(random(), 2.2);
  }

  const nodePositions = new Float32Array(nodeCount * 3);
  const nodeColors = new Float32Array(nodeCount * 3);

  for (let index = 0; index < nodeCount; index += 1) {
    const sourceIndex = pickDistributedIndex(index, nodeCount, particleCount, random);
    const sourceOffset = sourceIndex * 3;
    const offset = index * 3;
    nodePositions[offset] = particles.positions[sourceOffset];
    nodePositions[offset + 1] = particles.positions[sourceOffset + 1];
    nodePositions[offset + 2] = 0.05 + random() * 0.035;

    const isRed = random() > 0.78;
    nodeColors[offset] = isRed ? 0.906 : 0.957;
    nodeColors[offset + 1] = isRed ? 0 : 0.945;
    nodeColors[offset + 2] = isRed ? 0.067 : 0.918;
  }

  const growthPositions = new Float32Array(growthCount * 3);
  const growthHeights = new Float32Array(growthCount);

  for (let index = 0; index < growthCount; index += 1) {
    const sourceIndex = pickDistributedIndex(index, growthCount, particleCount, random);
    const sourceOffset = sourceIndex * 3;
    const offset = index * 3;
    growthPositions[offset] = particles.positions[sourceOffset];
    growthPositions[offset + 1] = particles.positions[sourceOffset + 1];
    growthPositions[offset + 2] = 0.04;
    growthHeights[index] = 0.12 + random() * 0.42;
  }

  return {
    particles,
    justiceOffsets,
    growthValues,
    nodePositions,
    nodeColors,
    connectionPositions: createConnections(nodePositions),
    growthPositions,
    growthHeights,
  };
}
