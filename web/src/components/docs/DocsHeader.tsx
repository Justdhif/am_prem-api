"use client";

import { motion } from "framer-motion";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function DocsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="space-y-4 pt-0"
    >
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <i className="fa-solid fa-house text-[10px] text-gray-400"></i>
              <span>Beranda</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <i className="fa-solid fa-book-bookmark text-[10px]"></i>
              <span>Dokumentasi API</span>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Docs Page Header */}
      <div className="space-y-1.5 pt-0">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide font-piximisa">
          Dokumentasi API Alight Motion Premium
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-2xl">
          Panduan integrasi endpoint untuk bot Telegram/WhatsApp atau automasi mandiri aktivasi lisensi Alight Motion Premium Resmi 1 Tahun dan scraper preset TikTok/YouTube.
        </p>
      </div>
    </motion.div>
  );
}
