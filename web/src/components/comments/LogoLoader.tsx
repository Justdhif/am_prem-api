import Image from "next/image";

export function LogoLoader({ text = "Memuat komentar..." }: { text?: string }) {
  return (
    <div className="m-auto flex flex-col items-center justify-center text-gray-400 space-y-4 select-none py-12 animate-in fade-in duration-200">
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Glow pulsing effect */}
        <div className="absolute inset-0 rounded-full bg-[#00e599]/25 blur-lg animate-pulse"></div>
        {/* Animated Rotating Logo */}
        <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg border border-[#00e599]/40 animate-[spin_4s_linear_infinite]">
          <Image
            src="/logo.svg"
            alt="Loading..."
            fill
            className="object-cover"
          />
        </div>
      </div>
      <span className="text-xs text-gray-400 font-medium tracking-wide">
        {text}
      </span>
    </div>
  );
}
