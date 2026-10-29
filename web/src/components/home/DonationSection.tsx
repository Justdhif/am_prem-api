"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function DonationSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyInfo = () => {
    navigator.clipboard.writeText("Dukung layanan Alight Motion Premium melalui Saweria / QRIS resmi: Justdhif");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const a = document.createElement("a");
    a.href = "/images/qr_donasi.webp";
    a.download = "QR_Donasi_AlightMotionPrem.webp";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#121826]/90 via-[#0e1422] to-[#0a0f1a] border border-gray-800/90 shadow-2xl relative overflow-hidden"
    >
      {/* Background Ambient Glow Accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#00e599]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Section Header */}
        <div className="space-y-1.5 text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#00e599]/10 text-[#00e599] border border-[#00e599]/30 text-xs font-bold">
            <i className="fa-solid fa-heart text-xs text-rose-400 animate-pulse"></i>
            <span>Dukungan Kreator &amp; Server</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-white tracking-wide font-piximisa flex items-center space-x-2">
            <span>Donasi &amp; Dukung Layanan Ini</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-2xl">
            Layanan aktivasi Alight Motion Premium dan Preset Finder ini disediakan gratis untuk seluruh komunitas editor. Donasi sukarela Anda sangat berharga untuk pemeliharaan server, API, dan pengembangan fitur baru.
          </p>
        </div>

        {/* Content Container: QR Card + Info & Methods */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* QR CODE CARD (Col 1 - 5) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="relative p-5 sm:p-6 rounded-2xl bg-[#090d16]/90 border border-gray-800/90 shadow-[0_0_35px_rgba(0,0,0,0.6)] flex flex-col items-center text-center space-y-3.5 w-full max-w-xs group"
            >
              {/* Top Saweria Badge */}
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#1b2538] border border-gray-700/80 text-[11px] font-semibold text-gray-200">
                <span className="w-2 h-2 rounded-full bg-[#00e599] animate-pulse"></span>
                <span>QRIS / Saweria Resmi</span>
              </div>

              {/* QR Image Container with Subtle Ambient Glow */}
              <div className="relative w-56 h-56 sm:w-60 sm:h-60 rounded-2xl overflow-hidden bg-[#0d121f]/95 border border-gray-800/80 p-3 flex items-center justify-center shadow-inner group-hover:border-[#00e599]/40 transition-colors duration-300">
                <Image
                  src="/images/qr_donasi.webp"
                  alt="QR Code Donasi Saweria"
                  width={240}
                  height={240}
                  className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.08)]"
                  priority
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-[#00e599] font-bold tracking-wider uppercase block">
                  Scan Bebas Semua Aplikasi
                </span>
                <p className="text-[10px] text-gray-400">
                  QRIS kompatibel dengan GoPay, OVO, Dana, ShopeePay, LinkAja, BCA, Mandiri, BRI, &amp; Mobile Banking lainnya.
                </p>
              </div>

              {/* Download QR Button */}
              <button
                type="button"
                onClick={handleDownloadQR}
                className="w-full py-2 px-3 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-200 text-xs font-semibold transition flex items-center justify-center space-x-1.5 active:scale-95 cursor-pointer border border-gray-700/60"
              >
                <i className="fa-solid fa-download text-[11px]"></i>
                <span>Simpan Gambar QR</span>
              </button>
            </motion.div>
          </div>

          {/* RIGHT DETAIL & INSTRUCTIONS (Col 6 - 12) */}
          <div className="lg:col-span-7 space-y-4 text-left">
            {/* Step-by-step Quick Guide */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-1.5">
                <i className="fa-solid fa-circle-check text-[#00e599]"></i>
                <span>Cara Melakukan Donasi:</span>
              </h3>

              <div className="space-y-2">
                {[
                  {
                    step: "1",
                    title: "Buka Aplikasi E-Wallet / Mobile Banking",
                    desc: "Buka aplikasi pembayaran favorit Anda (Dana, GoPay, OVO, ShopeePay, BCA, atau bank apa saja).",
                  },
                  {
                    step: "2",
                    title: "Pilih Menu 'Scan QR / QRIS'",
                    desc: "Arahkan kamera ke kode QR di samping, atau pilih gambar QR yang telah Anda simpan.",
                  },
                  {
                    step: "3",
                    title: "Masukkan Nominal Sukarela",
                    desc: "Tentukan nominal dukungan Anda dan kirimkan ucapan/pesan hangat untuk pengembang.",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#0d121f]/80 border border-gray-800/70 flex items-start space-x-3 transition hover:border-gray-700"
                  >
                    <div className="w-6 h-6 rounded-lg bg-[#00e599]/15 text-[#00e599] font-black text-xs flex items-center justify-center shrink-0 border border-[#00e599]/30">
                      {item.step}
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inspiration Badges */}
            <div className="pt-1 space-y-2">
              <span className="text-[11px] font-semibold text-gray-400 block">
                Pilihan Dukungan:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "Beli Kopi", amount: "Rp 5.000", icon: "fa-mug-hot" },
                  { label: "Cemilan", amount: "Rp 10.000", icon: "fa-cookie-bite" },
                  { label: "Server", amount: "Rp 25.000", icon: "fa-server" },
                  { label: "Sultan Backer", amount: "Rp 50.000+", icon: "fa-crown" },
                ].map((tier, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-[#090d16] border border-gray-800 text-center space-y-0.5 hover:border-[#00e599]/40 transition"
                  >
                    <div className="text-[#00e599] text-xs">
                      <i className={cn("fa-solid", tier.icon)}></i>
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium">{tier.label}</div>
                    <div className="text-xs font-bold text-white font-mono">{tier.amount}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Thank you note & copy button */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-800/80">
              <p className="text-[11px] text-gray-400 italic">
                Terima kasih atas segala bentuk apresiasi dan dukungan Anda untuk kelangsungan proyek ini! 💚
              </p>
              <button
                type="button"
                onClick={handleCopyInfo}
                className="px-3.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-medium transition cursor-pointer flex items-center justify-center space-x-1.5 shrink-0 active:scale-95"
              >
                <i className={cn("text-xs", copied ? "fa-solid fa-check text-[#00e599]" : "fa-regular fa-copy")}></i>
                <span>{copied ? "Tersalin!" : "Salin Info"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
