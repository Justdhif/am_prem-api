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
  title: "Aktivasi Alight Motion Premium Resmi 1 Tahun",
  description: "Formulir aktivasi resmi lisensi Alight Motion Premium 1 Tahun tanpa watermark menggunakan sistem verifikasi Firebase.",
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
              <span>Aktivasi Premium</span>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Title */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide font-piximisa">
          Aktivasi Alight Motion Premium 1 Tahun
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-2xl">
          Dapatkan lisensi Alight Motion Premium penuh tanpa watermark secara gratis dan otomatis melalui verifikasi tautan email akun Anda.
        </p>
      </div>

      {/* Steps Overview */}
      <StepsCard />

      {/* Interactive Activation Form */}
      <ActivationForm />
    </div>
  );
}
