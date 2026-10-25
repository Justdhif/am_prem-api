import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroStats } from "@/components/dashboard/HeroStats";
import { StepsCard } from "@/components/dashboard/StepsCard";
import { HomeServices } from "@/components/home/HomeServices";
import { CommentDrawer } from "@/components/comments/CommentDrawer";
import { MusicPlayer } from "@/components/player/MusicPlayer";

export default function Home() {
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
          {/* Button to Docs (Positioned identically to Back Button on Docs Page) */}
          <div className="pt-0">
            <Link
              href="/docs"
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#121826] hover:bg-gray-800 text-gray-300 hover:text-white text-xs font-semibold border border-gray-800 transition shadow-sm active:scale-95 cursor-pointer"
            >
              <i className="fa-solid fa-book-bookmark text-[11px] text-[#00e599]"></i>
              <span>Dokumentasi API</span>
            </Link>
          </div>

          <HeroStats />
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
