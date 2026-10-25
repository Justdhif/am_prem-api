import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroStats } from "@/components/dashboard/HeroStats";
import { StepsCard } from "@/components/dashboard/StepsCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DocsTab } from "@/components/docs/DocsTab";
import { PlaygroundTab } from "@/components/playground/PlaygroundTab";
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
        <main className="flex-1 w-full space-y-6 sm:space-y-8 min-w-0 overflow-x-hidden max-w-full">
          <HeroStats />
          <StepsCard />

          <Tabs defaultValue="docs" className="w-full">
            <TabsList>
              <TabsTrigger value="docs">
                <i className="fa-solid fa-book-bookmark text-xs sm:text-sm mr-1.5"></i>
                <span>Docs</span>
              </TabsTrigger>
              <TabsTrigger value="playground">
                <i className="fa-solid fa-flask text-xs sm:text-sm mr-1.5"></i>
                <span>Playground</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="docs">
              <DocsTab />
            </TabsContent>

            <TabsContent value="playground">
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
