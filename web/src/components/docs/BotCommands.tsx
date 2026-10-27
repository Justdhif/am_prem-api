"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { MultiCodeBlock, CodeSnippet } from "./MultiCodeBlock";
import { cn } from "@/lib/utils";

const BASE_URL = "https://amprem-api.vercel.app";

export function BotCommands() {
  const [copiedPath, setCopiedPath] = useState(false);
  const [copiedChip, setCopiedChip] = useState<string | null>(null);
  const [activeResponseIndex, setActiveResponseIndex] = useState(0);

  const path = "/api/am/command";

  const handleCopyPath = () => {
    navigator.clipboard.writeText(path);
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 2000);
  };

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedChip(cmd);
    setTimeout(() => setCopiedChip(null), 2000);
  };

  const commandSnippets: CodeSnippet[] = [
    {
      language: "curl",
      label: "cURL",
      code: `curl -X POST ${BASE_URL}${path} \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "!amprem user@gmail.com",
    "senderId": "628123456789@s.whatsapp.net"
  }'`,
    },
    {
      language: "javascript",
      label: "JavaScript",
      code: `const response = await fetch("${BASE_URL}${path}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    text: "!amprem user@gmail.com",
    senderId: "628123456789@s.whatsapp.net"
  })
});

const data = await response.json();
console.log(data.reply);`,
    },
    {
      language: "python",
      label: "Python",
      code: `import requests

url = "${BASE_URL}${path}"
payload = {
    "text": "!amprem user@gmail.com",
    "senderId": "628123456789@s.whatsapp.net"
}

response = requests.post(url, json=payload)
data = response.json()
print(data.get("reply"))`,
    },
    {
      language: "php",
      label: "PHP",
      code: `<?php
$ch = curl_init("${BASE_URL}${path}");
$payload = json_encode([
    "text" => "!amprem user@gmail.com",
    "senderId" => "628123456789@s.whatsapp.net"
]);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);

$result = curl_exec($ch);
curl_close($ch);
echo $result;`,
    },
  ];

  const responses = [
    {
      status: 200,
      statusText: "OK",
      payload: `{
  "success": true,
  "reply": "Link aktivasi Alight Motion telah dikirimkan ke user@gmail.com. Silakan buka email Anda, salin link verifikasinya, dan kirimkan ke sini untuk aktivasi!"
}`,
    },
    {
      status: 400,
      statusText: "Bad Request",
      isError: true,
      payload: `{
  "success": false,
  "message": "Perintah tidak dikenali. Ketik !amhelp untuk melihat daftar perintah yang tersedia.",
  "error": "Unknown bot command"
}`,
    },
  ];

  const activeResponse = responses[activeResponseIndex] || responses[0];

  const commandsList = [
    { cmd: "!amprem user@gmail.com", desc: "Memicu pengiriman magic link verifikasi ke email akun" },
    { cmd: "!ampreset https://vt.tiktok.com/ZSxxxxxxx/", desc: "Ekstrak link preset Alight Motion dari video TikTok/YouTube" },
    { cmd: "!amstats", desc: "Cek statistik total akun VIP aktif dan status server real-time" },
    { cmd: "!amhelp", desc: "Menampilkan daftar seluruh perintah bot dan panduan penggunaan" },
  ];

  return (
    <div
      id="bot-commands"
      className="p-5 sm:p-6 rounded-2xl bg-[#121826] border border-gray-800 shadow-xl space-y-5 scroll-mt-32 text-left transition hover:border-gray-700/80"
    >
      {/* Endpoint Header */}
      <div className="space-y-2 border-b border-gray-800/80 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2.5">
            <Badge variant="methodPost">POST</Badge>
            <code className="text-white font-mono text-xs sm:text-sm font-bold bg-[#0d121f] px-2.5 py-1 rounded-lg border border-gray-800">
              {path}
            </code>
            <button
              type="button"
              onClick={handleCopyPath}
              className="p-1.5 text-gray-500 hover:text-white transition active:scale-95 cursor-pointer text-xs"
              title="Salin path endpoint"
            >
              <i className={cn(copiedPath ? "fa-solid fa-check text-[#00e599]" : "fa-regular fa-copy")}></i>
            </button>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight pt-1">
          5. Webhook Bot WhatsApp &amp; Telegram Handler
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
          Endpoint pemroses pesan otomatis yang siap diintegrasikan dengan bot WhatsApp (Baileys, Wppconnect, Fonnte), Telegram Bot webhook, atau Discord bot.
        </p>
      </div>

      {/* Parameter Schema Table */}
      <div className="space-y-2.5">
        <div className="flex items-center space-x-2 text-xs font-bold text-gray-300">
          <i className="fa-solid fa-sliders text-[#00e599] text-xs"></i>
          <span>Parameter Request Body</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-800 bg-[#0d121f]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121826]/80 text-gray-400 border-b border-gray-800 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-3.5 py-2.5">Field</th>
                <th className="px-3.5 py-2.5">Tipe</th>
                <th className="px-3.5 py-2.5">Wajib</th>
                <th className="px-3.5 py-2.5">Deskripsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 text-gray-300 font-mono text-[11px]">
              <tr>
                <td className="px-3.5 py-2.5 font-bold text-white">text</td>
                <td className="px-3.5 py-2.5 text-[#00e599]">string</td>
                <td className="px-3.5 py-2.5 font-sans">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-semibold border border-amber-500/20">
                    Required
                  </span>
                </td>
                <td className="px-3.5 py-2.5 font-sans text-gray-400">
                  Isi pesan perintah yang dikirim user ke bot (contoh: <code className="text-[#00e599] bg-[#00e599]/10 px-1 py-0.5 rounded font-mono">!amprem user@gmail.com</code>).
                </td>
              </tr>
              <tr>
                <td className="px-3.5 py-2.5 font-bold text-white">senderId</td>
                <td className="px-3.5 py-2.5 text-[#00e599]">string</td>
                <td className="px-3.5 py-2.5 font-sans">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-semibold border border-amber-500/20">
                    Required
                  </span>
                </td>
                <td className="px-3.5 py-2.5 font-sans text-gray-400">
                  ID unik pengirim pesan (nomor WA seperti <code className="text-[#00e599] bg-[#00e599]/10 px-1 py-0.5 rounded font-mono">628123456789@s.whatsapp.net</code> atau Telegram chat ID).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Supported Bot Commands with One-Click Copy */}
      <div className="space-y-2.5">
        <div className="flex items-center space-x-2 text-xs font-bold text-gray-300">
          <i className="fa-solid fa-terminal text-[#00e599] text-xs"></i>
          <span>Contoh Perintah Teks yang Didukung (Klik untuk Menyalin)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {commandsList.map((item) => (
            <button
              key={item.cmd}
              type="button"
              onClick={() => handleCopyCommand(item.cmd)}
              className="p-3 rounded-xl bg-[#0d121f] hover:bg-[#121826] border border-gray-800 hover:border-gray-700 transition text-left space-y-1 group active:scale-[0.99] cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <code className="text-[#00e599] font-mono font-bold text-xs truncate group-hover:text-[#1affaa]">
                  {item.cmd}
                </code>
                <span className="text-[10px] text-gray-500 group-hover:text-gray-300 flex items-center space-x-1 shrink-0 ml-2">
                  <i className={cn(copiedChip === item.cmd ? "fa-solid fa-check text-[#00e599]" : "fa-regular fa-copy")}></i>
                  <span>{copiedChip === item.cmd ? "Tersalin!" : "Salin"}</span>
                </span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                {item.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Practical Tips Callout */}
      <div className="p-3.5 rounded-xl bg-[#00e599]/5 border border-[#00e599]/20 text-xs text-gray-300 flex items-start space-x-2.5">
        <i className="fa-solid fa-circle-info text-[#00e599] mt-0.5 shrink-0 text-sm"></i>
        <div className="space-y-0.5 leading-relaxed">
          <strong className="text-white block font-semibold">Tips Praktis Bot:</strong>
          <span>
            Bot secara otomatis mem-parsing perintah prefix, memanggil API aktivasi/preset di latar belakang, dan langsung mengembalikan pesan respons dalam format teks siap kirim ke pengguna obrolan.
          </span>
        </div>
      </div>

      {/* Multi-language Request Samples */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
          Contoh Request
        </span>
        <MultiCodeBlock snippets={commandSnippets} />
      </div>

      {/* Response Samples with Status Code Tabs */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-gray-300">Contoh Response Bot</span>
          <div className="flex items-center bg-[#0d121f] p-0.5 rounded-lg border border-gray-800 text-[11px]">
            {responses.map((res, idx) => (
              <button
                key={res.status}
                type="button"
                onClick={() => setActiveResponseIndex(idx)}
                className={cn(
                  "px-2.5 py-1 rounded-md font-mono font-bold transition cursor-pointer flex items-center space-x-1.5",
                  activeResponseIndex === idx
                    ? res.isError
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/30"
                    : "text-gray-400 hover:text-white"
                )}
              >
                <span>{res.status}</span>
                <span>{res.statusText}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative rounded-xl overflow-hidden border border-gray-800 bg-[#070b13]">
          <pre className="p-4 text-xs font-mono text-gray-300 overflow-x-auto leading-relaxed custom-scrollbar">
            <code>{activeResponse.payload}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
