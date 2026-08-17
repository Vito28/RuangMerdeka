export type MovementRoute = {
  points: Float32Array;
  alignedPoints: Float32Array;
  speed: number;
  offset: number;
};

export type MovementSceneData = {
  routes: MovementRoute[];
  trailPositions: Float32Array;
  alignedTrailPositions: Float32Array;
  trailAlong: Float32Array;
  trailBranches: Float32Array;
  trailTiers: Float32Array;
  ambientPositions: Float32Array;
  ambientSeeds: Float32Array;
};

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function createMovementSceneData(pathCount: number, ambientCount: number): MovementSceneData {
  const random = seededRandom(17082026 + pathCount * 31);
  const segmentCount = 48;
  const verticesPerPath = segmentCount * 2;
  const trailPositions = new Float32Array(pathCount * verticesPerPath * 3);
  const alignedTrailPositions = new Float32Array(pathCount * verticesPerPath * 3);
  const trailAlong = new Float32Array(pathCount * verticesPerPath);
  const trailBranches = new Float32Array(pathCount * verticesPerPath);
  const trailTiers = new Float32Array(pathCount * verticesPerPath);
  const routes: MovementRoute[] = [];
  let positionWrite = 0;
  let attributeWrite = 0;

  for (let pathIndex = 0; pathIndex < pathCount; pathIndex += 1) {
    const tier = pathIndex === 0 ? 0 : pathIndex < 8 ? 1 : 2;
    const branch = pathIndex === 0 ? 0 : 0.12 + Math.pow(pathIndex / pathCount, 0.72) * 0.31;
    const direction = random() * Math.PI * 2;
    const horizontalReach = tier === 1 ? 3.2 + random() * 3.4 : 2.1 + random() * 5.2;
    const verticalReach = tier === 1 ? 1.25 + random() * 2 : 0.8 + random() * 3.1;
    const directionX = Math.cos(direction) * horizontalReach;
    const directionY = Math.sin(direction) * verticalReach;
    const bend = (random() - 0.5) * (tier === 1 ? 1.2 : 2.4);
    const wave = random() * Math.PI * 2;
    const laneX = ((pathIndex % 13) - 6) * 0.34;
    const laneY = ((Math.floor(pathIndex / 13) % 9) - 4) * 0.27;
    const points = new Float32Array((segmentCount + 1) * 3);
    const alignedPoints = new Float32Array((segmentCount + 1) * 3);

    for (let step = 0; step <= segmentCount; step += 1) {
      const t = step / segmentCount;
      const divergence = smoothstep(0.04 + branch * 0.18, 0.78, t);
      const depth = 1.3 - t * 22;
      const pointOffset = step * 3;
      points[pointOffset] = directionX * divergence + Math.sin(t * Math.PI * 1.6 + wave) * bend * t;
      points[pointOffset + 1] = directionY * divergence + Math.sin(t * Math.PI * 2.2 + wave * 0.5) * 0.42 * t;
      points[pointOffset + 2] = depth + Math.cos(t * Math.PI * 1.3 + wave) * 0.25 * t;
      alignedPoints[pointOffset] = laneX + Math.sin(t * Math.PI + wave) * 0.11;
      alignedPoints[pointOffset + 1] = laneY + Math.sin(t * Math.PI * 1.5 + wave) * 0.08;
      alignedPoints[pointOffset + 2] = depth;

      if (step === 0) continue;
      const previousOffset = pointOffset - 3;
      for (const sourceOffset of [previousOffset, pointOffset]) {
        trailPositions[positionWrite] = points[sourceOffset];
        trailPositions[positionWrite + 1] = points[sourceOffset + 1];
        trailPositions[positionWrite + 2] = points[sourceOffset + 2];
        alignedTrailPositions[positionWrite] = alignedPoints[sourceOffset];
        alignedTrailPositions[positionWrite + 1] = alignedPoints[sourceOffset + 1];
        alignedTrailPositions[positionWrite + 2] = alignedPoints[sourceOffset + 2];
        positionWrite += 3;
        trailAlong[attributeWrite] = (step - (sourceOffset === previousOffset ? 1 : 0)) / segmentCount;
        trailBranches[attributeWrite] = branch;
        trailTiers[attributeWrite] = tier;
        attributeWrite += 1;
      }
    }

    routes.push({
      points,
      alignedPoints,
      speed: 0.055 + random() * 0.075,
      offset: random(),
    });
  }

  const ambientPositions = new Float32Array(ambientCount * 3);
  const ambientSeeds = new Float32Array(ambientCount);
  for (let index = 0; index < ambientCount; index += 1) {
    const offset = index * 3;
    ambientPositions[offset] = (random() - 0.5) * 15;
    ambientPositions[offset + 1] = (random() - 0.5) * 8;
    ambientPositions[offset + 2] = 1 - random() * 24;
    ambientSeeds[index] = random();
  }

  return {
    routes,
    trailPositions,
    alignedTrailPositions,
    trailAlong,
    trailBranches,
    trailTiers,
    ambientPositions,
    ambientSeeds,
  };
}
