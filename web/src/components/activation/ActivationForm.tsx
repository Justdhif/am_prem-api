"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function ActivationForm() {
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

  return (
    <div className="space-y-6 text-left w-full">
      {/* Stepper Tabs */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 p-1.5 bg-[#121826]/70 rounded-2xl border border-gray-800">
        <button
          type="button"
          onClick={() => setActivationStep(1)}
          className={cn(
            "py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center space-x-2 cursor-pointer",
            activationStep === 1
              ? "bg-[#00e599] text-gray-950 shadow-md shadow-[#00e599]/20"
              : "text-gray-400 hover:text-white hover:bg-gray-800/40"
          )}
        >
          <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px] font-black">
            1
          </span>
          <span className="truncate">Kirim Link Email</span>
        </button>

        <button
          type="button"
          onClick={() => setActivationStep(2)}
          className={cn(
            "py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center space-x-2 cursor-pointer",
            activationStep === 2
              ? "bg-[#00e599] text-gray-950 shadow-md shadow-[#00e599]/20"
              : "text-gray-400 hover:text-white hover:bg-gray-800/40"
          )}
        >
          <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px] font-black">
            2
          </span>
          <span className="truncate">Verifikasi &amp; Aktivasi</span>
        </button>
      </div>

      {/* Step 1 Form */}
      {activationStep === 1 && (
        <motion.div
          key="step1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="p-5 sm:p-7 bg-[#121826] border border-gray-800/90 rounded-2xl shadow-xl space-y-5"
        >
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <i className="fa-solid fa-paper-plane text-[#00e599]"></i>
              <span>Langkah 1: Masukkan Email Akun Alight Motion</span>
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Tuliskan email aktif yang Anda pakai untuk aplikasi Alight Motion. Kami akan mengirimkan magic link verifikasi resmi dari Firebase.
            </p>
          </div>

          <form onSubmit={handleSendLink} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Alamat Email <span className="text-[#00e599]">*</span>
              </label>
              <div className="flex items-center bg-[#0d121f] rounded-xl px-3.5 py-3 border border-gray-700/80 focus-within:border-[#00e599] transition">
                <i className="fa-regular fa-envelope text-gray-500 mr-2.5 text-sm shrink-0"></i>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh: user@gmail.com"
                  className="bg-transparent border-0 p-0 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none w-full"
                />
              </div>
            </div>

            {sendError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                <i className="fa-solid fa-circle-exclamation text-base shrink-0"></i>
                <span>{sendError}</span>
              </div>
            )}

            {sendSuccessMessage && (
              <div className="p-4 rounded-xl bg-[#00e599]/10 border border-[#00e599]/30 text-white text-xs space-y-2">
                <div className="flex items-center space-x-2 text-[#00e599] font-bold">
                  <i className="fa-solid fa-circle-check text-base"></i>
                  <span>Link Berhasil Dikirim!</span>
                </div>
                <p className="text-gray-300 leading-relaxed">{sendSuccessMessage}</p>
                <div className="pt-2 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setActivationStep(2)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#00e599] text-gray-950 font-bold text-xs hover:bg-[#1affaa] transition cursor-pointer"
                  >
                    Lanjut ke Langkah 2 &rarr;
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={sendLoading}
              className="w-full py-3 rounded-xl bg-[#00e599] hover:bg-[#1affaa] text-gray-950 font-bold text-xs sm:text-sm transition flex items-center justify-center space-x-2 shadow-lg shadow-[#00e599]/20 active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              {sendLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                  <span>Mengirim Link...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane text-xs"></i>
                  <span>Kirim Magic Link Verifikasi</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      )}

      {/* Step 2 Form */}
      {activationStep === 2 && (
        <motion.div
          key="step2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="p-5 sm:p-7 bg-[#121826] border border-gray-800/90 rounded-2xl shadow-xl space-y-5"
        >
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <i className="fa-solid fa-key text-[#00e599]"></i>
              <span>Langkah 2: Verifikasi &amp; Aktivasi Lisensi Pro VIP</span>
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Buka email masuk dari Alight Motion, salin tautan verifikasi masuk (atau parameter oobCode), lalu tempelkan di bawah ini.
            </p>
          </div>

          {!verifyResult ? (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Email Akun Terdaftar
                </label>
                <div className="flex items-center bg-[#0d121f] rounded-xl px-3.5 py-3 border border-gray-700/80 focus-within:border-[#00e599] transition">
                  <i className="fa-regular fa-envelope text-gray-500 mr-2.5 text-sm shrink-0"></i>
                  <input
                    type="email"
                    value={verifyEmail}
                    onChange={(e) => setVerifyEmail(e.target.value)}
                    placeholder="user@gmail.com (opsional jika link lengkap)"
                    className="bg-transparent border-0 p-0 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Tautan Verifikasi Email / oobCode <span className="text-[#00e599]">*</span>
                </label>
                <div className="flex items-start bg-[#0d121f] rounded-xl px-3.5 py-3 border border-gray-700/80 focus-within:border-[#00e599] transition">
                  <i className="fa-solid fa-link text-gray-500 mr-2.5 text-sm mt-1 shrink-0"></i>
                  <textarea
                    required
                    rows={3}
                    value={verifyLink}
                    onChange={(e) => setVerifyLink(e.target.value)}
                    placeholder="https://alightcreative.com/__/auth/action?apiKey=...&mode=signIn&oobCode=..."
                    className="bg-transparent border-0 p-0 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none w-full resize-none font-mono"
                  />
                </div>
              </div>

              {verifyError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                  <i className="fa-solid fa-circle-exclamation text-base shrink-0"></i>
                  <span>{verifyError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={verifyLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00e599] to-emerald-400 hover:from-[#1affaa] hover:to-emerald-300 text-gray-950 font-bold text-xs sm:text-sm transition flex items-center justify-center space-x-2 shadow-lg shadow-[#00e599]/25 active:scale-[0.99] cursor-pointer disabled:opacity-50"
              >
                {verifyLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                    <span>Memverifikasi Akun...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-crown text-xs"></i>
                    <span>Aktivasi Pro VIP 1 Tahun Sekarang</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* CELEBRATORY SUCCESS STATE */
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-[#0d1e18] via-[#111c24] to-[#121826] border border-[#00e599]/40 space-y-4 text-center"
            >
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#00e599]/60 shadow-lg shadow-[#00e599]/30">
                  <Image
                    src="/logo.webp"
                    alt="Alight Motion App"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#00e599] text-gray-950 flex items-center justify-center text-xs shadow-md">
                  <i className="fa-solid fa-crown text-[10px]"></i>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Aktivasi Alight Motion Pro VIP Berhasil! 🎉
                </h3>
                <p className="text-xs text-[#00e599] font-medium">
                  {verifyResult.message || "Selamat! Akun Anda kini resmi berlangganan Alight Motion Pro VIP 1 Tahun."}
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
                  💡 <strong>Cara Pakai:</strong> Buka aplikasi Alight Motion di HP Anda, masuk ke profil lalu login menggunakan email di atas. Status Pro VIP akan aktif otomatis tanpa watermark.
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
    </div>
  );
}
