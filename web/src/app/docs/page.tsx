import type { Metadata } from "next";
import { DocsHeader } from "@/components/docs/DocsHeader";
import { DocsTab } from "@/components/docs/DocsTab";

export const metadata: Metadata = {
  title: "Dokumentasi API - Alight Motion Pro VIP",
  description: "Dokumentasi resmi dan panduan integrasi REST API Alight Motion Pro VIP & Preset Finder.",
};

export default function DocsPage() {
  return (
    <>
      <DocsHeader />
      <DocsTab />
    </>
  );
}
