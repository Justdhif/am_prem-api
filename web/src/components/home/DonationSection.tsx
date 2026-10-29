"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export function DonationSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Lock body & html scroll completely when modal sheet is open
  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalTouchAction = document.body.style.touchAction;

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.touchAction = "none";

      const handlePreventDefault = (e: TouchEvent) => {
        const sheetEl = document.getElementById("donationSheetContent");
        if (sheetEl && sheetEl.contains(e.target as Node)) {
          return;
        }
        e.preventDefault();
      };

      window.addEventListener("touchmove", handlePreventDefault, { passive: false });

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.touchAction = originalTouchAction;
        window.removeEventListener("touchmove", handlePreventDefault);
      };
    }
  }, [isOpen]);

  const handleDownloadQR = () => {
    const a = document.createElement("a");
    a.href = "/images/qr_donasi.webp";
    a.download = "QRIS_Justdhif_Store.webp";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <>
      {/* ── BANNER / TRIGGER CARD PADA HALAMAN BERANDA ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#121826] via-[#151c2d] to-[#121826] border border-gray-800/90 hover:border-[#00e599]/30 transition-all shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left"
      >
        <div className="flex items-center space-x-3.5 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl bg-[#00e599]/15 text-[#00e599] flex items-center justify-center text-lg shrink-0 border border-[#00e599]/30">
            <i className="fa-solid fa-heart text-rose-400 animate-pulse"></i>
          </div>
          <div className="min-w-0 space-y-0.5">
            <h4 className="text-sm font-bold text-white font-piximisa tracking-wide">
              Dukungan Donasi &amp; Server
            </h4>
            <p className="text-xs text-gray-400 truncate sm:whitespace-normal">
              Suka dengan web ini? Berikan donasi sukarela untuk mendukung operasional server.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#00e599] hover:bg-[#1affaa] text-gray-950 font-bold text-xs transition flex items-center justify-center space-x-2 shadow-lg shadow-[#00e599]/20 active:scale-95 cursor-pointer shrink-0"
        >
          <i className="fa-solid fa-qrcode text-xs"></i>
          <span>Buka QR Donasi</span>
        </button>
      </motion.div>

      {/* ── BOTTOM SHEET MODAL (SLIDE DARI BAWAH) ── */}
      {hasMounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-[160] flex items-end justify-center">
                {/* Backdrop Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[160] touch-none cursor-pointer"
                />

                {/* Bottom Sheet Container */}
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 28, stiffness: 300 }}
                  id="donationSheetContent"
                  style={{ overscrollBehavior: "contain" }}
                  className="relative z-[165] w-full max-w-md bg-[#0d121f] border-t border-x border-gray-800/90 rounded-t-3xl shadow-[0_-12px_45px_rgba(0,0,0,0.85)] p-5 sm:p-6 text-center space-y-4 max-h-[90vh] overflow-y-auto"
                >
                  {/* Top Drag Handle */}
                  <div className="w-12 h-1.5 rounded-full bg-gray-700/80 mx-auto -mt-1 cursor-grab" />

                  {/* Header & Close Button */}
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-[11px] font-bold text-[#00e599] uppercase tracking-wider flex items-center space-x-1.5">
                      <i className="fa-solid fa-qrcode text-xs"></i>
                      <span>Justdhif Store</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="w-8 h-8 rounded-full bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition active:scale-90 cursor-pointer"
                      aria-label="Tutup"
                    >
                      <i className="fa-solid fa-xmark text-sm"></i>
                    </button>
                  </div>

                  {/* Ucapan Terimakasih */}
                  <div className="space-y-1.5 px-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white font-piximisa">
                      Terima Kasih Banyak! 💚
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Terima kasih sudah menggunakan, mampir, atau memberikan donasi sukarela untuk mendukung layanan Alight Motion Premium ini.
                    </p>
                  </div>

                  {/* Gambar QRIS Resmi */}
                  <div className="p-3 rounded-2xl bg-[#080d16] border border-gray-800/90 shadow-inner flex flex-col items-center justify-center space-y-2">
                    <div className="relative w-full max-w-[270px] sm:max-w-[290px] aspect-[727/1024] rounded-xl overflow-hidden shadow-lg border border-gray-700/60 bg-white">
                      <Image
                        src="/images/qr_donasi.webp"
                        alt="QRIS Donasi Justdhif Store"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                    <span className="text-[10px] text-gray-400">
                      Scan via GoPay, OVO, Dana, ShopeePay, BCA, atau Mobile Banking apa saja
                    </span>
                  </div>

                  {/* Button Unduh QR */}
                  <button
                    type="button"
                    onClick={handleDownloadQR}
                    className="w-full py-3 px-4 rounded-xl bg-[#00e599] hover:bg-[#1affaa] text-gray-950 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-[#00e599]/20 transition active:scale-95 cursor-pointer"
                  >
                    <i className="fa-solid fa-download text-sm"></i>
                    <span>Unduh QR Code</span>
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
