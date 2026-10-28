"use client";

import { motion } from "framer-motion";

export function WhatsAppBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="p-4 rounded-xl bg-[#00e599]/10 border border-[#00e599]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
    >
      <div className="flex items-center space-x-3">
        <i className="fa-brands fa-whatsapp text-2xl text-[#00e599] shrink-0"></i>
        <div>
          <span className="font-bold text-white block text-sm">Butuh Bantuan Lebih Lanjut?</span>
          <span className="text-gray-400 text-xs">
            Hubungi WhatsApp kami di +44 7762 422507 atau TikTok @justdhifbieber
          </span>
        </div>
      </div>
      <motion.a
        href="https://wa.me/447762422507"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        transition={{ duration: 0.15 }}
        className="px-4 py-2 rounded-xl bg-[#00e599] text-gray-950 font-bold text-xs hover:bg-[#1affaa] transition-colors shrink-0 text-center shadow-md shadow-[#00e599]/20 cursor-pointer"
      >
        Chat WhatsApp
      </motion.a>
    </motion.div>
  );
}
