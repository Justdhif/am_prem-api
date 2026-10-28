"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  TRENDING_PRESETS,
  CATEGORY_FILTERS,
  QUICK_SAMPLE_LINKS,
  extractPresetsFromRawText,
  SavedPreset,
} from "./presetData";

type ActiveTab = "scan" | "manual" | "trending" | "saved";

export function PresetFinderForm() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("scan");

  // Tab 1: Scanner State
  const [presetUrl, setPresetUrl] = useState("");
  const [presetLoading, setPresetLoading] = useState(false);
  const [presetResult, setPresetResult] = useState<any | null>(null);
  const [presetError, setPresetError] = useState<string | null>(null);
  const [scannerFilterType, setScannerFilterType] = useState<string>("all");

  // Tab 2: Manual Extractor State
  const [manualText, setManualText] = useState("");
  const [manualFilterType, setManualFilterType] = useState<string>("all");

  // Tab 3: Trending Presets State
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");

  // Tab 4: Bookmark / Saved State (localStorage)
  const [savedPresets, setSavedPresets] = useState<SavedPreset[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  // Load saved presets from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("am_prem_saved_presets");
      if (stored) {
        setSavedPresets(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage helper
  const toggleSavePreset = (item: {
    id: string;
    title: string;
    creator: string;
    platform: string;
    url: string;
    type: "5mb" | "xml" | "sound" | "channel";
  }) => {
    setSavedPresets((prev) => {
      const exists = prev.some((p) => p.url === item.url);
      let updated: SavedPreset[];
      if (exists) {
        updated = prev.filter((p) => p.url !== item.url);
      } else {
        updated = [
          {
            ...item,
            savedAt: new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          },
          ...prev,
        ];
      }
      try {
        localStorage.setItem("am_prem_saved_presets", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const isSaved = (url: string) => savedPresets.some((p) => p.url === url);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Export JSON helper
  const handleExportJson = (data: any, fileName = "alight-motion-presets.json") => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle Scan Submit
  const handleFindPreset = async (urlToScan?: string) => {
    const targetUrl = (urlToScan || presetUrl).trim();
    if (!targetUrl) return;

    if (urlToScan) {
      setPresetUrl(urlToScan);
    }

    setPresetLoading(true);
    setPresetError(null);
    setPresetResult(null);

    try {
      const res = await apiClient.findPreset(targetUrl);
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

  // Filtered Scan Results
  const filteredScanPresets = useMemo(() => {
    if (!presetResult?.presets) return [];
    return presetResult.presets.filter((item: any) => {
      const url = typeof item === "string" ? item : item.url || item.link;
      const isAlight = url.includes("alightcreative.com") || url.includes("alight.link");
      const isDrive = url.includes("drive.google.com") || url.includes("mediafire.com");
      const isSound = /sound|audio/i.test(url) || item.type === "sound";

      if (scannerFilterType === "5mb") return isAlight;
      if (scannerFilterType === "xml") return isDrive && !isSound;
      if (scannerFilterType === "sound") return isSound;
      return true;
    });
  }, [presetResult, scannerFilterType]);

  // Manual Extracted Results
  const manualExtractedLinks = useMemo(() => {
    if (!manualText.trim()) return [];
    const all = extractPresetsFromRawText(manualText);
    if (manualFilterType === "all") return all;
    return all.filter((item) => item.type === manualFilterType);
  }, [manualText, manualFilterType]);

  // Filtered Trending Presets
  const filteredTrending = useMemo(() => {
    return TRENDING_PRESETS.filter((item) => {
      const matchCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchPlatform = selectedPlatform === "all" || item.platform === selectedPlatform;
      return matchCategory && matchPlatform;
    });
  }, [selectedCategory, selectedPlatform]);

  return (
    <div className="space-y-6 text-left w-full">
      {/* Mode / Tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#0d121f] border border-gray-800/80 rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveTab("scan")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 cursor-pointer active:scale-95",
            activeTab === "scan"
              ? "bg-[#00e599] text-gray-950 shadow-md shadow-[#00e599]/20"
              : "text-gray-400 hover:text-white hover:bg-gray-800/50"
          )}
        >
          <i className="fa-solid fa-magnifying-glass text-xs"></i>
          <span>Scan Link VT</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("manual")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 cursor-pointer active:scale-95",
            activeTab === "manual"
              ? "bg-[#00e599] text-gray-950 shadow-md shadow-[#00e599]/20"
              : "text-gray-400 hover:text-white hover:bg-gray-800/50"
          )}
        >
          <i className="fa-solid fa-file-lines text-xs"></i>
          <span>Ekstraktor Manual</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("trending")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 cursor-pointer active:scale-95",
            activeTab === "trending"
              ? "bg-[#00e599] text-gray-950 shadow-md shadow-[#00e599]/20"
              : "text-gray-400 hover:text-white hover:bg-gray-800/50"
          )}
        >
          <i className="fa-solid fa-fire text-xs text-orange-400"></i>
          <span>Trending Presets</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-current font-mono">
            {TRENDING_PRESETS.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("saved")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 cursor-pointer active:scale-95 sm:ml-auto",
            activeTab === "saved"
              ? "bg-[#00e599] text-gray-950 shadow-md shadow-[#00e599]/20"
              : "text-gray-400 hover:text-white hover:bg-gray-800/50"
          )}
        >
          <i className="fa-solid fa-bookmark text-xs"></i>
          <span>Tersimpan</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-gray-800 text-[#00e599] font-mono border border-gray-700">
            {savedPresets.length}
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: SCAN LINK VT (TIKTOK & YOUTUBE)                    */}
      {/* ======================================================== */}
      {activeTab === "scan" && (
        <motion.div
          key="scan"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.25 }}
          className="p-5 sm:p-7 bg-[#121826] border border-gray-800/90 rounded-2xl shadow-xl space-y-5"
        >
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide font-piximisa flex items-center space-x-2">
              <i className="fa-solid fa-wand-magic-sparkles text-[#00e599]"></i>
              <span>Pindai Preset dari Video TikTok &amp; YouTube</span>
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Tempelkan tautan video VT TikTok atau video YouTube Shorts. Sistem kami akan memindai teks deskripsi serta seluruh komentar untuk menyaring link preset 5MB, file XML Google Drive, dan Sound Audio secara otomatis.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleFindPreset();
            }}
            className="space-y-4"
          >
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

            {/* Quick Sample Test Buttons */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-gray-400 block">
                Uji Cepat Link Contoh:
              </span>
              <div className="flex flex-wrap gap-2">
                {QUICK_SAMPLE_LINKS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleFindPreset(sample.url)}
                    className="px-2.5 py-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white text-[11px] font-medium transition flex items-center space-x-1.5 active:scale-95 cursor-pointer"
                  >
                    <i
                      className={cn(
                        "text-[10px]",
                        sample.platform === "tiktok"
                          ? "fa-brands fa-tiktok text-cyan-400"
                          : "fa-brands fa-youtube text-red-400"
                      )}
                    ></i>
                    <span>{sample.label}</span>
                  </button>
                ))}
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

            <div className="flex items-center justify-end pt-1">
              <button
                type="submit"
                disabled={presetLoading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#00e599] hover:bg-[#1affaa] text-gray-950 font-bold text-xs sm:text-sm transition flex items-center justify-center space-x-2 shadow-lg shadow-[#00e599]/20 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {presetLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                    <span>Memindai Video &amp; Komentar...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
                    <span>Scan Link Video</span>
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
                className="space-y-4 pt-4 border-t border-gray-800"
              >
                {/* Video Info Header */}
                {presetResult.video && (
                  <div className="p-3.5 rounded-xl bg-[#0d121f] border border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3 min-w-0">
                      {presetResult.video.thumbnailUrl && (
                        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-gray-700 relative">
                          <Image
                            src={presetResult.video.thumbnailUrl}
                            alt="Thumbnail"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[10px] text-[#00e599] font-bold uppercase tracking-wider">
                            Video {presetResult.platform || "Ditemukan"}
                          </span>
                          <span className="text-gray-500">•</span>
                          <span className="text-[10px] text-gray-400">
                            {presetResult.totalCommentsScanned || 0} Komentar Diperiksa
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5 max-w-md">
                          {presetResult.video.title || "Video Tanpa Judul"}
                        </h4>
                        <p className="text-[11px] text-gray-400 truncate">
                          Kreator: {presetResult.video.author || "Anonim"}
                        </p>
                      </div>
                    </div>

                    {/* Export JSON Button */}
                    <button
                      type="button"
                      onClick={() =>
                        handleExportJson(
                          presetResult,
                          `preset-${presetResult.platform || "scan"}.json`
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-semibold transition flex items-center space-x-1.5 shrink-0 self-end sm:self-auto cursor-pointer"
                    >
                      <i className="fa-solid fa-file-arrow-down text-xs text-[#00e599]"></i>
                      <span>Ekspor JSON</span>
                    </button>
                  </div>
                )}

                {/* Filter Chips for Scan Results */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex flex-wrap gap-1.5">
                    {["all", "5mb", "xml", "sound"].map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setScannerFilterType(f)}
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer",
                          scannerFilterType === f
                            ? "bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/40"
                            : "bg-gray-800/60 text-gray-400 hover:text-gray-200 border border-transparent"
                        )}
                      >
                        {f === "all"
                          ? "Semua Link"
                          : f === "5mb"
                          ? "Prst 5MB"
                          : f === "xml"
                          ? "Prst XML"
                          : "Sound Audio"}
                      </button>
                    ))}
                  </div>

                  <span className="text-xs font-mono text-gray-400">
                    Menampilkan <strong className="text-[#00e599]">{filteredScanPresets.length}</strong> link
                  </span>
                </div>

                {/* List of Found Presets */}
                {filteredScanPresets.length > 0 ? (
                  <div className="space-y-2">
                    {filteredScanPresets.map((item: any, idx: number) => {
                      const linkUrl = typeof item === "string" ? item : item.url || item.link;
                      const isAlight = linkUrl.includes("alightcreative.com") || linkUrl.includes("alight.link");
                      const isDrive = linkUrl.includes("drive.google.com") || linkUrl.includes("mediafire.com");
                      const isSound = /sound|audio/i.test(linkUrl) || item.type === "sound";
                      const itemType: "5mb" | "xml" | "sound" | "channel" = isAlight
                        ? "5mb"
                        : isSound
                        ? "sound"
                        : isDrive
                        ? "xml"
                        : "channel";

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
                              <span
                                className={cn(
                                  "text-[10px] px-2 py-0.5 rounded-md font-semibold border",
                                  itemType === "5mb"
                                    ? "bg-[#00e599]/15 text-[#00e599] border-[#00e599]/30"
                                    : itemType === "xml"
                                    ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                                    : itemType === "sound"
                                    ? "bg-purple-500/15 text-purple-400 border-purple-500/30"
                                    : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                )}
                              >
                                {itemType === "5mb"
                                  ? "Prst 5MB (Alight Link)"
                                  : itemType === "xml"
                                  ? "Prst XML (Drive/Cloud)"
                                  : itemType === "sound"
                                  ? "Sound Audio"
                                  : "Join Saluran"}
                              </span>
                            </div>
                            <span className="text-xs font-mono text-gray-300 truncate block">
                              {linkUrl}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            {/* Bookmark Toggle */}
                            <button
                              type="button"
                              onClick={() =>
                                toggleSavePreset({
                                  id: `scan-${idx}`,
                                  title: presetResult.video?.title || "Preset Alight Motion",
                                  creator: presetResult.video?.author || "Kreator",
                                  platform: presetResult.platform || "tiktok",
                                  url: linkUrl,
                                  type: itemType,
                                })
                              }
                              className={cn(
                                "p-2 rounded-lg text-xs transition cursor-pointer",
                                isSaved(linkUrl)
                                  ? "bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/40"
                                  : "bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white"
                              )}
                              title={isSaved(linkUrl) ? "Hapus dari Tersimpan" : "Simpan Preset"}
                            >
                              <i
                                className={cn(
                                  isSaved(linkUrl) ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"
                                )}
                              ></i>
                            </button>

                            {/* Copy Button */}
                            <button
                              type="button"
                              onClick={() => handleCopy(linkUrl, `scan-${idx}`)}
                              className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium transition cursor-pointer flex items-center space-x-1 active:scale-95"
                            >
                              <i
                                className={cn(
                                  "text-xs",
                                  copiedIndex === `scan-${idx}`
                                    ? "fa-solid fa-check text-[#00e599]"
                                    : "fa-regular fa-copy"
                                )}
                              ></i>
                              <span>{copiedIndex === `scan-${idx}` ? "Tersalin!" : "Salin"}</span>
                            </button>

                            {/* Open Preset Button */}
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
                    <p className="text-gray-300 font-medium">
                      Tidak ada link preset yang sesuai dengan filter ini.
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Pilih &ldquo;Semua Link&rdquo; atau periksa komentar video langsung.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: EKSTRAKTOR KOMENTAR MANUAL (INSTANT CLIENT-SIDE)  */}
      {/* ======================================================== */}
      {activeTab === "manual" && (
        <motion.div
          key="manual"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.25 }}
          className="p-5 sm:p-7 bg-[#121826] border border-gray-800/90 rounded-2xl shadow-xl space-y-5"
        >
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide font-piximisa flex items-center space-x-2">
              <i className="fa-solid fa-file-lines text-[#00e599]"></i>
              <span>Ekstraktor Komentar &amp; Deskripsi Manual</span>
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Punya tangkapan teks komentar atau deskripsi VT sendiri? Tempel teksnya ke bawah, sistem akan langsung memfilter dan memisahkan link 5MB, link Google Drive XML, serta link Sound secara instan tanpa perlu koneksi API.
            </p>
          </div>

          <div className="space-y-3">
            <textarea
              rows={5}
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="Tempel teks deskripsi atau komentar VT di sini... (Contoh: Preset 5MB: https://alightcreative.com/am/share/... XML: https://drive.google.com/file/...)"
              className="w-full bg-[#0d121f] rounded-xl p-3.5 border border-gray-700/80 focus:border-[#00e599] text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none font-mono"
            />

            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() =>
                  setManualText(
                    `PRESET AM JJ KANE BASS GLERR:\nPreset 5MB: https://alightcreative.com/am/share/u/CySFjQ0lYYNYbzkT2Vdd7IumW1r1/p/ckzHhOiPi7-300aaeb8e8c07ae3\nXML Drive: https://drive.google.com/file/d/1heAz4L3Hp5SYcr3faVPqqfc-MkrsSjrk/view?usp=drivesdk\nSound Drive: https://drive.google.com/file/d/1SoundKane_BassGlerr/view?usp=drivesdk\nJoin Saluran WA: https://chat.whatsapp.com/samplechannel`
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-300 text-xs font-medium transition cursor-pointer flex items-center space-x-1.5"
              >
                <i className="fa-solid fa-paste text-xs text-[#00e599]"></i>
                <span>Tempel Contoh Komentar</span>
              </button>

              {manualText && (
                <button
                  type="button"
                  onClick={() => setManualText("")}
                  className="px-3 py-1.5 rounded-lg bg-gray-800/80 hover:bg-red-500/20 text-gray-400 hover:text-red-400 text-xs transition cursor-pointer"
                >
                  Bersihkan Teks
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills for Manual Extractor */}
          {manualExtractedLinks.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-gray-800">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "all", label: "Semua Link" },
                    { id: "5mb", label: "Prst 5MB" },
                    { id: "xml", label: "Prst XML" },
                    { id: "sound", label: "Sound Audio" },
                    { id: "channel", label: "Saluran WA" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setManualFilterType(f.id)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer",
                        manualFilterType === f.id
                          ? "bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/40"
                          : "bg-gray-800/60 text-gray-400 hover:text-gray-200 border border-transparent"
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleExportJson(manualExtractedLinks, "manual-extracted-presets.json")}
                  className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <i className="fa-solid fa-file-arrow-down text-xs text-[#00e599]"></i>
                  <span>Ekspor JSON</span>
                </button>
              </div>

              {/* Extracted Links List */}
              <div className="space-y-2">
                {manualExtractedLinks.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#0d121f] border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-md font-semibold border inline-block mb-1",
                          item.type === "5mb"
                            ? "bg-[#00e599]/15 text-[#00e599] border-[#00e599]/30"
                            : item.type === "xml"
                            ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                            : item.type === "sound"
                            ? "bg-purple-500/15 text-purple-400 border-purple-500/30"
                            : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        )}
                      >
                        {item.label}
                      </span>
                      <span className="text-xs font-mono text-gray-300 truncate block">
                        {item.url}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          toggleSavePreset({
                            id: `manual-${idx}`,
                            title: item.label,
                            creator: "Ekstraksi Manual",
                            platform: "manual",
                            url: item.url,
                            type: item.type,
                          })
                        }
                        className={cn(
                          "p-2 rounded-lg text-xs transition cursor-pointer",
                          isSaved(item.url)
                            ? "bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/40"
                            : "bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white"
                        )}
                        title={isSaved(item.url) ? "Hapus dari Tersimpan" : "Simpan Preset"}
                      >
                        <i
                          className={cn(
                            isSaved(item.url) ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"
                          )}
                        ></i>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopy(item.url, `manual-${idx}`)}
                        className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium transition cursor-pointer flex items-center space-x-1 active:scale-95"
                      >
                        <i
                          className={cn(
                            "text-xs",
                            copiedIndex === `manual-${idx}`
                              ? "fa-solid fa-check text-[#00e599]"
                              : "fa-regular fa-copy"
                          )}
                        ></i>
                        <span>{copiedIndex === `manual-${idx}` ? "Tersalin!" : "Salin"}</span>
                      </button>

                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-lg bg-[#00e599] hover:bg-[#1affaa] text-gray-950 text-xs font-bold transition flex items-center space-x-1 shadow-md cursor-pointer active:scale-95"
                      >
                        <span>Buka</span>
                        <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: TRENDING PRESETS REPOSITORIES (COMMUNITY VIRAL)   */}
      {/* ======================================================== */}
      {activeTab === "trending" && (
        <motion.div
          key="trending"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          {/* Trending Header & Filters */}
          <div className="p-5 sm:p-6 bg-[#121826] border border-gray-800/90 rounded-2xl shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide font-piximisa flex items-center space-x-2">
                  <i className="fa-solid fa-fire text-orange-400"></i>
                  <span>Live Trending Repositories</span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Daftar repositori preset Alight Motion viral di TikTok &amp; YouTube, diurutkan berdasarkan Like terbanyak.
                </p>
              </div>

              {/* Platform Selector */}
              <div className="flex items-center space-x-1.5 p-1 bg-[#0d121f] rounded-xl border border-gray-800 self-start sm:self-auto shrink-0">
                {[
                  { id: "all", label: "Semua" },
                  { id: "tiktok", label: "TikTok" },
                  { id: "youtube", label: "YouTube" },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlatform(p.id)}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer",
                      selectedPlatform === p.id
                        ? "bg-[#00e599] text-gray-950 font-bold"
                        : "text-gray-400 hover:text-white"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {CATEGORY_FILTERS.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer active:scale-95",
                    selectedCategory === cat.id
                      ? "bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/40 font-bold"
                      : "bg-[#0d121f] text-gray-400 hover:text-white border border-gray-800"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="space-y-4">
            {filteredTrending.map((preset, pIdx) => (
              <motion.div
                key={preset.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: pIdx * 0.05 }}
                className="p-5 bg-[#121826] border border-gray-800/90 rounded-2xl shadow-xl space-y-4 hover:border-gray-700 transition"
              >
                {/* Card Header: Creator & Metrics */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-gray-800">
                  <div className="flex items-center space-x-2.5">
                    <span
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0",
                        preset.platform === "tiktok"
                          ? "bg-black text-cyan-400 border border-gray-800"
                          : "bg-red-500/10 text-red-400 border border-red-500/30"
                      )}
                    >
                      <i
                        className={preset.platform === "tiktok" ? "fa-brands fa-tiktok" : "fa-brands fa-youtube"}
                      ></i>
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white font-mono">
                          {preset.creatorHandle}
                        </span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#00e599]/15 text-[#00e599] border border-[#00e599]/30 font-semibold">
                          {preset.categoryLabel}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500">
                        {preset.updatedAt} • {preset.views.toLocaleString("id-ID")} Tayangan
                      </span>
                    </div>
                  </div>

                  {/* Likes & Comments Metric */}
                  <div className="flex items-center space-x-3 text-xs text-gray-400 font-mono self-start sm:self-auto">
                    <span className="flex items-center space-x-1">
                      <i className="fa-solid fa-heart text-red-500 text-xs"></i>
                      <span>{preset.likes.toLocaleString("id-ID")}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <i className="fa-solid fa-comment text-gray-400 text-xs"></i>
                      <span>{preset.commentsCount.toLocaleString("id-ID")}</span>
                    </span>
                  </div>
                </div>

                {/* Title & Sound */}
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white leading-snug">
                    {preset.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-[#00e599]">
                    <i className="fa-solid fa-music text-[10px]"></i>
                    <span className="font-mono text-[11px] truncate">{preset.soundTitle}</span>
                  </div>
                </div>

                {/* Direct Preset Links in this Repository */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    Link Preset Tersedia ({preset.links.length} Link):
                  </span>

                  <div className="space-y-1.5">
                    {preset.links.map((link, lIdx) => (
                      <div
                        key={lIdx}
                        className="p-2.5 rounded-xl bg-[#0d121f] border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2">
                            <span
                              className={cn(
                                "text-[10px] px-2 py-0.5 rounded font-semibold border shrink-0",
                                link.type === "5mb"
                                  ? "bg-[#00e599]/15 text-[#00e599] border-[#00e599]/30"
                                  : link.type === "xml"
                                  ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                                  : "bg-purple-500/15 text-purple-400 border-purple-500/30"
                              )}
                            >
                              {link.type === "5mb"
                                ? "Prst 5MB"
                                : link.type === "xml"
                                ? "Prst XML"
                                : "Sound Audio"}
                            </span>
                            <span className="text-xs text-gray-300 font-medium truncate">
                              {link.label}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-gray-500 truncate block mt-0.5">
                            {link.url}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                          {/* Bookmark */}
                          <button
                            type="button"
                            onClick={() =>
                              toggleSavePreset({
                                id: `${preset.id}-${lIdx}`,
                                title: preset.title,
                                creator: preset.creatorHandle,
                                platform: preset.platform,
                                url: link.url,
                                type: link.type,
                              })
                            }
                            className={cn(
                              "p-1.5 rounded-lg text-xs transition cursor-pointer",
                              isSaved(link.url)
                                ? "bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/40"
                                : "bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white"
                            )}
                            title={isSaved(link.url) ? "Hapus dari Tersimpan" : "Simpan Link"}
                          >
                            <i
                              className={cn(
                                isSaved(link.url) ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"
                              )}
                            ></i>
                          </button>

                          {/* Copy */}
                          <button
                            type="button"
                            onClick={() => handleCopy(link.url, `${preset.id}-${lIdx}`)}
                            className="px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium transition cursor-pointer flex items-center space-x-1"
                          >
                            <i
                              className={cn(
                                "text-xs",
                                copiedIndex === `${preset.id}-${lIdx}`
                                  ? "fa-solid fa-check text-[#00e599]"
                                  : "fa-regular fa-copy"
                              )}
                            ></i>
                            <span>
                              {copiedIndex === `${preset.id}-${lIdx}` ? "Tersalin!" : "Salin"}
                            </span>
                          </button>

                          {/* Open */}
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-[#00e599] hover:bg-[#1affaa] text-gray-950 text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                          >
                            <span>Buka</span>
                            <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: KOLEKSI TERSIMPAN (LOCALSTORAGE BOOKMARKS)         */}
      {/* ======================================================== */}
      {activeTab === "saved" && (
        <motion.div
          key="saved"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.25 }}
          className="p-5 sm:p-7 bg-[#121826] border border-gray-800/90 rounded-2xl shadow-xl space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide font-piximisa flex items-center space-x-2">
                <i className="fa-solid fa-bookmark text-[#00e599]"></i>
                <span>Preset Tersimpan ({savedPresets.length})</span>
              </h2>
              <p className="text-xs text-gray-400">
                Koleksi link preset yang telah Anda simpan di browser ini agar mudah dibuka kembali kapan saja.
              </p>
            </div>

            {savedPresets.length > 0 && (
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleExportJson(savedPresets, "preset-tersimpan.json")}
                  className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <i className="fa-solid fa-file-arrow-down text-xs text-[#00e599]"></i>
                  <span>Ekspor Backup</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Hapus semua preset yang tersimpan?")) {
                      setSavedPresets([]);
                      localStorage.removeItem("am_prem_saved_presets");
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition cursor-pointer"
                >
                  Hapus Semua
                </button>
              </div>
            )}
          </div>

          {savedPresets.length > 0 ? (
            <div className="space-y-2">
              {savedPresets.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#0d121f] border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded font-semibold border",
                          item.type === "5mb"
                            ? "bg-[#00e599]/15 text-[#00e599] border-[#00e599]/30"
                            : item.type === "xml"
                            ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                            : item.type === "sound"
                            ? "bg-purple-500/15 text-purple-400 border-purple-500/30"
                            : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        )}
                      >
                        {item.type === "5mb"
                          ? "Prst 5MB"
                          : item.type === "xml"
                          ? "Prst XML"
                          : item.type === "sound"
                          ? "Sound"
                          : "Saluran"}
                      </span>
                      <span className="text-xs font-bold text-white truncate">{item.title}</span>
                    </div>
                    <span className="text-xs font-mono text-gray-300 truncate block">
                      {item.url}
                    </span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">
                      Disimpan pada {item.savedAt} • {item.creator}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.url, `saved-${idx}`)}
                      className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium transition cursor-pointer flex items-center space-x-1"
                    >
                      <i
                        className={cn(
                          "text-xs",
                          copiedIndex === `saved-${idx}`
                            ? "fa-solid fa-check text-[#00e599]"
                            : "fa-regular fa-copy"
                        )}
                      ></i>
                      <span>{copiedIndex === `saved-${idx}` ? "Tersalin!" : "Salin"}</span>
                    </button>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-[#00e599] hover:bg-[#1affaa] text-gray-950 text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Buka</span>
                      <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        toggleSavePreset({
                          id: item.id,
                          title: item.title,
                          creator: item.creator,
                          platform: item.platform,
                          url: item.url,
                          type: item.type,
                        })
                      }
                      className="p-2 rounded-lg bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 text-xs transition cursor-pointer"
                      title="Hapus dari tersimpan"
                    >
                      <i className="fa-solid fa-trash-can text-xs"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-gray-800/20 border border-gray-800 text-center text-xs text-gray-400 space-y-2">
              <i className="fa-regular fa-bookmark text-3xl text-gray-600 block mb-1"></i>
              <p className="text-gray-300 font-medium">Belum ada preset yang disimpan.</p>
              <p className="text-[11px] text-gray-500 max-w-sm mx-auto">
                Buka tab &ldquo;Scan Link VT&rdquo;, &ldquo;Ekstraktor Manual&rdquo;, atau &ldquo;Trending Presets&rdquo; dan klik tombol bookmark untuk menyimpan preset favorit Anda di sini.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
