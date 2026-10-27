import Image from "next/image";

export function LogoLoader({ text = "Memuat komentar..." }: { text?: string }) {
  return (
    <div className="m-auto flex flex-col items-center justify-center text-gray-400 space-y-3.5 select-none py-10 animate-in fade-in duration-200">
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Murni logo SVG tanpa background atau box apapun */}
        <Image
          src="/logo.svg"
          alt="Memuat..."
          width={48}
          height={48}
          className="w-12 h-12 object-contain animate-[spin_3s_linear_infinite]"
        />
      </div>
      {text && (
        <span className="text-xs text-gray-400 font-medium tracking-wide">
          {text}
        </span>
      )}
    </div>
  );
}
