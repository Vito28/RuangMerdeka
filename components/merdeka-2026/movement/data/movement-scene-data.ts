import { createIndonesiaPointData, type IndonesiaPointData } from "../../hero/data/indonesia-points";

export type MovementRoute = {
  points: Float32Array;
  speed: number;
  offset: number;
};

export type MovementSceneData = {
  particles: IndonesiaPointData;
  activations: Float32Array;
  movementDirections: Float32Array;
  trailPositions: Float32Array;
  routes: MovementRoute[];
  ambientPositions: Float32Array;
  ambientSeeds: Float32Array;
};

const routeGroups: ReadonlyArray<readonly [number, number]> = [
  [0, 2], [2, 3], [3, 6], [6, 4], [4, 7], [7, 5],
  [5, 1], [1, 0], [0, 3], [2, 4], [5, 6], [3, 1],
  [4, 2], [6, 0], [1, 5], [2, 7], [7, 0], [5, 3],
];

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function pointAtGroupFraction(
  particles: IndonesiaPointData,
  group: number,
  fraction: number,
) {
  const candidates: number[] = [];
  for (let index = 0; index < particles.groupIds.length; index += 1) {
    if (particles.groupIds[index] === group) candidates.push(index);
  }

  const index = candidates[Math.min(candidates.length - 1, Math.floor(fraction * candidates.length))] ?? 0;
  const offset = index * 3;
  return [
    particles.positions[offset],
    particles.positions[offset + 1],
    particles.positions[offset + 2] + 0.08,
  ] as const;
}

function createRoutes(particles: IndonesiaPointData, count: number, random: () => number) {
  const routes: MovementRoute[] = [];
  const segmentCount = 26;
  const trailPositions = new Float32Array(count * segmentCount * 6);
  let trailWrite = 0;

  for (let routeIndex = 0; routeIndex < count; routeIndex += 1) {
    const groups = routeGroups[routeIndex % routeGroups.length];
    const start = pointAtGroupFraction(particles, groups[0], (0.17 + routeIndex * 0.37) % 0.96);
    const end = pointAtGroupFraction(particles, groups[1], (0.63 + routeIndex * 0.29) % 0.96);
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const distance = Math.hypot(dx, dy);
    const bend = (routeIndex % 2 === 0 ? 1 : -1) * (0.1 + Math.min(0.38, distance * 0.055));
    const controlX = (start[0] + end[0]) * 0.5 - dy * bend;
    const controlY = (start[1] + end[1]) * 0.5 + dx * bend;
    const controlZ = 0.18 + Math.min(0.42, distance * 0.07);
    const points = new Float32Array((segmentCount + 1) * 3);

    for (let step = 0; step <= segmentCount; step += 1) {
      const t = step / segmentCount;
      const inverse = 1 - t;
      const offset = step * 3;
      points[offset] = inverse * inverse * start[0] + 2 * inverse * t * controlX + t * t * end[0];
      points[offset + 1] = inverse * inverse * start[1] + 2 * inverse * t * controlY + t * t * end[1];
      points[offset + 2] = inverse * inverse * start[2] + 2 * inverse * t * controlZ + t * t * end[2];

      if (step > 0) {
        const previous = offset - 3;
        trailPositions[trailWrite] = points[previous];
        trailPositions[trailWrite + 1] = points[previous + 1];
        trailPositions[trailWrite + 2] = points[previous + 2];
        trailPositions[trailWrite + 3] = points[offset];
        trailPositions[trailWrite + 4] = points[offset + 1];
        trailPositions[trailWrite + 5] = points[offset + 2];
        trailWrite += 6;
      }
    }

    routes.push({ points, speed: 0.035 + random() * 0.035, offset: random() });
  }

  return { routes, trailPositions };
}

export function createMovementSceneData(
  particleCount: number,
  trailCount: number,
  ambientCount: number,
): MovementSceneData {
  const random = seededRandom(17082026 + particleCount + trailCount);
  const particles = createIndonesiaPointData(particleCount);
  const activations = new Float32Array(particleCount);
  const movementDirections = new Float32Array(particleCount * 3);

  for (let index = 0; index < particleCount; index += 1) {
    const offset = index * 3;
    const angle = random() * Math.PI * 2;
    activations[index] = random();
    movementDirections[offset] = Math.cos(angle) * (0.018 + random() * 0.045);
    movementDirections[offset + 1] = Math.sin(angle) * (0.018 + random() * 0.035);
    movementDirections[offset + 2] = 0.035 + random() * 0.11;
  }

  const ambientPositions = new Float32Array(ambientCount * 3);
  const ambientSeeds = new Float32Array(ambientCount);
  for (let index = 0; index < ambientCount; index += 1) {
    const offset = index * 3;
    ambientPositions[offset] = (random() - 0.5) * 10;
    ambientPositions[offset + 1] = (random() - 0.5) * 5.8;
    ambientPositions[offset + 2] = -0.5 + random() * 1.5;
    ambientSeeds[index] = random();
  }

  const routeData = createRoutes(particles, trailCount, random);
  return {
    particles,
    activations,
    movementDirections,
    trailPositions: routeData.trailPositions,
    routes: routeData.routes,
    ambientPositions,
    ambientSeeds,
  };
}
