"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";

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
      {/* Donation Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-800/80 bg-gradient-to-r from-[#0d121f] via-[#12192b] to-[#0d121f] p-5 sm:p-7 shadow-2xl text-left"
      >
        {/* Subtle Ambient Decorative Glows */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#00e599]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
          {/* Left Column: Icon + Text Content */}
          <div className="flex items-start sm:items-center space-x-3.5 sm:space-x-4 min-w-0 flex-1">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#00e599]/20 to-[#00b377]/10 border border-[#00e599]/30 text-[#00e599] flex items-center justify-center text-lg sm:text-xl shrink-0 shadow-[0_0_20px_rgba(0,229,153,0.15)]">
              <i className="fa-solid fa-heart text-rose-400 animate-pulse"></i>
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-[#00e599]/10 text-[#00e599] border border-[#00e599]/25 text-[10px] font-bold tracking-wider uppercase">
                  <span>Support &amp; Community</span>
                </span>
              </div>
              <h4 className="text-sm sm:text-base md:text-lg font-bold text-white font-piximisa tracking-wide">
                Dukungan Donasi &amp; Server
              </h4>
              <p className="text-xs sm:text-sm text-gray-300/90 leading-relaxed max-w-xl">
                Suka dengan web ini? Dukung kelangsungan server &amp; update fitur Alight Motion Premium melalui donasi sukarela via QRIS resmi.
              </p>
            </div>
          </div>

          {/* Right Column: CTA Button */}
          <motion.button
            type="button"
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#00e599] to-[#00c985] hover:from-[#1affaa] hover:to-[#00e599] text-gray-950 font-bold text-xs sm:text-sm transition-all shadow-[0_0_25px_rgba(0,229,153,0.3)] hover:shadow-[0_0_35px_rgba(0,229,153,0.5)] flex items-center justify-center space-x-2 shrink-0 cursor-pointer active:scale-95 group"
          >
            <i className="fa-solid fa-qrcode text-sm transition-transform duration-300 group-hover:rotate-6"></i>
            <span>Buka QR Donasi</span>
            <i className="fa-solid fa-arrow-right text-[11px] opacity-75 group-hover:translate-x-0.5 transition-transform duration-300"></i>
          </motion.button>
        </div>
      </motion.div>

      {/* Donation Bottom Sheet Modal */}
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
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="w-8 h-8 rounded-full bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white"
                      aria-label="Tutup"
                    >
                      <i className="fa-solid fa-xmark text-sm"></i>
                    </Button>
                  </div>

                  {/* Thank You Note */}
                  <div className="space-y-1.5 px-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white font-piximisa">
                      Terima Kasih Banyak! 💚
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Terima kasih sudah menggunakan, mampir, atau memberikan donasi sukarela untuk mendukung layanan Alight Motion Premium ini.
                    </p>
                  </div>

                  {/* Official QRIS Image */}
                  <div className="p-3 rounded-2xl bg-[#080d16] border border-gray-800/90 shadow-inner flex flex-col items-center justify-center">
                    <div className="relative w-full max-w-[270px] sm:max-w-[290px] aspect-[727/1024] rounded-xl overflow-hidden shadow-lg border border-gray-700/60 bg-white">
                      <Image
                        src="/images/qr_donasi.webp"
                        alt="QRIS Donasi Justdhif Store"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>

                  {/* Download QR Button */}
                  <Button
                    type="button"
                    onClick={handleDownloadQR}
                    className="w-full h-auto py-3 px-4 rounded-xl bg-[#00e599] hover:bg-[#1affaa] text-gray-950 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-[#00e599]/20"
                  >
                    <i className="fa-solid fa-download text-sm"></i>
                    <span>Unduh QR Code</span>
                  </Button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
