import type { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HeroStats } from "@/components/dashboard/HeroStats";
import { StepsCard } from "@/components/dashboard/StepsCard";
import { HomeOverview } from "@/components/home/HomeOverview";

export const metadata: Metadata = {
  title: "Alight Motion Premium - Overview & Layanan",
  description: "Layanan aktivasi resmi Alight Motion Premium 1 Tahun dan scraper preset multi-platform",
};

export default function Home() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header & Breadcrumb */}
      <div className="space-y-4 pt-0">
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>
                <i className="fa-solid fa-house text-[10px]"></i>
                <span>Beranda</span>
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="text-gray-400 text-xs font-medium">Overview &amp; Layanan</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero Overview */}
        <HeroStats />
      </div>

      {/* Activation Steps */}
      <StepsCard />

      {/* Overview & FAQ */}
      <HomeOverview />
    </div>
  );
}
