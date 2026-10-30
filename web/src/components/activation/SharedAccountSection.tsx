"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface SharedEmailMessage {
  id: string;
  from: string;
  subject: string;
  createdAt: string;
  loginLink: string | null;
}

export function SharedAccountSection() {
  const [email, setEmail] = useState("ampremcommunity@sharklasers.com");
  const [messages, setMessages] = useState<SharedEmailMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchInbox = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/shared-account", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setEmail(data.email || "ampremcommunity@sharklasers.com");
        setMessages(data.messages || []);
        setLastUpdated(
          new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        );
      }
    } catch (err) {
      console.error("Gagal memuat inbox akun bersama:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInbox();
    // Auto-refresh setiap 5 detik agar tautan login yang baru masuk langsung muncul
    const interval = setInterval(fetchInbox, 5000);
    return () => clearInterval(interval);
  }, [fetchInbox]);

  const copyToClipboard = (text: string, onSuccess: () => void) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
          fallbackCopy(text, onSuccess);
        });
      } else {
        fallbackCopy(text, onSuccess);
      }
    } catch {
      fallbackCopy(text, onSuccess);
    }
  };

  const fallbackCopy = (text: string, onSuccess: () => void) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      onSuccess();
    } catch (err) {
      console.error("Fallback copy failed", err);
    }
    textArea.remove();
  };

  const handleCopyEmail = () => {
    copyToClipboard(email, () => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    });
  };

  const handleCopyLink = (msgId: string, link: string) => {
    copyToClipboard(link, () => {
      setCopiedLinkId(msgId);
      setTimeout(() => setCopiedLinkId(null), 2500);
    });
  };

  return (
    <section className="px-4 py-4 sm:px-7 sm:py-6 bg-[#121826] border border-[#00e599]/30 rounded-2xl sm:rounded-3xl shadow-2xl space-y-4 sm:space-y-5 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#00e599]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="space-y-1 relative z-10">
        <h2 className="text-base sm:text-xl font-black text-white font-piximisa tracking-wide flex items-center space-x-2">
          <span>Login Akun Premium Alight Motion Siap Pakai</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
          Gunakan alamat email resmi di bawah ini untuk masuk ke aplikasi Alight Motion Anda tanpa perlu mendaftar email baru. Masukkan email di HP, lalu klik tautan login yang masuk di bawah.
        </p>
      </div>

      {/* Email Card & Copy Button */}
      <div className="p-3.5 sm:p-5 rounded-2xl bg-[#0a0e17] border border-gray-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 relative z-10 shadow-inner">
        <div className="space-y-1 min-w-0">
          <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
            Alamat Email Bersama
          </span>
          <div className="flex items-center space-x-2">
            <i className="fa-regular fa-envelope text-[#00e599] text-sm sm:text-base shrink-0"></i>
            <span className="text-xs sm:text-base font-mono font-bold text-white break-all select-all">
              {email}
            </span>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleCopyEmail}
          className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#00e599] to-[#00c985] hover:from-[#1affaa] hover:to-[#00e599] text-gray-950 font-bold text-xs shrink-0 flex items-center justify-center space-x-1.5 shadow-md shadow-[#00e599]/20 transition active:scale-95"
        >
          <i className={copiedEmail ? "fa-solid fa-check text-xs" : "fa-regular fa-copy text-xs"}></i>
          <span>{copiedEmail ? "Email Tersalin!" : "Salin Email"}</span>
        </Button>
      </div>

      {/* Inbox & Latest Magic Link Card */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-inbox text-[#00e599] text-sm"></i>
            <h3 className="text-xs sm:text-sm font-bold text-white">Kotak Masuk Login Terbaru</h3>
            {lastUpdated && (
              <span className="text-[10px] text-gray-500 font-mono hidden sm:inline">
                (diperbarui {lastUpdated})
              </span>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={fetchInbox}
            disabled={loading}
            className="h-7 px-2.5 py-1 text-[11px] rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-300 font-semibold space-x-1"
          >
            <i className={`fa-solid fa-arrows-rotate text-[10px] ${loading ? "fa-spin" : ""}`}></i>
            <span>Refresh</span>
          </Button>
        </div>

        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="py-7 px-4 rounded-2xl bg-[#0a0e17] border border-gray-800/80 text-center flex flex-col items-center justify-center space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#121826] border border-gray-800 flex items-center justify-center text-gray-400">
                <i className="fa-regular fa-envelope-open text-base"></i>
              </div>
              <div className="space-y-1 max-w-md">
                <p className="text-xs font-semibold text-gray-300">
                  Belum ada permintaan login masuk
                </p>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Masukkan email di atas pada aplikasi Alight Motion di HP Anda lalu kirim link masuk. Tautan login akan otomatis muncul di sini dalam beberapa detik.
                </p>
              </div>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 sm:p-5 rounded-2xl bg-[#0a0e17] border border-gray-800 hover:border-[#00e599]/50 transition-all shadow-xl space-y-3"
                >
                  {/* Status & Title Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800/80 pb-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00e599] animate-pulse shadow-[0_0_8px_#00e599]" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs sm:text-sm font-bold text-white">
                            {msg.subject || "Tautan Masuk Alight Motion"}
                          </h4>
                          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#00e599]/15 text-[#00e599] font-bold border border-[#00e599]/30">
                            Aktif
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400">
                          Resmi dari {msg.from}
                        </p>
                      </div>
                    </div>

                    <div className="text-[10px] sm:text-[11px] font-mono text-gray-400 bg-gray-900/80 px-2 py-0.5 rounded border border-gray-800 self-start sm:self-auto">
                      {new Date(msg.createdAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      WIB
                    </div>
                  </div>

                  {msg.loginLink ? (
                    <div className="space-y-2 pt-1">
                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <Link
                          href={msg.loginLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#00e599] to-emerald-400 hover:from-[#1affaa] hover:to-emerald-300 text-gray-950 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-[#00e599]/20 transition active:scale-95 text-center"
                        >
                          <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                          <span>🚀 Klik di Sini untuk Langsung Login di HP</span>
                        </Link>

                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => handleCopyLink(msg.id, msg.loginLink!)}
                          className="h-10 sm:h-11 px-4 text-xs font-semibold rounded-xl bg-gray-800/90 hover:bg-gray-700 text-gray-200 border border-gray-700/80 flex items-center justify-center space-x-2 shrink-0 transition"
                        >
                          <i className={copiedLinkId === msg.id ? "fa-solid fa-check text-[#00e599]" : "fa-regular fa-copy"}></i>
                          <span>{copiedLinkId === msg.id ? "Tautan Tersalin!" : "Salin Tautan"}</span>
                        </Button>
                      </div>

                      {/* Helper notice */}
                      <p className="text-[10px] sm:text-[11px] text-gray-400 leading-normal flex items-start space-x-1.5 pt-0.5">
                        <i className="fa-solid fa-circle-info text-[#00e599] mt-0.5 shrink-0 text-xs"></i>
                        <span>
                          Pastikan saat meminta link di HP, email yang dimasukkan sama persis:{" "}
                          <strong className="text-white font-mono">{email}</strong>
                        </span>
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                      Tautan login tidak terdeteksi di dalam pesan ini. Silakan kirim ulang dari aplikasi Alight Motion.
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
