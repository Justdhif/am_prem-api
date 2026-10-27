import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

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

export const metadata: Metadata = {
  title: "Alight Motion Pro API Docs - by Justdhif",
  description: "REST API documentation & interactive tester for Alight Motion Pro activation",
  icons: {
    icon: "/logo-web.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`dark ${plusJakartaSans.variable} ${jetbrainsMono.variable} overflow-x-clip max-w-full`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col antialiased selection:bg-[#00e599] selection:text-gray-950 bg-[#0d121f] text-[#e2e8f0] overflow-x-clip max-w-full w-full relative">
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
