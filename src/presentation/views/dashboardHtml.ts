import { LOGO_DATA_URI } from './logoAsset.js';

export function renderDashboardHtml(): string {
  return `<!DOCTYPE html>
<html lang="id" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <title>Alight Motion Pro VIP API Docs - by Justdhif</title>
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
              400: '#1affaa',
              500: '#00e599', // Alight Motion Neon Mint
              600: '#00c784',
            },
            midnight: '#0d121f',
            cardBg: '#131927',
            cardBorder: '#1f2b42',
          }
        }
      }
    }
  </script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0d121f; color: #e2e8f0; }
    pre, code { font-family: 'JetBrains Mono', monospace; }
    .doc-card { background-color: #131927; border: 1px solid #1f2b42; border-radius: 1rem; }
    .doc-card:hover { border-color: rgba(0, 229, 153, 0.35); }
    .badge-method { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 6px; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: #0d121f; }
    ::-webkit-scrollbar-thumb { background: #1f2b42; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #00e599; }
  </style>
</head>
<body class="min-h-screen flex flex-col antialiased selection:bg-[#00e599] selection:text-gray-950">

  <!-- TOP NAVBAR (MINIMALIST & MOBILE-OPTIMIZED) -->
  <header class="sticky top-0 z-30 border-b border-gray-800/80 bg-[#0d121f]/90 backdrop-blur-md">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <img src="${LOGO_DATA_URI}" alt="Alight Motion Logo" class="w-10 h-10 rounded-xl object-cover border border-[#00e599]/40 shadow-sm shadow-[#00e599]/20">
        <div class="flex flex-col items-start justify-center">
          <span class="font-bold text-base text-white tracking-tight leading-none">AM Pro VIP API</span>
          <span class="text-[10px] px-2 py-0.5 mt-1 rounded-full bg-[#00e599]/15 text-[#00e599] font-semibold border border-[#00e599]/30 leading-none">by Justdhif</span>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <a href="https://github.com/Justdhif/am_prem-api" target="_blank" rel="noopener noreferrer" class="p-2 text-gray-400 hover:text-white transition" title="GitHub Repository">
          <i class="fa-brands fa-github text-xl"></i>
        </a>
      </div>
    </div>
  </header>

  <!-- MAIN DOCUMENTATION CONTAINER -->
  <main class="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">

    <!-- HERO INTRODUCTION -->
    <div class="doc-card p-5 sm:p-7 relative overflow-hidden">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-[#00e599]/10 text-[#00e599] text-xs font-semibold mb-3">
            <i class="fa-solid fa-book-bookmark text-[11px]"></i>
            <span>REST API Documentation</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Dokumentasi <span class="text-[#00e599]">Alight Motion VIP</span>
          </h1>
          <p class="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Layanan REST API mandiri berbasis TypeScript untuk otomatisasi pengiriman magic link dan aktivasi lisensi <strong>Alight Motion Pro VIP 1 Tahun</strong> (bebas watermark &amp; full efek pro).
          </p>
        </div>
        <div class="hidden sm:block shrink-0">
          <img src="${LOGO_DATA_URI}" alt="Logo" class="w-20 h-20 rounded-2xl object-cover border border-[#00e599]/30 shadow-lg">
        </div>
      </div>

      <!-- Quick Stats Pills -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-gray-800">
        <div class="bg-[#0d121f] p-3 rounded-xl border border-gray-800/80">
          <span class="text-[11px] text-gray-400 block">Total Aktivasi</span>
          <span id="stat-total" class="text-base sm:text-lg font-bold text-white mt-0.5 block">Loading...</span>
        </div>
        <div class="bg-[#0d121f] p-3 rounded-xl border border-gray-800/80">
          <span class="text-[11px] text-gray-400 block">Aktivasi Hari Ini</span>
          <span id="stat-today" class="text-base sm:text-lg font-bold text-[#00e599] mt-0.5 block">Loading...</span>
        </div>
        <div class="col-span-2 sm:col-span-1 bg-[#0d121f] p-3 rounded-xl border border-gray-800/80">
          <span class="text-[11px] text-gray-400 block">Protokol</span>
          <span class="text-xs sm:text-sm font-semibold text-gray-200 mt-1 block">JSON &middot; POST / GET</span>
        </div>
      </div>
    </div>

    <!-- HOW IT WORKS (ALUR 2 LANGKAH) -->
    <div class="doc-card p-5 sm:p-6 space-y-4">
      <h2 class="text-lg font-bold text-white flex items-center">
        <i class="fa-solid fa-route text-[#00e599] mr-2.5 text-sm"></i>Alur Aktivasi 2 Langkah
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div class="bg-[#0d121f] p-4 rounded-xl border border-gray-800 space-y-2">
          <div class="flex items-center space-x-2">
            <span class="w-6 h-6 rounded-lg bg-[#00e599] text-gray-950 font-black flex items-center justify-center text-xs">1</span>
            <span class="font-bold text-white text-sm">Kirim Link ke Email</span>
          </div>
          <p class="text-gray-400 leading-relaxed">
            Client mengirimkan alamat email akun target ke <code class="text-[#00e599]">/api/am/send-link</code>. Pengguna akan menerima email resmi dari Firebase Alight Motion.
          </p>
        </div>

        <div class="bg-[#0d121f] p-4 rounded-xl border border-gray-800 space-y-2">
          <div class="flex items-center space-x-2">
            <span class="w-6 h-6 rounded-lg bg-[#00e599] text-gray-950 font-black flex items-center justify-center text-xs">2</span>
            <span class="font-bold text-white text-sm">Verifikasi &amp; Aktivasi VIP</span>
          </div>
          <p class="text-gray-400 leading-relaxed">
            Salin link tombol verifikasi di email, lalu kirimkan ke <code class="text-[#00e599]">/api/am/verify</code>. Sistem otomatis mengaktifkan lisensi VIP 1 tahun.
          </p>
        </div>
      </div>
    </div>

    <!-- ENDPOINTS SECTION -->
    <div class="space-y-6">
      <h2 class="text-lg font-bold text-white flex items-center">
        <i class="fa-solid fa-code text-[#00e599] mr-2.5 text-sm"></i>Daftar Endpoint API
      </h2>

      <!-- ENDPOINT 1: SEND LINK -->
      <section class="doc-card p-5 sm:p-6 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-800">
          <div class="flex items-center space-x-2.5 flex-wrap">
            <span class="badge-method bg-blue-500/20 text-blue-400 border border-blue-500/30">POST</span>
            <code class="text-sm font-bold text-white break-all">/api/am/send-link</code>
          </div>
          <span class="text-xs text-gray-400">Kirim Magic Link</span>
        </div>

        <p class="text-xs sm:text-sm text-gray-300">
          Meminta Firebase IdentityToolkit untuk mengirimkan email sign-in / verifikasi Alight Motion ke email target.
        </p>

        <!-- Request Body -->
        <div class="space-y-2">
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Request Body (JSON)</span>
          <div class="relative">
            <pre class="bg-[#0d121f] p-3 sm:p-4 rounded-xl text-xs text-gray-300 overflow-x-auto border border-gray-800/80"><code>{
  "email": "user@gmail.com"
}</code></pre>
            <button onclick="copySnippet('send-link-curl')" class="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px] transition">
              <i class="fa-regular fa-copy mr-1"></i>Salin cURL
            </button>
          </div>
        </div>

        <!-- Hidden cURL for copy -->
        <textarea id="send-link-curl" class="hidden">curl -X POST https://your-domain.com/api/am/send-link \
  -H "Content-Type: application/json" \
  -d '{"email": "user@gmail.com"}'</textarea>

        <!-- Response Example -->
        <div class="space-y-2">
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Response Berhasil (200 OK)</span>
          <pre class="bg-[#0d121f] p-3 sm:p-4 rounded-xl text-xs text-[#00e599] overflow-x-auto border border-gray-800/80"><code>{
  "success": true,
  "message": "Link verifikasi Alight Motion berhasil dikirim ke user@gmail.com. Silakan periksa kotak masuk atau spam email Anda.",
  "sessionId": "am_sess_a1b2c3d4",
  "data": {
    "email": "user@gmail.com",
    "sessionId": "am_sess_a1b2c3d4"
  }
}</code></pre>
        </div>
      </section>

      <!-- ENDPOINT 2: VERIFY LINK -->
      <section class="doc-card p-5 sm:p-6 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-800">
          <div class="flex items-center space-x-2.5 flex-wrap">
            <span class="badge-method bg-emerald-500/20 text-[#00e599] border border-emerald-500/30">POST</span>
            <code class="text-sm font-bold text-white break-all">/api/am/verify</code>
          </div>
          <span class="text-xs text-gray-400">Aktivasi Lisensi VIP 1 Tahun</span>
        </div>

        <p class="text-xs sm:text-sm text-gray-300">
          Memverifikasi tautan yang disalin dari email pengguna, lalu secara otomatis mengaktifkan paket <strong>Alight Motion Pro VIP Annual License</strong>.
        </p>

        <!-- Request Body -->
        <div class="space-y-2">
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Request Body (JSON)</span>
          <div class="relative">
            <pre class="bg-[#0d121f] p-3 sm:p-4 rounded-xl text-xs text-gray-300 overflow-x-auto border border-gray-800/80"><code>{
  "link": "https://alightcreative.com/?link=...&oobCode=xxxxxx",
  "email": "user@gmail.com" // opsional jika sebelumnya memanggil /send-link
}</code></pre>
            <button onclick="copySnippet('verify-link-curl')" class="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px] transition">
              <i class="fa-regular fa-copy mr-1"></i>Salin cURL
            </button>
          </div>
        </div>

        <!-- Hidden cURL for copy -->
        <textarea id="verify-link-curl" class="hidden">curl -X POST https://your-domain.com/api/am/verify \
  -H "Content-Type: application/json" \
  -d '{"link": "https://alightcreative.com/?link=...&oobCode=xxxxxx", "email": "user@gmail.com"}'</textarea>

        <!-- Response Example -->
        <div class="space-y-2">
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Response Berhasil (200 OK)</span>
          <pre class="bg-[#0d121f] p-3 sm:p-4 rounded-xl text-xs text-[#00e599] overflow-x-auto border border-gray-800/80"><code>{
  "success": true,
  "isPremium": true,
  "message": "Alight Motion Pro VIP berhasil diaktifkan!",
  "data": {
    "uid": "firebase_user_uid",
    "email": "user@gmail.com",
    "status": "ACTIVE",
    "membershipStatus": "PREMIUM_ACTIVE",
    "tier": "Alight Motion Pro VIP",
    "subscription": "Yearly VIP License"
  }
}</code></pre>
        </div>
      </section>

      <!-- ENDPOINT 3: FIND TIKTOK PRESET -->
      <section class="doc-card p-5 sm:p-6 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-800">
          <div class="flex items-center space-x-2.5 flex-wrap">
            <span class="badge-method bg-purple-500/20 text-purple-400 border border-purple-500/30">POST</span>
            <code class="text-sm font-bold text-white break-all">/api/am/preset/find</code>
          </div>
          <span class="text-xs text-gray-400">Pindai Preset TikTok (Caption &amp; Komen)</span>
        </div>

        <p class="text-xs sm:text-sm text-gray-300">
          Mencari tautan preset Alight Motion (<code class="text-[#00e599]">alight.link</code>, Google Drive, Mediafire, Sfile) secara otomatis dari caption dan komentar video TikTok.
        </p>

        <!-- Request Body -->
        <div class="space-y-2">
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Request Body (JSON)</span>
          <div class="relative">
            <pre class="bg-[#0d121f] p-3 sm:p-4 rounded-xl text-xs text-gray-300 overflow-x-auto border border-gray-800/80"><code>{
  "url": "https://vt.tiktok.com/ZSxxxxxxx/"
}</code></pre>
            <button onclick="copySnippet('find-preset-curl')" class="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px] transition">
              <i class="fa-regular fa-copy mr-1"></i>Salin cURL
            </button>
          </div>
        </div>

        <textarea id="find-preset-curl" class="hidden">curl -X POST https://your-domain.com/api/am/preset/find \
  -H "Content-Type: application/json" \
  -d '{"url": "https://vt.tiktok.com/ZSxxxxxxx/"}'</textarea>

        <!-- Response Example -->
        <div class="space-y-2">
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Response Berhasil (200 OK)</span>
          <pre class="bg-[#0d121f] p-3 sm:p-4 rounded-xl text-xs text-[#00e599] overflow-x-auto border border-gray-800/80"><code>{
  "success": true,
  "message": "Berhasil menemukan 2 link preset Alight Motion dari video TikTok!",
  "data": {
    "totalPresetsFound": 2,
    "totalCommentsScanned": 50,
    "presets": [
      {
        "url": "https://alight.link/xxxxxx",
        "type": "alight_link",
        "source": "comment",
        "label": "Alight Link (Official)",
        "author": "creator_name",
        "isCreator": true
      },
      {
        "url": "https://drive.google.com/file/d/xxxxxx/view",
        "type": "google_drive",
        "source": "caption",
        "label": "Google Drive (XML/Preset)",
        "author": "creator_name",
        "isCreator": true
      }
    ],
    "formattedText": "*乂 TIKTOK ALIGHT MOTION PRESET FINDER 乂*\\n..."
  }
}</code></pre>
        </div>
      </section>
      <section class="doc-card p-5 sm:p-6 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-800">
          <div class="flex items-center space-x-2.5 flex-wrap">
            <span class="badge-method bg-amber-500/20 text-amber-400 border border-amber-500/30">POST</span>
            <code class="text-sm font-bold text-white break-all">/api/am/command</code>
          </div>
          <span class="text-xs text-gray-400">Adapter Bot WhatsApp</span>
        </div>

        <p class="text-xs sm:text-sm text-gray-300">
          Endpoint khusus pemroses perintah teks bot WhatsApp (misal: Baileys/Wppconnect). Menghasilkan respon teks siap kirim ber-branding Justdhif.
        </p>

        <div class="space-y-2">
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Contoh Perintah Teks yang Didukung</span>
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <div class="bg-[#0d121f] p-2.5 rounded-lg border border-gray-800 font-mono text-[#00e599]">!amprem user@gmail.com</div>
            <div class="bg-[#0d121f] p-2.5 rounded-lg border border-gray-800 font-mono text-[#00e599]">!ampreset &lt;url_tiktok&gt;</div>
            <div class="bg-[#0d121f] p-2.5 rounded-lg border border-gray-800 font-mono text-[#00e599]">!amstats</div>
            <div class="bg-[#0d121f] p-2.5 rounded-lg border border-gray-800 font-mono text-[#00e599]">!amhelp</div>
          </div>
        </div>

        <div class="space-y-2">
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Request Body (JSON)</span>
          <pre class="bg-[#0d121f] p-3 sm:p-4 rounded-xl text-xs text-gray-300 overflow-x-auto border border-gray-800/80"><code>{
  "text": "!amprem user@gmail.com",
  "senderId": "628123456789@s.whatsapp.net"
}</code></pre>
        </div>
      </section>

      <!-- ENDPOINT 4: STATS & HEALTH -->
      <section class="doc-card p-5 sm:p-6 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-800">
          <div class="flex items-center space-x-2.5 flex-wrap">
            <span class="badge-method bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">GET</span>
            <code class="text-sm font-bold text-white break-all">/api/am/stats</code>
          </div>
          <span class="text-xs text-gray-400">Statistik Global</span>
        </div>

        <p class="text-xs sm:text-sm text-gray-300">
          Mengambil data jumlah total akun VIP yang berhasil diaktifkan secara global dan jumlah aktivasi hari ini.
        </p>

        <pre class="bg-[#0d121f] p-3 sm:p-4 rounded-xl text-xs text-[#00e599] overflow-x-auto border border-gray-800/80"><code>{
  "success": true,
  "data": {
    "totalPremium": 144,
    "todayPremium": 20,
    "status": "Online 🟢"
  }
}</code></pre>
      </section>
    </div>

  </main>

  <!-- TOAST NOTIFICATION -->
  <div id="toast" class="fixed bottom-5 right-5 z-50 flex items-center space-x-2.5 px-4 py-2.5 rounded-xl bg-[#131927] text-white border border-[#00e599]/40 shadow-xl transition-all duration-300 transform translate-y-20 opacity-0 text-xs">
    <i class="fa-solid fa-circle-check text-[#00e599]"></i>
    <span id="toast-msg">Tersalin ke clipboard!</span>
  </div>

  <!-- MINIMALIST FOOTER -->
  <footer class="border-t border-gray-800/80 py-6 mt-8 text-center text-xs text-gray-500 bg-[#0d121f]">
    <div class="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
      <div class="flex items-center space-x-2">
        <img src="${LOGO_DATA_URI}" alt="Logo" class="w-5 h-5 rounded-md object-cover">
        <span class="text-gray-300 font-semibold">Alight Motion Pro VIP API</span>
      </div>
      <p class="text-[11px] text-gray-500">Crafted with 💚 by <strong>Justdhif</strong> &copy; 2026. Clean Architecture.</p>
    </div>
  </footer>

  <!-- LIGHTWEIGHT CLIENT SCRIPT -->
  <script>
    function copySnippet(id) {
      const text = document.getElementById(id).value;
      navigator.clipboard.writeText(text);
      showToast('Perintah cURL berhasil disalin!');
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      document.getElementById('toast-msg').innerText = msg;
      toast.classList.remove('translate-y-20', 'opacity-0');
      setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
      }, 2500);
    }

    // Fetch stats in background
    async function loadStats() {
      try {
        const res = await fetch('/api/am/stats');
        const json = await res.json();
        if (json.success && json.data) {
          document.getElementById('stat-total').innerText = json.data.totalPremium + ' Akun';
          document.getElementById('stat-today').innerText = json.data.todayPremium + ' Akun';
        }
      } catch {
        document.getElementById('stat-total').innerText = '-';
        document.getElementById('stat-today').innerText = '-';
      }
    }

    window.addEventListener('DOMContentLoaded', loadStats);
  </script>
</body>
</html>`;
}
