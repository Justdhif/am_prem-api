"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Memuat antarmuka...");

  useEffect(() => {
    // Prevent background scrolling while loading
    document.body.style.overflow = "hidden";

    // Progress counter animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        // Variable increments for natural loading feel
        const diff = Math.floor(Math.random() * 12) + 6;
        const next = Math.min(100, prev + diff);

        if (next < 35) {
          setStatusText("Memuat antarmuka...");
        } else if (next < 70) {
          setStatusText("Menyiapkan dokumentasi API...");
        } else if (next < 95) {
          setStatusText("Sinkronisasi audio & aset...");
        } else {
          setStatusText("Siap!");
        }

        return next;
      });
    }, 80);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
        document.body.style.overflow = "";
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="splash-loading"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#070b13] flex flex-col items-center justify-center select-none overflow-hidden"
        >
          {/* Ambient Background Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00e599]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Center Brand & Animation Container */}
          <div className="relative z-10 flex flex-col items-center space-y-6 text-center px-4">
            {/* Logo with Glowing Ring */}
            <div className="relative group">
              {/* Pulsing Backlight */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#00e599] to-emerald-500 rounded-3xl blur-md opacity-50 group-hover:opacity-75 transition duration-500 animate-pulse" />

              {/* Main Logo Card */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-[#00e599]/70 shadow-2xl shadow-[#00e599]/30 bg-[#0d121f] p-0.5"
              >
                <Image
                  src="/logo-web.webp"
                  alt="AM Premium Logo"
                  fill
                  className="object-contain p-1.5"
                  priority
                />
              </motion.div>
            </div>

            {/* Brand Title & Subtitle */}
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="flex flex-col items-center space-y-1.5"
            >
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  AM Premium
                </h1>
                <span className="w-2 h-2 rounded-full bg-[#00e599] animate-ping" />
              </div>

              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#00e599]/15 text-[#00e599] font-bold border border-[#00e599]/30">
                by Justdhif
              </span>
            </motion.div>

            {/* Progress Bar & Percentage */}
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="flex flex-col items-center space-y-2.5 w-64 sm:w-72 pt-2"
            >
              {/* Outer Bar Track */}
              <div className="relative w-full h-2 bg-gray-900/90 rounded-full overflow-hidden border border-gray-800 shadow-inner p-0.5">
                {/* Glowing Fill */}
                <motion.div
                  className="h-full bg-gradient-to-r from-[#00e599] to-[#1affaa] rounded-full shadow-[0_0_12px_rgba(0,229,153,0.8)]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.1 }}
                />
              </div>

              {/* Progress Percentage & Status Label */}
              <div className="w-full flex items-center justify-between text-xs px-0.5 font-mono">
                <span className="text-gray-400 font-sans text-[11px] truncate pr-2">
                  {statusText}
                </span>
                <span className="text-[#00e599] font-bold font-mono text-xs shrink-0">
                  {progress}%
                </span>
              </div>
            </motion.div>
          </div>

          {/* Bottom subtle copyright / branding tag */}
          <div className="absolute bottom-6 text-center text-[11px] text-gray-500 font-mono tracking-wider">
            ALIGHT MOTION PRO ACTIVATION
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
