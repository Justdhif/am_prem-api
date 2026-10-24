import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alight Motion Pro API Docs - by Justdhif",
  description: "REST API documentation & interactive tester for Alight Motion Pro activation",
  icons: {
    icon: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-[#00e599] selection:text-gray-950 bg-[#0d121f] text-[#e2e8f0]">
        {children}
      </body>
    </html>
  );
}
