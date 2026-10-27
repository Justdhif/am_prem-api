import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-800/80 bg-[#0d121f]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-10 lg:px-12 xl:px-16 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand (Nama Web) */}
        <Link href="/" className="flex items-center space-x-3 shrink-0 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#00e599]/40 shadow-sm shadow-[#00e599]/20 shrink-0 group-hover:scale-105 transition">
            <Image
              src="/logo-web.png"
              alt="AM Pro API Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain p-0.5"
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

        {/* Right: Icon TikTok */}
        <div className="flex items-center space-x-2 shrink-0">
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
