"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { Card } from "@/components/ui/card";

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

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-[#0d121f] p-3.5 rounded-xl border border-gray-800/80">
          <span className="text-[11px] text-gray-400 block font-medium">Total Aktivasi</span>
          <span className="text-xl sm:text-2xl font-extrabold text-[#00e599] mt-0.5 block font-mono">
            {stats.loading ? "..." : stats.total.toLocaleString()}
          </span>
        </div>
        <div className="bg-[#0d121f] p-3.5 rounded-xl border border-gray-800/80">
          <span className="text-[11px] text-gray-400 block font-medium">Aktivasi Hari Ini</span>
          <span className="text-xl sm:text-2xl font-extrabold text-white mt-0.5 block font-mono">
            {stats.loading ? "..." : stats.today.toLocaleString()}
          </span>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-[#0d121f] p-3.5 rounded-xl border border-gray-800/80">
          <span className="text-[11px] text-gray-400 block font-medium">Protokol</span>
          <span className="text-xl sm:text-2xl font-extrabold text-blue-400 mt-0.5 block font-mono">
            REST API
          </span>
        </div>
      </div>
    </Card>
  );
}
