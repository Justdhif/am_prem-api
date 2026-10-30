"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";

interface SharedEmailMessage {
  id: string;
  from: string;
  subject: string;
  createdAt: string;
  loginLink: string | null;
}

export function SharedAccountSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("ampremcommunity@sharklasers.com");
  const [messages, setMessages] = useState<SharedEmailMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  // Filter hanya link yang masih dalam masa aktif 1 menit (60 detik)
  const activeMessages = messages.filter((msg) => {
    const ageSeconds = (currentTime - new Date(msg.createdAt).getTime()) / 1000;
    return ageSeconds <= 60;
  });

  return (
    <>
      {/* Slim Invitation Banner Trigger */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setIsOpen(true);
        }}
        className="group relative p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-[#121826] via-[#0d1624] to-[#121826] border border-[#00e599]/35 hover:border-[#00e599]/70 shadow-lg hover:shadow-[0_0_25px_rgba(0,229,153,0.15)] transition-all duration-300 cursor-pointer overflow-hidden flex items-center justify-between gap-3"
      >
        {/* Subtle decorative background ambient light */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#00e599]/10 rounded-full blur-2xl group-hover:bg-[#00e599]/20 transition-all pointer-events-none" />

        <div className="flex items-center space-x-3 min-w-0 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-[#00e599]/15 border border-[#00e599]/30 flex items-center justify-center text-[#00e599] shrink-0 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,229,153,0.2)]">
            <i className="fa-solid fa-wand-magic-sparkles text-base"></i>
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm font-bold text-white group-hover:text-[#00e599] transition-colors truncate">
                Gamau ribet? Pake akun sharing aja nih
              </span>
              <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-[#00e599]/15 text-[#00e599] font-bold border border-[#00e599]/30 shrink-0 hidden sm:inline-block">
                Gratis
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-400 truncate">
              Tinggal salin email & klik tautan masuk yang otomatis muncul. Siap pakai!
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 relative z-10">
          {activeMessages.length > 0 && (
            <span className="hidden sm:flex items-center space-x-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{activeMessages.length} link siap</span>
            </span>
          )}
          <Button
            type="button"
            size="sm"
            className="h-8 sm:h-9 px-3 sm:px-3.5 rounded-xl bg-gradient-to-r from-[#00e599] to-[#00c985] text-gray-950 font-bold text-xs flex items-center space-x-1.5 shadow-sm group-hover:shadow-[0_0_12px_rgba(0,229,153,0.3)] transition shrink-0"
          >
            <span>Buka Akun</span>
            <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-0.5 transition-transform"></i>
          </Button>
        </div>
      </div>

      {/* Slide-over Drawer / Sheet for Shared Account */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="right"
          aria-label="Panel Akun Sharing"
          className="p-0 border-l border-gray-800 shadow-2xl z-[180] flex flex-col w-full sm:w-[460px] max-w-full bg-[#090d16]"
        >
          {/* Sheet Header */}
          <SheetHeader className="px-5 py-4 border-b border-gray-800 flex items-center justify-between bg-[#0d121f] shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#00e599]/15 border border-[#00e599]/30 flex items-center justify-center text-[#00e599]">
                <i className="fa-solid fa-key text-sm"></i>
              </div>
              <div className="text-left">
                <SheetTitle className="text-sm sm:text-base font-bold text-gray-100 font-piximisa tracking-wide">
                  Akun Sharing Alight Motion
                </SheetTitle>
                <SheetDescription className="text-[11px] text-gray-400">
                  Login instan tanpa perlu daftar email pribadi
                </SheetDescription>
              </div>
            </div>

            <SheetClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Tutup Panel"
                className="w-8 h-8 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-gray-200"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </Button>
            </SheetClose>
          </SheetHeader>

          {/* Sheet Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* Email Card & Copy Button */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0d121f] border border-gray-800 space-y-2.5 shadow-inner">
              <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                Alamat Email Bersama
              </span>
              <div className="flex items-center space-x-2 bg-[#090d16] p-2.5 rounded-xl border border-gray-800/80">
                <i className="fa-regular fa-envelope text-[#00e599] text-sm shrink-0"></i>
                <span className="text-xs sm:text-sm font-mono font-bold text-white break-all select-all flex-1">
                  {email}
                </span>
              </div>

              <Button
                type="button"
                onClick={handleCopyEmail}
                className="w-full h-9 rounded-xl bg-gradient-to-r from-[#00e599] to-[#00c985] hover:from-[#1affaa] hover:to-[#00e599] text-gray-950 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-[#00e599]/20 transition active:scale-95"
              >
                <i className={copiedEmail ? "fa-solid fa-check text-xs" : "fa-regular fa-copy text-xs"}></i>
                <span>{copiedEmail ? "Email Berhasil Disalin!" : "Salin Email"}</span>
              </Button>
            </div>

            {/* Inbox Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <i className="fa-solid fa-inbox text-[#00e599] text-sm"></i>
                  <h3 className="text-xs sm:text-sm font-bold text-white">Kotak Masuk Login</h3>
                  {lastUpdated && (
                    <span className="text-[10px] text-gray-500 font-mono hidden sm:inline">
                      ({lastUpdated})
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
                {activeMessages.length === 0 ? (
                  <div className="py-7 px-4 rounded-2xl bg-[#0d121f] border border-gray-800/80 text-center flex flex-col items-center justify-center space-y-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#090d16] border border-gray-800 flex items-center justify-center text-gray-400">
                      <i className="fa-regular fa-envelope-open text-base"></i>
                    </div>
                    <div className="space-y-1 max-w-sm">
                      <p className="text-xs font-semibold text-gray-300">
                        Belum ada permintaan login masuk
                      </p>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        Masukkan email di atas pada aplikasi Alight Motion di HP Anda lalu kirim link masuk. Tautan login akan otomatis muncul di sini dan berlaku selama 1 menit.
                      </p>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence>
                    {activeMessages.map((msg) => {
                      const remainingSeconds = Math.max(
                        0,
                        60 - Math.floor((currentTime - new Date(msg.createdAt).getTime()) / 1000)
                      );

                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="p-4 rounded-2xl bg-[#0d121f] border border-gray-800 hover:border-[#00e599]/50 transition-all shadow-xl space-y-3"
                        >
                          {/* Header Title & Time */}
                          <div className="flex items-center justify-between gap-2 border-b border-gray-800/80 pb-2.5">
                            <h4 className="text-xs sm:text-sm font-bold text-white">
                              {msg.subject || "Tautan Masuk Alight Motion"}
                            </h4>

                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                Kadaluarsa: {remainingSeconds}s
                              </span>
                              <span className="text-[10px] sm:text-[11px] font-mono text-gray-400 bg-gray-900/80 px-2 py-0.5 rounded border border-gray-800">
                                {new Date(msg.createdAt).toLocaleTimeString("id-ID", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}{" "}
                                WIB
                              </span>
                            </div>
                          </div>

                          {msg.loginLink ? (
                            <div className="space-y-2 pt-0.5">
                              {/* Action Buttons */}
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                <Link
                                  href={msg.loginLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#00e599] to-emerald-400 hover:from-[#1affaa] hover:to-emerald-300 text-gray-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-[#00e599]/20 transition active:scale-95 text-center"
                                >
                                  <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                                  <span>Login ke Aplikasi</span>
                                </Link>

                                <Button
                                  type="button"
                                  variant="secondary"
                                  onClick={() => handleCopyLink(msg.id, msg.loginLink!)}
                                  className="h-9 px-3.5 text-xs font-semibold rounded-xl bg-gray-800/90 hover:bg-gray-700 text-gray-200 border border-gray-700/80 flex items-center justify-center space-x-2 shrink-0 transition"
                                >
                                  <i className={copiedLinkId === msg.id ? "fa-solid fa-check text-[#00e599]" : "fa-regular fa-copy"}></i>
                                  <span>{copiedLinkId === msg.id ? "Tersalin!" : "Salin Tautan"}</span>
                                </Button>
                              </div>

                              {/* Helper notice */}
                              <p className="text-[10px] text-gray-400 leading-normal flex items-start space-x-1.5 pt-0.5">
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
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
