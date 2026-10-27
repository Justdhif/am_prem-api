import Image from "next/image";

export function Footer() {
  return (
    <footer className="hidden lg:block border-t border-gray-800/80 py-6 mt-12 text-center text-xs text-gray-500 bg-[#0d121f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-10 lg:px-12 xl:px-16 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="relative w-5 h-5 rounded-md overflow-hidden shrink-0">
            <Image
              src="/logo-web.webp"
              alt="AM Pro API Logo"
              width={20}
              height={20}
              className="object-contain"
            />
          </div>
          <span className="text-gray-300 font-semibold text-xs">
            Alight Motion Pro API
          </span>
        </div>
        <p className="text-[11px] text-gray-500">
          Crafted with 💚 by <strong>Justdhif</strong> &copy; 2026. Clean Architecture &amp; Next.js.
        </p>
      </div>
    </footer>
  );
}
