import type { TraceMediaId, TraceMediaItem } from "../types";

const SECTION_04_ASSET_ROOT = "/2026/17-08/section-04/images";

export const TRACE_MEDIA: readonly TraceMediaItem[] = [
  {
    id: "transition-city",
    src: `${SECTION_04_ASSET_ROOT}/transition-city.webp`,
    alt: "Jejak lampu kendaraan merah melintasi jalan kota Indonesia pada malam hari.",
    label: "JEJAK KOTA",
    statement: "GERAK MENINGGALKAN CAHAYA.",
    treatment: "slice",
    aspect: 1672 / 941,
    phase: [0.025, 0.29],
  },
  {
    id: "education",
    src: `${SECTION_04_ASSET_ROOT}/education.webp`,
    alt: "Guru dan murid belajar bersama di dalam ruang kelas Indonesia.",
    label: "PENDIDIKAN",
    statement: "PENGETAHUAN MEMBUKA JALAN.",
    treatment: "approach",
    aspect: 1672 / 941,
    phase: [0.27, 0.395],
  },
  {
    id: "pangan",
    src: `${SECTION_04_ASSET_ROOT}/pangan.webp`,
    alt: "Petani merawat tanaman padi di kaki pegunungan saat matahari terbit.",
    label: "PANGAN",
    statement: "YANG DITANAM, MENJADI KEHIDUPAN.",
    treatment: "horizon",
    aspect: 1672 / 941,
    phase: [0.355, 0.475],
  },
  {
    id: "connectivity",
    src: `${SECTION_04_ASSET_ROOT}/connectivity.webp`,
    alt: "Jembatan panjang menghubungkan wilayah di tengah bentang alam Indonesia.",
    label: "KONEKTIVITAS",
    statement: "JARAK MENJADI LEBIH DEKAT.",
    treatment: "travel",
    aspect: 1672 / 941,
    phase: [0.435, 0.555],
  },
  {
    id: "technology",
    src: `${SECTION_04_ASSET_ROOT}/technology.webp`,
    alt: "Tiga pemuda Indonesia mengembangkan mesin dan teknologi di ruang kerja.",
    label: "TEKNOLOGI",
    statement: "GAGASAN MENJADI KEMUNGKINAN.",
    treatment: "occlusion",
    aspect: 3 / 2,
    phase: [0.515, 0.625],
  },
  {
    id: "culture",
    src: `${SECTION_04_ASSET_ROOT}/culture.webp`,
    alt: "Penari tradisional Indonesia bergerak dalam busana merah dan hitam.",
    label: "BUDAYA",
    statement: "YANG KITA WARISI, TERUS KITA HIDUPKAN.",
    treatment: "fabric",
    aspect: 3 / 2,
    phase: [0.585, 0.675],
  },
  {
    id: "generation",
    src: `${SECTION_04_ASSET_ROOT}/generation.webp`,
    alt: "Generasi muda Indonesia berjalan bersama menatap ruang kota dan masa depan.",
    label: "GENERASI",
    statement: "YANG KITA MULAI, MEREKA YANG MELANJUTKAN.",
    treatment: "expansion",
    aspect: 3 / 2,
    phase: [0.695, 0.775],
  },
  {
    id: "quiet-human",
    src: `${SECTION_04_ASSET_ROOT}/quiet-human.webp`,
    alt: "Seorang perempuan belajar dalam ruang tenang yang diterangi cahaya jendela.",
    label: "GERAK KECIL",
    statement: "DARI GERAK KECIL, LAHIR PERUBAHAN BESAR.",
    treatment: "silence",
    aspect: 3 / 2,
    phase: [0.755, 0.835],
  },
] as const;

export const TRACE_MEDIA_BY_ID = Object.fromEntries(
  TRACE_MEDIA.map((item) => [item.id, item]),
) as Record<TraceMediaId, TraceMediaItem>;

export const TRACE_ASSET_PATHS = TRACE_MEDIA.map((item) => item.src);

export const TRACE_LABEL_MEDIA = TRACE_MEDIA.filter(
  (item) => item.id !== "transition-city" && item.id !== "quiet-human",
);

export const CORRIDOR_LAYOUT = [
  { id: "education", position: [1.2, 1.15, -27] as const, rotation: [-0.02, 0.09, -0.008] as const, scale: [5.8, 3.26] as const },
  { id: "pangan", position: [3.6, -0.95, -30.2] as const, rotation: [0.025, -0.08, 0.01] as const, scale: [4.2, 2.36] as const },
  { id: "connectivity", position: [5.8, 1.05, -33.3] as const, rotation: [-0.018, 0.075, -0.01] as const, scale: [6.1, 3.43] as const },
  { id: "technology", position: [8.2, -0.75, -36.1] as const, rotation: [0.02, -0.1, 0.008] as const, scale: [5.3, 3.53] as const },
  { id: "culture", position: [10.5, 0.85, -39.2] as const, rotation: [-0.02, 0.08, -0.012] as const, scale: [5.6, 3.73] as const },
] as const;

export const MOSAIC_LAYOUT = [
  { id: "generation", position: [2.7, 1.55, 0.2] as const, scale: [3.25, 2.16] as const },
  { id: "education", position: [-2.65, 1.45, -0.15] as const, scale: [3, 1.69] as const },
  { id: "culture", position: [0.15, -1.2, 0.25] as const, scale: [2.45, 1.63] as const },
  { id: "pangan", position: [-3.6, -1.05, -0.25] as const, scale: [1.9, 1.07] as const },
  { id: "connectivity", position: [3.75, -1.15, 0.05] as const, scale: [2.35, 1.32] as const },
  { id: "technology", position: [-0.55, 1.65, -0.3] as const, scale: [1.55, 1.03] as const },
  { id: "quiet-human", position: [4.55, 0.55, -0.2] as const, scale: [1.35, 0.9] as const },
  { id: "transition-city", position: [-4.6, 0.45, 0.15] as const, scale: [1.5, 0.84] as const },
  { id: "education", position: [1.05, 0.35, -0.1] as const, scale: [1.45, 0.82] as const },
  { id: "generation", position: [-1.9, -0.4, 0.3] as const, scale: [1.15, 0.77] as const },
  { id: "culture", position: [2.25, -0.45, -0.35] as const, scale: [1.25, 0.83] as const },
  { id: "pangan", position: [-4.65, -1.85, 0.05] as const, scale: [1.25, 0.7] as const },
] as const;
