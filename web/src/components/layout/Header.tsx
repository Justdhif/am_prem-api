"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Aktivasi & Preset",
      href: "/",
      icon: "fa-solid fa-wand-magic-sparkles",
      isActive: pathname === "/",
    },
    {
      name: "Dokumentasi API",
      href: "/docs",
      icon: "fa-solid fa-book-bookmark",
      isActive: pathname.startsWith("/docs"),
    },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-gray-800/80 bg-[#0d121f]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-3 shrink-0 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#00e599]/40 shadow-sm shadow-[#00e599]/20 shrink-0 group-hover:scale-105 transition">
            <Image
              src="/logo.jpg"
              alt="Alight Motion Logo"
              width={40}
              height={40}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div className="flex flex-col items-start justify-center">
            <span className="font-bold text-base text-white tracking-tight leading-none group-hover:text-[#00e599] transition">
              AM Pro API
            </span>
            <span className="text-[10px] px-2 py-0.5 mt-1 rounded-full bg-[#00e599]/15 text-[#00e599] font-semibold border border-[#00e599]/30 leading-none">
              by Justdhif
            </span>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2 bg-[#121826]/80 p-1 rounded-2xl border border-gray-800/80">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center space-x-1.5 sm:space-x-2 shrink-0 select-none",
                item.isActive
                  ? "bg-[#00e599] text-gray-950 shadow-md shadow-[#00e599]/25 font-bold"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/60"
              )}
            >
              <i className={cn(item.icon, "text-xs")}></i>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Social Links */}
        <div className="hidden sm:flex items-center space-x-2 shrink-0">
          <a
            href="https://www.tiktok.com/@justdhifbieber"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-[#00e599] transition active:scale-95"
            title="TikTok"
          >
            <i className="fa-brands fa-tiktok text-xl"></i>
          </a>
          <a
            href="https://wa.me/447762422507"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-[#00e599] transition active:scale-95"
            title="WhatsApp (+44 7762 422507)"
          >
            <i className="fa-brands fa-whatsapp text-xl"></i>
          </a>
        </div>
      </div>
    </header>
  );
}
