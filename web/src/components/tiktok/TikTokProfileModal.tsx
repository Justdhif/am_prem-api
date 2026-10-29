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
  const [copied, setCopied] = useState(false);
  const [loadingEmbed, setLoadingEmbed] = useState(true);

  const profileUrl = "https://www.tiktok.com/@justdhifbieber";
  const username = "@justdhifbieber";

  useEffect(() => {
    setHasMounted(true);
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
      // Reload TikTok embeds if script is already present in DOM
      const timer = setTimeout(() => {
        try {
          // TikTok's global embed reload trigger
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
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm touch-none"
          />

          {/* Bottom Sheet on Mobile / Centered Modal on Tablet & Desktop */}
          <motion.div
            initial={{ y: "100%", opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative z-[201] w-full sm:max-w-md bg-[#0d121f] border-t sm:border border-gray-800 rounded-t-3xl sm:rounded-3xl shadow-[0_-12px_45px_rgba(0,0,0,0.85)] flex flex-col max-h-[90dvh] overflow-hidden select-none"
          >
            {/* Mobile Drag Indicator */}
            <div className="sm:hidden pt-2.5 pb-1 flex justify-center">
              <div className="w-12 h-1 bg-gray-700/80 rounded-full" />
            </div>

            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-gray-800/80 flex items-center justify-between bg-[#111726]/80 shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-black border border-[#00e599]/40 flex items-center justify-center text-[#00e599] shadow-sm shadow-[#00e599]/20">
                  <i className="fa-brands fa-tiktok text-base"></i>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-100 flex items-center space-x-1.5">
                    <span>TikTok Official</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#00e599]/15 text-[#00e599] font-semibold border border-[#00e599]/30">
                      Live
                    </span>
                  </h3>
                  <p className="text-[11px] text-gray-400 font-mono">{username}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white transition flex items-center justify-center cursor-pointer active:scale-95"
                aria-label="Tutup"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            {/* Modal Body: Live TikTok Creator Embed Widget & Stats */}
            <div className="p-4 overflow-y-auto overscroll-contain space-y-4 custom-scrollbar">
              {/* Creator Banner Card */}
              <div className="bg-[#141b2b] border border-gray-800 rounded-2xl p-3.5 flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#00e599] to-[#00b377] p-0.5 shrink-0 shadow-md shadow-[#00e599]/20">
                    <div className="w-full h-full rounded-full bg-[#0d121f] flex items-center justify-center text-white">
                      <i className="fa-brands fa-tiktok text-xl text-[#00e599]"></i>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                      <span>Justdhif Official</span>
                      <i className="fa-solid fa-circle-check text-[11px] text-[#00e599]" title="Verified"></i>
                    </h4>
                    <p className="text-[11px] text-gray-400 truncate">{username}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Alight Motion Pro & XML Preset</p>
                  </div>
                </div>

                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#00e599]/15 hover:bg-[#00e599]/25 border border-[#00e599]/30 text-[#00e599] text-xs font-bold transition flex items-center space-x-1 shrink-0 active:scale-95"
                >
                  <span>Buka</span>
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                </a>
              </div>

              {/* Real-time TikTok Creator Embed Widget */}
              <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-gray-800/80 min-h-[300px] flex items-center justify-center">
                {loadingEmbed && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0d121f]/90 space-y-2.5">
                    <div className="w-7 h-7 border-2 border-[#00e599] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[11px] text-gray-400">Memuat profil TikTok...</span>
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

            {/* Modal Footer Actions */}
            <div className="p-3.5 border-t border-gray-800/80 bg-[#111726]/80 flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gray-800 hover:bg-gray-700 active:scale-98 text-gray-200 font-semibold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer border border-gray-700/60"
              >
                <i className={copied ? "fa-solid fa-check text-[#00e599]" : "fa-regular fa-clone"}></i>
                <span>{copied ? "Link Tersalin!" : "Salin Link"}</span>
              </button>

              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-[2] py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#00e599] to-[#00b377] hover:brightness-105 active:scale-98 text-gray-950 font-bold text-xs transition shadow-lg shadow-[#00e599]/20 flex items-center justify-center space-x-2"
              >
                <i className="fa-brands fa-tiktok text-sm"></i>
                <span>Buka Profil TikTok</span>
                <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
