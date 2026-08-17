export type Edition = {
  year: number;
  edition: number;
  title: string;
  href: string;
  status: "available" | "coming-soon";
};

export const CURRENT_EDITION = 2026;

export const editions: Edition[] = [
  {
    year: 2026,
    edition: 1,
    title: "81 Tahun Merdeka",
    href: "/2026",
    status: "available",
  },
];

export const currentEdition =
  editions.find((edition) => edition.year === CURRENT_EDITION) ?? editions[0];
