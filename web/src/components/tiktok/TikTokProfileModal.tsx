"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface TikTokProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TikTokProfileModal({ isOpen, onClose }: TikTokProfileModalProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loadingEmbed, setLoadingEmbed] = useState(true);

  const profileUrl = "https://www.tiktok.com/@justdhifbieber";
  const username = "@justdhifbieber";

  useEffect(() => {
    setHasMounted(true);
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 640);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Dynamically load TikTok Embed Script and trigger re-render
  useEffect(() => {
    if (!isOpen) return;
    setLoadingEmbed(true);

    const scriptId = "tiktok-embed-script";
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;
      script.onload = () => {
        setLoadingEmbed(false);
      };
      document.body.appendChild(script);
    } else {
      const timer = setTimeout(() => {
        try {
          (window as any).tiktokEmbed?.load();
        } catch {
          // ignore
        }
        setLoadingEmbed(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!hasMounted || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className={`fixed inset-0 z-[200] flex ${
            isDesktop ? "items-center justify-center p-4 sm:p-6" : "items-end justify-center"
          }`}
        >
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm touch-none"
          />

          {/* Conditional: Desktop Centered Dialog vs Mobile Bottom Sheet */}
          {isDesktop ? (
            /* ─────────────────────────────────────────────────────────────
               1. DESKTOP MODE: Centered Floating Dialog Modal
               ───────────────────────────────────────────────────────────── */
            <motion.div
              key="tiktok-desktop-dialog"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative z-[201] w-full max-w-lg bg-[#0d121f] border border-gray-800 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] flex flex-col max-h-[85vh] overflow-hidden select-none"
            >
              {/* Desktop Dialog Header */}
              <div className="px-6 py-4 border-b border-gray-800/80 flex items-center justify-between bg-[#111726]/90 shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-black border border-[#00e599]/40 flex items-center justify-center text-[#00e599] shadow-sm shadow-[#00e599]/25">
                    <i className="fa-brands fa-tiktok text-lg"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-100 flex items-center space-x-2">
                      <span>Profil TikTok Resmi</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00e599]/15 text-[#00e599] font-semibold border border-[#00e599]/30">
                        Live Data
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400 font-mono">{username}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white transition flex items-center justify-center cursor-pointer active:scale-95"
                  aria-label="Tutup Dialog"
                >
                  <i className="fa-solid fa-xmark text-sm"></i>
                </button>
              </div>

              {/* Desktop Dialog Content */}
              <div className="p-5 overflow-y-auto overscroll-contain space-y-4 custom-scrollbar">
                {/* Creator Showcase Card */}
                <div className="bg-[#141b2b] border border-gray-800/90 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00e599] to-[#00b377] p-0.5 shrink-0 shadow-md shadow-[#00e599]/25">
                      <div className="w-full h-full rounded-full bg-[#0d121f] flex items-center justify-center text-white">
                        <i className="fa-brands fa-tiktok text-2xl text-[#00e599]"></i>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate flex items-center gap-1.5">
                        <span>Justdhif Official</span>
                        <i className="fa-solid fa-circle-check text-xs text-[#00e599]" title="Verified"></i>
                      </h4>
                      <p className="text-xs text-gray-400 truncate">{username}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Alight Motion Pro & XML Preset</p>
                    </div>
                  </div>

                  <a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-[#00e599]/15 hover:bg-[#00e599]/25 border border-[#00e599]/30 text-[#00e599] text-xs font-bold transition flex items-center space-x-1.5 shrink-0 active:scale-95 hover:shadow-sm hover:shadow-[#00e599]/20"
                  >
                    <span>Kunjungi</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-[11px]"></i>
                  </a>
                </div>

                {/* TikTok Live Creator Embed Widget */}
                <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-gray-800/80 min-h-[300px] flex items-center justify-center">
                  {loadingEmbed && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0d121f]/90 space-y-2.5">
                      <div className="w-7 h-7 border-2 border-[#00e599] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs text-gray-400">Memuat profil TikTok...</span>
                    </div>
                  )}

                  <div className="w-full flex justify-center py-2">
                    <blockquote
                      className="tiktok-embed"
                      cite={profileUrl}
                      data-unique-id="justdhifbieber"
                      data-embed-from="oembed"
                      data-embed-type="creator"
                      style={{ maxWidth: "100%", minWidth: "288px", margin: "0 auto" }}
                    >
                      <section className="p-4 text-center">
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://www.tiktok.com/@justdhifbieber?refer=creator_embed"
                          className="text-xs text-[#00e599] hover:underline"
                        >
                          @justdhifbieber
                        </a>
                      </section>
                    </blockquote>
                  </div>
                </div>
              </div>

              {/* Desktop Dialog Footer Actions */}
              <div className="px-6 py-4 border-t border-gray-800/80 bg-[#111726]/90 flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gray-800/90 hover:bg-gray-700 active:scale-98 text-gray-200 font-semibold text-xs transition flex items-center justify-center space-x-2 cursor-pointer border border-gray-700/60"
                >
                  <i className={copied ? "fa-solid fa-check text-[#00e599]" : "fa-regular fa-clone"}></i>
                  <span>{copied ? "Link Tersalin!" : "Salin Link"}</span>
                </button>

                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-[2] py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00e599] to-[#00b377] hover:brightness-105 active:scale-98 text-gray-950 font-bold text-xs transition shadow-lg shadow-[#00e599]/25 flex items-center justify-center space-x-2"
                >
                  <i className="fa-brands fa-tiktok text-sm"></i>
                  <span>Buka di Aplikasi TikTok</span>
                  <i className="fa-solid fa-arrow-up-right-from-square text-[11px]"></i>
                </a>
              </div>
            </motion.div>
          ) : (
            /* ─────────────────────────────────────────────────────────────
               2. MOBILE MODE: Bottom Sheet Modal with Drag Indicator
               ───────────────────────────────────────────────────────────── */
            <motion.div
              key="tiktok-mobile-sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative z-[201] w-full bg-[#0d121f] border-t border-gray-800 rounded-t-3xl shadow-[0_-12px_45px_rgba(0,0,0,0.9)] flex flex-col max-h-[88dvh] overflow-hidden select-none"
            >
              {/* Mobile Drag Indicator Handle */}
              <div className="pt-2.5 pb-1 flex justify-center">
                <div className="w-12 h-1 bg-gray-700/80 rounded-full" />
              </div>

              {/* Mobile Sheet Header */}
              <div className="px-4 py-3 border-b border-gray-800/80 flex items-center justify-between bg-[#111726]/80 shrink-0">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-black border border-[#00e599]/40 flex items-center justify-center text-[#00e599] shadow-sm shadow-[#00e599]/20">
                    <i className="fa-brands fa-tiktok text-base"></i>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-100 flex items-center space-x-1.5">
                      <span>TikTok Official</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#00e599]/15 text-[#00e599] font-semibold border border-[#00e599]/30">
                        Live
                      </span>
                    </h3>
                    <p className="text-[11px] text-gray-400 font-mono">{username}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white transition flex items-center justify-center cursor-pointer active:scale-95"
                  aria-label="Tutup"
                >
                  <i className="fa-solid fa-xmark text-sm"></i>
                </button>
              </div>

              {/* Mobile Sheet Content */}
              <div className="p-3.5 overflow-y-auto overscroll-contain space-y-3.5 custom-scrollbar">
                {/* Creator Showcase Card */}
                <div className="bg-[#141b2b] border border-gray-800 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00e599] to-[#00b377] p-0.5 shrink-0 shadow-md shadow-[#00e599]/20">
                      <div className="w-full h-full rounded-full bg-[#0d121f] flex items-center justify-center text-white">
                        <i className="fa-brands fa-tiktok text-lg text-[#00e599]"></i>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate flex items-center gap-1">
                        <span>Justdhif Official</span>
                        <i className="fa-solid fa-circle-check text-[10px] text-[#00e599]" title="Verified"></i>
                      </h4>
                      <p className="text-[11px] text-gray-400 truncate">{username}</p>
                    </div>
                  </div>

                  <a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-xl bg-[#00e599]/15 hover:bg-[#00e599]/25 border border-[#00e599]/30 text-[#00e599] text-[11px] font-bold transition flex items-center space-x-1 shrink-0 active:scale-95"
                  >
                    <span>Buka</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                  </a>
                </div>

                {/* TikTok Live Creator Embed Widget */}
                <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-gray-800/80 min-h-[290px] flex items-center justify-center">
                  {loadingEmbed && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0d121f]/90 space-y-2">
                      <div className="w-6 h-6 border-2 border-[#00e599] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[11px] text-gray-400">Memuat profil TikTok...</span>
                    </div>
                  )}

                  <div className="w-full flex justify-center py-1.5">
                    <blockquote
                      className="tiktok-embed"
                      cite={profileUrl}
                      data-unique-id="justdhifbieber"
                      data-embed-from="oembed"
                      data-embed-type="creator"
                      style={{ maxWidth: "100%", minWidth: "288px", margin: "0 auto" }}
                    >
                      <section className="p-3 text-center">
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://www.tiktok.com/@justdhifbieber?refer=creator_embed"
                          className="text-xs text-[#00e599] hover:underline"
                        >
                          @justdhifbieber
                        </a>
                      </section>
                    </blockquote>
                  </div>
                </div>
              </div>

              {/* Mobile Sheet Footer Actions */}
              <div className="p-3 border-t border-gray-800/80 bg-[#111726]/80 flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gray-800 hover:bg-gray-700 active:scale-98 text-gray-200 font-semibold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer border border-gray-700/60"
                >
                  <i className={copied ? "fa-solid fa-check text-[#00e599]" : "fa-regular fa-clone"}></i>
                  <span>{copied ? "Tersalin!" : "Salin"}</span>
                </button>

                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-[2] py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#00e599] to-[#00b377] hover:brightness-105 active:scale-98 text-gray-950 font-bold text-xs transition shadow-lg shadow-[#00e599]/20 flex items-center justify-center space-x-1.5"
                >
                  <i className="fa-brands fa-tiktok text-xs"></i>
                  <span>Buka TikTok</span>
                  <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                </a>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
