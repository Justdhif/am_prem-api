"use client";

import { useState } from "react";
import { EndpointCard } from "./EndpointCard";
import { BotCommands } from "./BotCommands";
import { FaqSection } from "./FaqSection";
import { WhatsAppBanner } from "./WhatsAppBanner";
import { cn } from "@/lib/utils";

const BASE_URL = "https://amprem-api.vercel.app";

export function DocsTab() {
  const [copiedBaseUrl, setCopiedBaseUrl] = useState(false);

  const handleCopyBaseUrl = () => {
    navigator.clipboard.writeText(BASE_URL);
    setCopiedBaseUrl(true);
    setTimeout(() => setCopiedBaseUrl(false), 2000);
  };

  const navSections = [
    { id: "overview", label: "Overview", icon: "fa-solid fa-compass" },
    { id: "endpoint-send-link", label: "POST /send-link", icon: "fa-regular fa-envelope" },
    { id: "endpoint-verify", label: "POST /verify", icon: "fa-solid fa-key" },
    { id: "endpoint-stats", label: "GET /stats", icon: "fa-solid fa-chart-line" },
    { id: "endpoint-preset", label: "POST /preset/find", icon: "fa-solid fa-magnifying-glass" },
    { id: "bot-commands", label: "Bot Commands", icon: "fa-solid fa-robot" },
    { id: "status-codes", label: "Status Codes", icon: "fa-solid fa-triangle-exclamation" },
    { id: "faq", label: "FAQ", icon: "fa-regular fa-circle-question" },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // 1. SNIPPETS FOR /api/am/send-link
  const sendLinkSnippets = [
    {
      language: "curl" as const,
      label: "cURL",
      code: `curl -X POST ${BASE_URL}/api/am/send-link \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@gmail.com"
  }'`,
    },
    {
      language: "javascript" as const,
      label: "JavaScript",
      code: `const response = await fetch("${BASE_URL}/api/am/send-link", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "user@gmail.com",
  }),
});

const data = await response.json();
console.log(data);`,
    },
    {
      language: "python" as const,
      label: "Python",
      code: `import requests

url = "${BASE_URL}/api/am/send-link"
payload = {"email": "user@gmail.com"}
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
    },
    {
      language: "php" as const,
      label: "PHP",
      code: `<?php
$ch = curl_init("${BASE_URL}/api/am/send-link");
$payload = json_encode(["email" => "user@gmail.com"]);

curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);
curl_close($ch);
echo $result;`,
    },
  ];

  // 2. SNIPPETS FOR /api/am/verify
  const verifySnippets = [
    {
      language: "curl" as const,
      label: "cURL",
      code: `curl -X POST ${BASE_URL}/api/am/verify \\
  -H "Content-Type: application/json" \\
  -d '{
    "link": "https://alightcreative.com/?link=https://alightcreative.com/am/share/...&oobCode=SAMPLE_OOB_CODE",
    "email": "user@gmail.com"
  }'`,
    },
    {
      language: "javascript" as const,
      label: "JavaScript",
      code: `const response = await fetch("${BASE_URL}/api/am/verify", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    link: "https://alightcreative.com/?link=https://alightcreative.com/am/share/...&oobCode=SAMPLE_OOB_CODE",
    email: "user@gmail.com",
  }),
});

const data = await response.json();
console.log(data);`,
    },
    {
      language: "python" as const,
      label: "Python",
      code: `import requests

url = "${BASE_URL}/api/am/verify"
payload = {
    "link": "https://alightcreative.com/?link=https://alightcreative.com/am/share/...&oobCode=SAMPLE_OOB_CODE",
    "email": "user@gmail.com"
}
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
    },
    {
      language: "php" as const,
      label: "PHP",
      code: `<?php
$ch = curl_init("${BASE_URL}/api/am/verify");
$payload = json_encode([
    "link" => "https://alightcreative.com/?link=https://alightcreative.com/am/share/...&oobCode=SAMPLE_OOB_CODE",
    "email" => "user@gmail.com"
]);

curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);
curl_close($ch);
echo $result;`,
    },
  ];

  // 3. SNIPPETS FOR /api/am/stats
  const statsSnippets = [
    {
      language: "curl" as const,
      label: "cURL",
      code: `curl -X GET ${BASE_URL}/api/am/stats`,
    },
    {
      language: "javascript" as const,
      label: "JavaScript",
      code: `const response = await fetch("${BASE_URL}/api/am/stats");
const data = await response.json();
console.log(data);`,
    },
    {
      language: "python" as const,
      label: "Python",
      code: `import requests

response = requests.get("${BASE_URL}/api/am/stats")
print(response.json())`,
    },
    {
      language: "php" as const,
      label: "PHP",
      code: `<?php
$result = file_get_contents("${BASE_URL}/api/am/stats");
echo $result;`,
    },
  ];

  // 4. SNIPPETS FOR /api/am/preset/find
  const presetSnippets = [
    {
      language: "curl" as const,
      label: "cURL",
      code: `curl -X POST ${BASE_URL}/api/am/preset/find \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://vt.tiktok.com/ZSxxxxxxx/"
  }'`,
    },
    {
      language: "javascript" as const,
      label: "JavaScript",
      code: `const response = await fetch("${BASE_URL}/api/am/preset/find", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    url: "https://vt.tiktok.com/ZSxxxxxxx/",
  }),
});

const data = await response.json();
console.log(data);`,
    },
    {
      language: "python" as const,
      label: "Python",
      code: `import requests

url = "${BASE_URL}/api/am/preset/find"
payload = {"url": "https://vt.tiktok.com/ZSxxxxxxx/"}
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
    },
    {
      language: "php" as const,
      label: "PHP",
      code: `<?php
$ch = curl_init("${BASE_URL}/api/am/preset/find");
$payload = json_encode(["url" => "https://vt.tiktok.com/ZSxxxxxxx/"]);

curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);
curl_close($ch);
echo $result;`,
    },
  ];

  return (
    <div className="space-y-8 text-left w-full">
      {/* 1. PRO BASE URL HERO CARD */}
      <div id="overview" className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#121826] via-[#121826] to-[#0d1622] border border-gray-800 shadow-xl space-y-4 text-left scroll-mt-32">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00e599] animate-pulse"></span>
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              API Production Server
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00e599]/15 text-[#00e599] font-mono border border-[#00e599]/30">
              Online 🟢
            </span>
          </div>

          <a
            href={`${BASE_URL}/health`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-gray-400 hover:text-[#00e599] transition flex items-center space-x-1"
          >
            <span>Health Check: /health</span>
            <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
          </a>
        </div>

        {/* Base URL Box */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-400 block">
            Base URL Endpoint:
          </label>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#070b13] border border-gray-700/80 group">
            <code className="text-sm sm:text-base font-mono font-bold text-[#00e599] truncate">
              {BASE_URL}
            </code>
            <button
              type="button"
              onClick={handleCopyBaseUrl}
              className="px-3 py-1.5 rounded-lg bg-gray-800/90 hover:bg-gray-700 text-gray-200 text-xs font-semibold transition active:scale-95 flex items-center space-x-1.5 cursor-pointer shrink-0 ml-2"
              title="Salin Base URL"
            >
              <i className={cn(copiedBaseUrl ? "fa-solid fa-check text-[#00e599]" : "fa-regular fa-copy text-xs")}></i>
              <span>{copiedBaseUrl ? "Tersalin!" : "Salin URL"}</span>
            </button>
          </div>
        </div>

        {/* Global Specifications Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
          <div className="p-2.5 rounded-xl bg-[#0d121f] border border-gray-800 space-y-0.5">
            <span className="text-gray-500 block">Content-Type</span>
            <span className="font-mono font-bold text-gray-200">application/json</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0d121f] border border-gray-800 space-y-0.5">
            <span className="text-gray-500 block">Autentikasi</span>
            <span className="font-bold text-[#00e599]">Public API (Free)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0d121f] border border-gray-800 space-y-0.5">
            <span className="text-gray-500 block">Rate Limiting</span>
            <span className="font-mono font-bold text-gray-200">100 req / 15 min</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0d121f] border border-gray-800 space-y-0.5">
            <span className="text-gray-500 block">Cross-Origin</span>
            <span className="font-mono font-bold text-gray-200">CORS Allowed (*)</span>
          </div>
        </div>
      </div>

      {/* 2. QUICK JUMP NAVIGATION PILLS */}
      <div className="sticky top-16 z-20 bg-[#0d121f]/90 backdrop-blur-md py-2 border-y border-gray-800/80 -mx-1 px-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-1.5 min-w-max">
          {navSections.map((nav) => (
            <button
              key={nav.id}
              type="button"
              onClick={() => scrollTo(nav.id)}
              className="px-3 py-1.5 rounded-xl bg-[#121826] hover:bg-gray-800 text-gray-400 hover:text-white text-xs font-semibold border border-gray-800 transition active:scale-95 cursor-pointer flex items-center space-x-1.5"
            >
              <i className={cn(nav.icon, "text-[11px] text-[#00e599]")}></i>
              <span>{nav.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. ENDPOINT LIST */}
      <div className="space-y-6 sm:space-y-8">
        {/* Endpoint 1: Send Link */}
        <EndpointCard
          id="endpoint-send-link"
          method="POST"
          path="/api/am/send-link"
          title="1. Kirim Magic Link Alight Motion ke Email"
          description="Memicu Firebase Authentication resmi milik Alight Motion untuk mengirimkan magic link verifikasi login langsung ke kotak masuk atau folder spam email pengguna."
          parameters={[
            {
              name: "email",
              type: "string",
              required: true,
              description: "Alamat email target yang akan digunakan untuk mengaktifkan akun Alight Motion.",
              example: "user@gmail.com",
            },
          ]}
          tip="Setelah request sukses, minta user untuk memeriksa folder Spam jika email tidak muncul di kotak masuk utama dalam 1-2 menit."
          requestSnippets={sendLinkSnippets}
          responses={[
            {
              status: 200,
              statusText: "OK",
              payload: `{
  "success": true,
  "message": "Link verifikasi Alight Motion berhasil dikirim ke user@gmail.com. Silakan periksa kotak masuk atau spam email Anda.",
  "data": {
    "email": "user@gmail.com",
    "expiresIn": "15 menit"
  }
}`,
            },
            {
              status: 400,
              statusText: "Bad Request",
              isError: true,
              payload: `{
  "success": false,
  "message": "Format email tidak valid atau kuota pengiriman Firebase tercapai.",
  "error": "Invalid email address"
}`,
            },
          ]}
        />

        {/* Endpoint 2: Verify & Activate */}
        <EndpointCard
          id="endpoint-verify"
          method="POST"
          path="/api/am/verify"
          title="2. Verifikasi & Aktifkan Alight Motion Pro VIP"
          description="Memverifikasi tautan login resmi dari email (oobCode) lalu secara otomatis menaikkan tier akun menjadi lisensi Alight Motion Pro VIP Resmi 1 Tahun tanpa watermark dan semua fitur premium terbuka."
          parameters={[
            {
              name: "link",
              type: "string",
              required: true,
              description: "Full URL link verifikasi dari tombol 'Sign in to Alight Motion' atau cukup nilai kode oobCode.",
              example: "https://alightcreative.com/?link=https://alightcreative.com/am/share/...&oobCode=xxxx",
            },
            {
              name: "email",
              type: "string",
              required: false,
              description: "Alamat email akun target (opsional jika sebelumnya sudah memanggil /send-link pada sesi yang sama).",
              example: "user@gmail.com",
            },
          ]}
          tip="Tautan magic link dari email bersifat satu kali pakai (one-time use) dan memiliki batas kedaluwarsa 15 menit sejak dikirim."
          requestSnippets={verifySnippets}
          responses={[
            {
              status: 200,
              statusText: "OK",
              payload: `{
  "success": true,
  "isPremium": true,
  "message": "Alight Motion Pro VIP berhasil diaktifkan selama 1 Tahun!",
  "data": {
    "uid": "firebase_user_uid_xxxx",
    "email": "user@gmail.com",
    "status": "ACTIVE",
    "membershipStatus": "PREMIUM_ACTIVE",
    "tier": "Alight Motion Pro",
    "subscription": "Yearly License (365 Days)"
  }
}`,
            },
            {
              status: 400,
              statusText: "Bad Request",
              isError: true,
              payload: `{
  "success": false,
  "isPremium": false,
  "message": "Verifikasi link gagal: Link sudah pernah digunakan atau telah kedaluwarsa.",
  "error": "OOB code has expired or is invalid"
}`,
            },
          ]}
        />

        {/* Endpoint 3: Stats */}
        <EndpointCard
          id="endpoint-stats"
          method="GET"
          path="/api/am/stats"
          title="3. Statistik Aktivasi Alight Motion Real-Time"
          description="Mengambil statistik agregat jumlah total lisensi VIP aktif, total aktivasi hari ini, status server, serta riwayat aktivasi 7 hari terakhir."
          parameters={[]}
          tip="Endpoint ini cocok dipanggil secara berkala (misalnya interval 10-30 detik) untuk menampilkan live counter di bot atau dashboard Anda."
          requestSnippets={statsSnippets}
          responses={[
            {
              status: 200,
              statusText: "OK",
              payload: `{
  "success": true,
  "message": "Statistik Alight Motion Pro",
  "data": {
    "totalPremium": 144,
    "todayPremium": 0,
    "status": "Online 🟢",
    "history": [
      { "date": "2026-10-19", "count": 12 },
      { "date": "2026-10-20", "count": 9 },
      { "date": "2026-10-21", "count": 14 },
      { "date": "2026-10-22", "count": 10 },
      { "date": "2026-10-23", "count": 12 },
      { "date": "2026-10-24", "count": 0 },
      { "date": "2026-10-25", "count": 0 }
    ]
  }
}`,
            },
          ]}
        />

        {/* Endpoint 4: Preset Finder */}
        <EndpointCard
          id="endpoint-preset"
          method="POST"
          path="/api/am/preset/find"
          title="4. Scraper & Ekstraktor Preset Multi-Platform (TikTok & YouTube)"
          description="Menerima link video TikTok atau YouTube, mengekstrak metadata video, memindai deskripsi dan seluruh komentar untuk menemukan link preset Alight Creative, Google Drive XML, atau undangan saluran."
          parameters={[
            {
              name: "url",
              type: "string",
              required: true,
              description: "URL video TikTok (vt.tiktok.com / tiktok.com) atau YouTube (youtu.be / youtube.com).",
              example: "https://vt.tiktok.com/ZSxxxxxxx/",
            },
          ]}
          tip="Sistem scraper otomatis menangani pengalihan URL pendek (shortlink) dan mengekstrak link Drive serta Alight Link secara akurat."
          requestSnippets={presetSnippets}
          responses={[
            {
              status: 200,
              statusText: "OK",
              payload: `{
  "success": true,
  "message": "Berhasil menemukan 2 preset Alight Motion!",
  "data": {
    "platform": "tiktok",
    "video": {
      "title": "Preset Alight Motion Jedag Jedug Terbaru 2026",
      "author": "AM Creator",
      "thumbnailUrl": "https://p16-sign.tiktokcdn.com/..."
    },
    "totalPresetsFound": 2,
    "presets": [
      {
        "type": "alight_creative",
        "url": "https://alightcreative.com/am/share/u/preset_id_1"
      },
      {
        "type": "google_drive",
        "url": "https://drive.google.com/file/d/drive_file_id/view"
      }
    ]
  }
}`,
            },
            {
              status: 400,
              statusText: "Bad Request",
              isError: true,
              payload: `{
  "success": false,
  "message": "URL tidak valid atau bukan link video TikTok/YouTube yang didukung.",
  "error": "Unsupported video URL format"
}`,
            },
          ]}
        />
      </div>

      {/* 4. BOT COMMANDS REFERENCE */}
      <BotCommands />

      {/* 5. STATUS CODES REFERENCE TABLE */}
      <div id="status-codes" className="p-5 sm:p-6 rounded-2xl bg-[#121826] border border-gray-800 shadow-xl space-y-4 scroll-mt-32">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <i className="fa-solid fa-triangle-exclamation text-amber-400 text-sm"></i>
            <span>Daftar Kode Status HTTP &amp; Penanganan Error</span>
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            API mengembalikan kode status standar HTTP untuk mengindikasikan keberhasilan atau kegagalan request.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-800 bg-[#0d121f]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121826]/80 text-gray-400 border-b border-gray-800 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-3.5 py-2.5">Kode</th>
                <th className="px-3.5 py-2.5">Status</th>
                <th className="px-3.5 py-2.5">Keterangan</th>
                <th className="px-3.5 py-2.5">Solusi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 text-gray-300 font-mono text-[11px]">
              <tr>
                <td className="px-3.5 py-2.5 font-bold text-[#00e599]">200</td>
                <td className="px-3.5 py-2.5 text-white">OK</td>
                <td className="px-3.5 py-2.5 font-sans text-gray-400">Request berhasil diproses.</td>
                <td className="px-3.5 py-2.5 font-sans text-gray-500">—</td>
              </tr>
              <tr>
                <td className="px-3.5 py-2.5 font-bold text-amber-400">400</td>
                <td className="px-3.5 py-2.5 text-white">Bad Request</td>
                <td className="px-3.5 py-2.5 font-sans text-gray-400">Parameter tidak lengkap, format email salah, atau link verifikasi kedaluwarsa.</td>
                <td className="px-3.5 py-2.5 font-sans text-gray-500">Periksa isi JSON body dan kirim ulang link baru.</td>
              </tr>
              <tr>
                <td className="px-3.5 py-2.5 font-bold text-amber-400">429</td>
                <td className="px-3.5 py-2.5 text-white">Too Many Requests</td>
                <td className="px-3.5 py-2.5 font-sans text-gray-400">IP Anda melampaui batas rate limit (100 request dalam 15 menit).</td>
                <td className="px-3.5 py-2.5 font-sans text-gray-500">Tunggu beberapa menit sebelum mengirim request berikutnya.</td>
              </tr>
              <tr>
                <td className="px-3.5 py-2.5 font-bold text-red-400">500</td>
                <td className="px-3.5 py-2.5 text-white">Internal Server Error</td>
                <td className="px-3.5 py-2.5 font-sans text-gray-400">Terjadi kendala pada gateway Firebase atau server Alight Motion.</td>
                <td className="px-3.5 py-2.5 font-sans text-gray-500">Coba beberapa saat lagi atau hubungi admin.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. FAQ & TROUBLESHOOTING */}
      <div id="faq" className="scroll-mt-32 pt-2">
        <FaqSection />
      </div>

      {/* 7. SUPPORT BANNER */}
      <WhatsAppBanner />
    </div>
  );
}
