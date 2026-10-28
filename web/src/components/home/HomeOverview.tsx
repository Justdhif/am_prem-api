"use client";

import { motion } from "framer-motion";

export function HomeOverview() {
  const features = [
    {
      icon: "fa-solid fa-shield-halved",
      title: "Resmi & Anti-Banned",
      desc: "Lisensi diaktivasi langsung ke server Firebase Alight Creative resmi. 100% aman tanpa modifikasi APK berbahaya.",
    },
    {
      icon: "fa-solid fa-ban",
      title: "Bebas Watermark",
      desc: "Ekspor seluruh hasil karya video animasi tanpa tanda air logo Alight Motion sama sekali.",
    },
    {
      icon: "fa-solid fa-layer-group",
      title: "Semua Efek & Preset Terbuka",
      desc: "Gunakan 100+ efek visual premium, kurva kecepatan eksklusif, dan kemampuan impor file XML tanpa batas.",
    },
    {
      icon: "fa-solid fa-film",
      title: "Ekspor Kualitas Tinggi",
      desc: "Dukungan render video resolusi hingga 4K pada 60 FPS untuk hasil motion graphic yang tajam dan mulus.",
    },
  ];

  const faqs = [
    {
      q: "Apakah layanan aktivasi ini memerlukan mod APK?",
      a: "Sama sekali tidak. Anda cukup mengunduh aplikasi Alight Motion resmi langsung dari Google Play Store atau Apple App Store. Aktivasi diterapkan ke akun email Anda.",
    },
    {
      q: "Bagaimana cara kerja verifikasi magic link?",
      a: "Sistem memicu Firebase Auth untuk mengirim tautan masuk resmi ke email Anda. Saat tautan tersebut diverifikasi melalui sistem kami, lisensi Premium 1 Tahun langsung dipasangkan ke ID akun Anda.",
    },
    {
      q: "Bagaimana cara menggunakan Preset Finder?",
      a: "Cukup salin URL video TikTok atau YouTube yang membagikan preset, lalu tempelkan di halaman Preset Finder. Scraper kami akan menelusuri komentar kreator dan pengguna untuk menemukan link XML Google Drive atau Alight Link.",
    },
    {
      q: "Bisakah saya mengintegrasikan layanan ini ke bot saya?",
      a: "Tentu saja. Kami menyediakan endpoint REST API publik yang siap pakai. Silakan pelajari panduan lengkap dan contoh request di menu Dokumentasi API.",
    },
  ];

  return (
    <div className="space-y-8 sm:space-y-10 text-left w-full">
      {/* 1. OVERVIEW FITUR ALIGHT MOTION PREMIUM */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="p-6 sm:p-7 rounded-2xl bg-[#121826]/70 border border-gray-800/90 space-y-5"
      >
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#00e599]">
            <i className="fa-solid fa-star text-[11px]"></i>
            <span>Keunggulan Layanan</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-wide font-piximisa">
            Kenapa Menggunakan Alight Motion Premium?
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-2xl">
            Tingkatkan kualitas editing video Anda dengan akses penuh ke ekosistem resmi Alight Motion tanpa kompromi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -2, borderColor: "rgba(0, 229, 153, 0.3)" }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-xl bg-[#0d121f] border border-gray-800/80 space-y-2 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#00e599]/10 text-[#00e599] flex items-center justify-center text-sm shrink-0 border border-[#00e599]/20">
                  <i className={feat.icon}></i>
                </div>
                <h4 className="text-sm font-bold text-white">{feat.title}</h4>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed pl-10">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 2. FAQ SECTION (Overview Pertanyaan Umum) */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
        className="space-y-4"
      >
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide font-piximisa flex items-center space-x-2">
            <i className="fa-regular fa-circle-question text-[#00e599]"></i>
            <span>Pertanyaan yang Sering Diajukan (FAQ)</span>
          </h2>
          <p className="text-xs text-gray-400">
            Penjelasan ringkas seputar aktivasi lisensi, scraper preset, dan integrasi API.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -2, borderColor: "rgba(0, 229, 153, 0.3)" }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-xl bg-[#121826]/80 border border-gray-800/80 space-y-1.5 transition-colors"
            >
              <h4 className="text-xs sm:text-sm font-bold text-white flex items-start space-x-2">
                <span className="text-[#00e599] font-black text-xs shrink-0 mt-0.5">Q:</span>
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed pl-4">
                {faq.a}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
