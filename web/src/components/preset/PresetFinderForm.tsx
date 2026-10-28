"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function PresetFinderForm() {
  const [presetUrl, setPresetUrl] = useState("");
  const [presetLoading, setPresetLoading] = useState(false);
  const [presetResult, setPresetResult] = useState<any | null>(null);
  const [presetError, setPresetError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleFindPreset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!presetUrl) return;

    setPresetLoading(true);
    setPresetError(null);
    setPresetResult(null);

    try {
      const res = await apiClient.findPreset(presetUrl);
      if (res.ok && res.data?.success) {
        setPresetResult(res.data.data);
      } else {
        setPresetError(
          res.data?.message || res.data?.error || "Tidak dapat menemukan preset dari tautan tersebut."
        );
      }
    } catch (err: any) {
      setPresetError(err.message || "Gagal memindai video. Pastikan link video valid.");
    } finally {
      setPresetLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 text-left w-full">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="p-5 sm:p-7 bg-[#121826] border border-gray-800/90 rounded-2xl shadow-xl space-y-5"
      >
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide font-piximisa flex items-center space-x-2">
            <i className="fa-solid fa-magnifying-glass text-[#00e599]"></i>
            <span>Cari &amp; Ekstrak Preset Alight Motion</span>
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Tempelkan link video TikTok atau YouTube yang membagikan preset. Sistem kami akan memindai deskripsi dan seluruh komentar untuk mengambil link preset resmi (XML / Alight Creative link).
          </p>
        </div>

        <form onSubmit={handleFindPreset} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              URL Video TikTok / YouTube <span className="text-[#00e599]">*</span>
            </label>
            <div className="flex items-center bg-[#0d121f] rounded-xl px-3.5 py-3 border border-gray-700/80 focus-within:border-[#00e599] transition">
              <i className="fa-solid fa-link text-gray-500 mr-2.5 text-sm shrink-0"></i>
              <input
                type="text"
                required
                value={presetUrl}
                onChange={(e) => setPresetUrl(e.target.value)}
                placeholder="https://vt.tiktok.com/ZSxxxxxxx/ atau https://youtu.be/..."
                className="bg-transparent border-0 p-0 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none w-full font-mono"
              />
            </div>
          </div>

          <AnimatePresence>
            {presetError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2"
              >
                <i className="fa-solid fa-circle-exclamation text-base shrink-0"></i>
                <span>{presetError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            {/* Sample Buttons */}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
              <button
                type="button"
                onClick={() => setPresetUrl("https://vt.tiktok.com/ZSxxxxxxx/")}
                className="px-3 py-2 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-medium transition flex items-center justify-center space-x-1.5 active:scale-95 cursor-pointer"
              >
                <i className="fa-brands fa-tiktok text-xs"></i>
                <span>Contoh TikTok</span>
              </button>
              <button
                type="button"
                onClick={() => setPresetUrl("https://youtu.be/dQw4w9WgXcQ")}
                className="px-3 py-2 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-medium transition flex items-center justify-center space-x-1.5 active:scale-95 cursor-pointer"
              >
                <i className="fa-brands fa-youtube text-xs text-red-400"></i>
                <span>Contoh YouTube</span>
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={presetLoading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#00e599] hover:bg-[#1affaa] text-gray-950 font-bold text-xs sm:text-sm transition flex items-center justify-center space-x-2 shadow-lg shadow-[#00e599]/20 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {presetLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                  <span>Memindai Video...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-magnifying-glass text-xs"></i>
                  <span>Cari Preset</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* PRESET RESULTS CARD */}
        <AnimatePresence>
          {presetResult && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 pt-3 border-t border-gray-800"
            >
              {/* Video Details Card */}
              {presetResult.video && (
                <div className="p-3.5 rounded-xl bg-[#0d121f] border border-gray-800 flex items-center space-x-3">
                  {presetResult.video.thumbnailUrl && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-700 relative">
                      <Image
                        src={presetResult.video.thumbnailUrl}
                        alt="Thumbnail"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-[#00e599] font-bold uppercase tracking-wider block">
                      Video {presetResult.platform || "Ditemukan"}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                      {presetResult.video.title || "Video Tanpa Judul"}
                    </h4>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">
                      Kreator: {presetResult.video.author || "Anonim"}
                    </p>
                  </div>
                </div>
              )}

              {/* List of Found Presets */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-400 px-1">
                  <span>Preset Ditemukan:</span>
                  <span className="text-[#00e599] font-mono">
                    {presetResult.presets?.length || presetResult.totalPresetsFound || 0} Link
                  </span>
                </div>

                {presetResult.presets && presetResult.presets.length > 0 ? (
                  <div className="space-y-2">
                    {presetResult.presets.map((item: any, idx: number) => {
                      const linkUrl = typeof item === "string" ? item : item.url || item.link;
                      const isAlightCreative = linkUrl.includes("alightcreative.com") || linkUrl.includes("alight.link");
                      const isDrive = linkUrl.includes("drive.google.com");

                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: idx * 0.04 }}
                          className="p-3.5 rounded-xl bg-[#0d121f] border border-gray-800 hover:border-gray-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-1.5 mb-1">
                              <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-[#00e599]/15 text-[#00e599] border border-[#00e599]/30">
                                {isAlightCreative ? "Alight Link" : isDrive ? "Google Drive (XML)" : "Preset Link"}
                              </span>
                            </div>
                            <span className="text-xs font-mono text-gray-300 truncate block">
                              {linkUrl}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleCopy(linkUrl, idx)}
                              className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium transition cursor-pointer flex items-center space-x-1 active:scale-95"
                            >
                              <i className={cn("text-xs", copiedIndex === idx ? "fa-solid fa-check text-[#00e599]" : "fa-regular fa-copy")}></i>
                              <span>{copiedIndex === idx ? "Tersalin!" : "Salin"}</span>
                            </button>

                            <a
                              href={linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-1.5 rounded-lg bg-[#00e599] hover:bg-[#1affaa] text-gray-950 text-xs font-bold transition flex items-center space-x-1 shadow-md cursor-pointer active:scale-95"
                            >
                              <span>Buka Preset</span>
                              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                            </a>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-gray-800/40 border border-gray-800 text-center text-xs text-gray-400 space-y-1">
                    <p className="text-gray-300 font-medium">Tidak ada link preset langsung yang ditemukan di komentar video ini.</p>
                    <p className="text-[11px] text-gray-500">Coba cek link video kreator lain atau pastikan video tersebut membagikan preset.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
