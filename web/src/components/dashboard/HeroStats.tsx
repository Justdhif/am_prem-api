"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { ActivationChart } from "./ActivationChart";

export function HeroStats() {
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    loading: true,
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
    >
      <Card className="p-6 sm:p-7 relative overflow-hidden bg-[#131927]">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00e599]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        {/* Top Banner Gradient */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#00e599]/15 via-transparent to-transparent border border-[#00e599]/30 mb-6">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#00e599] mb-1.5 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#00e599] animate-pulse"></span>
            <span>Resmi &amp; Otomatis</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Layanan Aktivasi Alight Motion Pro VIP
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-1.5 leading-relaxed max-w-2xl">
            Endpoint mandiri &amp; otomatis untuk verifikasi Firebase link menjadi lisensi Alight Motion Pro VIP Resmi 1 Tahun tanpa watermark.
          </p>
        </div>

        {/* Primary Stats Grid (2 Columns: Total & Today, Protokol removed) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <motion.div
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="bg-[#0d121f] p-4 rounded-xl border border-gray-800/80 transition-colors hover:border-[#00e599]/40 flex items-center justify-between"
          >
            <div>
              <span className="text-xs text-gray-400 block font-medium">Total Akun VIP Aktif</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#00e599] mt-1 block font-mono">
                {stats.loading ? "..." : stats.total.toLocaleString()}
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#00e599]/10 border border-[#00e599]/20 flex items-center justify-center text-[#00e599]">
              <i className="fa-solid fa-crown text-lg"></i>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="bg-[#0d121f] p-4 rounded-xl border border-gray-800/80 transition-colors hover:border-gray-700 flex items-center justify-between"
          >
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400 block font-medium">Aktivasi Hari Ini</span>
                <span className="w-2 h-2 rounded-full bg-[#00e599] animate-ping"></span>
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block font-mono">
                {stats.loading ? "..." : stats.today.toLocaleString()}
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-gray-800/80 border border-gray-700/60 flex items-center justify-center text-gray-300">
              <i className="fa-solid fa-bolt-lightning text-lg text-amber-400"></i>
            </div>
          </motion.div>
        </div>

        {/* Spline Wave Neon Area Chart */}
        <ActivationChart
          totalActivations={stats.total}
          todayActivations={stats.today}
          loading={stats.loading}
        />
      </Card>
    </motion.div>
  );
}
