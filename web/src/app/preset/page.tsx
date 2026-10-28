import Link from "next/link";
import { PresetFinderForm } from "@/components/preset/PresetFinderForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cari & Ekstrak Preset Alight Motion (TikTok & YouTube)",
  description: "Alat pemindai link preset Alight Motion dari deskripsi dan komentar video TikTok dan YouTube secara otomatis.",
};

export default function PresetPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#121826] hover:bg-gray-800 text-gray-300 hover:text-white text-xs font-semibold border border-gray-800 transition shadow-sm active:scale-95 cursor-pointer"
        >
          <i className="fa-solid fa-house text-[11px] text-gray-400"></i>
          <span>Beranda</span>
        </Link>
        <span className="text-gray-600 text-xs">/</span>
        <span className="text-xs font-bold text-[#00e599]">Preset Finder</span>
      </div>

      {/* Header Title */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#00e599]/15 text-[#00e599] border border-[#00e599]/30 text-[11px] font-bold">
          <i className="fa-solid fa-wand-magic-sparkles text-[10px]"></i>
          <span>Scraper Multi-Platform</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide font-piximisa">
          Preset Finder Alight Motion
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-2xl">
          Temukan link preset XML dan tautan Alight Creative resmi langsung dari video TikTok maupun YouTube tanpa perlu mencari manual di komentar.
        </p>
      </div>

      {/* Interactive Preset Finder Form */}
      <PresetFinderForm />
    </div>
  );
}
