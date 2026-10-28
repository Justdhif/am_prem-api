"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function LogoLoader({ text = "Memuat komentar..." }: { text?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="m-auto flex flex-col items-center justify-center text-gray-400 space-y-3.5 select-none py-10"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        className="relative w-12 h-12 flex items-center justify-center"
      >
        <Image
          src="/images/logos/logo.svg"
          alt="Memuat..."
          width={48}
          height={48}
          className="w-12 h-12 object-contain"
        />
      </motion.div>
      {text && (
        <span className="text-xs text-gray-400 font-medium tracking-wide">
          {text}
        </span>
      )}
    </motion.div>
  );
}
