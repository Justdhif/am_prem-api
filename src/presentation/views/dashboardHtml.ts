export function renderDashboardHtml(): string {
  return `<!DOCTYPE html>
<html lang="id" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alight Motion Pro VIP API - Dashboard by Justdhif</title>
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
            brand: {
              50: '#f5f3ff',
              100: '#ede9fe',
              500: '#8b5cf6',
              600: '#7c3aed',
              700: '#6d28d9',
            },
            darkBg: '#0b0f19',
            cardBg: '#111827',
          }
        }
      }
    }
  </script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0b0f19; }
    pre, code { font-family: 'JetBrains Mono', monospace; }
    .glass-card { background: rgba(17, 24, 39, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); }
    .glow-purple { box-shadow: 0 0 40px -10px rgba(124, 58, 237, 0.3); }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #0b0f19; }
    ::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #4b5563; }
  </style>
</head>
<body class="text-gray-100 min-h-screen flex flex-col antialiased selection:bg-purple-600 selection:text-white">

  <!-- TOP NAVBAR -->
  <nav class="sticky top-0 z-40 border-b border-gray-800 bg-[#0b0f19]/80 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <i class="fa-solid fa-bolt text-white text-lg"></i>
        </div>
        <div>
          <span class="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-gray-200 to-purple-400 bg-clip-text text-transparent">
            Alight Motion API
          </span>
          <span class="text-xs px-2 py-0.5 ml-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
            by Justdhif
          </span>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="hidden md:flex items-center space-x-1 bg-gray-900/90 border border-gray-800 p-1 rounded-xl">
        <button onclick="switchTab('playground')" id="nav-playground" class="tab-btn px-4 py-1.5 text-sm font-medium rounded-lg transition-all text-white bg-purple-600 shadow">
          <i class="fa-solid fa-terminal mr-2 text-xs"></i>API Playground
        </button>
        <button onclick="switchTab('billing')" id="nav-billing" class="tab-btn px-4 py-1.5 text-sm font-medium rounded-lg transition-all text-gray-400 hover:text-white">
          <i class="fa-solid fa-gem mr-2 text-xs"></i>Paket & Billing
        </button>
        <button onclick="switchTab('dashboard')" id="nav-dashboard" class="tab-btn px-4 py-1.5 text-sm font-medium rounded-lg transition-all text-gray-400 hover:text-white">
          <i class="fa-solid fa-key mr-2 text-xs"></i>Access Key Saya
        </button>
        <a href="/docs" target="_blank" class="px-4 py-1.5 text-sm font-medium rounded-lg transition-all text-gray-400 hover:text-white">
          <i class="fa-solid fa-book mr-2 text-xs"></i>Swagger Docs
        </a>
      </div>

      <!-- User Auth State Button -->
      <div id="auth-nav-container">
        <button onclick="openAuthModal('login')" class="px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition shadow-lg shadow-purple-600/30 flex items-center">
          <i class="fa-solid fa-right-to-bracket mr-2"></i>Masuk / Daftar
        </button>
      </div>
    </div>
  </nav>

  <!-- MAIN CONTAINER -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <!-- HERO BANNER -->
    <div class="relative overflow-hidden rounded-3xl p-8 mb-8 bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-transparent border border-purple-500/20 glow-purple">
      <div class="relative z-10 max-w-3xl">
        <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-medium mb-4">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Gateway Serverless Aktif 100% Online</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          Aktivasi Otomatis <span class="text-purple-400">Alight Motion Pro VIP</span> 1 Tahun
        </h1>
        <p class="text-gray-300 text-base sm:text-lg mb-6 leading-relaxed">
          Platform REST API profesional & SaaS untuk otomatisasi lisensi Alight Motion VIP. Lengkap dengan sistem Access Key berbasis durasi paket, playground interaktif, dan format bot WhatsApp.
        </p>
        <div class="flex flex-wrap gap-3">
          <button onclick="switchTab('billing')" class="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition shadow-lg shadow-purple-600/30 flex items-center">
            <i class="fa-solid fa-bag-shopping mr-2"></i>Beli Access Key
          </button>
          <button onclick="switchTab('playground')" class="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold rounded-xl transition flex items-center">
            <i class="fa-solid fa-play mr-2 text-purple-400"></i>Coba API Playground
          </button>
          <a href="/docs" target="_blank" class="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 font-semibold rounded-xl transition flex items-center">
            <i class="fa-solid fa-code mr-2"></i>Swagger UI
          </a>
        </div>
      </div>
    </div>

    <!-- TAB 1: API PLAYGROUND & DOCUMENTATION -->
    <div id="tab-playground" class="tab-content space-y-8">
      
      <!-- Stats Cards Header -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4" id="stats-container">
        <div class="glass-card rounded-2xl p-5 border border-gray-800">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs uppercase font-bold tracking-wider text-gray-400">Total Akun VIP</span>
            <div class="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <i class="fa-solid fa-users"></i>
            </div>
          </div>
          <div id="stat-total" class="text-2xl sm:text-3xl font-extrabold text-white">Loading...</div>
          <span class="text-xs text-gray-400 mt-1 block">Akun teraktivasi secara global</span>
        </div>

        <div class="glass-card rounded-2xl p-5 border border-gray-800">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs uppercase font-bold tracking-wider text-gray-400">Aktivasi Hari Ini</span>
            <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <i class="fa-solid fa-chart-line"></i>
            </div>
          </div>
          <div id="stat-today" class="text-2xl sm:text-3xl font-extrabold text-white">Loading...</div>
          <span class="text-xs text-emerald-400 mt-1 block">Auto-reset setiap tengah malam</span>
        </div>

        <div class="glass-card rounded-2xl p-5 border border-gray-800">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs uppercase font-bold tracking-wider text-gray-400">Status Gateway</span>
            <div class="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <i class="fa-solid fa-server"></i>
            </div>
          </div>
          <div class="text-xl sm:text-2xl font-bold text-white flex items-center">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 animate-ping"></span>
            Online 🟢
          </div>
          <span class="text-xs text-gray-400 mt-1 block">IdentityToolkit & CloudFunctions</span>
        </div>
      </div>

      <!-- PLAYGROUND TESTER GRIDS -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- CARD 1: Send Verification Link -->
        <div class="glass-card rounded-2xl p-6 border border-gray-800 flex flex-col">
          <div class="flex items-center space-x-3 mb-4">
            <span class="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">POST</span>
            <span class="font-mono text-sm font-semibold text-gray-200">/api/am/send-link</span>
          </div>
          <h3 class="text-lg font-bold text-white mb-2">1. Kirim Magic Link ke Email</h3>
          <p class="text-xs text-gray-400 mb-4">
            Meminta Firebase mengirimkan email verifikasi Alight Motion. Email target akan dicatat sementara di sesi server.
          </p>

          <form onsubmit="handleSendLink(event)" class="space-y-4 flex-1 flex flex-col justify-between">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">Alamat Email Target</label>
              <div class="relative">
                <input type="email" id="input-send-email" required placeholder="user@gmail.com" class="w-full bg-gray-900 border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition">
                <i class="fa-regular fa-envelope absolute right-4 top-3 text-gray-500 text-sm"></i>
              </div>
            </div>

            <div class="pt-2">
              <button type="submit" id="btn-send-link" class="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-purple-600/20 flex items-center justify-center">
                <i class="fa-solid fa-paper-plane mr-2 text-xs"></i>Kirim Magic Link Sekarang
              </button>
            </div>
          </form>

          <!-- Response Box -->
          <div id="res-send-link-container" class="mt-4 hidden">
            <div class="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Hasil Response:</span>
              <button onclick="copyElementText('res-send-link')" class="text-purple-400 hover:text-purple-300 text-xs">Salin</button>
            </div>
            <pre id="res-send-link" class="p-3 bg-gray-950 rounded-xl text-xs text-gray-300 overflow-x-auto max-h-48 border border-gray-800"></pre>
          </div>
        </div>

        <!-- CARD 2: Verify & Activate Pro VIP -->
        <div class="glass-card rounded-2xl p-6 border border-gray-800 flex flex-col">
          <div class="flex items-center space-x-3 mb-4">
            <span class="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">POST</span>
            <span class="font-mono text-sm font-semibold text-gray-200">/api/am/verify</span>
          </div>
          <h3 class="text-lg font-bold text-white mb-2">2. Verifikasi & Aktivasi Pro VIP</h3>
          <p class="text-xs text-gray-400 mb-4">
            Salin tautan tombol <em>"Sign in to Alight Motion"</em> dari inbox/spam email Anda, lalu tempelkan di bawah.
          </p>

          <form onsubmit="handleVerifyLink(event)" class="space-y-4 flex-1 flex flex-col justify-between">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">Tautan / Link dari Email</label>
              <div class="relative">
                <input type="text" id="input-verify-link" required placeholder="https://alightcreative.com/?link=...&oobCode=xxxx" class="w-full bg-gray-900 border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition font-mono text-xs">
                <i class="fa-solid fa-link absolute right-4 top-3 text-gray-500 text-sm"></i>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Email Target <span class="text-gray-500 font-normal lowercase">(opsional jika sudah send-link)</span>
              </label>
              <input type="email" id="input-verify-email" placeholder="user@gmail.com (otomatis terisi dari sesi)" class="w-full bg-gray-900 border border-gray-700 focus:border-emerald-500 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 outline-none transition">
            </div>

            <div class="pt-2">
              <button type="submit" id="btn-verify" class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center">
                <i class="fa-solid fa-crown mr-2 text-xs"></i>Verifikasi & Aktifkan VIP 1 Tahun
              </button>
            </div>
          </form>

          <!-- Response Box -->
          <div id="res-verify-container" class="mt-4 hidden">
            <div class="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Hasil Response:</span>
              <button onclick="copyElementText('res-verify')" class="text-emerald-400 hover:text-emerald-300 text-xs">Salin</button>
            </div>
            <pre id="res-verify" class="p-3 bg-gray-950 rounded-xl text-xs text-gray-300 overflow-x-auto max-h-48 border border-gray-800"></pre>
          </div>
        </div>

      </div>

      <!-- CARD 3: Bot Command Simulator -->
      <div class="glass-card rounded-2xl p-6 border border-gray-800">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <span class="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">POST</span>
            <span class="font-mono text-sm font-semibold text-gray-200">/api/am/command</span>
          </div>
          <span class="text-xs text-gray-400"><i class="fa-brands fa-whatsapp text-emerald-400 mr-1.5"></i>WhatsApp Bot Adapter</span>
        </div>
        <h3 class="text-lg font-bold text-white mb-2">Simulasi Perintah Bot WhatsApp</h3>
        <p class="text-xs text-gray-400 mb-4">
          Uji langsung format respon teks chat yang akan diterima oleh pengguna bot WhatsApp Anda.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-3">
            <div class="flex gap-2">
              <input type="text" id="input-bot-command" value="!amstats" placeholder="!amprem email@gmail.com atau !amstats" class="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-sm text-white font-mono">
              <button onclick="handleBotCommand()" class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold transition">
                Eksekusi
              </button>
            </div>
            <div class="flex flex-wrap gap-1.5 text-xs">
              <span class="text-gray-400 self-center mr-1">Contoh:</span>
              <button onclick="setCommandInput('!amhelp')" class="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-mono">!amhelp</button>
              <button onclick="setCommandInput('!amstats')" class="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-mono">!amstats</button>
              <button onclick="setCommandInput('!amprem user@gmail.com')" class="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-mono">!amprem</button>
            </div>
          </div>

          <div class="bg-gray-950 p-4 rounded-xl border border-gray-800 text-xs text-gray-200 font-mono whitespace-pre-wrap max-h-56 overflow-y-auto" id="bot-chat-preview">Ketik perintah di atas dan klik "Eksekusi" untuk melihat format balasan WhatsApp...</div>
        </div>
      </div>

    </div>

    <!-- TAB 2: BILLING & PRICING PLANS -->
    <div id="tab-billing" class="tab-content hidden space-y-8">
      <div class="text-center max-w-2xl mx-auto mb-10">
        <h2 class="text-3xl font-extrabold text-white mb-3">Pilihan Paket Langganan API</h2>
        <p class="text-gray-400 text-sm">
          Setiap akun mendapatkan <strong>Access Key unik</strong> dengan masa aktif yang disesuaikan dengan durasi paket. Setelah durasi paket berakhir, Access Key akan otomatis expired dan dapat diaktifkan kembali dengan memperpanjang billing.
        </p>
      </div>

      <!-- Pricing Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6" id="pricing-plans-grid">
        <!-- Weekly -->
        <div class="glass-card rounded-2xl p-6 border border-gray-800 flex flex-col justify-between hover:border-purple-500/50 transition">
          <div>
            <div class="text-xs uppercase font-bold text-gray-400 mb-1">Starter</div>
            <h3 class="text-xl font-bold text-white mb-2">Paket Mingguan</h3>
            <div class="flex items-baseline mb-4">
              <span class="text-3xl font-extrabold text-white">Rp 15.000</span>
              <span class="text-xs text-gray-400 ml-1.5">/ 7 Hari</span>
            </div>
            <p class="text-xs text-gray-400 mb-6">Cocok untuk kebutuhan aktivasi cepat atau proyek jangka pendek.</p>
            <ul class="space-y-2.5 text-xs text-gray-300 mb-6">
              <li class="flex items-center"><i class="fa-solid fa-check text-emerald-400 mr-2"></i>Access Key aktif 7 hari</li>
              <li class="flex items-center"><i class="fa-solid fa-check text-emerald-400 mr-2"></i>Akses penuh semua endpoint API</li>
              <li class="flex items-center"><i class="fa-solid fa-check text-emerald-400 mr-2"></i>Aktivasi Alight Motion VIP 1 Tahun</li>
              <li class="flex items-center"><i class="fa-solid fa-check text-emerald-400 mr-2"></i>Integrasi Bot WhatsApp</li>
            </ul>
          </div>
          <button onclick="handleSelectPlan('weekly')" class="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold rounded-xl border border-gray-700 transition">
            Pilih Paket Mingguan
          </button>
        </div>

        <!-- Monthly (Popular) -->
        <div class="glass-card rounded-2xl p-6 border-2 border-purple-500/80 bg-purple-950/20 relative flex flex-col justify-between shadow-2xl shadow-purple-900/30">
          <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-0.5 rounded-full bg-purple-600 text-white font-bold text-xs shadow-md">
            Paling Populer ⭐
          </div>
          <div>
            <div class="text-xs uppercase font-bold text-purple-400 mb-1">Kreator & Bot Admin</div>
            <h3 class="text-xl font-bold text-white mb-2">Paket Bulanan</h3>
            <div class="flex items-baseline mb-4">
              <span class="text-3xl font-extrabold text-white">Rp 45.000</span>
              <span class="text-xs text-gray-400 ml-1.5">/ 30 Hari</span>
            </div>
            <p class="text-xs text-gray-300 mb-6">Paling populer untuk kreator, admin bot, dan reseller lisensi.</p>
            <ul class="space-y-2.5 text-xs text-gray-200 mb-6">
              <li class="flex items-center"><i class="fa-solid fa-check text-purple-400 mr-2 font-bold"></i>Access Key aktif 30 hari</li>
              <li class="flex items-center"><i class="fa-solid fa-check text-purple-400 mr-2 font-bold"></i>Prioritas Fast Gateway</li>
              <li class="flex items-center"><i class="fa-solid fa-check text-purple-400 mr-2 font-bold"></i>Aktivasi Alight Motion VIP 1 Tahun</li>
              <li class="flex items-center"><i class="fa-solid fa-check text-purple-400 mr-2 font-bold"></i>Support Webhook & Multi-Client</li>
              <li class="flex items-center"><i class="fa-solid fa-check text-purple-400 mr-2 font-bold"></i>Hemat 25% dibanding mingguan</li>
            </ul>
          </div>
          <button onclick="handleSelectPlan('monthly')" class="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-purple-600/30 transition">
            Aktifkan Paket Bulanan
          </button>
        </div>

        <!-- Yearly (Best Value) -->
        <div class="glass-card rounded-2xl p-6 border border-gray-800 flex flex-col justify-between hover:border-indigo-500/50 transition">
          <div>
            <div class="text-xs uppercase font-bold text-indigo-400 mb-1">Bisnis / Reseller</div>
            <h3 class="text-xl font-bold text-white mb-2">Paket Tahunan</h3>
            <div class="flex items-baseline mb-4">
              <span class="text-3xl font-extrabold text-white">Rp 150.000</span>
              <span class="text-xs text-gray-400 ml-1.5">/ 365 Hari</span>
            </div>
            <p class="text-xs text-gray-400 mb-6">Solusi hemat maksimal untuk bisnis dan layanan bot skala besar.</p>
            <ul class="space-y-2.5 text-xs text-gray-300 mb-6">
              <li class="flex items-center"><i class="fa-solid fa-check text-indigo-400 mr-2"></i>Access Key aktif 365 hari (1 Tahun)</li>
              <li class="flex items-center"><i class="fa-solid fa-check text-indigo-400 mr-2"></i>Bypass Rate Limit (Akses VIP)</li>
              <li class="flex items-center"><i class="fa-solid fa-check text-indigo-400 mr-2"></i>Akses Endpoint Admin & Metrics</li>
              <li class="flex items-center"><i class="fa-solid fa-check text-indigo-400 mr-2"></i>Hemat lebih dari 70%</li>
            </ul>
          </div>
          <button onclick="handleSelectPlan('yearly')" class="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold rounded-xl border border-gray-700 transition">
            Pilih Paket Tahunan
          </button>
        </div>
      </div>
    </div>

    <!-- TAB 3: USER DASHBOARD / ACCESS KEY -->
    <div id="tab-dashboard" class="tab-content hidden space-y-6">
      <div id="dashboard-not-logged-in" class="text-center py-16 glass-card rounded-2xl border border-gray-800">
        <div class="w-16 h-16 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-4 text-2xl">
          <i class="fa-solid fa-lock"></i>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">Silakan Masuk Terlebih Dahulu</h3>
        <p class="text-gray-400 text-sm max-w-md mx-auto mb-6">
          Masuk ke akun Anda untuk melihat Access Key pribadi, memantau sisa hari masa aktif paket, dan melakukan perpanjangan billing.
        </p>
        <button onclick="openAuthModal('login')" class="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-sm transition">
          Masuk / Registrasi Akun
        </button>
      </div>

      <div id="dashboard-logged-in" class="hidden space-y-6">
        <!-- Account Info Card -->
        <div class="glass-card rounded-2xl p-6 border border-gray-800">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-800 gap-4">
            <div class="flex items-center space-x-4">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-xl font-extrabold text-white">
                <span id="user-avatar-initial">U</span>
              </div>
              <div>
                <h3 class="text-lg font-bold text-white flex items-center gap-2">
                  <span id="user-display-username">Username</span>
                  <span id="user-role-badge" class="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 border border-gray-700 uppercase">User</span>
                </h3>
                <p id="user-display-email" class="text-xs text-gray-400">email@example.com</p>
              </div>
            </div>

            <!-- Logout button -->
            <button onclick="handleLogout()" class="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold transition self-start sm:self-auto">
              <i class="fa-solid fa-arrow-right-from-bracket mr-1.5"></i>Keluar
            </button>
          </div>

          <!-- Subscription Status -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div class="bg-gray-900/60 p-4 rounded-xl border border-gray-800">
              <span class="text-xs text-gray-400 block mb-1">Status Langganan</span>
              <div id="user-plan-status" class="text-sm font-bold flex items-center">
                <span class="w-2 h-2 rounded-full bg-gray-500 mr-2"></span> Belum Berlangganan
              </div>
            </div>

            <div class="bg-gray-900/60 p-4 rounded-xl border border-gray-800">
              <span class="text-xs text-gray-400 block mb-1">Paket Saat Ini</span>
              <div id="user-plan-name" class="text-sm font-bold text-white">None</div>
            </div>

            <div class="bg-gray-900/60 p-4 rounded-xl border border-gray-800">
              <span class="text-xs text-gray-400 block mb-1">Masa Berlaku Key</span>
              <div id="user-plan-expires" class="text-sm font-bold text-purple-400">-</div>
            </div>
          </div>
        </div>

        <!-- Access Key Card -->
        <div class="glass-card rounded-2xl p-6 border border-gray-800">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-bold text-white text-base flex items-center">
              <i class="fa-solid fa-key text-purple-400 mr-2"></i>Personal Access Key Anda
            </h4>
            <span class="text-xs text-gray-400">Gunakan di header: <code class="text-purple-300">x-api-key</code></span>
          </div>
          <p class="text-xs text-gray-400 mb-4">
            Access Key ini terikat dengan akun Anda dan hanya aktif selama masa langganan masih berlaku.
          </p>

          <div class="flex flex-col sm:flex-row gap-2 mb-4">
            <div class="relative flex-1">
              <input type="password" id="user-access-key" readonly value="am_live_xxxxxxxxxxxxxxxx" class="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-2.5 text-sm font-mono text-purple-300 outline-none">
              <button onclick="toggleKeyVisibility()" class="absolute right-3 top-2.5 text-gray-400 hover:text-white text-sm">
                <i id="eye-icon" class="fa-regular fa-eye"></i>
              </button>
            </div>
            <button onclick="copyAccessKey()" class="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center">
              <i class="fa-regular fa-copy mr-2"></i>Salin Kunci
            </button>
            <button onclick="handleRegenerateKey()" class="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 rounded-xl text-sm font-semibold transition flex items-center justify-center" title="Reset & Buat Kunci Baru">
              <i class="fa-solid fa-arrows-rotate mr-1.5"></i>Reset Kunci
            </button>
          </div>

          <div class="p-3 bg-purple-950/20 border border-purple-800/40 rounded-xl text-xs text-purple-300 flex items-start">
            <i class="fa-solid fa-circle-info mr-2 mt-0.5 text-purple-400"></i>
            <span>Jika masa aktif paket habis, Access Key otomatis dinonaktifkan (expired) dan API akan menolak request sampai paket diperpanjang.</span>
          </div>
        </div>
      </div>
    </div>

  </main>

  <!-- AUTH MODAL (LOGIN / REGISTER) -->
  <div id="auth-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm hidden p-4">
    <div class="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gray-800 shadow-2xl relative glow-purple">
      <button onclick="closeAuthModal()" class="absolute right-5 top-5 text-gray-400 hover:text-white">
        <i class="fa-solid fa-xmark text-lg"></i>
      </button>

      <!-- Modal Tabs -->
      <div class="flex border-b border-gray-800 pb-3 mb-6 space-x-6">
        <button onclick="setAuthTab('login')" id="modal-tab-login" class="text-sm font-bold text-white border-b-2 border-purple-500 pb-2">
          Masuk Akun
        </button>
        <button onclick="setAuthTab('register')" id="modal-tab-register" class="text-sm font-bold text-gray-400 hover:text-white pb-2">
          Daftar Baru
        </button>
      </div>

      <!-- Login Form -->
      <form id="form-login" onsubmit="handleLoginSubmit(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">Email atau Username</label>
          <input type="text" id="login-identifier" required placeholder="user@gmail.com" class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500">
        </div>
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">Kata Sandi</label>
          <input type="password" id="login-password" required placeholder="••••••••" class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500">
        </div>
        <button type="submit" id="btn-login-submit" class="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-purple-600/30">
          Masuk Sekarang
        </button>
      </form>

      <!-- Register Form -->
      <form id="form-register" onsubmit="handleRegisterSubmit(event)" class="space-y-4 hidden">
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">Username</label>
          <input type="text" id="reg-username" required placeholder="username_kamu" class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500">
        </div>
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">Alamat Email</label>
          <input type="email" id="reg-email" required placeholder="user@gmail.com" class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500">
        </div>
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">Kata Sandi (Min. 6 Karakter)</label>
          <input type="password" id="reg-password" minlength="6" required placeholder="••••••••" class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500">
        </div>
        <button type="submit" id="btn-reg-submit" class="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-purple-600/30">
          Buat Akun & Dapatkan Access Key
        </button>
      </form>
    </div>
  </div>

  <!-- TOAST NOTIFICATION -->
  <div id="toast" class="fixed bottom-5 right-5 z-50 flex items-center space-x-3 px-4 py-3 rounded-2xl bg-gray-900 text-white border border-gray-700 shadow-2xl transition-all duration-300 transform translate-y-20 opacity-0">
    <div id="toast-icon"></div>
    <div id="toast-msg" class="text-xs font-medium"></div>
  </div>

  <!-- FOOTER -->
  <footer class="border-t border-gray-800 py-6 text-center text-xs text-gray-500">
    <p>Alight Motion Pro VIP Service &copy; 2026 Crafted with 💜 by <strong>Justdhif</strong>. Clean Architecture API.</p>
  </footer>

  <!-- CLIENT-SIDE SCRIPT -->
  <script>
    let currentUser = null;
    let token = localStorage.getItem('am_auth_token');

    // Tab Switching
    function switchTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('bg-purple-600', 'text-white', 'shadow');
        btn.classList.add('text-gray-400');
      });

      const targetTab = document.getElementById('tab-' + tabId);
      const targetNav = document.getElementById('nav-' + tabId);
      if (targetTab) targetTab.classList.remove('hidden');
      if (targetNav) {
        targetNav.classList.remove('text-gray-400');
        targetNav.classList.add('bg-purple-600', 'text-white', 'shadow');
      }

      if (tabId === 'dashboard') {
        checkUserSession();
      }
    }

    // Toast
    function showToast(msg, type = 'success') {
      const toast = document.getElementById('toast');
      const icon = document.getElementById('toast-icon');
      const text = document.getElementById('toast-msg');

      text.innerText = msg;
      if (type === 'success') {
        icon.innerHTML = '<i class="fa-solid fa-circle-check text-emerald-400"></i>';
      } else {
        icon.innerHTML = '<i class="fa-solid fa-circle-exclamation text-red-400"></i>';
      }

      toast.classList.remove('translate-y-20', 'opacity-0');
      setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
      }, 3500);
    }

    // Auth Modals
    function openAuthModal(mode = 'login') {
      setAuthTab(mode);
      document.getElementById('auth-modal').classList.remove('hidden');
    }
    function closeAuthModal() {
      document.getElementById('auth-modal').classList.add('hidden');
    }
    function setAuthTab(mode) {
      const tabLog = document.getElementById('modal-tab-login');
      const tabReg = document.getElementById('modal-tab-register');
      const formLog = document.getElementById('form-login');
      const formReg = document.getElementById('form-register');

      if (mode === 'login') {
        tabLog.className = 'text-sm font-bold text-white border-b-2 border-purple-500 pb-2';
        tabReg.className = 'text-sm font-bold text-gray-400 hover:text-white pb-2';
        formLog.classList.remove('hidden');
        formReg.classList.add('hidden');
      } else {
        tabReg.className = 'text-sm font-bold text-white border-b-2 border-purple-500 pb-2';
        tabLog.className = 'text-sm font-bold text-gray-400 hover:text-white pb-2';
        formReg.classList.remove('hidden');
        formLog.classList.add('hidden');
      }
    }

    // Login Action
    async function handleLoginSubmit(e) {
      e.preventDefault();
      const id = document.getElementById('login-identifier').value.trim();
      const pw = document.getElementById('login-password').value;

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: id, password: pw })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login gagal');

        localStorage.setItem('am_auth_token', data.token);
        token = data.token;
        currentUser = data.data;

        closeAuthModal();
        showToast('Login berhasil! Selamat datang ' + currentUser.username);
        updateAuthNav();
        checkUserSession();
      } catch (err) {
        showToast(err.message, 'error');
      }
    }

    // Register Action
    async function handleRegisterSubmit(e) {
      e.preventDefault();
      const un = document.getElementById('reg-username').value.trim();
      const em = document.getElementById('reg-email').value.trim();
      const pw = document.getElementById('reg-password').value;

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: un, email: em, password: pw })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registrasi gagal');

        localStorage.setItem('am_auth_token', data.token);
        token = data.token;
        currentUser = data.data;

        closeAuthModal();
        showToast('Akun berhasil dibuat! Silakan pilih paket langganan Anda.');
        updateAuthNav();
        switchTab('billing');
      } catch (err) {
        showToast(err.message, 'error');
      }
    }

    // Session Check
    async function checkUserSession() {
      if (!token) {
        document.getElementById('dashboard-not-logged-in').classList.remove('hidden');
        document.getElementById('dashboard-logged-in').classList.add('hidden');
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        const json = await res.json();
        if (!res.ok) throw new Error();

        currentUser = json.data;
        renderUserDashboard(currentUser);
      } catch {
        localStorage.removeItem('am_auth_token');
        token = null;
        currentUser = null;
        updateAuthNav();
        document.getElementById('dashboard-not-logged-in').classList.remove('hidden');
        document.getElementById('dashboard-logged-in').classList.add('hidden');
      }
    }

    function renderUserDashboard(user) {
      document.getElementById('dashboard-not-logged-in').classList.add('hidden');
      document.getElementById('dashboard-logged-in').classList.remove('hidden');

      document.getElementById('user-avatar-initial').innerText = user.username.charAt(0).toUpperCase();
      document.getElementById('user-display-username').innerText = user.username;
      document.getElementById('user-display-email').innerText = user.email;
      document.getElementById('user-role-badge').innerText = user.role;
      document.getElementById('user-access-key').value = user.apiKey;
      document.getElementById('user-plan-name').innerText = user.planName;

      const statusEl = document.getElementById('user-plan-status');
      const expiresEl = document.getElementById('user-plan-expires');

      if (user.status === 'active') {
        statusEl.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-400 mr-2"></span> Aktif (' + user.daysRemaining + ' Hari Lagi)';
        statusEl.className = 'text-sm font-bold text-emerald-400 flex items-center';
        expiresEl.innerText = new Date(user.planExpiresAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      } else if (user.status === 'expired') {
        statusEl.innerHTML = '<span class="w-2 h-2 rounded-full bg-red-400 mr-2"></span> Expired (Kadaluarsa)';
        statusEl.className = 'text-sm font-bold text-red-400 flex items-center';
        expiresEl.innerText = 'Sudah Habis (Perpanjang)';
      } else {
        statusEl.innerHTML = '<span class="w-2 h-2 rounded-full bg-gray-500 mr-2"></span> Belum Berlangganan';
        statusEl.className = 'text-sm font-bold text-gray-400 flex items-center';
        expiresEl.innerText = 'Pilih Paket Dulu';
      }
    }

    function updateAuthNav() {
      const container = document.getElementById('auth-nav-container');
      if (token && currentUser) {
        container.innerHTML = \`
          <button onclick="switchTab('dashboard')" class="flex items-center space-x-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition">
            <div class="w-6 h-6 rounded-lg bg-purple-600 text-white font-bold flex items-center justify-center text-xs">
              \${currentUser.username.charAt(0).toUpperCase()}
            </div>
            <span class="text-xs font-bold text-gray-200">\${currentUser.username}</span>
          </button>
        \`;
      } else {
        container.innerHTML = \`
          <button onclick="openAuthModal('login')" class="px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition shadow-lg shadow-purple-600/30 flex items-center">
            <i class="fa-solid fa-right-to-bracket mr-2"></i>Masuk / Daftar
          </button>
        \`;
      }
    }

    function handleLogout() {
      localStorage.removeItem('am_auth_token');
      token = null;
      currentUser = null;
      updateAuthNav();
      showToast('Anda telah keluar dari akun.');
      switchTab('playground');
    }

    // Billing Subscribe Action
    async function handleSelectPlan(planId) {
      if (!token) {
        showToast('Silakan masuk atau buat akun terlebih dahulu untuk memilih paket!', 'error');
        openAuthModal('login');
        return;
      }

      try {
        const res = await fetch('/api/billing/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ plan: planId })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Gagal berlangganan');

        currentUser = data.data;
        showToast(data.message);
        switchTab('dashboard');
      } catch (err) {
        showToast(err.message, 'error');
      }
    }

    // Regenerate Key Action
    async function handleRegenerateKey() {
      if (!confirm('Apakah Anda yakin ingin membuat Access Key baru? Access Key lama akan langsung tidak berlaku.')) return;

      try {
        const res = await fetch('/api/billing/regenerate-key', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Gagal membuat kunci baru');

        currentUser = data.data;
        document.getElementById('user-access-key').value = currentUser.apiKey;
        showToast('Access Key baru berhasil digenerate!');
      } catch (err) {
        showToast(err.message, 'error');
      }
    }

    // Playground Handlers
    async function handleSendLink(e) {
      e.preventDefault();
      const email = document.getElementById('input-send-email').value.trim();
      const btn = document.getElementById('btn-send-link');
      const box = document.getElementById('res-send-link');
      const boxContainer = document.getElementById('res-send-link-container');

      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Meminta link...';

      const headers = { 'Content-Type': 'application/json' };
      if (currentUser?.apiKey) headers['x-api-key'] = currentUser.apiKey;

      try {
        const res = await fetch('/api/am/send-link', {
          method: 'POST',
          headers,
          body: JSON.stringify({ email })
        });
        const json = await res.json();
        boxContainer.classList.remove('hidden');
        box.innerText = JSON.stringify(json, null, 2);

        if (res.ok) {
          showToast('Link verifikasi berhasil dikirim ke ' + email);
          document.getElementById('input-verify-email').value = email;
        } else {
          showToast(json.message || 'Gagal mengirim link', 'error');
        }
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane mr-2 text-xs"></i>Kirim Magic Link Sekarang';
      }
    }

    async function handleVerifyLink(e) {
      e.preventDefault();
      const link = document.getElementById('input-verify-link').value.trim();
      const email = document.getElementById('input-verify-email').value.trim();
      const btn = document.getElementById('btn-verify');
      const box = document.getElementById('res-verify');
      const boxContainer = document.getElementById('res-verify-container');

      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Mengaktifkan Pro VIP...';

      const headers = { 'Content-Type': 'application/json' };
      if (currentUser?.apiKey) headers['x-api-key'] = currentUser.apiKey;

      const payload = { link };
      if (email) payload.email = email;

      try {
        const res = await fetch('/api/am/verify', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        boxContainer.classList.remove('hidden');
        box.innerText = JSON.stringify(json, null, 2);

        if (res.ok && json.isPremium) {
          showToast('🎉 Selamat! Akun Anda telah sukses aktif Pro VIP 1 Tahun!');
          fetchStats();
        } else {
          showToast(json.message || 'Verifikasi gagal', 'error');
        }
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-crown mr-2 text-xs"></i>Verifikasi & Aktifkan VIP 1 Tahun';
      }
    }

    async function handleBotCommand() {
      const text = document.getElementById('input-bot-command').value.trim();
      const preview = document.getElementById('bot-chat-preview');

      preview.innerText = 'Memproses perintah bot...';

      const headers = { 'Content-Type': 'application/json' };
      if (currentUser?.apiKey) headers['x-api-key'] = currentUser.apiKey;

      try {
        const res = await fetch('/api/am/command', {
          method: 'POST',
          headers,
          body: JSON.stringify({ text, senderId: 'web_simulator_user' })
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
        // silent fail
      }
    }

    function toggleKeyVisibility() {
      const input = document.getElementById('user-access-key');
      const icon = document.getElementById('eye-icon');
      if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fa-regular fa-eye-slash';
      } else {
        input.type = 'password';
        icon.className = 'fa-regular fa-eye';
      }
    }

    function copyAccessKey() {
      const input = document.getElementById('user-access-key');
      navigator.clipboard.writeText(input.value);
      showToast('Access Key berhasil disalin ke clipboard!');
    }

    function copyElementText(id) {
      const el = document.getElementById(id);
      navigator.clipboard.writeText(el.innerText);
      showToast('Berhasil disalin ke clipboard!');
    }

    // Init
    window.addEventListener('DOMContentLoaded', () => {
      fetchStats();
      if (token) {
        checkUserSession();
      }
    });
  </script>
</body>
</html>`;
}
