"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-24 text-center relative overflow-hidden">
        {/* Glowing background radial spots */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00e599]/10 rounded-full blur-3xl pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 max-w-lg mx-auto space-y-6"
        >
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#00e599]/15 border border-[#00e599]/30 text-[#00e599] text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#00e599] animate-ping"></span>
            <span>404 • Halaman Tidak Ditemukan</span>
          </div>

          {/* Large 404 Number with Neon Gradient */}
          <div className="relative">
            <h1 className="text-8xl sm:text-9xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#00e599] via-[#00c784] to-emerald-950 select-none drop-shadow-[0_0_35px_rgba(0,229,153,0.35)]">
              404
            </h1>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Oops! Tersesat di Luar Jangkauan
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed max-w-md mx-auto">
              Halaman atau tautan yang Anda cari tidak tersedia, sudah dipindahkan, atau alamat URL yang dimasukkan kurang tepat.
            </p>
          </div>

          {/* Navigation Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Link
                href="/"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#00e599] hover:bg-[#1affaa] text-gray-950 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-[#00e599]/25 transition duration-200"
              >
                <i className="fa-solid fa-house text-xs"></i>
                <span>Kembali ke Beranda</span>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Link
                href="https://wa.me/447762422507"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-800/90 hover:bg-gray-700/90 text-gray-200 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 border border-gray-700 transition duration-200"
              >
                <i className="fa-brands fa-whatsapp text-emerald-400 text-sm"></i>
                <span>Hubungi Creator</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
