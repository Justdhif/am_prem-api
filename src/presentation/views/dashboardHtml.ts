import { LOGO_DATA_URI } from './logoAsset.js';
import { CommentNode } from '../../domain/entities/Comment.js';


function renderCommentNodeServerSide(comment: CommentNode): string {
  const anonBadge = comment.isAnonymous
    ? '<span class="text-[9px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 font-normal border border-gray-700/60 ml-1.5">Anonim</span>'
    : '';

  const repliesHtml = (comment.replies && comment.replies.length > 0)
    ? '<div class="mt-3 pl-3 sm:pl-4 space-y-3 border-l-2 border-gray-800/90">' +
        comment.replies.map(renderCommentNodeServerSide).join('') +
      '</div>'
    : '';

  const safeName = (comment.name || 'Anonim').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeContent = (comment.content || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const avatarUrl = comment.avatarUrl || 'https://ui-avatars.com/api/?name=Anonim&background=1f2b42&color=94a3b8&bold=true';

  return `
    <div id="comment-${comment.id}" class="bg-[#0d121f] p-3.5 sm:p-4 rounded-xl border border-gray-800/80 transition hover:border-gray-700">
      <div class="flex items-start space-x-3">
        <img src="${avatarUrl}" alt="Avatar" class="w-8 h-8 rounded-full border border-gray-700/60 object-cover shrink-0 mt-0.5">
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <div class="flex items-center">
              <span class="font-bold text-xs sm:text-sm text-white truncate">${safeName}</span>
              ${anonBadge}
            </div>
            <span class="text-[10px] text-gray-500 font-medium">${comment.formattedTime || ''}</span>
          </div>
          <p class="text-xs text-gray-300 mt-1.5 leading-relaxed break-words whitespace-pre-line">${safeContent}</p>
          <div class="mt-2.5 flex items-center space-x-3">
            <button type="button" onclick="toggleReplyForm('${comment.id}')" class="text-[11px] font-semibold text-[#00e599] hover:text-[#1affaa] transition inline-flex items-center space-x-1">
              <i class="fa-solid fa-reply text-[10px]"></i>
              <span>Balas</span>
            </button>
          </div>
          <div id="reply-box-${comment.id}" class="hidden mt-3 pt-3 border-t border-gray-800/80 space-y-2.5">
            <div class="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
              <input type="text" id="reply-name-${comment.id}" placeholder="Nama kamu..." maxlength="50" class="w-full sm:w-1/2 bg-[#131927] border border-gray-700/80 rounded-lg px-2.5 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00e599] transition">
              <label class="flex items-center space-x-1.5 cursor-pointer select-none">
                <input type="checkbox" id="reply-anon-${comment.id}" onchange="toggleAnonymous('reply-name-${comment.id}', this.checked)" class="rounded bg-gray-800 border-gray-700 text-[#00e599] focus:ring-0">
                <span class="text-[11px] text-gray-400">Anonim</span>
              </label>
            </div>
            <textarea id="reply-content-${comment.id}" rows="2" placeholder="Tulis balasan kamu..." maxlength="1000" class="w-full bg-[#131927] border border-gray-700/80 rounded-lg p-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00e599] transition resize-y"></textarea>
            <div class="flex items-center justify-end space-x-2">
              <button type="button" onclick="toggleReplyForm('${comment.id}')" class="px-3 py-1 rounded-lg text-xs text-gray-400 hover:text-white transition">Batal</button>
              <button type="button" onclick="submitReply('${comment.id}')" class="px-3.5 py-1 rounded-lg bg-[#00e599] hover:bg-[#1affaa] text-gray-950 font-bold text-xs transition">Kirim Balasan</button>
            </div>
          </div>
          ${repliesHtml}
        </div>
      </div>
    </div>
  `;
}

export function renderDashboardHtml(initialStats?: { total: number; today: number }, initialComments?: CommentNode[]): string {
  return `<!DOCTYPE html>
<html lang="id" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <title>Alight Motion Pro API Docs - by Justdhif</title>
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
          <span class="font-bold text-base text-white tracking-tight leading-none">AM Pro API</span>
          <span class="text-[10px] px-2 py-0.5 mt-1 rounded-full bg-[#00e599]/15 text-[#00e599] font-semibold border border-[#00e599]/30 leading-none">by Justdhif</span>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <a href="https://www.tiktok.com/@justdhifbieber" target="_blank" rel="noopener noreferrer" class="p-2 text-gray-400 hover:text-[#00e599] transition" title="TikTok">
          <i class="fa-brands fa-tiktok text-xl"></i>
        </a>
        <a href="https://wa.me/447762422507" target="_blank" rel="noopener noreferrer" class="p-2 text-gray-400 hover:text-[#00e599] transition" title="WhatsApp (+44 7762 422507)">
          <i class="fa-brands fa-whatsapp text-xl"></i>
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
            Dokumentasi <span class="text-[#00e599]">Alight Motion Pro</span>
          </h1>
          <p class="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Layanan REST API mandiri berbasis TypeScript untuk otomatisasi pengiriman magic link dan aktivasi lisensi <strong>Alight Motion Pro 1 Tahun</strong> (bebas watermark &amp; full efek pro).
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
          <span id="stat-total" class="text-base sm:text-lg font-bold text-white mt-0.5 block">${initialStats ? initialStats.total + ' Akun' : 'Loading...'}</span>
        </div>
        <div class="bg-[#0d121f] p-3 rounded-xl border border-gray-800/80">
          <span class="text-[11px] text-gray-400 block">Aktivasi Hari Ini</span>
          <span id="stat-today" class="text-base sm:text-lg font-bold text-[#00e599] mt-0.5 block">${initialStats ? initialStats.today + ' Akun' : 'Loading...'}</span>
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
            <span class="font-bold text-white text-sm">Verifikasi &amp; Aktivasi Pro</span>
          </div>
          <p class="text-gray-400 leading-relaxed">
            Salin link tombol verifikasi di email, lalu kirimkan ke <code class="text-[#00e599]">/api/am/verify</code>. Sistem otomatis mengaktifkan lisensi Pro 1 tahun.
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
          <span class="text-xs text-gray-400">Aktivasi Lisensi Pro 1 Tahun</span>
        </div>

        <p class="text-xs sm:text-sm text-gray-300">
          Memverifikasi tautan yang disalin dari email pengguna, lalu secara otomatis mengaktifkan paket <strong>Alight Motion Pro Annual License</strong>.
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
  "message": "Alight Motion Pro berhasil diaktifkan!",
  "data": {
    "uid": "firebase_user_uid",
    "email": "user@gmail.com",
    "status": "ACTIVE",
    "membershipStatus": "PREMIUM_ACTIVE",
    "tier": "Alight Motion Pro",
    "subscription": "Yearly License"
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
          Mengambil data jumlah total akun Pro yang berhasil diaktifkan secara global dan jumlah aktivasi hari ini.
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


      <!-- SECTION KOMENTAR & DISKUSI KOMUNITAS -->
      <section class="doc-card p-5 sm:p-6 space-y-6" id="diskusi">
        <div class="flex items-center justify-between border-b border-gray-800 pb-4">
          <div>
            <h2 class="text-lg font-bold text-white flex items-center">
              <i class="fa-solid fa-comments text-[#00e599] mr-2.5 text-sm"></i>Diskusi &amp; Komentar
            </h2>
            <p class="text-xs text-gray-400 mt-1">Bagikan tanggapan, tanyakan seputar API, atau sapa komunitas!</p>
          </div>
          <span id="comment-count-badge" class="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#00e599]/15 text-[#00e599] border border-[#00e599]/30">
            ${initialComments ? initialComments.length + ' Komentar' : '0 Komentar'}
          </span>
        </div>

        <!-- FORM TAMBAH KOMENTAR UTAMA -->
        <form id="main-comment-form" onsubmit="submitMainComment(event)" class="space-y-3 bg-[#0d121f] p-4 rounded-xl border border-gray-800/80">
          <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div class="w-full sm:w-1/2">
              <label class="text-[11px] font-medium text-gray-300 block mb-1">Nama Tampilan</label>
              <input type="text" id="comment-name" placeholder="Nama kamu (misal: Dhif)" maxlength="50"
                class="w-full bg-[#131927] border border-gray-700/80 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00e599] transition disabled:opacity-50 disabled:bg-gray-800/50">
            </div>
            <div class="flex items-center space-x-2 pt-1 sm:pt-4">
              <label class="relative inline-flex items-center cursor-pointer select-none">
                <input type="checkbox" id="toggle-anon" onchange="toggleAnonymous('comment-name', this.checked)" class="sr-only peer">
                <div class="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00e599]"></div>
                <span class="ml-2 text-xs font-medium text-gray-300">Kirim sebagai Anonim</span>
              </label>
            </div>
          </div>

          <div>
            <label class="text-[11px] font-medium text-gray-300 block mb-1">Pesan Komentar</label>
            <textarea id="comment-content" rows="3" placeholder="Tulis komentar atau tanggapan kamu di sini..." required maxlength="1000"
              class="w-full bg-[#131927] border border-gray-700/80 rounded-lg p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00e599] transition resize-y"></textarea>
          </div>

          <div class="flex justify-end">
            <button type="submit" id="btn-submit-comment"
              class="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#00e599] hover:bg-[#1affaa] text-gray-950 font-bold text-xs transition shadow-sm shadow-[#00e599]/20 disabled:opacity-50">
              <i class="fa-solid fa-paper-plane text-[11px]"></i>
              <span>Kirim Komentar</span>
            </button>
          </div>
        </form>

        <!-- LIST KOMENTAR THREADED -->
        <div id="comments-list" class="space-y-3.5 pt-1">
          ${
            initialComments
              ? initialComments.length === 0
                ? '<div class="text-center py-8 text-gray-500 text-xs bg-[#0d121f] rounded-xl border border-gray-800/80">' +
                    '<i class="fa-regular fa-comment-dots text-2xl block mb-2 text-gray-600"></i>' +
                    'Belum ada komentar. Jadilah yang pertama berkomentar!' +
                  '</div>'
                : initialComments.map(renderCommentNodeServerSide).join('')
              : '<div class="text-center py-8 text-gray-500 text-xs">' +
                  '<i class="fa-solid fa-spinner fa-spin mr-1.5 text-[#00e599]"></i>Memuat diskusi...' +
                '</div>'
          }
        </div>
      </section>

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
        <span class="text-gray-300 font-semibold">Alight Motion Pro API</span>
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

    
    // --- Comments System ---
    async function loadComments() {
      try {
        var res = await fetch('/api/comments');
        var json = await res.json();
        var listEl = document.getElementById('comments-list');
        var badgeEl = document.getElementById('comment-count-badge');

        if (!res.ok || !json.success || !Array.isArray(json.comments)) {
          if (listEl && listEl.innerText.includes('Memuat diskusi')) {
            listEl.innerHTML =
              '<div class="text-center py-8 text-gray-500 text-xs bg-[#0d121f] rounded-xl border border-gray-800/80">' +
                '<i class="fa-regular fa-comment-dots text-2xl block mb-2 text-gray-600"></i>' +
                'Belum ada komentar. Jadilah yang pertama berkomentar!' +
              '</div>';
          }
          return;
        }

        if (badgeEl) badgeEl.innerText = (json.totalComments || 0) + ' Komentar';
        if (json.comments.length === 0) {
          listEl.innerHTML =
            '<div class="text-center py-8 text-gray-500 text-xs bg-[#0d121f] rounded-xl border border-gray-800/80">' +
              '<i class="fa-regular fa-comment-dots text-2xl block mb-2 text-gray-600"></i>' +
              'Belum ada komentar. Jadilah yang pertama berkomentar!' +
            '</div>';
          return;
        }

        listEl.innerHTML = json.comments.map(function(c) { return renderCommentHtml(c); }).join('');
      } catch (err) {
        var listEl = document.getElementById('comments-list');
        if (listEl) {
          listEl.innerHTML =
            '<div class="text-center py-4 text-red-400 text-xs">' +
              'Gagal memuat diskusi. Silakan refresh halaman.' +
            '</div>';
        }
      }
    }

    function renderCommentHtml(comment) {
      var anonBadge = comment.isAnonymous
        ? '<span class="text-[9px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 font-normal border border-gray-700/60 ml-1.5">Anonim</span>'
        : '';

      var repliesHtml = (comment.replies && comment.replies.length > 0)
        ? '<div class="mt-3 pl-3 sm:pl-4 space-y-3 border-l-2 border-gray-800/90">' +
            comment.replies.map(function(r) { return renderCommentHtml(r); }).join('') +
          '</div>'
        : '';

      return (
        '<div id="comment-' + comment.id + '" class="bg-[#0d121f] p-3.5 sm:p-4 rounded-xl border border-gray-800/80 transition hover:border-gray-700">' +
          '<div class="flex items-start space-x-3">' +
            '<img src="' + escapeHtml(comment.avatarUrl) + '" alt="Avatar" class="w-8 h-8 rounded-full border border-gray-700/60 object-cover shrink-0 mt-0.5">' +
            '<div class="flex-1 min-w-0">' +
              '<div class="flex items-center justify-between gap-2 flex-wrap">' +
                '<div class="flex items-center">' +
                  '<span class="font-bold text-xs sm:text-sm text-white truncate">' + escapeHtml(comment.name) + '</span>' +
                  anonBadge +
                '</div>' +
                '<span class="text-[10px] text-gray-500 font-medium">' + escapeHtml(comment.formattedTime || '') + '</span>' +
              '</div>' +
              '<p class="text-xs text-gray-300 mt-1.5 leading-relaxed break-words whitespace-pre-line">' + escapeHtml(comment.content) + '</p>' +
              '<div class="mt-2.5 flex items-center space-x-3">' +
                '<button type="button" onclick="toggleReplyForm(\'' + comment.id + '\')" class="text-[11px] font-semibold text-[#00e599] hover:text-[#1affaa] transition inline-flex items-center space-x-1">' +
                  '<i class="fa-solid fa-reply text-[10px]"></i>' +
                  '<span>Balas</span>' +
                '</button>' +
              '</div>' +
              '<div id="reply-box-' + comment.id + '" class="hidden mt-3 pt-3 border-t border-gray-800/80 space-y-2.5">' +
                '<div class="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">' +
                  '<input type="text" id="reply-name-' + comment.id + '" placeholder="Nama kamu..." maxlength="50" class="w-full sm:w-1/2 bg-[#131927] border border-gray-700/80 rounded-lg px-2.5 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00e599] transition">' +
                  '<label class="flex items-center space-x-1.5 cursor-pointer select-none">' +
                    '<input type="checkbox" id="reply-anon-' + comment.id + '" onchange="toggleAnonymous(\'' + 'reply-name-' + comment.id + '\', this.checked)" class="rounded bg-gray-800 border-gray-700 text-[#00e599] focus:ring-0">' +
                    '<span class="text-[11px] text-gray-400">Anonim</span>' +
                  '</label>' +
                '</div>' +
                '<textarea id="reply-content-' + comment.id + '" rows="2" placeholder="Tulis balasan kamu..." maxlength="1000" class="w-full bg-[#131927] border border-gray-700/80 rounded-lg p-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00e599] transition resize-y"></textarea>' +
                '<div class="flex items-center justify-end space-x-2">' +
                  '<button type="button" onclick="toggleReplyForm(\'' + comment.id + '\')" class="px-3 py-1 rounded-lg text-xs text-gray-400 hover:text-white transition">Batal</button>' +
                  '<button type="button" onclick="submitReply(\'' + comment.id + '\')" class="px-3.5 py-1 rounded-lg bg-[#00e599] hover:bg-[#1affaa] text-gray-950 font-bold text-xs transition">Kirim Balasan</button>' +
                '</div>' +
              '</div>' +
              repliesHtml +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function toggleAnonymous(inputId, isChecked) {
      var input = document.getElementById(inputId);
      if (!input) return;
      if (isChecked) {
        input.disabled = true;
        input.value = '';
        input.placeholder = 'Anonim';
      } else {
        input.disabled = false;
        input.placeholder = 'Nama kamu...';
      }
    }

    function toggleReplyForm(commentId) {
      var box = document.getElementById('reply-box-' + commentId);
      if (box) {
        box.classList.toggle('hidden');
        if (!box.classList.contains('hidden')) {
          var textarea = document.getElementById('reply-content-' + commentId);
          if (textarea) textarea.focus();
        }
      }
    }

    async function submitMainComment(e) {
      e.preventDefault();
      var nameInput = document.getElementById('comment-name');
      var anonToggle = document.getElementById('toggle-anon');
      var contentInput = document.getElementById('comment-content');
      var btn = document.getElementById('btn-submit-comment');

      var isAnonymous = Boolean(anonToggle && anonToggle.checked);
      var name = isAnonymous ? 'Anonim' : (nameInput ? nameInput.value : '').trim();
      var content = (contentInput ? contentInput.value : '').trim();

      if (!content) {
        showToast('Komentar tidak boleh kosong!');
        return;
      }

      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-xs"></i><span>Mengirim...</span>';

      try {
        var res = await fetch('/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name, isAnonymous: isAnonymous, content: content }),
        });
        var json = await res.json();
        if (json.success) {
          contentInput.value = '';
          showToast('Komentar berhasil dipublikasikan!');
          await loadComments();
        } else {
          showToast(json.message || 'Gagal mengirim komentar.');
        }
      } catch (err) {
        showToast('Gagal terhubung ke server.');
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane text-[11px]"></i><span>Kirim Komentar</span>';
      }
    }

    async function submitReply(parentId) {
      var nameInput = document.getElementById('reply-name-' + parentId);
      var anonCheck = document.getElementById('reply-anon-' + parentId);
      var contentInput = document.getElementById('reply-content-' + parentId);

      var isAnonymous = Boolean(anonCheck && anonCheck.checked);
      var name = isAnonymous ? 'Anonim' : (nameInput ? nameInput.value : '').trim();
      var content = (contentInput ? contentInput.value : '').trim();

      if (!content) {
        showToast('Balasan tidak boleh kosong!');
        return;
      }

      try {
        var res = await fetch('/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parentId: parentId, name: name, isAnonymous: isAnonymous, content: content }),
        });
        var json = await res.json();
        if (json.success) {
          if (contentInput) contentInput.value = '';
          toggleReplyForm(parentId);
          showToast('Balasan berhasil dikirim!');
          await loadComments();
        } else {
          showToast(json.message || 'Gagal mengirim balasan.');
        }
      } catch (err) {
        showToast('Gagal terhubung ke server.');
      }
    }

    window.addEventListener('DOMContentLoaded', () => {
      loadComments();
      loadStats();
      setInterval(loadStats, 10000); // Polling otomatis tiap 10 detik agar realtime
    });
  </script>
</body>
</html>`;
}
