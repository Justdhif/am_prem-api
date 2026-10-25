import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MusicPlayer } from "@/components/player/MusicPlayer";
import { CommentDrawer } from "@/components/comments/CommentDrawer";
import { DocsTab } from "@/components/docs/DocsTab";
import { PlaygroundTab } from "@/components/playground/PlaygroundTab";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dokumentasi API - Alight Motion Pro VIP",
  description: "Dokumentasi resmi dan panduan integrasi REST API Alight Motion Pro VIP & Preset Finder.",
};

export default function DocsPage() {
  return (
    <>
      <Header />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-0 pb-28 lg:pb-8 flex flex-col lg:flex-row gap-6 items-start overflow-x-hidden max-w-full">
        {/* Left Sidebar: Spotify-style Music Player & Dynamic Synchronized Lyrics */}
        <aside className="w-full lg:w-80 xl:w-[340px] shrink-0 lg:sticky lg:top-20 z-20">
          <MusicPlayer />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full space-y-6 sm:space-y-8 min-w-0 overflow-x-hidden max-w-full pt-0">
          {/* Docs Page Header */}
          <div className="space-y-2 pt-0 mt-0">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#00e599]/10 border border-[#00e599]/30 text-[#00e599] text-xs font-semibold">
              <i className="fa-solid fa-code text-[11px]"></i>
              <span>REST API Reference &amp; Tester</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Dokumentasi API Alight Motion Pro
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
              Panduan integrasi endpoint untuk bot Telegram/WhatsApp atau automasi mandiri aktivasi lisensi Alight Motion Pro VIP Resmi 1 Tahun dan scraper preset TikTok/YouTube.
            </p>
          </div>

          {/* Sub Navigation: Specs vs Interactive API Tester */}
          <Tabs defaultValue="docs" className="w-full">
            <TabsList>
              <TabsTrigger value="docs">
                <i className="fa-solid fa-book-bookmark text-xs sm:text-sm mr-1.5"></i>
                <span>Spesifikasi API</span>
              </TabsTrigger>
              <TabsTrigger value="tester">
                <i className="fa-solid fa-flask text-xs sm:text-sm mr-1.5"></i>
                <span>API Tester (Developer)</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="docs">
              <DocsTab />
            </TabsContent>

            <TabsContent value="tester">
              <PlaygroundTab />
            </TabsContent>
          </Tabs>
        </main>

        {/* Comment Drawer Sidebar (Desktop & Mobile) */}
        <CommentDrawer />
      </div>
      <Footer />
    </>
  );
}
