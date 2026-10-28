"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function QuickNavPills() {
  const pills = [
    {
      href: "/aktivasi",
      label: "Aktivasi VIP",
      icon: "fa-solid fa-crown",
      color: "text-[#00e599]",
      glow: "hover:border-[#00e599]/60 hover:shadow-[0_0_15px_rgba(0,229,153,0.2)]",
      badge: "Gratis",
    },
    {
      href: "/preset",
      label: "Preset Finder",
      icon: "fa-solid fa-wand-magic-sparkles",
      color: "text-amber-400",
      glow: "hover:border-amber-400/60 hover:shadow-[0_0_15px_rgba(251,191,36,0.2)]",
      badge: "XML",
    },
    {
      href: "/docs",
      label: "Dokumentasi API",
      icon: "fa-solid fa-book-bookmark",
      color: "text-blue-400",
      glow: "hover:border-blue-400/60 hover:shadow-[0_0_15px_rgba(96,165,250,0.2)]",
      badge: "REST",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-wrap items-center gap-2 pt-0.5"
    >
      {pills.map((p, idx) => (
        <Link key={idx} href={p.href} className="inline-block">
          <div
            className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#121826] hover:bg-[#161f30] text-gray-300 hover:text-white text-xs font-semibold border border-gray-800 transition-all duration-200 shadow-sm cursor-pointer group active:scale-95 ${p.glow}`}
          >
            <i className={`${p.icon} text-[11px] ${p.color} group-hover:scale-110 transition-transform`} />
            <span>{p.label}</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/40 text-gray-400 font-mono">
              {p.badge}
            </span>
            <i className="fa-solid fa-arrow-right text-[9px] text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>
      ))}
    </motion.div>
  );
}
