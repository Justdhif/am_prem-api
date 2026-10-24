import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-800/80 bg-[#0d121f]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#00e599]/40 shadow-sm shadow-[#00e599]/20 shrink-0">
            <Image
              src="/logo.jpg"
              alt="Alight Motion Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col items-start justify-center">
            <span className="font-bold text-base text-white tracking-tight leading-none">
              AM Pro API
            </span>
            <span className="text-[10px] px-2 py-0.5 mt-1 rounded-full bg-[#00e599]/15 text-[#00e599] font-semibold border border-[#00e599]/30 leading-none">
              by Justdhif
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
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
