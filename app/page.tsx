import type { Metadata } from "next";
import { HomeExperience } from "@/components/home/hari-kita/home-experience";

export const metadata: Metadata = {
  title: "Hari Kita — Setiap Hari Punya Cerita",
  description:
    "Perayaan, budaya, dan momen yang kita bagi bersama—didokumentasikan sebagai pengalaman digital yang berbeda setiap tahunnya.",
};

export default function Home() {
  return <HomeExperience />;
}
