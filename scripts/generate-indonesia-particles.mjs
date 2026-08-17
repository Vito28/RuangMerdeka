import fs from "node:fs";
import path from "node:path";

const SOURCE_PATH = path.resolve("docs/indonesia.geojson");
const OUTPUT_PATH = path.resolve(
  "components/merdeka-2026/hero/data/indonesia-particle-source.generated.ts",
);

const TIER_COUNTS = [2800, 6500, 10000];
const SCENE_WIDTH = 7.8;
const BYTES_PER_POINT = 5;

const GROUPS = {
  sumatra: 0,
  java: 1,
  kalimantan: 2,
  sulawesi: 3,
  papua: 4,
  nusaTenggara: 5,
  maluku: 6,
  smallerIslands: 7,
};

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function groupForProvince(name) {
  const province = name.toLowerCase();

  if (province.includes("papua")) return GROUPS.papua;
  if (province.includes("maluku")) return GROUPS.maluku;
  if (province.includes("sulawesi") || province.includes("gorontalo")) return GROUPS.sulawesi;
  if (province.includes("kalimantan")) return GROUPS.kalimantan;
  if (province.includes("nusa tenggara") || province === "bali") return GROUPS.nusaTenggara;
  if (
    province.includes("jawa") ||
    province.includes("banten") ||
    province.includes("yogyakarta") ||
    province.includes("jakarta")
  ) {
    return GROUPS.java;
  }
  if (province.includes("kepulauan riau") || province.includes("bangka")) {
    return GROUPS.smallerIslands;
  }

  return GROUPS.sumatra;
}

function signedRingArea(ring) {
  let area = 0;
  for (let index = 0; index < ring.length - 1; index += 1) {
    const current = ring[index];
    const next = ring[index + 1];
    area += current[0] * next[1] - next[0] * current[1];
  }
  return area / 2;
}

function ringCentroid(ring) {
  let x = 0;
  let y = 0;
  let crossSum = 0;

  for (let index = 0; index < ring.length - 1; index += 1) {
    const current = ring[index];
    const next = ring[index + 1];
    const cross = current[0] * next[1] - next[0] * current[1];
    x += (current[0] + next[0]) * cross;
    y += (current[1] + next[1]) * cross;
    crossSum += cross;
  }

  if (Math.abs(crossSum) < 1e-10) return ring[0];
  return [x / (3 * crossSum), y / (3 * crossSum)];
}

function pointInRing(point, ring) {
  let inside = false;
  const [x, y] = point;

  for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index, index += 1) {
    const [x1, y1] = ring[index];
    const [x2, y2] = ring[previous];
    const crosses = y1 > y !== y2 > y && x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1;
    if (crosses) inside = !inside;
  }

  return inside;
}

function pointInPolygon(point, polygon) {
  if (!pointInRing(point, polygon.rings[0])) return false;
  return !polygon.rings.slice(1).some((hole) => pointInRing(point, hole));
}

function sampleInsidePolygon(polygon, random) {
  const { minX, minY, maxX, maxY } = polygon.bounds;

  for (let attempt = 0; attempt < 240; attempt += 1) {
    const point = [minX + random() * (maxX - minX), minY + random() * (maxY - minY)];
    if (pointInPolygon(point, polygon)) return point;
  }

  const centroid = ringCentroid(polygon.rings[0]);
  if (pointInPolygon(centroid, polygon)) return centroid;
  return polygon.rings[0][Math.floor(random() * (polygon.rings[0].length - 1))];
}

function createWeightedPicker(items, weightFor) {
  const cumulative = [];
  let total = 0;

  for (const item of items) {
    total += weightFor(item);
    cumulative.push(total);
  }

  return (random) => {
    const target = random() * total;
    let low = 0;
    let high = cumulative.length - 1;

    while (low < high) {
      const middle = (low + high) >> 1;
      if (target <= cumulative[middle]) high = middle;
      else low = middle + 1;
    }

    return items[low];
  };
}

function flattenGeoJson(geoJson) {
  const polygons = [];
  const allCoordinates = [];

  for (const feature of geoJson.features) {
    const group = groupForProvince(feature.properties.state);
    const geometry = feature.geometry;
    const polygonCoordinates = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;

    for (const rings of polygonCoordinates) {
      const outerArea = Math.abs(signedRingArea(rings[0]));
      const holesArea = rings.slice(1).reduce((sum, ring) => sum + Math.abs(signedRingArea(ring)), 0);
      const area = Math.max(0, outerArea - holesArea);
      if (area < 1e-9) continue;

      const outer = rings[0];
      const xs = outer.map((coordinate) => coordinate[0]);
      const ys = outer.map((coordinate) => coordinate[1]);
      const polygon = {
        rings,
        group,
        area,
        bounds: {
          minX: Math.min(...xs),
          minY: Math.min(...ys),
          maxX: Math.max(...xs),
          maxY: Math.max(...ys),
        },
      };

      polygons.push(polygon);
      allCoordinates.push(...outer);
    }
  }

  const longitude = allCoordinates.map((coordinate) => coordinate[0]);
  const latitude = allCoordinates.map((coordinate) => coordinate[1]);

  return {
    polygons,
    bounds: {
      minLongitude: Math.min(...longitude),
      maxLongitude: Math.max(...longitude),
      minLatitude: Math.min(...latitude),
      maxLatitude: Math.max(...latitude),
    },
  };
}

function createCoastSegments(polygons) {
  const segments = [];

  for (const polygon of polygons) {
    const ring = polygon.rings[0];
    const anchor = sampleInsidePolygon(polygon, seededRandom(ring.length * 7919 + polygon.group));

    for (let index = 0; index < ring.length - 1; index += 1) {
      const start = ring[index];
      const end = ring[index + 1];
      const length = Math.hypot(end[0] - start[0], end[1] - start[1]);
      if (length > 1e-8) segments.push({ start, end, length, polygon, anchor });
    }
  }

  return segments;
}

function shuffle(array, random) {
  for (let index = array.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
  }
}

function sampleStage(count, seed, polygons, segments) {
  const random = seededRandom(seed);
  const byArea = createWeightedPicker(polygons, (polygon) => polygon.area);
  const byCoverage = createWeightedPicker(polygons, (polygon) => Math.sqrt(polygon.area));
  const byCoast = createWeightedPicker(segments, (segment) => segment.length);
  const samples = [];
  const coastlineCount = Math.round(count * 0.18);
  const coverageCount = Math.round(count * 0.14);

  for (let index = 0; index < count - coastlineCount - coverageCount; index += 1) {
    const polygon = byArea(random);
    samples.push({ point: sampleInsidePolygon(polygon, random), group: polygon.group });
  }

  for (let index = 0; index < coverageCount; index += 1) {
    const polygon = byCoverage(random);
    samples.push({ point: sampleInsidePolygon(polygon, random), group: polygon.group });
  }

  for (let index = 0; index < coastlineCount; index += 1) {
    const segment = byCoast(random);
    const along = random();
    const edge = [
      segment.start[0] + (segment.end[0] - segment.start[0]) * along,
      segment.start[1] + (segment.end[1] - segment.start[1]) * along,
    ];
    const inset = 0.003 + random() * 0.018;
    const candidate = [
      edge[0] + (segment.anchor[0] - edge[0]) * inset,
      edge[1] + (segment.anchor[1] - edge[1]) * inset,
    ];
    samples.push({
      point: pointInPolygon(candidate, segment.polygon) ? candidate : edge,
      group: segment.polygon.group,
    });
  }

  shuffle(samples, random);
  return samples;
}

function encodeSamples(samples, bounds) {
  const bytes = Buffer.alloc(samples.length * BYTES_PER_POINT);
  const longitudeSpan = bounds.maxLongitude - bounds.minLongitude;
  const latitudeSpan = bounds.maxLatitude - bounds.minLatitude;

  for (let index = 0; index < samples.length; index += 1) {
    const sample = samples[index];
    const quantizedX = Math.round(((sample.point[0] - bounds.minLongitude) / longitudeSpan) * 65535);
    const quantizedY = Math.round(((sample.point[1] - bounds.minLatitude) / latitudeSpan) * 65535);
    const offset = index * BYTES_PER_POINT;

    bytes.writeUInt16LE(quantizedX, offset);
    bytes.writeUInt16LE(quantizedY, offset + 2);
    bytes[offset + 4] = sample.group;
  }

  return bytes.toString("base64");
}

const geoJson = JSON.parse(fs.readFileSync(SOURCE_PATH, "utf8"));
const { polygons, bounds } = flattenGeoJson(geoJson);
const segments = createCoastSegments(polygons);
const samples = [];
let previousCount = 0;

for (let tier = 0; tier < TIER_COUNTS.length; tier += 1) {
  const stageCount = TIER_COUNTS[tier] - previousCount;
  samples.push(...sampleStage(stageCount, 17081945 + tier * 2026, polygons, segments));
  previousCount = TIER_COUNTS[tier];
}

const longitudeSpan = bounds.maxLongitude - bounds.minLongitude;
const latitudeSpan = bounds.maxLatitude - bounds.minLatitude;
const sceneHeight = (latitudeSpan / longitudeSpan) * SCENE_WIDTH;
const encoded = encodeSamples(samples, bounds);
const groupCounts = Object.fromEntries(Object.keys(GROUPS).map((name) => [name, 0]));
const groupNames = Object.keys(GROUPS);

for (const sample of samples) groupCounts[groupNames[sample.group]] += 1;

const output = `// Generated by scripts/generate-indonesia-particles.mjs from docs/indonesia.geojson.\n// Do not edit this file manually.\n\nexport const INDONESIA_PARTICLE_SOURCE = {\n  count: ${samples.length},\n  bytesPerPoint: ${BYTES_PER_POINT},\n  sceneWidth: ${SCENE_WIDTH},\n  sceneHeight: ${sceneHeight.toFixed(8)},\n  geographicBounds: [${bounds.minLongitude}, ${bounds.minLatitude}, ${bounds.maxLongitude}, ${bounds.maxLatitude}] as const,\n  tierCounts: { low: ${TIER_COUNTS[0]}, medium: ${TIER_COUNTS[1]}, high: ${TIER_COUNTS[2]} } as const,\n  encoded: \"${encoded}\",\n} as const;\n`;

fs.writeFileSync(OUTPUT_PATH, output);

console.log(
  JSON.stringify(
    {
      source: path.relative(process.cwd(), SOURCE_PATH),
      output: path.relative(process.cwd(), OUTPUT_PATH),
      features: geoJson.features.length,
      polygons: polygons.length,
      coastlineSegments: segments.length,
      particleCount: samples.length,
      geographicBounds: bounds,
      sceneSize: [SCENE_WIDTH, sceneHeight],
      groupCounts,
      generatedBytes: Buffer.byteLength(output),
    },
    null,
    2,
  ),
);
