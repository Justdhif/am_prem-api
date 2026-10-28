import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ActivationForm } from "@/components/activation/ActivationForm";
import { StepsCard } from "@/components/dashboard/StepsCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aktivasi Alight Motion Pro VIP Resmi 1 Tahun",
  description: "Formulir aktivasi resmi lisensi Alight Motion Pro VIP 1 Tahun tanpa watermark menggunakan sistem verifikasi Firebase.",
};

export default function AktivasiPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
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
              <i className="fa-solid fa-crown text-[10px]"></i>
              <span>Aktivasi Pro VIP</span>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Title */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#00e599]/15 text-[#00e599] border border-[#00e599]/30 text-[11px] font-bold">
          <i className="fa-solid fa-crown text-[10px]"></i>
          <span>Layanan Mandiri Resmi</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide font-piximisa">
          Aktivasi Alight Motion Pro VIP 1 Tahun
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-2xl">
          Dapatkan lisensi Alight Motion Pro VIP penuh tanpa watermark secara gratis dan otomatis melalui verifikasi tautan email akun Anda.
        </p>
      </div>

      {/* Steps Overview */}
      <StepsCard />

      {/* Interactive Activation Form */}
      <ActivationForm />
    </div>
  );
}
