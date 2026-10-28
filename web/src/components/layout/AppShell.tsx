"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSpecialPage = !["/", "/aktivasi", "/preset", "/docs"].includes(pathname);

  if (isSpecialPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 md:px-10 lg:px-12 xl:px-16 pt-3.5 sm:pt-6 lg:pt-8 pb-28 lg:pb-12 flex flex-col lg:flex-row gap-0 lg:gap-10 xl:gap-12 items-start">
        {/* Left Sidebar: Persistent Spotify-style Music Player & Dynamic Synchronized Lyrics */}
        <aside className="contents lg:block lg:w-80 xl:w-[340px] shrink-0 lg:sticky lg:top-20 lg:z-20">
          <MusicPlayer />
        </aside>

        {/* Main Content Area with page transition animation */}
        <main className="flex-1 w-full min-w-0 pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full space-y-6 sm:space-y-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Comment Drawer Sidebar (Desktop & Mobile) */}
        <CommentDrawer />
      </div>
      <Footer />
    </>
  );
}
