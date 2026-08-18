import * as THREE from "three";

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
  signalPositions: Float32Array;
  signalSeeds: Float32Array;
  signalTints: Float32Array;
  signalSizes: Float32Array;
  dustPositions: Float32Array;
  dustSeeds: Float32Array;
};

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function writePoint(target: Float32Array, offset: number, point: THREE.Vector3) {
  target[offset] = point.x;
  target[offset + 1] = point.y;
  target[offset + 2] = point.z;
}

export function createMovementSceneData(
  majorCount: number,
  secondaryCount: number,
  signalCount: number,
  dustCount: number,
): MovementSceneData {
  const random = seededRandom(17082026 + majorCount * 41 + signalCount);
  const sampleCount = 56;
  const pathCount = 1 + majorCount + secondaryCount;
  const verticesPerPath = sampleCount * 2;
  const trailPositions = new Float32Array(pathCount * verticesPerPath * 3);
  const alignedTrailPositions = new Float32Array(pathCount * verticesPerPath * 3);
  const trailAlong = new Float32Array(pathCount * verticesPerPath);
  const trailBranches = new Float32Array(pathCount * verticesPerPath);
  const trailTiers = new Float32Array(pathCount * verticesPerPath);
  const routes: MovementRoute[] = [];
  const mainCurve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(0, 0, 1.3),
      new THREE.Vector3(0.42, 0.24, -3.2),
      new THREE.Vector3(-0.5, -0.34, -7.2),
      new THREE.Vector3(0.64, 0.42, -11.4),
      new THREE.Vector3(-0.36, -0.18, -16.2),
      new THREE.Vector3(0, 0.04, -22.5),
    ],
    false,
    "centripetal",
    0.42,
  );
  let positionWrite = 0;
  let attributeWrite = 0;

  for (let pathIndex = 0; pathIndex < pathCount; pathIndex += 1) {
    const isMain = pathIndex === 0;
    const isMajor = pathIndex > 0 && pathIndex <= majorCount;
    const tier = isMain ? 0 : isMajor ? 1 : 2;
    const localIndex = isMajor ? pathIndex - 1 : Math.max(0, pathIndex - majorCount - 1);
    const localCount = isMajor ? majorCount : Math.max(1, secondaryCount);
    const branch = isMain
      ? 0
      : isMajor
        ? 0.12 + (localIndex / Math.max(1, majorCount)) * 0.15
        : 0.22 + (localIndex / Math.max(1, secondaryCount)) * 0.2;
    const direction = pathIndex % 2 === 0 ? 1 : -1;
    const lanePosition = localCount > 1 ? localIndex / (localCount - 1) : 0.5;
    const startX = direction * ((isMajor ? 4.6 : 3.8) + random() * (isMajor ? 2.2 : 2.8));
    const startY = THREE.MathUtils.lerp(-3.7, 3.7, lanePosition) + (random() - 0.5) * 0.8;
    const startDepth = 0.4 - random() * 4.4;
    const endX = direction * (isMajor ? 2.4 + random() * 3.8 : 2.8 + random() * 3.6);
    const endY = isMajor
      ? -startY * 0.32 + (random() - 0.5) * 1.3
      : startY * 0.54 + (random() - 0.5) * 1.1;
    const endDepth = -9 - random() * 14;
    const laneX = ((pathIndex % 9) - 4) * 0.48;
    const laneY = ((Math.floor(pathIndex / 9) % 7) - 3) * 0.36;
    const curve = isMain
      ? mainCurve
      : new THREE.CatmullRomCurve3(
          [
            new THREE.Vector3(startX, startY, startDepth),
            new THREE.Vector3(
              startX * 0.52 + (random() - 0.5) * 0.8,
              startY * 0.82 + (random() - 0.5) * 0.55,
              THREE.MathUtils.lerp(startDepth, endDepth, 0.3),
            ),
            new THREE.Vector3(
              endX * 0.48 + (random() - 0.5) * 0.8,
              endY + (random() - 0.5) * 0.7,
              THREE.MathUtils.lerp(startDepth, endDepth, 0.72),
            ),
            new THREE.Vector3(endX, endY, endDepth),
          ],
          false,
          "centripetal",
          0.38,
        );
    const points = new Float32Array((sampleCount + 1) * 3);
    const alignedPoints = new Float32Array((sampleCount + 1) * 3);

    for (let step = 0; step <= sampleCount; step += 1) {
      const t = step / sampleCount;
      const point = curve.getPointAt(t);
      const aligned = new THREE.Vector3(
        laneX + Math.sin(t * Math.PI * 1.5 + pathIndex) * 0.08,
        laneY + Math.sin(t * Math.PI + pathIndex * 0.7) * 0.06,
        THREE.MathUtils.lerp(1.3, -23, t),
      );
      writePoint(points, step * 3, point);
      writePoint(alignedPoints, step * 3, aligned);

      if (step === 0) continue;
      for (const sourceStep of [step - 1, step]) {
        const sourceOffset = sourceStep * 3;
        trailPositions[positionWrite] = points[sourceOffset];
        trailPositions[positionWrite + 1] = points[sourceOffset + 1];
        trailPositions[positionWrite + 2] = points[sourceOffset + 2];
        alignedTrailPositions[positionWrite] = alignedPoints[sourceOffset];
        alignedTrailPositions[positionWrite + 1] = alignedPoints[sourceOffset + 1];
        alignedTrailPositions[positionWrite + 2] = alignedPoints[sourceOffset + 2];
        positionWrite += 3;
        trailAlong[attributeWrite] = sourceStep / sampleCount;
        trailBranches[attributeWrite] = branch;
        trailTiers[attributeWrite] = tier;
        attributeWrite += 1;
      }
    }

    routes.push({
      points,
      alignedPoints,
      speed: 0.035 + random() * 0.06,
      offset: random(),
    });
  }

  const signalPositions = new Float32Array(signalCount * 3);
  const signalSeeds = new Float32Array(signalCount);
  const signalTints = new Float32Array(signalCount);
  const signalSizes = new Float32Array(signalCount);
  for (let index = 0; index < signalCount; index += 1) {
    const route = routes[1 + Math.floor(random() * Math.max(1, routes.length - 1))] ?? routes[0];
    const t = 0.06 + random() * 0.9;
    const pointIndex = Math.min(sampleCount, Math.floor(t * sampleCount)) * 3;
    const offset = index * 3;
    signalPositions[offset] = route.points[pointIndex] + (random() - 0.5) * 0.7;
    signalPositions[offset + 1] = route.points[pointIndex + 1] + (random() - 0.5) * 0.55;
    signalPositions[offset + 2] = route.points[pointIndex + 2] + (random() - 0.5) * 1.2;
    signalSeeds[index] = random();
    signalTints[index] = random();
    signalSizes[index] = random();
  }

  const dustPositions = new Float32Array(dustCount * 3);
  const dustSeeds = new Float32Array(dustCount);
  for (let index = 0; index < dustCount; index += 1) {
    const offset = index * 3;
    const sideBias = random() < 0.5 ? -1 : 1;
    dustPositions[offset] = sideBias * (1.1 + random() * 7.6) + (random() - 0.5) * 1.3;
    dustPositions[offset + 1] = (random() - 0.5) * 9.2;
    dustPositions[offset + 2] = 1.2 - random() * 26;
    dustSeeds[index] = random();
  }

  return {
    routes,
    trailPositions,
    alignedTrailPositions,
    trailAlong,
    trailBranches,
    trailTiers,
    signalPositions,
    signalSeeds,
    signalTints,
    signalSizes,
    dustPositions,
    dustSeeds,
  };
}
