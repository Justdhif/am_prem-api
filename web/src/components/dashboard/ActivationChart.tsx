"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { DailyStatItem } from "@/lib/api";

interface ActivationChartProps {
  totalActivations: number;
  todayActivations: number;
  history?: DailyStatItem[];
  loading?: boolean;
}

interface DataPoint {
  dayLabel: string;
  dateLabel: string;
  count: number;
  isToday: boolean;
}

export function ActivationChart({
  todayActivations,
  history = [],
  loading = false,
}: ActivationChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Map data 7 hari riil dari database PostgreSQL
  const chartData = useMemo<DataPoint[]>(() => {
    const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    if (history && history.length > 0) {
      return history.map((item) => {
        // Parse date YYYY-MM-DD
        const parts = item.date.split("-");
        const itemDate = new Date(
          parseInt(parts[0], 10),
          parseInt(parts[1], 10) - 1,
          parseInt(parts[2], 10)
        );
        const isToday = item.date === todayStr;

        return {
          dayLabel: isToday ? "Hari Ini" : dayNames[itemDate.getDay()] || item.date,
          dateLabel: itemDate.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
          count: loading ? 0 : Math.max(0, item.count),
          isToday,
        };
      });
    }

    // Fallback jika belum ada data history
    const result: DataPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const isToday = i === 0;
      result.push({
        dayLabel: isToday ? "Hari Ini" : dayNames[d.getDay()],
        dateLabel: d.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
        count: isToday ? Math.max(0, todayActivations) : 0,
        isToday,
      });
    }
    return result;
  }, [history, todayActivations, loading]);

  // Chart coordinate dimensions
  const width = 600;
  const height = 150;
  const padLeft = 24;
  const padRight = 24;
  const padTop = 20;
  const padBottom = 30;

  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  const maxVal = Math.max(5, ...chartData.map((d) => d.count)) * 1.25;

  // Compute (x, y) coordinates for each point
  const points = useMemo(() => {
    if (chartData.length === 0) return [];
    return chartData.map((d, i) => {
      const x = padLeft + (i / Math.max(1, chartData.length - 1)) * plotWidth;
      const y = padTop + plotHeight - (d.count / maxVal) * plotHeight;
      return { x, y, ...d };
    });
  }, [chartData, plotWidth, plotHeight, maxVal]);

  // Smooth spline curve generator
  const { linePath, areaPath } = useMemo(() => {
    if (points.length === 0) return { linePath: "", areaPath: "" };

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    const baselineY = padTop + plotHeight;
    const a = `${d} L ${points[points.length - 1].x} ${baselineY} L ${points[0].x} ${baselineY} Z`;

    return { linePath: d, areaPath: a };
  }, [points, plotHeight]);

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];

  return (
    <div className="w-full">
      {/* Chart Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#00e599] animate-pulse"></span>
          <span className="text-xs font-bold text-gray-200">Tren Aktivasi VIP (Riil Database)</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00e599]/15 text-[#00e599] font-semibold border border-[#00e599]/30">
            7 Hari Terakhir
          </span>
        </div>

        {/* Dynamic Highlight Metric */}
        {activePoint && (
          <div className="text-xs text-gray-400 flex items-center space-x-1.5 self-start sm:self-auto font-mono">
            <span className="text-gray-400 font-sans">{activePoint.dayLabel} ({activePoint.dateLabel}):</span>
            <span className="text-[#00e599] font-black text-sm">
              {activePoint.count} Aktivasi
            </span>
          </div>
        )}
      </div>

      {/* Responsive SVG Chart */}
      <div className="relative w-full aspect-[4/1] min-h-[140px] select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Neon Green Gradient Fill */}
            <linearGradient id="neonAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00e599" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#00e599" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#00e599" stopOpacity="0.0" />
            </linearGradient>

            {/* Glowing filter for neon stroke */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#00e599" floodOpacity="0.65" />
            </filter>
          </defs>

          {/* Horizontal Subtle Dashed Guidelines */}
          {[0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padTop + plotHeight * (1 - ratio);
            return (
              <line
                key={ratio}
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="#1f2b42"
                strokeWidth="1"
                strokeDasharray="4 4"
                strokeOpacity="0.7"
              />
            );
          })}

          {/* Area Fill */}
          <motion.path
            d={areaPath}
            fill="url(#neonAreaGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          {/* Spline Line Stroke with Glow */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="#00e599"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#neonGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* Interactive Guide Line on Hover */}
          {hoveredIndex !== null && activePoint && (
            <motion.line
              x1={activePoint.x}
              y1={padTop}
              x2={activePoint.x}
              y2={padTop + plotHeight}
              stroke="#00e599"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              strokeOpacity="0.8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}

          {/* Data Points (Dots) */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Transparent wider hit area for easy hover/touch */}
                <rect
                  x={pt.x - 20}
                  y={0}
                  width="40"
                  height={height}
                  fill="transparent"
                />

                {/* Outer pulsing ring for today or hovered point */}
                {(pt.isToday || isHovered) && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 8 : 6}
                    fill="none"
                    stroke="#00e599"
                    strokeWidth="2"
                    strokeOpacity={isHovered ? 1 : 0.4}
                    className={pt.isToday && !isHovered ? "animate-ping" : ""}
                  />
                )}

                {/* Solid Point Center */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 5 : pt.isToday ? 4.5 : 3.5}
                  fill={isHovered || pt.isToday ? "#00e599" : "#0d121f"}
                  stroke="#00e599"
                  strokeWidth={isHovered || pt.isToday ? "2" : "1.75"}
                  className="transition-all duration-200"
                />

                {/* Day Labels at Bottom */}
                <text
                  x={pt.x}
                  y={height - 8}
                  textAnchor="middle"
                  fill={isHovered || pt.isToday ? "#00e599" : "#64748b"}
                  fontSize="10"
                  fontWeight={isHovered || pt.isToday ? "700" : "500"}
                  className="transition-colors duration-150 font-sans"
                >
                  {pt.dayLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
