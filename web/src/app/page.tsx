import Link from "next/link";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroStats } from "@/components/dashboard/HeroStats";
import { StepsCard } from "@/components/dashboard/StepsCard";
import { HomeServices } from "@/components/home/HomeServices";

const MusicPlayer = dynamic(
  () => import("@/components/player/MusicPlayer").then((m) => m.MusicPlayer),
  {
    loading: () => (
      <div className="w-full bg-[#0d121f] border border-gray-800/80 rounded-3xl p-5 min-h-[520px] animate-pulse hidden lg:block" />
    ),
  }
);

const CommentDrawer = dynamic(
  () => import("@/components/comments/CommentDrawer").then((m) => m.CommentDrawer)
);

export const metadata: Metadata = {
  title: "Alight Motion Pro VIP - by Justdhif",
  description: "Layanan aktivasi resmi Alight Motion Pro VIP 1 Tahun dan scraper preset multi-platform",
};

export default function Home() {
  return (
    <>
      <Header />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 md:px-10 lg:px-12 xl:px-16 pt-0 sm:pt-6 lg:pt-8 pb-28 lg:pb-12 flex flex-col lg:flex-row gap-0 lg:gap-10 xl:gap-12 items-start max-w-full">
        {/* Left Sidebar: Spotify-style Music Player & Dynamic Synchronized Lyrics */}
        <aside className="contents lg:block lg:w-80 xl:w-[340px] shrink-0 lg:sticky lg:top-20 lg:z-20">
          <MusicPlayer />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full space-y-6 sm:space-y-8 min-w-0 max-w-full pt-0">
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
        </main>

        {/* Comment Drawer Sidebar (Desktop & Mobile) */}
        <CommentDrawer />
      </div>
      <Footer />
    </>
  );
}
