import type { Metadata } from "next";
import { DocsButton } from "@/components/dashboard/DocsButton";
import { HeroStats } from "@/components/dashboard/HeroStats";
import { StepsCard } from "@/components/dashboard/StepsCard";
import { HomeServices } from "@/components/home/HomeServices";

export const metadata: Metadata = {
  title: "Alight Motion Pro VIP - by Justdhif",
  description: "Layanan aktivasi resmi Alight Motion Pro VIP 1 Tahun dan scraper preset multi-platform",
};

export default function Home() {
  return (
    <>
      {/* Top Action / Nav Link grouped tight with Hero */}
      <div className="space-y-3 pt-0">
        <DocsButton />
        <HeroStats />
      </div>

      <StepsCard />
      <HomeServices />
    </>
  );
}
