import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-gray-800/80 py-6 mt-12 text-center text-xs text-gray-500 bg-[#0d121f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="relative w-5 h-5 rounded-md overflow-hidden shrink-0">
            <Image
              src="/logo.jpg"
              alt="Logo"
              fill
              className="object-cover"
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
