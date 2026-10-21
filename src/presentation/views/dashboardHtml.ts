import { LOGO_DATA_URI } from './logoAsset.js';

export function renderDashboardHtml(): string {
  return `<!DOCTYPE html>
<html lang="id" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alight Motion Pro VIP Generator & API - by Justdhif</title>
  <link rel="icon" type="image/jpeg" href="${LOGO_DATA_URI}">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Font Awesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            am: {
              50: '#e6fff6',
              100: '#b3ffe2',
              200: '#80ffcd',
              300: '#4dffb9',
              400: '#1affaa',
              500: '#00e599', // Alight Motion Neon Mint
              600: '#00c784',
              700: '#009e68',
              800: '#00754d',
              900: '#004d33',
            },
            midnight: '#0d121f',
            cardBg: '#141c2e',
            cardHover: '#1a253d',
          }
        }
      }
    }
  </script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0d121f; }
    pre, code { font-family: 'JetBrains Mono', monospace; }
    .glass-card { background: rgba(20, 28, 46, 0.75); backdrop-filter: blur(12px); border: 1px solid rgba(0, 229, 153, 0.12); }
    .glass-card:hover { border-color: rgba(0, 229, 153, 0.25); }
    .glow-mint { box-shadow: 0 0 45px -10px rgba(0, 229, 153, 0.25); }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #0d121f; }
    ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #00e599; }
  </style>
</head>
<body class="text-gray-100 min-h-screen flex flex-col antialiased selection:bg-[#00e599] selection:text-gray-950">

  <!-- TOP NAVBAR -->
  <nav class="sticky top-0 z-40 border-b border-gray-800/80 bg-[#0d121f]/85 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center space-x-3.5">
        <!-- Logo Image -->
        <div class="relative group cursor-pointer" onclick="switchTab('generator')">
          <img src="${LOGO_DATA_URI}" alt="Alight Motion Logo" class="w-10 h-10 rounded-xl object-cover shadow-lg shadow-[#00e599]/20 border border-[#00e599]/40 group-hover:scale-105 transition duration-200">
          <span class="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#00e599] border-2 border-[#0d121f] animate-pulse"></span>
        </div>
        <div>
          <div class="flex items-center gap-1.5">
            <span class="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-gray-100 to-[#00e599] bg-clip-text text-transparent">
              Alight Motion VIP
            </span>
            <span class="text-[11px] px-2 py-0.5 rounded-full bg-[#00e599]/15 text-[#00e599] border border-[#00e599]/30 font-semibold">
              by Justdhif
            </span>
          </div>
          <span class="text-[11px] text-gray-400 block -mt-0.5">Automated License Gateway</span>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex items-center space-x-1 bg-[#141c2e]/90 border border-gray-800 p-1 rounded-xl">
        <button onclick="switchTab('generator')" id="nav-generator" class="tab-btn px-4 py-1.5 text-sm font-semibold rounded-lg transition-all text-gray-950 bg-[#00e599] shadow-md shadow-[#00e599]/20">
          <i class="fa-solid fa-wand-magic-sparkles mr-2 text-xs"></i>Web Generator
        </button>
        <button onclick="switchTab('docs')" id="nav-docs" class="tab-btn px-4 py-1.5 text-sm font-semibold rounded-lg transition-all text-gray-400 hover:text-white">
          <i class="fa-solid fa-code mr-2 text-xs"></i>API Docs
        </button>
      </div>
    </div>
  </nav>

  <!-- MAIN CONTAINER -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <!-- HERO BANNER WITH ALIGHT MOTION LOGO BRANDING -->
    <div class="relative overflow-hidden rounded-3xl p-8 mb-8 bg-gradient-to-r from-[#141c2e] via-[#111929] to-[#0d121f] border border-[#00e599]/25 glow-mint">
      <div class="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        <div class="max-w-2xl">
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#00e599]/10 border border-[#00e599]/30 text-[#00e599] text-xs font-semibold mb-4">
            <span class="w-2 h-2 rounded-full bg-[#00e599] animate-ping"></span>
            <span>Gateway Resmi Alight Creative &middot; Serverless 100% Online</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Aktivasi Instan <span class="text-[#00e599]">Alight Motion Pro VIP</span> 1 Tahun
          </h1>
          <p class="text-gray-300 text-base sm:text-lg mb-6 leading-relaxed">
            Platform web generator resmi untuk mengaktifkan lisensi Alight Motion VIP tanpa watermark dan full fitur pro secara gratis dan instan.
          </p>
          <div class="flex flex-wrap gap-3">
            <button onclick="switchTab('generator')" class="px-5 py-2.5 bg-gradient-to-r from-[#00e599] to-[#00b074] hover:from-[#00f2a5] hover:to-[#00c784] text-gray-950 font-bold rounded-xl transition shadow-lg shadow-[#00e599]/30 flex items-center">
              <i class="fa-solid fa-wand-magic-sparkles mr-2 text-sm"></i>Mulai Aktivasi Sekarang
            </button>
            <button onclick="switchTab('docs')" class="px-5 py-2.5 bg-gray-800/80 hover:bg-gray-800 border border-gray-700 text-white font-semibold rounded-xl transition flex items-center">
              <i class="fa-solid fa-code mr-2 text-[#00e599]"></i>Dokumentasi API
            </button>
          </div>
        </div>

        <!-- Big Logo Visual Card -->
        <div class="hidden lg:flex items-center justify-center">
          <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-[#00e599] to-cyan-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition duration-500"></div>
            <div class="relative bg-[#141c2e] p-4 rounded-3xl border border-[#00e599]/40 shadow-2xl flex flex-col items-center">
              <img src="${LOGO_DATA_URI}" alt="Alight Motion Logo" class="w-36 h-36 rounded-2xl object-cover shadow-inner">
              <span class="mt-3 text-xs font-extrabold tracking-wider uppercase text-[#00e599]">Alight Motion VIP</span>
              <span class="text-[10px] text-gray-400">Lisensi Tahunan Resmi</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 1: WEB GENERATOR -->
    <div id="tab-generator" class="tab-content space-y-8">

      <!-- Stats Cards Header -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4" id="stats-container">
        <div class="glass-card rounded-2xl p-5 border border-gray-800">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs uppercase font-bold tracking-wider text-gray-400">Total Akun VIP</span>
            <div class="w-8 h-8 rounded-lg bg-[#00e599]/15 text-[#00e599] flex items-center justify-center">
              <i class="fa-solid fa-users"></i>
            </div>
          </div>
          <div id="stat-total" class="text-2xl sm:text-3xl font-extrabold text-white">Loading...</div>
          <span class="text-xs text-gray-400 mt-1 block">Akun teraktivasi secara global</span>
        </div>

        <div class="glass-card rounded-2xl p-5 border border-gray-800">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs uppercase font-bold tracking-wider text-gray-400">Aktivasi Hari Ini</span>
            <div class="w-8 h-8 rounded-lg bg-[#00e599]/15 text-[#00e599] flex items-center justify-center">
              <i class="fa-solid fa-chart-line"></i>
            </div>
          </div>
          <div id="stat-today" class="text-2xl sm:text-3xl font-extrabold text-white">Loading...</div>
          <span class="text-xs text-[#00e599] mt-1 block">Auto-reset setiap tengah malam</span>
        </div>

        <div class="glass-card rounded-2xl p-5 border border-gray-800">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs uppercase font-bold tracking-wider text-gray-400">Status Gateway</span>
            <div class="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <i class="fa-solid fa-server"></i>
            </div>
          </div>
          <div class="text-xl sm:text-2xl font-bold text-white flex items-center">
            <span class="w-2.5 h-2.5 rounded-full bg-[#00e599] mr-2 animate-ping"></span>
            Online 🟢
          </div>
          <span class="text-xs text-gray-400 mt-1 block">Alight CloudFunctions Gateway</span>
        </div>
      </div>

      <!-- 2-STEP WEB GENERATOR WORKFLOW -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- STEP 1: GENERATE & KIRIM LINK KE EMAIL -->
        <div class="glass-card rounded-2xl p-6 border border-gray-800 flex flex-col justify-between hover:border-[#00e599]/40 transition">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-2.5">
                <span class="w-7 h-7 rounded-lg bg-[#00e599] text-gray-950 font-black flex items-center justify-center text-xs shadow-md shadow-[#00e599]/30">1</span>
                <h3 class="text-lg font-bold text-white">Generate Magic Link</h3>
              </div>
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-[#00e599]/10 text-[#00e599] border border-[#00e599]/20 font-semibold">Langkah 1</span>
            </div>
            <p class="text-xs text-gray-400 mb-5">
              Masukkan alamat email akun Alight Motion Anda. Sistem akan meminta Firebase mengirimkan tautan masuk resmi ke inbox email target.
            </p>

            <form onsubmit="handleSendLink(event)" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">Alamat Email Alight Motion</label>
                <div class="relative">
                  <input type="email" id="input-send-email" required placeholder="akunmu@gmail.com" class="w-full bg-[#0d121f] border border-gray-700 focus:border-[#00e599] focus:ring-1 focus:ring-[#00e599] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition">
                  <i class="fa-regular fa-envelope absolute right-4 top-3 text-gray-500 text-sm"></i>
                </div>
              </div>

              <div class="pt-2">
                <button type="submit" id="btn-send-link" class="w-full py-3 px-4 bg-gradient-to-r from-[#00e599] to-[#00b074] hover:from-[#00f2a5] hover:to-[#00c784] text-gray-950 font-extrabold text-sm rounded-xl transition shadow-lg shadow-[#00e599]/25 flex items-center justify-center">
                  <i class="fa-solid fa-paper-plane mr-2 text-xs"></i>Kirim Magic Link ke Email
                </button>
              </div>
            </form>
          </div>

          <!-- Step 1 Result Guidance Box -->
          <div id="res-send-link-container" class="mt-5 hidden">
            <div class="p-4 rounded-xl bg-[#0d121f] border border-[#00e599]/40 space-y-2.5 text-xs text-gray-200 shadow-lg">
              <div class="flex items-center text-[#00e599] font-bold">
                <i class="fa-solid fa-circle-check mr-2"></i>
                <span id="send-link-status-text">Magic Link Berhasil Dikirim!</span>
              </div>
              <p class="text-gray-300">
                Silakan buka email Anda, lalu <strong>salin alamat tautan</strong> dari tombol <em>"Sign in to Alight Motion"</em> dan tempelkan ke <strong>Langkah 2</strong> di sebelah kanan.
              </p>
              <div class="pt-1 flex items-center justify-between text-[11px] text-gray-400 border-t border-[#00e599]/20">
                <span>Email tercatat di sesi</span>
                <span class="text-[#00e599] font-mono" id="send-link-recorded-email"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 2: VERIFIKASI & AKTIVASI PRO VIP 1 TAHUN -->
        <div class="glass-card rounded-2xl p-6 border border-gray-800 flex flex-col justify-between hover:border-[#00e599]/40 transition">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-2.5">
                <span class="w-7 h-7 rounded-lg bg-[#00e599] text-gray-950 font-black flex items-center justify-center text-xs shadow-md shadow-[#00e599]/30">2</span>
                <h3 class="text-lg font-bold text-white">Verifikasi & Aktivasi VIP</h3>
              </div>
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-[#00e599]/10 text-[#00e599] border border-[#00e599]/20 font-semibold">Langkah 2</span>
            </div>
            <p class="text-xs text-gray-400 mb-5">
              Tempelkan tautan verifikasi yang ada di email Anda ke kolom di bawah. Lisensi Alight Motion VIP 1 Tahun akan langsung diaktifkan!
            </p>

            <form onsubmit="handleVerifyLink(event)" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">Tautan / Link dari Email</label>
                <div class="relative">
                  <input type="text" id="input-verify-link" required placeholder="https://alightcreative.com/?link=...&oobCode=xxxx" class="w-full bg-[#0d121f] border border-gray-700 focus:border-[#00e599] focus:ring-1 focus:ring-[#00e599] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none transition font-mono">
                  <i class="fa-solid fa-link absolute right-4 top-3 text-gray-500 text-sm"></i>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                  Email Target <span class="text-gray-500 font-normal lowercase">(opsional / otomatis)</span>
                </label>
                <input type="email" id="input-verify-email" placeholder="akunmu@gmail.com" class="w-full bg-[#0d121f] border border-gray-700 focus:border-[#00e599] rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 outline-none transition">
              </div>

              <div class="pt-2">
                <button type="submit" id="btn-verify" class="w-full py-3 px-4 bg-gradient-to-r from-[#00e599] to-[#00b074] hover:from-[#00f2a5] hover:to-[#00c784] text-gray-950 font-extrabold text-sm rounded-xl transition shadow-lg shadow-[#00e599]/25 flex items-center justify-center">
                  <i class="fa-solid fa-crown mr-2 text-xs"></i>Verifikasi & Aktifkan VIP 1 Tahun
                </button>
              </div>
            </form>
          </div>

          <!-- Step 2 Result Celebration Card -->
          <div id="res-verify-container" class="mt-5 hidden">
            <div id="verify-success-box" class="p-4 rounded-xl bg-[#0d121f] border border-[#00e599]/60 space-y-3 text-xs shadow-xl glow-mint">
              <div class="flex items-center text-[#00e599] font-black text-sm">
                <i class="fa-solid fa-circle-check text-base mr-2"></i>
                <span>SUKSES! AKUN ANDA TELAH AKTIF PRO VIP</span>
              </div>
              <div class="bg-black/50 p-3 rounded-lg border border-[#00e599]/30 font-mono text-[11px] text-gray-300 space-y-1">
                <div><span class="text-gray-500">Status:</span> <span class="text-[#00e599] font-bold">PREMIUM AKTIF</span></div>
                <div><span class="text-gray-500">Paket:</span> am.full.sub.annual.19q4 (1 Tahun)</div>
                <div><span class="text-gray-500">Target:</span> <span id="verify-res-email" class="text-white"></span></div>
                <div><span class="text-gray-500">User ID:</span> <span id="verify-res-uid" class="text-[#00e599]"></span></div>
              </div>
              <p class="text-gray-300 text-[11px]">
                Silakan buka aplikasi <strong>Alight Motion</strong> di smartphone Anda dan login dengan email tersebut. Semua watermark dan efek pro otomatis terbuka!
              </p>
            </div>

            <div id="verify-error-box" class="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-xs hidden">
              <div class="flex items-center text-red-400 font-bold mb-1">
                <i class="fa-solid fa-triangle-exclamation mr-2"></i>
                <span>Verifikasi Gagal</span>
              </div>
              <p id="verify-error-text" class="text-gray-300"></p>
            </div>
          </div>
        </div>

      </div>

      <!-- WHATSAPP BOT RUNNER / SIMULATOR -->
      <div class="glass-card rounded-2xl p-6 border border-gray-800">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-lg bg-[#00e599]/15 text-[#00e599] flex items-center justify-center">
              <i class="fa-brands fa-whatsapp text-base"></i>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white">Bot Command Runner</h3>
              <p class="text-xs text-gray-400">Jalankan perintah langsung format WhatsApp bot yang terhubung ke API Justdhif.</p>
            </div>
          </div>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-[#00e599]/10 text-[#00e599] border border-[#00e599]/20 font-semibold">
            Perintah Bot
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-3">
            <div class="flex gap-2">
              <input type="text" id="input-bot-command" value="!amstats" placeholder="!amprem email@gmail.com atau !amstats" class="flex-1 bg-[#0d121f] border border-gray-700 rounded-xl px-4 py-2 text-sm text-white font-mono outline-none focus:border-[#00e599]">
              <button onclick="handleBotCommand()" class="px-5 py-2 bg-[#00e599] hover:bg-[#00c784] text-gray-950 font-bold rounded-xl text-sm transition shrink-0">
                Kirim
              </button>
            </div>
            <div class="flex flex-wrap gap-1.5 text-xs">
              <span class="text-gray-400 self-center mr-1">Tombol Cepat:</span>
              <button onclick="setCommandInput('!amhelp')" class="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-mono">!amhelp</button>
              <button onclick="setCommandInput('!amstats')" class="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-mono">!amstats</button>
              <button onclick="setCommandInput('!amprem user@gmail.com')" class="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-mono">!amprem</button>
            </div>
          </div>

          <div class="relative">
            <div class="bg-[#0d121f] p-4 rounded-xl border border-gray-800 text-xs text-gray-200 font-mono whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed" id="bot-chat-preview">Ketik perintah di atas dan klik "Kirim" untuk melihat hasil format WhatsApp...</div>
            <button onclick="copyElementText('bot-chat-preview')" class="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px] border border-gray-700">
              Salin Teks
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- TAB 2: API DOCUMENTATION -->
    <div id="tab-docs" class="tab-content hidden space-y-6">
      <div class="glass-card rounded-2xl p-6 border border-gray-800">
        <h3 class="text-xl font-bold text-white mb-2">Panduan Integrasi REST API Justdhif</h3>
        <p class="text-xs text-gray-400 mb-6">
          Panggil endpoint berikut dari script, aplikasi web/mobile, atau bot WhatsApp Anda.
        </p>

        <div class="space-y-4">
          <!-- Endpoint 1 -->
          <div class="p-4 bg-[#0d121f] rounded-xl border border-gray-800 space-y-2">
            <div class="flex items-center space-x-2">
              <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/30">POST</span>
              <code class="text-xs font-bold text-[#00e599]">/api/am/send-link</code>
            </div>
            <p class="text-xs text-gray-400">Mengirim tautan verifikasi masuk Alight Motion ke email target.</p>
            <pre class="bg-black/60 p-3 rounded-lg text-xs text-gray-300 overflow-x-auto"><code>curl -X POST https://your-domain.com/api/am/send-link \\
  -H "Content-Type: application/json" \\
  -d '{"email": "user@gmail.com"}'</code></pre>
          </div>

          <!-- Endpoint 2 -->
          <div class="p-4 bg-[#0d121f] rounded-xl border border-gray-800 space-y-2">
            <div class="flex items-center space-x-2">
              <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/30">POST</span>
              <code class="text-xs font-bold text-[#00e599]">/api/am/verify</code>
            </div>
            <p class="text-xs text-gray-400">Memverifikasi magic link dan mengaktifkan keanggotaan Alight Motion Pro VIP 1 Tahun.</p>
            <pre class="bg-black/60 p-3 rounded-lg text-xs text-gray-300 overflow-x-auto"><code>curl -X POST https://your-domain.com/api/am/verify \\
  -H "Content-Type: application/json" \\
  -d '{"link": "https://alightcreative.com/?link=...&oobCode=xxxx", "email": "user@gmail.com"}'</code></pre>
          </div>

          <!-- Endpoint 3 -->
          <div class="p-4 bg-[#0d121f] rounded-xl border border-gray-800 space-y-2">
            <div class="flex items-center space-x-2">
              <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">POST</span>
              <code class="text-xs font-bold text-[#00e599]">/api/am/command</code>
            </div>
            <p class="text-xs text-gray-400">Adapter perintah bot WhatsApp langsung (contoh: <code class="text-[#00e599]">!amprem email@gmail.com</code>).</p>
            <pre class="bg-black/60 p-3 rounded-lg text-xs text-gray-300 overflow-x-auto"><code>curl -X POST https://your-domain.com/api/am/command \\
  -H "Content-Type: application/json" \\
  -d '{"text": "!amprem user@gmail.com"}'</code></pre>
          </div>

          <!-- Endpoint 4 -->
          <div class="p-4 bg-[#0d121f] rounded-xl border border-gray-800 space-y-2">
            <div class="flex items-center space-x-2">
              <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">GET</span>
              <code class="text-xs font-bold text-cyan-300">/api/am/stats</code>
            </div>
            <p class="text-xs text-gray-400">Melihat statistik aktivasi total dan aktivasi harian.</p>
          </div>
        </div>
      </div>
    </div>

  </main>

  <!-- TOAST NOTIFICATION -->
  <div id="toast" class="fixed bottom-5 right-5 z-50 flex items-center space-x-3 px-4 py-3 rounded-2xl bg-[#141c2e] text-white border border-[#00e599]/30 shadow-2xl transition-all duration-300 transform translate-y-20 opacity-0">
    <div id="toast-icon"></div>
    <div id="toast-msg" class="text-xs font-medium"></div>
  </div>

  <!-- FOOTER -->
  <footer class="border-t border-gray-800/80 py-6 text-center text-xs text-gray-500 bg-[#0d121f]">
    <div class="flex items-center justify-center space-x-2 mb-2">
      <img src="${LOGO_DATA_URI}" alt="Logo" class="w-5 h-5 rounded-md object-cover">
      <span class="text-gray-300 font-semibold">Alight Motion Pro VIP Gateway</span>
    </div>
    <p>Crafted with 💚 by <strong>Justdhif</strong> &copy; 2026. Clean Architecture REST API & Web Generator.</p>
  </footer>

  <!-- CLIENT-SIDE SCRIPT -->
  <script>
    // Tab Switching
    function switchTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('bg-[#00e599]', 'text-gray-950', 'shadow-md');
        btn.classList.add('text-gray-400');
      });

      const targetTab = document.getElementById('tab-' + tabId);
      const targetNav = document.getElementById('nav-' + tabId);
      if (targetTab) targetTab.classList.remove('hidden');
      if (targetNav) {
        targetNav.classList.remove('text-gray-400');
        targetNav.classList.add('bg-[#00e599]', 'text-gray-950', 'shadow-md');
      }
    }

    // Toast
    function showToast(msg, type = 'success') {
      const toast = document.getElementById('toast');
      const icon = document.getElementById('toast-icon');
      const text = document.getElementById('toast-msg');

      text.innerText = msg;
      if (type === 'success') {
        icon.innerHTML = '<i class="fa-solid fa-circle-check text-[#00e599]"></i>';
      } else {
        icon.innerHTML = '<i class="fa-solid fa-circle-exclamation text-red-400"></i>';
      }

      toast.classList.remove('translate-y-20', 'opacity-0');
      setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
      }, 3500);
    }

    // GENERATOR: Step 1 (Send Magic Link)
    async function handleSendLink(e) {
      e.preventDefault();
      const email = document.getElementById('input-send-email').value.trim();
      const btn = document.getElementById('btn-send-link');
      const boxContainer = document.getElementById('res-send-link-container');
      const recordedEmail = document.getElementById('send-link-recorded-email');

      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Mengirim magic link...';

      try {
        const res = await fetch('/api/am/send-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.message || 'Gagal mengirim magic link.');
        }

        boxContainer.classList.remove('hidden');
        recordedEmail.innerText = email;
        document.getElementById('input-verify-email').value = email;

        showToast('✅ Magic Link berhasil dikirim ke ' + email + '! Cek email Anda sekarang.');
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane mr-2 text-xs"></i>Kirim Magic Link ke Email';
      }
    }

    // GENERATOR: Step 2 (Verify & Activate Pro VIP)
    async function handleVerifyLink(e) {
      e.preventDefault();
      const link = document.getElementById('input-verify-link').value.trim();
      const email = document.getElementById('input-verify-email').value.trim();
      const btn = document.getElementById('btn-verify');
      const boxContainer = document.getElementById('res-verify-container');
      const successBox = document.getElementById('verify-success-box');
      const errorBox = document.getElementById('verify-error-box');

      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Mengaktifkan Pro VIP 1 Tahun...';

      const payload = { link };
      if (email) payload.email = email;

      try {
        const res = await fetch('/api/am/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();

        boxContainer.classList.remove('hidden');

        if (res.ok && json.isPremium) {
          successBox.classList.remove('hidden');
          errorBox.classList.add('hidden');
          document.getElementById('verify-res-email').innerText = json.email || email || 'Akun Alight Motion';
          document.getElementById('verify-res-uid').innerText = json.uid || 'Terverifikasi';
          showToast('🎉 Selamat! Akun Anda telah sukses aktif Pro VIP 1 Tahun!');
          fetchStats();
        } else {
          successBox.classList.add('hidden');
          errorBox.classList.remove('hidden');
          document.getElementById('verify-error-text').innerText = json.message || 'Verifikasi link gagal atau tautan telah kadaluarsa.';
          showToast(json.message || 'Verifikasi gagal', 'error');
        }
      } catch (err) {
        boxContainer.classList.remove('hidden');
        successBox.classList.add('hidden');
        errorBox.classList.remove('hidden');
        document.getElementById('verify-error-text').innerText = err.message;
        showToast(err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-crown mr-2 text-xs"></i>Verifikasi & Aktifkan VIP 1 Tahun';
      }
    }

    // BOT COMMAND RUNNER
    async function handleBotCommand() {
      const text = document.getElementById('input-bot-command').value.trim();
      const preview = document.getElementById('bot-chat-preview');

      preview.innerText = 'Memproses perintah bot...';

      try {
        const res = await fetch('/api/am/command', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, senderId: 'web_user' })
        });
        const json = await res.json();
        preview.innerText = json.replyText || json.message || JSON.stringify(json, null, 2);
      } catch (err) {
        preview.innerText = 'Error: ' + err.message;
      }
    }

    function setCommandInput(cmd) {
      document.getElementById('input-bot-command').value = cmd;
      handleBotCommand();
    }

    async function fetchStats() {
      try {
        const res = await fetch('/api/am/stats');
        const json = await res.json();
        if (json.success && json.data) {
          document.getElementById('stat-total').innerText = json.data.totalPremium + ' Akun';
          document.getElementById('stat-today').innerText = json.data.todayPremium + ' Akun';
        }
      } catch {
        // silent
      }
    }

    function copyElementText(id) {
      const el = document.getElementById(id);
      navigator.clipboard.writeText(el.innerText);
      showToast('Berhasil disalin ke clipboard!');
    }

    // Init
    window.addEventListener('DOMContentLoaded', () => {
      fetchStats();
    });
  </script>
</body>
</html>`;
}
