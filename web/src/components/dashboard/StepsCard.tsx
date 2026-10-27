"use client";

import { motion } from "framer-motion";

export function StepsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
      className="space-y-3.5"
    >
      <div className="flex items-center space-x-2.5">
        <i className="fa-solid fa-wand-magic-sparkles text-[#00e599] text-base"></i>
        <h2 className="text-base font-bold text-white tracking-wide font-piximisa">Alur Aktivasi 2 Langkah</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-xs">
        {/* Step 1 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2.5">
            <span className="w-6 h-6 rounded-full bg-[#00e599] text-gray-950 font-black flex items-center justify-center text-xs shrink-0 shadow-sm shadow-[#00e599]/30">
              1
            </span>
            <span className="font-bold text-white text-sm">Kirim Link ke Email</span>
          </div>
          <p className="text-gray-400 leading-relaxed pl-8">
            Panggil <code className="text-[#00e599] bg-[#00e599]/10 px-1 py-0.5 rounded font-mono">POST /api/am/send-link</code> dengan menyertakan target email Anda. Sistem akan memicu Firebase untuk mengirim magic link verifikasi.
          </p>
        </div>

        {/* Step 2 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2.5">
            <span className="w-6 h-6 rounded-full bg-[#00e599] text-gray-950 font-black flex items-center justify-center text-xs shrink-0 shadow-sm shadow-[#00e599]/30">
              2
            </span>
            <span className="font-bold text-white text-sm">Verifikasi &amp; Aktivasi Pro</span>
          </div>
          <p className="text-gray-400 leading-relaxed pl-8">
            Salin full link dari email (atau cukup oobCode) lalu kirimkan ke <code className="text-[#00e599] bg-[#00e599]/10 px-1 py-0.5 rounded font-mono">POST /api/am/verify</code>. Akun Anda langsung aktif VIP 1 Tahun!
          </p>
        </div>
      </div>
    </motion.div>
  );
}
