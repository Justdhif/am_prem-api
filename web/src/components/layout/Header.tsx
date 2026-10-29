"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { GitHubProfileModal } from "@/components/github/GitHubProfileModal";

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);

  const navItems = [
    { label: "Beranda", href: "/", icon: "fa-solid fa-house" },
    { label: "Aktivasi Premium", href: "/aktivasi", icon: "fa-solid fa-crown" },
    { label: "Preset Finder", href: "/preset", icon: "fa-solid fa-wand-magic-sparkles" },
    { label: "Docs", href: "/docs", icon: "fa-solid fa-book-bookmark" },
  ];

  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const activeIndex = navItems.findIndex((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
  );

  // Hitung posisi horizontal (X) dari link yang aktif secara presisi
  // Pendekatan ini 100% kebal terhadap offset scroll vertikal (delta Y) sehingga animasi HANYA bergeser ke samping
  useEffect(() => {
    const updateIndicator = () => {
      if (activeIndex !== -1 && itemRefs.current[activeIndex]) {
        const el = itemRefs.current[activeIndex]!;
        setIndicatorStyle({
          left: el.offsetLeft + 12,
          width: Math.max(0, el.offsetWidth - 24),
          opacity: 1,
        });
      } else {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    updateIndicator();
    const timeout = setTimeout(updateIndicator, 50);

    window.addEventListener("resize", updateIndicator);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [pathname, activeIndex]);

  // Auto-close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body & html scroll completely when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalBodyTouchAction = document.body.style.touchAction;

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.touchAction = "none";

      const preventTouchMove = (e: TouchEvent) => {
        const target = e.target as HTMLElement | null;
        if (target && target.closest(".mobile-menu-scrollable")) {
          return;
        }
        if (e.cancelable) {
          e.preventDefault();
        }
      };

      const preventWheel = (e: WheelEvent) => {
        const target = e.target as HTMLElement | null;
        if (target && target.closest(".mobile-menu-scrollable")) {
          return;
        }
        if (e.cancelable) {
          e.preventDefault();
        }
      };

      document.addEventListener("touchmove", preventTouchMove, { passive: false });
      document.addEventListener("wheel", preventWheel, { passive: false });

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.touchAction = originalBodyTouchAction;
        document.removeEventListener("touchmove", preventTouchMove);
        document.removeEventListener("wheel", preventWheel);
      };
    }
  }, [isMobileMenuOpen]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[170] w-full bg-[#0d121f]/60 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.25)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-10 lg:px-12 xl:px-16 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand (Nama Web & Logo) */}
        <Link href="/" className="flex items-center space-x-3 shrink-0 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#00e599]/40 shadow-sm shadow-[#00e599]/20 shrink-0 group-hover:scale-105 transition">
            <Image
              src="/images/logos/logo-web.webp"
              alt="AM Premium Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain p-0.5"
              priority
            />
          </div>
          <div className="flex flex-col items-start justify-center">
            <span className="font-bold text-base sm:text-lg text-white tracking-wider leading-none group-hover:text-[#00e599] transition font-piximisa">
              AM Premium
            </span>
            <span className="text-[10px] px-2 py-0.5 mt-1 rounded-full bg-[#00e599]/15 text-[#00e599] font-semibold border border-[#00e599]/30 leading-none">
              by Justdhif
            </span>
          </div>
        </Link>

        {/* Center: Main Navigation Menu (Desktop: Clean, Floating, No Box Background, Standard Navbar Style) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-transparent border-0 p-0 shadow-none relative">
          {navItems.map((item, idx) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={idx}
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                href={item.href}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer relative group",
                  isActive
                    ? "text-[#00e599] font-bold"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                )}
              >
                <i
                  className={cn(
                    item.icon,
                    "text-xs transition-colors",
                    isActive ? "text-[#00e599]" : "text-gray-400 group-hover:text-gray-200"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Active Underline Indicator - Purely Horizontal X Slide (100% immune to scroll Y offset) */}
          <motion.div
            initial={false}
            animate={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
              opacity: indicatorStyle.opacity,
            }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 30,
            }}
            className="absolute -bottom-1 h-0.5 bg-[#00e599] rounded-full shadow-[0_0_8px_rgba(0,229,153,0.8)] pointer-events-none"
          />
        </nav>

        {/* Right: GitHub Icon & Mobile Hamburger Toggle */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* GitHub Profile Button - Opens Profile Modal */}
          <button
            type="button"
            onClick={() => setIsGitHubModalOpen(true)}
            className="p-2 text-gray-400 hover:text-[#00e599] transition active:scale-95 flex items-center justify-center rounded-lg hover:bg-white/5 cursor-pointer"
            title="Lihat Profil GitHub @Justdhif"
            aria-label="Lihat Profil GitHub @Justdhif"
          >
            <i className="fa-brands fa-github text-xl"></i>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition active:scale-95 cursor-pointer flex items-center justify-center md:hidden"
            aria-label={isMobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          >
            <i
              className={cn(
                "text-xl transition-all duration-200",
                isMobileMenuOpen ? "fa-solid fa-xmark text-[#00e599]" : "fa-solid fa-bars"
              )}
            />
          </button>
        </div>
      </div>
    </header>

      {/* Mobile Hamburger Dropdown Menu & Screen Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-16 z-[160] md:hidden">
            {/* Backdrop with touch-none to prevent background interaction */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm touch-none"
            />

            {/* Dropdown Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full bg-[#0d121f]/95 backdrop-blur-2xl border-b border-gray-800/80 shadow-2xl p-4 space-y-1.5 max-h-[calc(100vh-4rem)] overflow-y-auto mobile-menu-scrollable"
            >
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 py-1">
                Navigasi Menu
              </div>

              {navItems.map((item, idx) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition active:scale-[0.99] cursor-pointer",
                      isActive
                        ? "bg-[#00e599]/15 text-[#00e599] border border-[#00e599]/30 font-bold"
                        : "text-gray-300 hover:text-white hover:bg-gray-800/60 border border-transparent"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0",
                          isActive
                            ? "bg-[#00e599] text-gray-950 font-bold"
                            : "bg-gray-800/80 text-gray-400"
                        )}
                      >
                        <i className={item.icon}></i>
                      </div>
                      <span>{item.label}</span>
                    </div>

                    <i className="fa-solid fa-chevron-right text-[10px] text-gray-600"></i>
                  </Link>
                );
              })}

              {/* WhatsApp Help Shortcut in Mobile Menu */}
              <div className="pt-2 mt-2 border-t border-gray-800/80">
                <a
                  href="https://wa.me/447762422507?text=Halo%20Admin%2C%20saya%20butuh%20bantuan%20terkait%20layanan%20Alight%20Motion%20Premium"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/15 transition text-xs font-semibold"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500 text-gray-950 flex items-center justify-center text-sm font-bold shrink-0">
                      <i className="fa-brands fa-whatsapp"></i>
                    </div>
                    <div>
                      <span className="text-white block font-bold text-xs">Pusat Bantuan WhatsApp</span>
                      <span className="text-[10px] text-gray-400">+44 7762 422507</span>
                    </div>
                  </div>
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-emerald-400"></i>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic GitHub Profile Modal */}
      <GitHubProfileModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />

      {/* Spacer to preserve content flow offset since header is fixed */}
      <div className="h-16 w-full shrink-0 pointer-events-none" aria-hidden="true" />
    </>
  );
}
