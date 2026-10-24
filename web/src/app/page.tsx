import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroStats } from "@/components/dashboard/HeroStats";
import { StepsCard } from "@/components/dashboard/StepsCard";

export default function Home() {
  return (
    <>
      <Header />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col lg:flex-row gap-6 items-start">
        {/* Main Content Area */}
        <main className="flex-1 w-full space-y-6 sm:space-y-8 min-w-0">
          <HeroStats />
          <StepsCard />
        </main>
      </div>
      <Footer />
    </>
  );
}
