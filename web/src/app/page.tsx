import Link from "next/link";
import type { Metadata } from "next";
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
        <div className="flex items-center">
          <Link
            href="/docs"
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-[#121826] hover:bg-gray-800 text-gray-300 hover:text-white text-xs font-semibold border border-gray-800 transition shadow-sm active:scale-95 cursor-pointer"
          >
            <i className="fa-solid fa-book-bookmark text-[11px] text-[#00e599]"></i>
            <span>Dokumentasi API</span>
          </Link>
        </div>

        <HeroStats />
      </div>

      <StepsCard />
      <HomeServices />
    </>
  );
}
