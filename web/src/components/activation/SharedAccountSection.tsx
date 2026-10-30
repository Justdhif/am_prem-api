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
  const [email, setEmail] = useState("ampremcommunity@maxxspace.com");
  const [messages, setMessages] = useState<SharedEmailMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchInbox = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/shared-account", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setEmail(data.email || "ampremcommunity@maxxspace.com");
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

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section className="px-5 pb-5 pt-3 sm:px-7 sm:pb-7 sm:pt-4 bg-[#121826] border border-[#00e599]/30 rounded-2xl sm:rounded-3xl shadow-2xl space-y-5 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#00e599]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="space-y-1.5 relative z-10">
        <h2 className="text-lg sm:text-xl font-black text-white font-piximisa tracking-wide flex items-center space-x-2">
          <span>Login Akun Premium Alight Motion Siap Pakai</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
          Gunakan alamat email resmi di bawah ini untuk masuk ke aplikasi Alight Motion Anda tanpa perlu mendaftar email baru. Masukkan email di HP, lalu klik tautan login yang masuk di bawah.
        </p>
      </div>

      {/* Email Card & Copy Button */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0e17] border border-gray-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 relative z-10">
        <div className="space-y-1 min-w-0">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
            Alamat Email Bersama
          </span>
          <div className="flex items-center space-x-2">
            <i className="fa-regular fa-envelope text-[#00e599] text-base shrink-0"></i>
            <span className="text-sm sm:text-base font-mono font-bold text-white truncate select-all">
              {email}
            </span>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleCopyEmail}
          className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#00e599] to-[#00c985] hover:from-[#1affaa] hover:to-[#00e599] text-gray-950 font-bold text-xs shrink-0 flex items-center justify-center space-x-1.5 shadow-md shadow-[#00e599]/20"
        >
          <i className={copiedEmail ? "fa-solid fa-check text-xs" : "fa-regular fa-copy text-xs"}></i>
          <span>{copiedEmail ? "Tersalin!" : "Salin Email"}</span>
        </Button>
      </div>

      {/* Inbox & Latest Magic Link Card */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-inbox text-[#00e599] text-sm"></i>
            <h3 className="text-sm font-bold text-white">Kotak Masuk Login Terbaru</h3>
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

        <div className="space-y-2.5">
          {messages.length === 0 ? (
            <div className="py-7 px-5 rounded-2xl bg-[#0a0e17] border border-gray-800/80 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#121826] border border-gray-800 flex items-center justify-center text-gray-400">
                <i className="fa-regular fa-envelope-open text-lg"></i>
              </div>
              <div className="space-y-1 max-w-md">
                <p className="text-xs font-semibold text-gray-300">
                  Belum ada permintaan login masuk
                </p>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Masukkan email di atas pada aplikasi Alight Motion di HP Anda lalu kirim link masuk. Tautan login akan otomatis muncul di sini.
                </p>
              </div>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 rounded-2xl bg-[#0a0e17] border border-gray-800/90 hover:border-[#00e599]/40 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-[#00e599] animate-pulse"></span>
                      <strong className="text-white font-medium">{msg.subject || "Tautan Masuk Alight Motion"}</strong>
                      <span className="text-[10px] text-gray-400 font-mono">({msg.from})</span>
                    </div>
                    <span className="text-[10px] text-gray-500">
                      {new Date(msg.createdAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {msg.loginLink ? (
                    <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <Link
                        href={msg.loginLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00e599] to-emerald-400 hover:from-[#1affaa] hover:to-emerald-300 text-gray-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-[#00e599]/20 transition active:scale-95"
                      >
                        <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                        <span>🚀 Klik di Sini untuk Langsung Login di HP</span>
                      </Link>

                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(msg.loginLink!);
                          alert("Tautan login berhasil disalin ke clipboard!");
                        }}
                        className="h-10 px-3.5 text-xs font-semibold rounded-xl"
                      >
                        <i className="fa-regular fa-copy text-xs"></i>
                        <span className="hidden sm:inline">Salin Link</span>
                      </Button>
                    </div>
                  ) : (
                    <p className="text-[11px] text-amber-400">
                      Link login tidak ditemukan di dalam pesan ini.
                    </p>
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
