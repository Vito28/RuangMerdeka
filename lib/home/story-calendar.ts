export type StoryStatus = "active" | "upcoming";

export type StoryPalette = {
  accent: string;
  accentSoft: string;
  glow: string;
};

export type ActiveStory = {
  id: string;
  slug: string;
  name: string;
  year: number;
  day: number;
  month: number;
  dateLabel: string;
  numericDate: string;
  eyebrow: string;
  headline: [string, string];
  summary: string;
  region: string;
  duration: string;
  status: StoryStatus;
  href?: string;
  palette: StoryPalette;
};

type MonthDay = { month: number; day: number };

type StoryDefinition = {
  id: string;
  slug: string;
  name: string;
  fixedDate?: MonthDay;
  scheduledDates?: Record<number, MonthDay>;
  activeDaysBefore: number;
  activeDaysAfter: number;
  headline: (year: number) => [string, string];
  summary: string;
  region: string;
  duration: string;
  routes?: Record<number, string>;
  palette: StoryPalette;
};

const MONTHS = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
] as const;

const DAY_MS = 86_400_000;

export const storyDefinitions: StoryDefinition[] = [
  {
    id: "imlek",
    slug: "imlek",
    name: "Imlek",
    scheduledDates: {
      2026: { month: 2, day: 17 },
      2027: { month: 2, day: 6 },
    },
    activeDaysBefore: 10,
    activeDaysAfter: 7,
    headline: (year) => ["TAHUN BARU", `${year}`],
    summary: "Tentang pulang, harapan baru, dan meja makan yang kembali penuh.",
    region: "INDONESIA",
    duration: "~ 04 MIN",
    palette: { accent: "#B83B32", accentSoft: "#D79A45", glow: "#E8B455" },
  },
  {
    id: "lebaran",
    slug: "lebaran",
    name: "Lebaran",
    scheduledDates: {
      2026: { month: 3, day: 20 },
      2027: { month: 3, day: 10 },
    },
    activeDaysBefore: 12,
    activeDaysAfter: 8,
    headline: () => ["JALAN", "PULANG"],
    summary: "Dari perjalanan panjang, menjadi ruang untuk saling memaafkan.",
    region: "INDONESIA",
    duration: "~ 05 MIN",
    palette: { accent: "#6F825F", accentSoft: "#D1A04E", glow: "#B9D29E" },
  },
  {
    id: "paskah",
    slug: "paskah",
    name: "Paskah",
    scheduledDates: {
      2026: { month: 4, day: 5 },
      2027: { month: 3, day: 28 },
    },
    activeDaysBefore: 7,
    activeDaysAfter: 7,
    headline: () => ["HARAPAN", "TUMBUH"],
    summary: "Sebuah cerita tentang terang, pembaruan, dan harapan yang tumbuh kembali.",
    region: "INDONESIA",
    duration: "~ 04 MIN",
    palette: { accent: "#A96B82", accentSoft: "#D7B7C5", glow: "#F0C4D4" },
  },
  {
    id: "kartini",
    slug: "hari-kartini",
    name: "Hari Kartini",
    fixedDate: { month: 4, day: 21 },
    activeDaysBefore: 7,
    activeDaysAfter: 7,
    headline: () => ["HABIS GELAP", "TERBITLAH TERANG"],
    summary: "Suara, keberanian, dan gagasan yang membuka jalan bagi generasi berikutnya.",
    region: "INDONESIA",
    duration: "~ 05 MIN",
    palette: { accent: "#A9473D", accentSoft: "#D1A04E", glow: "#E5A77A" },
  },
  {
    id: "waisak",
    slug: "waisak",
    name: "Waisak",
    scheduledDates: {
      2026: { month: 5, day: 31 },
      2027: { month: 5, day: 20 },
    },
    activeDaysBefore: 8,
    activeDaysAfter: 7,
    headline: () => ["HENING", "YANG MENYALA"],
    summary: "Tentang jeda, welas asih, dan cahaya kecil yang dijaga bersama.",
    region: "INDONESIA",
    duration: "~ 04 MIN",
    palette: { accent: "#B9783D", accentSoft: "#D6B45B", glow: "#F0C96B" },
  },
  {
    id: "kemerdekaan",
    slug: "17-08",
    name: "Kemerdekaan",
    fixedDate: { month: 8, day: 17 },
    activeDaysBefore: 16,
    activeDaysAfter: 14,
    headline: (year) => [`${year - 1945} TAHUN`, "MERDEKA"],
    summary: "Dari sebuah proklamasi, menjadi perjalanan jutaan manusia.",
    region: "INDONESIA",
    duration: "~ 06 MIN",
    routes: { 2026: "/2026/17-08" },
    palette: { accent: "#C8102E", accentSoft: "#F4F1EA", glow: "#FF2738" },
  },
  {
    id: "mooncake",
    slug: "mooncake",
    name: "Mooncake Festival",
    scheduledDates: {
      2026: { month: 9, day: 25 },
      2027: { month: 9, day: 15 },
    },
    activeDaysBefore: 8,
    activeDaysAfter: 6,
    headline: () => ["BULAN", "YANG PULANG"],
    summary: "Kisah tentang bulan penuh, kebersamaan, dan rasa yang dibagi.",
    region: "INDONESIA",
    duration: "~ 04 MIN",
    palette: { accent: "#C9823D", accentSoft: "#D1A04E", glow: "#F0BC62" },
  },
  {
    id: "halloween",
    slug: "halloween",
    name: "Halloween",
    fixedDate: { month: 10, day: 31 },
    activeDaysBefore: 10,
    activeDaysAfter: 2,
    headline: () => ["MALAM", "BERCERITA"],
    summary: "Imajinasi, kostum, dan keberanian kecil untuk menertawakan rasa takut.",
    region: "INDONESIA",
    duration: "~ 04 MIN",
    palette: { accent: "#CE6F33", accentSoft: "#75629A", glow: "#E78A42" },
  },
  {
    id: "natal",
    slug: "natal",
    name: "Natal",
    fixedDate: { month: 12, day: 25 },
    activeDaysBefore: 18,
    activeDaysAfter: 6,
    headline: () => ["CAHAYA", "DI RUMAH"],
    summary: "Tentang kehangatan, memberi, dan cahaya yang kembali dinyalakan.",
    region: "INDONESIA",
    duration: "~ 05 MIN",
    palette: { accent: "#9D3C35", accentSoft: "#54705C", glow: "#E7B95C" },
  },
];

function jakartaDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  return { year: value("year"), month: value("month"), day: value("day") };
}

function occurrenceDate(definition: StoryDefinition, year: number) {
  return definition.fixedDate ?? definition.scheduledDates?.[year];
}

function utcDay(year: number, month: number, day: number) {
  return Date.UTC(year, month - 1, day) / DAY_MS;
}

function buildStory(
  definition: StoryDefinition,
  year: number,
  date: MonthDay,
  status: StoryStatus,
): ActiveStory {
  const day = String(date.day).padStart(2, "0");
  const month = String(date.month).padStart(2, "0");

  return {
    id: definition.id,
    slug: definition.slug,
    name: definition.name,
    year,
    day: date.day,
    month: date.month,
    dateLabel: `${date.day} ${MONTHS[date.month - 1]} ${year}`,
    numericDate: `${day} / ${month} / ${year}`,
    eyebrow: status === "active" ? "SEDANG BERLANGSUNG" : "CERITA BERIKUTNYA",
    headline: definition.headline(year),
    summary: definition.summary,
    region: definition.region,
    duration: definition.duration,
    status,
    href: definition.routes?.[year],
    palette: definition.palette,
  };
}

export function resolveActiveStory(now = new Date()): ActiveStory {
  const today = jakartaDateParts(now);
  const todayValue = utcDay(today.year, today.month, today.day);
  const candidates: Array<{
    definition: StoryDefinition;
    year: number;
    date: MonthDay;
    eventDay: number;
    starts: number;
    ends: number;
  }> = [];

  for (const year of [today.year, today.year + 1]) {
    for (const definition of storyDefinitions) {
      const date = occurrenceDate(definition, year);
      if (!date) continue;
      const eventDay = utcDay(year, date.month, date.day);
      candidates.push({
        definition,
        year,
        date,
        eventDay,
        starts: eventDay - definition.activeDaysBefore,
        ends: eventDay + definition.activeDaysAfter,
      });
    }
  }

  const active = candidates
    .filter((candidate) => todayValue >= candidate.starts && todayValue <= candidate.ends)
    .sort((a, b) => Math.abs(a.eventDay - todayValue) - Math.abs(b.eventDay - todayValue))[0];

  if (active) return buildStory(active.definition, active.year, active.date, "active");

  const upcoming = candidates
    .filter((candidate) => candidate.eventDay > todayValue)
    .sort((a, b) => a.eventDay - b.eventDay)[0];

  if (upcoming) return buildStory(upcoming.definition, upcoming.year, upcoming.date, "upcoming");

  const fallback = storyDefinitions.find((definition) => definition.id === "kemerdekaan")!;
  const fallbackDate = occurrenceDate(fallback, today.year) ?? { month: 8, day: 17 };
  return buildStory(fallback, today.year, fallbackDate, "upcoming");
}

export const initialStory = resolveActiveStory(new Date("2026-08-19T05:00:00.000Z"));
