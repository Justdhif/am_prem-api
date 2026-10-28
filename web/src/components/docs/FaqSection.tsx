"use client";

import { motion } from "framer-motion";

export function FaqSection() {
  return (
    <motion.div
      id="faq"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="p-5 sm:p-6 rounded-2xl bg-[#121826] border border-gray-800 shadow-xl space-y-5 scroll-mt-[126px] text-left transition hover:border-gray-700/80"
    >
      <div className="flex items-center space-x-3 border-b border-gray-800/80 pb-4">
        <div className="w-9 h-9 rounded-xl bg-[#00e599]/10 border border-[#00e599]/30 text-[#00e599] flex items-center justify-center text-sm font-bold shrink-0">
          <i className="fa-regular fa-circle-question text-base"></i>
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Panduan Bantuan &amp; FAQ</h2>
          <p className="text-xs sm:text-sm text-gray-400">Petunjuk aktivasi, panduan bot, dan solusi kendala umum.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <motion.div
          whileHover={{ scale: 1.01, borderColor: "rgba(0, 229, 153, 0.3)" }}
          transition={{ duration: 0.2 }}
          className="bg-[#0d121f] p-4 rounded-xl border border-gray-800 space-y-2 transition-colors"
        >
          <span className="font-bold text-[#00e599] flex items-center text-xs sm:text-sm">
            <i className="fa-solid fa-envelope-circle-check mr-2"></i>Email tidak masuk?
          </span>
          <p className="text-gray-300 leading-relaxed">
            Pastikan alamat email sudah terdaftar di Alight Motion. Periksa folder <strong>Spam</strong>, <strong>Junk</strong>, atau tab <strong>Promosi</strong> di Gmail. Tunggu 1&ndash;2 menit.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01, borderColor: "rgba(0, 229, 153, 0.3)" }}
          transition={{ duration: 0.2 }}
          className="bg-[#0d121f] p-4 rounded-xl border border-gray-800 space-y-2 transition-colors"
        >
          <span className="font-bold text-[#00e599] flex items-center text-xs sm:text-sm">
            <i className="fa-solid fa-clock-rotate-left mr-2"></i>Link Kadaluarsa (Expired)?
          </span>
          <p className="text-gray-300 leading-relaxed">
            Magic link dari Firebase hanya berlaku 15 menit. Jika kadaluarsa, cukup kirim ulang perintah <code className="text-[#00e599]">!amprem</code> atau submit ulang email di form.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01, borderColor: "rgba(0, 229, 153, 0.3)" }}
          transition={{ duration: 0.2 }}
          className="bg-[#0d121f] p-4 rounded-xl border border-gray-800 space-y-2 transition-colors"
        >
          <span className="font-bold text-[#00e599] flex items-center text-xs sm:text-sm">
            <i className="fa-solid fa-star mr-2"></i>Fitur Pro yang Didapat?
          </span>
          <p className="text-gray-300 leading-relaxed">
            Lisensi Alight Motion Premium 1 Tahun resmi aktif: bebas watermark saat export video, akses penuh semua efek premium, import preset XML &amp; font tanpa batas.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01, borderColor: "rgba(0, 229, 153, 0.3)" }}
          transition={{ duration: 0.2 }}
          className="bg-[#0d121f] p-4 rounded-xl border border-gray-800 space-y-2 transition-colors"
        >
          <span className="font-bold text-[#00e599] flex items-center text-xs sm:text-sm">
            <i className="fa-solid fa-robot mr-2"></i>Daftar Perintah Bot WhatsApp
          </span>
          <p className="text-gray-300 leading-relaxed">
            Gunakan <code className="text-[#00e599]">!amprem &lt;email&gt;</code> untuk kirim link, <code className="text-[#00e599]">!ampreset &lt;url&gt;</code> untuk cari preset VT/YT, dan balas link untuk aktivasi.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
