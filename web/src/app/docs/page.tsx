import Link from "next/link";
import { DocsTab } from "@/components/docs/DocsTab";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dokumentasi API - Alight Motion Pro VIP",
  description: "Dokumentasi resmi dan panduan integrasi REST API Alight Motion Pro VIP & Preset Finder.",
};

export default function DocsPage() {
  return (
    <>
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
    </>
  );
}
