import type { Metadata } from "next";
import { HeroStats } from "@/components/dashboard/HeroStats";
import { StepsCard } from "@/components/dashboard/StepsCard";
import { HomeOverview } from "@/components/home/HomeOverview";

export const metadata: Metadata = {
  title: "Alight Motion Pro VIP - Overview & Layanan",
  description: "Layanan aktivasi resmi Alight Motion Pro VIP 1 Tahun dan scraper preset multi-platform",
};

export default function Home() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Overview */}
      <HeroStats />

      {/* Conceptual 2-step activation workflow overview */}
      <StepsCard />

      {/* Primary Service Navigation Cards, Feature Highlights, and FAQ */}
      <HomeOverview />
    </div>
  );
}
