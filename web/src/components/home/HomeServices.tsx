"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function HomeServices() {
  // Activation Workflow State
  const [activationStep, setActivationStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [sendLoading, setSendLoading] = useState(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyLink, setVerifyLink] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Preset Finder State
  const [presetUrl, setPresetUrl] = useState("");
  const [presetLoading, setPresetLoading] = useState(false);
  const [presetResult, setPresetResult] = useState<any | null>(null);
  const [presetError, setPresetError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Handlers for Step 1: Send Magic Link
  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSendLoading(true);
    setSendError(null);
    setSendSuccessMessage(null);

    try {
      const res = await apiClient.sendLink(email);
      if (res.ok && res.data?.success) {
        setSendSuccessMessage(
          res.data.message || `Link verifikasi berhasil dikirim ke ${email}!`
        );
        setVerifyEmail(email);
      } else {
        setSendError(
          res.data?.message || res.data?.error || "Gagal mengirim link verifikasi. Pastikan email valid."
        );
      }
    } catch (err: any) {
      setSendError(err.message || "Gagal menghubungi server. Silakan coba lagi.");
    } finally {
      setSendLoading(false);
    }
  };

  // Handlers for Step 2: Verify Magic Link
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyLink) return;

    setVerifyLoading(true);
    setVerifyError(null);
    setVerifyResult(null);

    try {
      const res = await apiClient.verifyLink(verifyEmail, verifyLink);
      if (res.ok && res.data?.success) {
        setVerifyResult(res.data);
      } else {
        setVerifyError(
          res.data?.message || res.data?.error || "Link verifikasi tidak valid atau telah kedaluwarsa."
        );
      }
    } catch (err: any) {
      setVerifyError(err.message || "Gagal memverifikasi akun. Silakan periksa kembali link Anda.");
    } finally {
      setVerifyLoading(false);
    }
  };

  // Handlers for Preset Finder
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
    <div className="space-y-6 sm:space-y-8 text-left w-full">
      {/* 1. ACTIVATION SECTION */}
      <section className="space-y-4">
        {/* Stepper Indicator */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 p-1.5 bg-[#121826]/70 rounded-2xl border border-gray-800">
            <button
              type="button"
              onClick={() => setActivationStep(1)}
              className={cn(
                "py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 select-none",
                activationStep === 1
                  ? "bg-[#00e599] text-gray-950 shadow-sm"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/40"
              )}
            >
              <span className="w-5 h-5 rounded-full bg-gray-950/20 text-center text-[10px] font-black leading-5">
                1
              </span>
              <span>1. Kirim Magic Link</span>
            </button>

            <button
              type="button"
              onClick={() => setActivationStep(2)}
              className={cn(
                "py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 select-none",
                activationStep === 2
                  ? "bg-[#00e599] text-gray-950 shadow-sm"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/40"
              )}
            >
              <span className="w-5 h-5 rounded-full bg-gray-950/20 text-center text-[10px] font-black leading-5">
                2
              </span>
              <span>2. Tempel Link &amp; Aktifkan</span>
            </button>
          </div>

          {/* STEP 1: SEND MAGIC LINK */}
          {activationStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 sm:p-6 bg-[#121826] border border-gray-800/90 rounded-2xl shadow-xl space-y-5"
            >
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center space-x-2">
                  <i className="fa-regular fa-envelope text-[#00e599]"></i>
                  <span>Langkah 1: Masukkan Email Akun Alight Motion</span>
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Masukkan email yang akan digunakan untuk akun Alight Motion Anda. Server akan mengirimkan link masuk resmi langsung dari Firebase Alight Motion.
                </p>
              </div>

              <form onSubmit={handleSendLink} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Alamat Email <span className="text-[#00e599]">*</span>
                  </label>
                  <div className="flex items-center bg-[#0d121f] rounded-xl px-3.5 py-3 border border-gray-700/80 focus-within:border-[#00e599] transition">
                    <i className="fa-regular fa-envelope text-gray-500 mr-2.5 text-sm"></i>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contoh: namaanda@gmail.com"
                      className="bg-transparent border-0 p-0 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none w-full"
                    />
                  </div>
                </div>

                {sendError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                    <i className="fa-solid fa-triangle-exclamation text-sm shrink-0"></i>
                    <span>{sendError}</span>
                  </div>
                )}

                {sendSuccessMessage && (
                  <div className="p-4 rounded-xl bg-[#00e599]/10 border border-[#00e599]/30 text-[#00e599] text-xs space-y-2">
                    <div className="flex items-center space-x-2 font-bold text-sm">
                      <i className="fa-solid fa-circle-check text-base"></i>
                      <span>Link Berhasil Dikirim!</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-[11px]">
                      Silakan periksa kotak masuk (Inbox) atau folder Spam di email <strong className="text-white">{email}</strong>. Salin link tombol &quot;Sign in to Alight Motion&quot;, lalu lanjutkan ke Langkah 2.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActivationStep(2)}
                      className="mt-2 px-3.5 py-1.5 rounded-lg bg-[#00e599] text-gray-950 font-bold text-xs hover:bg-[#1affaa] transition inline-flex items-center space-x-1.5 cursor-pointer shadow-md"
                    >
                      <span>Lanjut ke Langkah 2: Tempel Link</span>
                      <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-end pt-1">
                  <button
                    type="submit"
                    disabled={sendLoading}
                    className="px-5 py-2.5 rounded-xl bg-[#00e599] hover:bg-[#1affaa] text-gray-950 font-bold text-xs sm:text-sm transition flex items-center space-x-2 shadow-lg shadow-[#00e599]/20 active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {sendLoading ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                        <span>Mengirim Link...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-paper-plane text-xs"></i>
                        <span>Kirim Link Verifikasi</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 2: VERIFY & ACTIVATE */}
          {activationStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 sm:p-6 bg-[#121826] border border-gray-800/90 rounded-2xl shadow-xl space-y-5"
            >
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center space-x-2">
                  <i className="fa-solid fa-key text-[#00e599]"></i>
                  <span>Langkah 2: Verifikasi &amp; Aktifkan Akun Pro VIP</span>
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Buka email dari Alight Motion, salin tautan (link) dari tombol &quot;Sign in to Alight Motion&quot;, lalu tempelkan di bawah ini.
                </p>
              </div>

              {!verifyResult ? (
                <form onSubmit={handleVerify} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Email Akun <span className="text-gray-500 font-normal">(opsional jika sudah terisi)</span>
                    </label>
                    <div className="flex items-center bg-[#0d121f] rounded-xl px-3.5 py-3 border border-gray-700/80 focus-within:border-[#00e599] transition">
                      <i className="fa-regular fa-envelope text-gray-500 mr-2.5 text-sm"></i>
                      <input
                        type="email"
                        value={verifyEmail}
                        onChange={(e) => setVerifyEmail(e.target.value)}
                        placeholder="user@gmail.com"
                        className="bg-transparent border-0 p-0 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Magic Link / Tautan dari Email <span className="text-[#00e599]">*</span>
                    </label>
                    <div className="flex items-start bg-[#0d121f] rounded-xl px-3.5 py-3 border border-gray-700/80 focus-within:border-[#00e599] transition">
                      <i className="fa-solid fa-link text-gray-500 mr-2.5 mt-1 text-sm shrink-0"></i>
                      <textarea
                        required
                        rows={3}
                        value={verifyLink}
                        onChange={(e) => setVerifyLink(e.target.value)}
                        placeholder="https://alightcreative.com/?link=https://alightcreative.com/am/share/...&oobCode=..."
                        className="bg-transparent border-0 p-0 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none w-full resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  {verifyError && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                      <i className="fa-solid fa-circle-exclamation text-base shrink-0"></i>
                      <span>{verifyError}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setActivationStep(1)}
                      className="px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold transition"
                    >
                      <i className="fa-solid fa-arrow-left mr-1.5"></i>
                      Kembali ke Langkah 1
                    </button>

                    <button
                      type="submit"
                      disabled={verifyLoading}
                      className="px-6 py-2.5 rounded-xl bg-[#00e599] hover:bg-[#1affaa] text-gray-950 font-bold text-xs sm:text-sm transition flex items-center space-x-2 shadow-lg shadow-[#00e599]/25 active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      {verifyLoading ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                          <span>Mengaktifkan Pro VIP...</span>
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-bolt-lightning text-xs"></i>
                          <span>Aktifkan VIP Sekarang</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* CELEBRATORY SUCCESS STATE */
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-[#0d1e18] via-[#111c24] to-[#121826] border border-[#00e599]/40 space-y-4 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/40 flex items-center justify-center mx-auto text-2xl shadow-lg shadow-[#00e599]/25">
                    <i className="fa-solid fa-crown"></i>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00e599] bg-[#00e599]/15 px-3 py-1 rounded-full border border-[#00e599]/30 inline-block">
                      VIP 1 Tahun Aktif
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      Selamat! Akun Alight Motion Anda Telah Pro VIP
                    </h3>
                    <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
                      Lisensi Alight Motion Pro VIP Resmi 1 Tahun tanpa watermark dan semua efek terbuka telah berhasil ditautkan ke akun Anda.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0d121f]/90 border border-gray-800 text-xs text-left space-y-2 max-w-md mx-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Status Lisensi:</span>
                      <span className="font-bold text-[#00e599] flex items-center space-x-1">
                        <i className="fa-solid fa-circle-check text-[10px]"></i>
                        <span>Resmi 1 Tahun</span>
                      </span>
                    </div>
                    {verifyEmail && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Email Akun:</span>
                        <span className="font-mono text-white truncate ml-2">{verifyEmail}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-gray-800 text-[11px] text-gray-400 leading-normal">
                      💡 <strong>Cara Pakai:</strong> Buka aplikasi Alight Motion di HP Anda, masuk ke profil lalu login menggunakan email di atas. Status Pro VIP akan aktif otomatis.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setVerifyResult(null);
                      setVerifyLink("");
                      setActivationStep(1);
                    }}
                    className="px-5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold transition cursor-pointer"
                  >
                    Aktivasi Akun Lain
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
      </section>

      {/* 2. PRESET FINDER SECTION */}
      <section className="space-y-4">
        <div className="p-5 sm:p-6 bg-[#121826] border border-gray-800/90 rounded-2xl shadow-xl space-y-5">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center space-x-2">
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
              <div className="flex items-start bg-[#0d121f] rounded-xl px-3.5 py-3 border border-gray-700/80 focus-within:border-[#00e599] transition">
                <i className="fa-solid fa-link text-gray-500 mr-2.5 mt-1 text-sm shrink-0"></i>
                <textarea
                  required
                  rows={2}
                  value={presetUrl}
                  onChange={(e) => setPresetUrl(e.target.value)}
                  placeholder="https://vt.tiktok.com/ZSxxxxxxx/ atau https://youtu.be/xxxx"
                  className="bg-transparent border-0 p-0 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none w-full resize-none leading-relaxed"
                />
              </div>
            </div>

            {presetError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                <i className="fa-solid fa-circle-exclamation text-base shrink-0"></i>
                <span>{presetError}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setPresetUrl("https://vt.tiktok.com/ZSxxxxxxx/")}
                  className="px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition flex items-center space-x-1"
                >
                  <i className="fa-brands fa-tiktok text-[11px]"></i>
                  <span>Contoh TikTok</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPresetUrl("https://youtu.be/dQw4w9WgXcQ")}
                  className="px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition flex items-center space-x-1"
                >
                  <i className="fa-brands fa-youtube text-[11px] text-red-400"></i>
                  <span>Contoh YouTube</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={presetLoading}
                className="px-5 py-2.5 rounded-xl bg-[#00e599] hover:bg-[#1affaa] text-gray-950 font-bold text-xs sm:text-sm transition flex items-center space-x-2 shadow-lg shadow-[#00e599]/20 active:scale-95 cursor-pointer disabled:opacity-50"
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
          {presetResult && (
            <div className="space-y-4 pt-3 border-t border-gray-800">
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
                        <div
                          key={idx}
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
                              className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium transition cursor-pointer flex items-center space-x-1"
                            >
                              <i className={cn("text-xs", copiedIndex === idx ? "fa-solid fa-check text-[#00e599]" : "fa-regular fa-copy")}></i>
                              <span>{copiedIndex === idx ? "Tersalin!" : "Salin"}</span>
                            </button>

                            <a
                              href={linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-1.5 rounded-lg bg-[#00e599] hover:bg-[#1affaa] text-gray-950 text-xs font-bold transition flex items-center space-x-1 shadow-md cursor-pointer"
                            >
                              <span>Buka Preset</span>
                              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                            </a>
                          </div>
                        </div>
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
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
