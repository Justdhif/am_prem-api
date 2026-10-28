import Image from "next/image";
import Link from "next/link";

export function Header() {
  const navItems = [
    { label: "Beranda", href: "/", icon: "fa-solid fa-house" },
    { label: "Aktivasi VIP", href: "/aktivasi", icon: "fa-solid fa-crown" },
    { label: "Preset Finder", href: "/preset", icon: "fa-solid fa-wand-magic-sparkles" },
    { label: "Docs", href: "/docs", icon: "fa-solid fa-book-bookmark" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-gray-800/80 bg-[#0d121f]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-10 lg:px-12 xl:px-16 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand (Nama Web) */}
        <Link href="/" className="flex items-center space-x-3 shrink-0 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#00e599]/40 shadow-sm shadow-[#00e599]/20 shrink-0 group-hover:scale-105 transition">
            <Image
              src="/logo-web.webp"
              alt="AM Pro API Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain p-0.5"
              priority
            />
          </div>
          <div className="flex flex-col items-start justify-center">
            <span className="font-bold text-base sm:text-lg text-white tracking-wider leading-none group-hover:text-[#00e599] transition font-piximisa">
              AM Pro API
            </span>
            <span className="text-[10px] px-2 py-0.5 mt-1 rounded-full bg-[#00e599]/15 text-[#00e599] font-semibold border border-[#00e599]/30 leading-none">
              by Justdhif
            </span>
          </div>
        </Link>

        {/* Center: Main Navigation Menu (Desktop & Tablet) */}
        <nav className="hidden md:flex items-center space-x-1 bg-[#121826]/80 p-1 rounded-2xl border border-gray-800/80">
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-800/60 transition flex items-center space-x-1.5 cursor-pointer"
            >
              <i className={`${item.icon} text-[11px] text-[#00e599]`}></i>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Right: Mobile Quick Nav + TikTok */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Quick buttons on mobile */}
          <div className="flex md:hidden items-center space-x-1">
            <Link
              href="/aktivasi"
              className="px-2.5 py-1 rounded-lg bg-[#00e599]/15 border border-[#00e599]/30 text-[#00e599] text-xs font-bold transition flex items-center space-x-1"
            >
              <i className="fa-solid fa-crown text-[10px]"></i>
              <span>VIP</span>
            </Link>
            <Link
              href="/preset"
              className="px-2.5 py-1 rounded-lg bg-gray-800/80 border border-gray-700/80 text-gray-300 text-xs font-semibold transition flex items-center space-x-1"
            >
              <i className="fa-solid fa-wand-magic-sparkles text-[10px]"></i>
              <span>Preset</span>
            </Link>
          </div>

          <a
            href="https://www.tiktok.com/@justdhifbieber"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-[#00e599] transition active:scale-95 flex items-center justify-center"
            title="TikTok"
          >
            <i className="fa-brands fa-tiktok text-xl"></i>
          </a>
        </div>
      </div>
    </header>
  );
}
