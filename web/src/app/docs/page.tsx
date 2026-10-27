import Link from "next/link";
import dynamic from "next/dynamic";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DocsTab } from "@/components/docs/DocsTab";
import type { Metadata } from "next";

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
  title: "Dokumentasi API - Alight Motion Pro VIP",
  description: "Dokumentasi resmi dan panduan integrasi REST API Alight Motion Pro VIP & Preset Finder.",
};

export default function DocsPage() {
  return (
    <>
      <Header />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 md:px-10 lg:px-12 xl:px-16 pt-6 sm:pt-8 pb-28 lg:pb-12 flex flex-col lg:flex-row gap-8 lg:gap-10 xl:gap-12 items-start max-w-full">
        {/* Left Sidebar: Spotify-style Music Player & Dynamic Synchronized Lyrics */}
        <aside className="w-full lg:w-80 xl:w-[340px] shrink-0 lg:sticky lg:top-20 lg:z-20">
          <MusicPlayer />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full space-y-6 sm:space-y-8 min-w-0 max-w-full pt-0">
          {/* Back Button and Docs Header grouped tightly */}
          <div className="space-y-3 pt-0">
            <div className="flex items-center">
              <Link
                href="/"
                className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-[#121826] hover:bg-gray-800 text-gray-300 hover:text-white text-xs font-semibold border border-gray-800 transition shadow-sm active:scale-95 cursor-pointer"
              >
                <i className="fa-solid fa-arrow-left text-[11px] text-[#00e599]"></i>
                <span>Kembali ke Beranda</span>
              </Link>
            </div>

            {/* Docs Page Header */}
            <div className="space-y-1.5 pt-0">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Dokumentasi API Alight Motion Pro
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-2xl">
                Panduan integrasi endpoint untuk bot Telegram/WhatsApp atau automasi mandiri aktivasi lisensi Alight Motion Pro VIP Resmi 1 Tahun dan scraper preset TikTok/YouTube.
              </p>
            </div>
          </div>

          {/* Direct Documentation View */}
          <DocsTab />
        </main>

        {/* Comment Drawer Sidebar (Desktop & Mobile) */}
        <CommentDrawer />
      </div>
      <Footer />
    </>
  );
}
