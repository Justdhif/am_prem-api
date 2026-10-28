import type { Metadata } from "next";
import { QuickNavPills } from "@/components/dashboard/QuickNavPills";
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
      {/* Top Action Nav Pills & Hero Overview grouped tight */}
      <div className="space-y-3.5 pt-0">
        <QuickNavPills />
        <HeroStats />
      </div>

      {/* Conceptual 2-step activation workflow overview */}
      <StepsCard />

      {/* Primary Service Navigation Cards, Feature Highlights, and FAQ */}
      <HomeOverview />
    </div>
  );
}
