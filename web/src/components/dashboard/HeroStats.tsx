"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiClient, DailyStatItem } from "@/lib/api";
import { ActivationChart } from "./ActivationChart";

export function HeroStats() {
  const [stats, setStats] = useState<{
    total: number;
    today: number;
    loading: boolean;
    history: DailyStatItem[];
  }>({
    total: 0,
    today: 0,
    loading: true,
    history: [],
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchStats() {
      try {
        const data = await apiClient.getStats();
        if (isMounted) {
          setStats({
            total: data.totalActivations ?? 0,
            today: data.todayActivations ?? 0,
            loading: false,
            history: data.history || [],
          });
        }
      } catch (e) {
        if (isMounted) setStats((prev) => ({ ...prev, loading: false }));
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="space-y-6 relative"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#00e599]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Top Banner (Cardless, Seamless) */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#00e599] uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#00e599] animate-pulse"></span>
          <span>Resmi &amp; Otomatis</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Layanan Aktivasi Alight Motion Pro VIP
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
          Endpoint mandiri &amp; otomatis untuk verifikasi Firebase link menjadi lisensi Alight Motion Pro VIP Resmi 1 Tahun tanpa watermark.
        </p>
      </div>

      {/* Primary Stats Grid (Cardless & Minimalist) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Stat 1: Total VIP */}
        <div className="flex items-center space-x-3.5 py-1">
          <div className="w-12 h-12 rounded-2xl bg-[#00e599]/10 border border-[#00e599]/25 flex items-center justify-center text-[#00e599] shrink-0 shadow-sm shadow-[#00e599]/10">
            <i className="fa-solid fa-crown text-lg"></i>
          </div>
          <div>
            <span className="text-xs text-gray-400 font-medium block">Total Akun VIP Aktif</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#00e599] font-mono tracking-tight block">
              {stats.loading ? "..." : stats.total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Stat 2: Aktivasi Hari Ini */}
        <div className="flex items-center space-x-3.5 py-1">
          <div className="w-12 h-12 rounded-2xl bg-gray-800/60 border border-gray-700/60 flex items-center justify-center text-amber-400 shrink-0">
            <i className="fa-solid fa-bolt-lightning text-lg"></i>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400 font-medium block">Aktivasi Hari Ini</span>
              <span className="w-2 h-2 rounded-full bg-[#00e599] animate-ping"></span>
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight block">
              {stats.loading ? "..." : stats.today.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Spline Wave Neon Area Chart */}
      <ActivationChart
        totalActivations={stats.total}
        todayActivations={stats.today}
        history={stats.history}
        loading={stats.loading}
      />
    </motion.div>
  );
}
