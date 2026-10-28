import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <i className="fa-solid fa-house text-[10px] text-gray-400"></i>
              <span>Beranda</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <i className="fa-solid fa-wand-magic-sparkles text-[10px]"></i>
              <span>Preset Finder</span>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
          Temukan link preset 5MB, XML Drive, dan Sound Audio resmi dari video TikTok maupun YouTube, ekstraksi komentar manual secara instan, serta jelajahi repositori preset trending pilihan komunitas.
        </p>
      </div>

      {/* Interactive Preset Finder Form */}
      <PresetFinderForm />
    </div>
  );
}
