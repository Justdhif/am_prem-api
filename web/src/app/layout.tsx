import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const plusJakartaSans = localFont({
  src: "./fonts/PlusJakartaSans-Variable.woff2",
  variable: "--font-jakarta",
  display: "swap",
  weight: "200 800",
});

const jetbrainsMono = localFont({
  src: "./fonts/JetBrainsMono-Variable.woff2",
  variable: "--font-jetbrains",
  display: "swap",
  weight: "100 800",
});

const piximisa = localFont({
  src: "./fonts/Piximisa.ttf",
  variable: "--font-piximisa",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alight Motion Premium - by Justdhif",
  description: "Layanan aktivasi resmi Alight Motion Premium 1 Tahun dan scraper preset multi-platform",
  icons: {
    icon: "/logo-web.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`dark ${plusJakartaSans.variable} ${jetbrainsMono.variable} ${piximisa.variable} overflow-x-clip max-w-full`}>
      <body className="font-sans min-h-screen flex flex-col antialiased selection:bg-[#00e599] selection:text-gray-950 bg-[#0d121f] text-[#e2e8f0] overflow-x-clip max-w-full w-full relative">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
