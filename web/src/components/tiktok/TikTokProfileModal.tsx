"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface TikTokProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TikTokProfileData {
  username: string;
  displayName: string;
  profileUrl: string;
  avatarUrl: string;
  bio: string;
  verified: boolean;
  stats: {
    following: string;
    followers: string;
    likes: string;
  };
  tags: string[];
}

const DEFAULT_PROFILE: TikTokProfileData = {
  username: "justdhifbieber",
  displayName: "JusłDhıƒ — order di bio",
  profileUrl: "https://www.tiktok.com/@justdhifbieber",
  avatarUrl: "/images/logos/logo-web.webp",
  bio: "🗎 @ayaa\nrandom account\n\nam prem 1k? order:\nhttps://linkbio-justdhif.vercel.app/",
  verified: true,
  stats: {
    following: "7",
    followers: "330",
    likes: "355",
  },
  tags: [
    "Aktivasi AM Pro 1K",
    "Preset XML Alight Motion",
    "Resmi & Bergaransi",
  ],
};

export function TikTokProfileModal({ isOpen, onClose }: TikTokProfileModalProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState<TikTokProfileData>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setHasMounted(true);
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 640);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Fetch real-time live profile data every time modal is opened
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setLoading(true);

    fetch("/api/tiktok", { cache: "no-store" })
      .then((res) => res.json())
      .then((resData) => {
        if (isMounted && resData?.success && resData.data) {
          setProfile(resData.data);
        }
      })
      .catch((err) => {
        console.warn("[TikTokModal] Live fetch error:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profile.profileUrl);
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
              className="relative z-[201] w-full max-w-md bg-[#0d121f] border border-gray-800 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden select-none"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-800/80 flex items-center justify-between bg-[#111726]/90 shrink-0">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-black border border-[#00e599]/40 flex items-center justify-center text-[#00e599] shadow-sm shadow-[#00e599]/25">
                    <i className="fa-brands fa-tiktok text-base"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-100">
                      Profil TikTok
                    </h3>
                    <p className="text-xs text-gray-400 font-mono">@{profile.username}</p>
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

              {/* Body */}
              <div className="p-6 space-y-5">
                {/* Hero Profile Info */}
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#00e599] to-[#00b377] p-1 shadow-lg shadow-[#00e599]/25">
                      <div className="w-full h-full rounded-full overflow-hidden bg-[#0d121f]">
                        <Image
                          src={profile.avatarUrl}
                          alt={profile.displayName}
                          width={80}
                          height={80}
                          unoptimized
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-black border border-[#00e599]/50 flex items-center justify-center text-[#00e599] text-xs shadow-md">
                      <i className="fa-brands fa-tiktok"></i>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white flex items-center justify-center">
                      <span>{profile.displayName}</span>
                    </h4>
                    <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full bg-gray-800/80 text-gray-400 text-xs font-mono">
                      @{profile.username}
                    </span>
                  </div>

                  {/* Bio with clickable URL */}
                  <div className="text-xs text-gray-300 leading-relaxed max-w-sm whitespace-pre-line text-center">
                    {profile.bio.split("\n").map((line, i) => {
                      if (line.startsWith("http://") || line.startsWith("https://")) {
                        return (
                          <a
                            key={i}
                            href={line}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#00e599] hover:underline font-semibold block mt-1"
                          >
                            {line}
                          </a>
                        );
                      }
                      return (
                        <span key={i} className="block">
                          {line}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* 3-Column Stats Counter Grid (Mengikuti | Pengikut | Suka) */}
                <div className="grid grid-cols-3 gap-2.5 bg-[#141b2b] border border-gray-800/90 rounded-2xl p-3.5 text-center">
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                      <i className="fa-solid fa-user-plus text-[10px] text-blue-400"></i>
                      <span>Mengikuti</span>
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-white font-mono">
                      {profile.stats.following}
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center space-y-1 border-x border-gray-800/80 px-2">
                    <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                      <i className="fa-solid fa-users text-[10px] text-[#00e599]"></i>
                      <span>Pengikut</span>
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-[#00e599] font-mono">
                      {profile.stats.followers}
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center space-y-1">
                    <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                      <i className="fa-solid fa-heart text-[10px] text-rose-500"></i>
                      <span>Suka</span>
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-white font-mono">
                      {profile.stats.likes}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-6 py-4 border-t border-gray-800/80 bg-[#111726]/90 flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gray-800/90 hover:bg-gray-700 active:scale-98 text-gray-200 font-semibold text-xs transition flex items-center justify-center space-x-2 cursor-pointer border border-gray-700/60"
                >
                  <i className={copied ? "fa-solid fa-check text-[#00e599]" : "fa-regular fa-clone"}></i>
                  <span>{copied ? "Link Tersalin!" : "Salin Link"}</span>
                </button>

                <a
                  href={profile.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-[2] py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00e599] to-[#00b377] hover:brightness-105 active:scale-98 text-gray-950 font-bold text-xs transition shadow-lg shadow-[#00e599]/25 flex items-center justify-center space-x-2"
                >
                  <i className="fa-brands fa-tiktok text-sm"></i>
                  <span>Buka di TikTok</span>
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
              className="relative z-[201] w-full bg-[#0d121f] border-t border-gray-800 rounded-t-3xl shadow-[0_-12px_45px_rgba(0,0,0,0.9)] flex flex-col max-h-[90dvh] overflow-hidden select-none"
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
                    <h3 className="text-xs font-bold text-gray-100">
                      Profil TikTok
                    </h3>
                    <p className="text-[11px] text-gray-400 font-mono">@{profile.username}</p>
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
              <div className="p-4 space-y-4 overflow-y-auto overscroll-contain custom-scrollbar">
                {/* Hero Profile Info */}
                <div className="flex flex-col items-center text-center space-y-2.5">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#00e599] to-[#00b377] p-0.5 shadow-md shadow-[#00e599]/25">
                      <div className="w-full h-full rounded-full overflow-hidden bg-[#0d121f]">
                        <Image
                          src={profile.avatarUrl}
                          alt={profile.displayName}
                          width={64}
                          height={64}
                          unoptimized
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-black border border-[#00e599]/50 flex items-center justify-center text-[#00e599] text-[10px]">
                      <i className="fa-brands fa-tiktok"></i>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center justify-center">
                      <span>{profile.displayName}</span>
                    </h4>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-gray-800/80 text-gray-400 text-[11px] font-mono">
                      @{profile.username}
                    </span>
                  </div>

                  {/* Bio with clickable URL */}
                  <div className="text-xs text-gray-300 leading-relaxed text-center whitespace-pre-line">
                    {profile.bio.split("\n").map((line, i) => {
                      if (line.startsWith("http://") || line.startsWith("https://")) {
                        return (
                          <a
                            key={i}
                            href={line}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#00e599] hover:underline font-semibold block mt-1"
                          >
                            {line}
                          </a>
                        );
                      }
                      return (
                        <span key={i} className="block">
                          {line}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* 3-Column Stats Counter Grid (Mengikuti | Pengikut | Suka) */}
                <div className="grid grid-cols-3 gap-2 bg-[#141b2b] border border-gray-800/90 rounded-2xl p-3 text-center">
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                      <i className="fa-solid fa-user-plus text-[9px] text-blue-400"></i>
                      <span>Mengikuti</span>
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-white font-mono">
                      {profile.stats.following}
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center space-y-1 border-x border-gray-800/80 px-1">
                    <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                      <i className="fa-solid fa-users text-[9px] text-[#00e599]"></i>
                      <span>Pengikut</span>
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#00e599] font-mono">
                      {profile.stats.followers}
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center space-y-1">
                    <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                      <i className="fa-solid fa-heart text-[9px] text-rose-500"></i>
                      <span>Suka</span>
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-white font-mono">
                      {profile.stats.likes}
                    </span>
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
                  href={profile.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-[2] py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#00e599] to-[#00b377] hover:brightness-105 active:scale-98 text-gray-950 font-bold text-xs transition shadow-lg shadow-[#00e599]/20 flex items-center justify-center space-x-1.5"
                >
                  <i className="fa-brands fa-tiktok text-xs"></i>
                  <span>Buka di TikTok</span>
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
