"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function DocsButton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex items-center"
    >
      <Link href="/docs" className="inline-block">
        <motion.div
          whileHover={{
            scale: 1.04,
            borderColor: "rgba(0, 229, 153, 0.4)",
            boxShadow: "0 0 20px rgba(0, 229, 153, 0.15)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.18 }}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-[#121826] hover:bg-[#161f30] text-gray-300 hover:text-white text-xs font-semibold border border-gray-800 transition-colors shadow-sm cursor-pointer group"
        >
          <motion.i
            animate={{ rotate: [0, -8, 8, -4, 0] }}
            transition={{ repeat: Infinity, repeatDelay: 4, duration: 0.8 }}
            className="fa-solid fa-book-bookmark text-[11px] text-[#00e599] group-hover:scale-110 transition-transform"
          />
          <span>Dokumentasi API</span>
          <i className="fa-solid fa-arrow-right text-[10px] text-gray-500 group-hover:text-[#00e599] group-hover:translate-x-0.5 transition-all ml-0.5" />
        </motion.div>
      </Link>
    </motion.div>
  );
}
