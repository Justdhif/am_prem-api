"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function DocsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="space-y-3 pt-0"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Link href="/" className="inline-block">
          <motion.div
            whileHover={{
              scale: 1.04,
              x: -2,
              borderColor: "rgba(0, 229, 153, 0.4)",
              boxShadow: "0 0 20px rgba(0, 229, 153, 0.15)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-[#121826] hover:bg-[#161f30] text-gray-300 hover:text-white text-xs font-semibold border border-gray-800 transition-colors shadow-sm cursor-pointer group"
          >
            <i className="fa-solid fa-arrow-left text-[11px] text-[#00e599] group-hover:-translate-x-0.5 transition-transform" />
            <span>Kembali ke Beranda</span>
          </motion.div>
        </Link>

        <Link href="/aktivasi" className="inline-block">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#121826] hover:bg-gray-800 text-gray-300 hover:text-white text-xs font-semibold border border-gray-800 transition shadow-sm">
            <i className="fa-solid fa-crown text-[10px] text-[#00e599]" />
            <span>Halaman Aktivasi</span>
          </div>
        </Link>

        <Link href="/preset" className="inline-block">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#121826] hover:bg-gray-800 text-gray-300 hover:text-white text-xs font-semibold border border-gray-800 transition shadow-sm">
            <i className="fa-solid fa-wand-magic-sparkles text-[10px] text-amber-400" />
            <span>Preset Finder</span>
          </div>
        </Link>
      </div>

      {/* Docs Page Header */}
      <div className="space-y-1.5 pt-0">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide font-piximisa">
          Dokumentasi API Alight Motion Pro
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-2xl">
          Panduan integrasi endpoint untuk bot Telegram/WhatsApp atau automasi mandiri aktivasi lisensi Alight Motion Pro VIP Resmi 1 Tahun dan scraper preset TikTok/YouTube.
        </p>
      </div>
    </motion.div>
  );
}
