"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { CustomVideoPlayer } from "./CustomVideoPlayer";

export function PresetFinderForm() {
  const [presetUrl, setPresetUrl] = useState("");
  const [presetLoading, setPresetLoading] = useState(false);
  const [presetResult, setPresetResult] = useState<any | null>(null);
  const [presetError, setPresetError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [downloadingType, setDownloadingType] = useState<"video" | "audio" | null>(null);
  const [copiedMedia, setCopiedMedia] = useState<string | null>(null);

  interface ActiveMediaVideo {
    title: string;
    author: string;
    platform: string;
    cover: string;
    videoUrl?: string | null;
    hdVideoUrl?: string | null;
    audioUrl?: string | null;
    embedUrl?: string | null;
    downloads?: any[];
    description: string;
  }

  // Media aktif hanya tersedia jika link telah berhasil di-scan
  const activeVideo: ActiveMediaVideo | null = presetResult?.video
    ? {
        title: presetResult.video.title || "Video Tanpa Judul",
        author:
          typeof presetResult.video.author === "object"
            ? presetResult.video.author?.username || presetResult.video.author?.nickname || "Kreator"
            : presetResult.video.author || "Kreator",
        platform: presetResult.platform || "video",
        cover: presetResult.video.cover || presetResult.video.thumbnailUrl || "/logo-web.webp",
        videoUrl: presetResult.video.videoUrl || (presetResult.platform === "tiktok" ? presetResult.video.url : null),
        hdVideoUrl: presetResult.video.hdVideoUrl,
        audioUrl: presetResult.video.audioUrl,
        embedUrl: presetResult.video.embedUrl,
        downloads: presetResult.video.downloads || [],
        description: presetResult.video.description || "",
      }
    : null;

  const handleFindPreset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!presetUrl.trim()) return;

    setPresetLoading(true);
    setPresetError(null);

    try {
      const res = await apiClient.findPreset(presetUrl.trim());
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

  const handleCopyMediaLink = (url: string, label: string) => {
    navigator.clipboard.writeText(url);
    setCopiedMedia(label);
    setTimeout(() => setCopiedMedia(null), 2000);
  };

  const triggerDownload = async (url: string, filename: string, type: "video" | "audio") => {
    if (!url) return;
    setDownloadingType(type);

    try {
      // Coba fetch blob untuk direct download file
      const res = await fetch(url, { mode: "cors" });
      if (res.ok) {
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(blobUrl);
        setDownloadingType(null);
        return;
      }
    } catch {
      // Fallback: buka tautan langsung di tab baru jika browser menerapkan batasan CORS
    }

    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => setDownloadingType(null), 1000);
  };

  return (
    <div className="space-y-6 text-left w-full">
      <div className="p-5 sm:p-7 bg-[#121826] border border-gray-800/90 rounded-2xl shadow-xl space-y-6">
        {/* HEADER SCAN FORM */}
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide font-piximisa flex items-center space-x-2">
            <i className="fa-solid fa-magnifying-glass text-[#00e599]"></i>
            <span>Cari &amp; Ekstrak Preset Alight Motion</span>
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Tempelkan link video TikTok atau YouTube. Sistem akan memindai link preset resmi (XML / Alight Creative link) dan menyiapkan pemutar preview video serta unduhan video &amp; audio.
          </p>
        </div>

        {/* INPUT FORM */}
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
            {/* Tombol Contoh Link */}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
              <button
                type="button"
                onClick={() => setPresetUrl("https://www.tiktok.com/@tiktok/video/7106594312292453675")}
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

            {/* Tombol Submit Scan */}
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
                  <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
                  <span>Pindai &amp; Ekstrak</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* PREVIEW VIDEO & MEDIA DOWNLOADER (EMPTY STATE / ACTIVE)   */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div className="pt-5 border-t border-gray-800/90 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="space-y-0.5">
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center space-x-2">
                <i className="fa-solid fa-circle-play text-[#00e599]"></i>
                <span>Preview Video &amp; Unduh Media</span>
              </h3>
              <p className="text-[11px] text-gray-400">
                {activeVideo
                  ? `Hasil pindaian video ${activeVideo.platform.toUpperCase()} siap diputar dan diunduh.`
                  : "Preview pemutar media akan otomatis tampil setelah link video berhasil dipindai."}
              </p>
            </div>

            {/* Badge Status */}
            <div className="flex items-center space-x-1.5">
              {activeVideo ? (
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#00e599]/15 text-[#00e599] border border-[#00e599]/30 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e599] animate-pulse"></span>
                  <span>Video Terhubung</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-gray-800 text-gray-400 border border-gray-700/80 text-[10px] font-medium">
                  <i className="fa-solid fa-video-slash text-[9px]"></i>
                  <span>Belum Ada Video</span>
                </span>
              )}
            </div>
          </div>

          {/* PEMUTAR VIDEO ATAU EMPTY STATE CONTAINER */}
          {activeVideo ? (
            <div className="relative rounded-2xl bg-[#080d16] border border-gray-800 overflow-hidden shadow-2xl">
              {presetLoading && (
                <div className="absolute inset-0 z-30 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
                  <div className="w-10 h-10 border-2 border-[#00e599] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-semibold text-white">Memindai video &amp; menyiapkan media...</p>
                </div>
              )}

              {/* Player Rendering: Embed YouTube vs Custom Video Player */}
              {activeVideo.embedUrl ? (
                <div
                  className={cn(
                    "w-full transition-all duration-300",
                    presetResult?.video?.url?.includes("/shorts/")
                      ? "aspect-[9/16] max-w-md mx-auto"
                      : "aspect-video"
                  )}
                >
                  <iframe
                    src={activeVideo.embedUrl}
                    title={activeVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : activeVideo.videoUrl ? (
                <CustomVideoPlayer
                  src={activeVideo.videoUrl}
                  poster={activeVideo.cover}
                  title={activeVideo.title}
                />
              ) : (
                <div className="p-8 text-center text-gray-400 text-xs">
                  Video tidak dapat diputar langsung. Silakan gunakan link alternatif.
                </div>
              )}

              {/* Detail Video Bar */}
              <div className="p-3.5 sm:p-4 bg-[#0d121f] border-t border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-gray-800 text-gray-300 border border-gray-700">
                      {activeVideo.platform}
                    </span>
                    <span className="text-[11px] text-gray-400 truncate">
                      Oleh: <strong className="text-white">@{activeVideo.author}</strong>
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-white truncate" title={activeVideo.title}>
                    {activeVideo.title}
                  </h4>
                </div>

                {/* Action Salin Link Video */}
                {activeVideo.videoUrl && (
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyMediaLink(activeVideo.videoUrl!, "video")}
                      className="px-2.5 py-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white text-[11px] font-medium transition flex items-center space-x-1 cursor-pointer"
                    >
                      <i className={cn("text-[11px]", copiedMedia === "video" ? "fa-solid fa-check text-[#00e599]" : "fa-regular fa-copy")}></i>
                      <span>{copiedMedia === "video" ? "Tersalin!" : "Salin Link"}</span>
                    </button>
                    <a
                      href={activeVideo.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white text-[11px] font-medium transition flex items-center space-x-1"
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                      <span>Buka Tab</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="relative rounded-2xl bg-[#080d16] border border-dashed border-gray-800/90 p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-3.5 min-h-[260px]">
              {presetLoading ? (
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-10 h-10 border-2 border-[#00e599] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-semibold text-white">Memindai video &amp; menyiapkan media...</p>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-gray-800/90 to-[#0d121f] border border-gray-700/60 text-gray-400 flex items-center justify-center text-xl sm:text-2xl shadow-xl">
                    <i className="fa-solid fa-film text-[#00e599]/70"></i>
                  </div>
                  <div className="max-w-md space-y-1.5">
                    <h4 className="text-sm sm:text-base font-bold text-white font-piximisa tracking-wide">
                      Belum Ada Video yang Dipindai
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Tempelkan link video TikTok atau YouTube pada kolom di atas, lalu klik{" "}
                      <strong className="text-[#00e599]">Pindai &amp; Ekstrak</strong> untuk melihat preview video dan opsi unduh media.
                    </p>
                  </div>
                  <div className="inline-flex items-center space-x-3 text-[11px] text-gray-500 pt-1">
                    <span className="flex items-center space-x-1.5">
                      <i className="fa-brands fa-tiktok text-gray-400"></i>
                      <span>TikTok</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1.5">
                      <i className="fa-brands fa-youtube text-red-400"></i>
                      <span>YouTube</span>
                    </span>
                    <span>•</span>
                    <span>Preset XML &amp; Audio</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* OPSI UNDUH: VIDEO DENGAN AUDIO VS AUDIO SAJA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* KARTU UNDUH 1: VIDEO DENGAN AUDIO (MP4) */}
            <div className="p-4 rounded-xl bg-[#0d121f] border border-gray-800/90 hover:border-[#00e599]/40 transition space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-[#00e599]/15 text-[#00e599] flex items-center justify-center text-xs shrink-0">
                    <i className="fa-solid fa-video"></i>
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-white">Unduh Video (MP4)</h5>
                    <span className="text-[10px] text-[#00e599] font-medium block">
                      Video Kualitas Penuh + Audio {presetResult?.platform === "tiktok" ? "(Tanpa Watermark)" : ""}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed pt-1">
                  {activeVideo?.videoUrl
                    ? "Unduh video asli beserta suara tanpa watermark untuk bahan edit atau koleksi."
                    : "Tersedia secara otomatis setelah link video berhasil dipindai."}
                </p>
              </div>

              <button
                type="button"
                disabled={!activeVideo?.videoUrl || downloadingType === "video"}
                onClick={() =>
                  activeVideo?.videoUrl &&
                  triggerDownload(
                    activeVideo.videoUrl,
                    `${(activeVideo.title || "video").replace(/[^a-zA-Z0-9]/g, "_").slice(0, 30)}.mp4`,
                    "video"
                  )
                }
                className={cn(
                  "w-full py-2.5 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-2 shadow-md active:scale-95",
                  activeVideo?.videoUrl
                    ? "bg-[#00e599] hover:bg-[#1affaa] text-gray-950 shadow-[#00e599]/15 cursor-pointer"
                    : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700/50"
                )}
              >
                {downloadingType === "video" ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin text-xs"></i>
                    <span>Menyiapkan Video...</span>
                  </>
                ) : activeVideo?.videoUrl ? (
                  <>
                    <i className="fa-solid fa-download text-xs"></i>
                    <span>Unduh Video Sekarang (MP4)</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-lock text-xs"></i>
                    <span>Menunggu Link Video</span>
                  </>
                )}
              </button>
            </div>

            {/* KARTU UNDUH 2: AUDIO SAJA (MP3) */}
            <div className="p-4 rounded-xl bg-[#0d121f] border border-gray-800/90 hover:border-sky-500/40 transition space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center text-xs shrink-0">
                    <i className="fa-solid fa-music"></i>
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-white">Unduh Audio Saja (MP3)</h5>
                    <span className="text-[10px] text-sky-400 font-medium block">
                      Soundtrack Murni / Sound TikTok &amp; YouTube
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed pt-1">
                  {activeVideo?.audioUrl || activeVideo?.videoUrl
                    ? "Ekstrak dan simpan trek audio / backsound saja dalam format audio beresolusi jernih."
                    : "Tersedia secara otomatis setelah link video berhasil dipindai."}
                </p>
              </div>

              <button
                type="button"
                disabled={(!activeVideo?.audioUrl && !activeVideo?.videoUrl) || downloadingType === "audio"}
                onClick={() => {
                  const audioSrc = activeVideo?.audioUrl || activeVideo?.videoUrl;
                  if (audioSrc) {
                    triggerDownload(
                      audioSrc,
                      `${(activeVideo?.title || "audio").replace(/[^a-zA-Z0-9]/g, "_").slice(0, 30)}.mp3`,
                      "audio"
                    );
                  }
                }}
                className={cn(
                  "w-full py-2.5 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-2 shadow-md active:scale-95",
                  activeVideo?.audioUrl || activeVideo?.videoUrl
                    ? "bg-sky-500 hover:bg-sky-400 text-gray-950 shadow-sky-500/15 cursor-pointer"
                    : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700/50"
                )}
              >
                {downloadingType === "audio" ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin text-xs"></i>
                    <span>Menyiapkan Audio...</span>
                  </>
                ) : activeVideo?.audioUrl || activeVideo?.videoUrl ? (
                  <>
                    <i className="fa-solid fa-headphones text-xs"></i>
                    <span>Unduh Audio Saja (MP3)</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-lock text-xs"></i>
                    <span>Menunggu Link Video</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* HASIL PINDAIAN LINK PRESET ALIGHT MOTION                   */}
        {/* ══════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {presetResult && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 pt-5 border-t border-gray-800"
            >
              {/* Notice Cerdas jika Link Alight langsung tidak ada, tapi ditemukan Saluran Kreator */}
              {presetResult.directPresets?.length === 0 && presetResult.channelInvites?.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start space-x-2.5">
                  <i className="fa-solid fa-circle-info text-amber-400 mt-0.5 shrink-0 text-sm"></i>
                  <div className="space-y-1">
                    <p className="font-semibold text-white">
                      Kreator Membagikan Preset Melalui Saluran (Pencarian Alternatif)
                    </p>
                    <p className="text-[11px] text-amber-200/80 leading-relaxed">
                      Link preset Alight Motion tidak ditaruh langsung di komentar publik, melainkan melalui <strong>Saluran WhatsApp / Telegram</strong> resmi di bawah ini. Klik <strong>Buka Saluran</strong> untuk masuk dan mengunduh preset dari pesan kreator.
                    </p>
                  </div>
                </div>
              )}

              {/* Ringkasan Presets Ditemukan */}
              <div className="flex items-center justify-between text-xs font-semibold text-gray-300 px-1">
                <span className="flex items-center space-x-1.5">
                  <i className="fa-solid fa-file-code text-[#00e599]"></i>
                  <span>
                    {presetResult.directPresets?.length > 0
                      ? "Link Preset Alight Motion (Ditemukan Langsung):"
                      : "Tautan Alternatif / Saluran Kreator:"}
                  </span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#00e599]/15 text-[#00e599] border border-[#00e599]/30 text-[11px] font-mono font-bold">
                  {presetResult.presets?.length || presetResult.totalPresetsFound || 0} Tautan
                </span>
              </div>

              {presetResult.presets && presetResult.presets.length > 0 ? (
                <div className="space-y-2.5">
                  {presetResult.presets.map((item: any, idx: number) => {
                    const linkUrl = typeof item === "string" ? item : item.url || item.link;
                    const isAlightCreative =
                      linkUrl.includes("alightcreative.com") || linkUrl.includes("alight.link");
                    const isDrive = linkUrl.includes("drive.google.com");
                    const isMediaFire = linkUrl.includes("mediafire.com");
                    const isChannel = item.priority === "join_saluran" || linkUrl.includes("whatsapp.com/channel") || linkUrl.includes("t.me/");

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.04 }}
                        className={cn(
                          "p-3.5 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                          isChannel
                            ? "bg-[#0d1620] border-sky-800/60 hover:border-sky-600/80"
                            : "bg-[#0d121f] border-gray-800 hover:border-gray-700"
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-1.5 mb-1 flex-wrap gap-y-1">
                            <span
                              className={cn(
                                "text-[10px] px-2 py-0.5 rounded-md font-semibold border",
                                isAlightCreative
                                  ? "bg-[#00e599]/15 text-[#00e599] border-[#00e599]/30"
                                  : isDrive
                                  ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                                  : isMediaFire
                                  ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                                  : isChannel
                                  ? "bg-sky-500/15 text-sky-300 border-sky-500/30"
                                  : "bg-gray-800 text-gray-300 border-gray-700"
                              )}
                            >
                              {item.label || (isAlightCreative ? "Alight Link" : isDrive ? "Google Drive (XML)" : isMediaFire ? "MediaFire (XML)" : isChannel ? "Saluran Kreator" : "Preset Link")}
                            </span>

                            {item.source && (
                              <span className="text-[10px] text-gray-400">
                                Dari: {item.source === "comment" ? `Komentar (@${item.author || "User"})` : item.source === "description" ? "Deskripsi" : "Caption"}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-mono text-gray-300 truncate block">
                            {linkUrl}
                          </span>
                          {item.context && (
                            <p className="text-[11px] text-gray-400 italic truncate pt-1">
                              &ldquo;{item.context.replace(/\n+/g, " ")}&rdquo;
                            </p>
                          )}
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
                            className={cn(
                              "px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 shadow-md cursor-pointer active:scale-95",
                              isChannel
                                ? "bg-sky-500 hover:bg-sky-400 text-gray-950"
                                : "bg-[#00e599] hover:bg-[#1affaa] text-gray-950"
                            )}
                          >
                            <span>{isChannel ? "Buka Saluran" : "Buka Preset"}</span>
                            <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                          </a>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-gray-800/40 border border-gray-800 text-center text-xs text-gray-400 space-y-1">
                  <p className="text-gray-300 font-medium">Tidak ada tautan preset Alight Motion langsung yang ditemukan.</p>
                  <p className="text-[11px] text-gray-500">Anda tetap dapat mengunduh video dan audionya melalui panel preview di atas.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
