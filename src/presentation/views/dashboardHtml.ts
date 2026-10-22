import { LOGO_DATA_URI } from "./logoAsset.js";
import { CommentNode } from "../../domain/entities/Comment.js";

function renderTikTokCommentServerSide(comment: CommentNode): string {
  const anonBadge = comment.isAnonymous
    ? '<span class="text-[9px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 font-normal border border-gray-700/60 ml-1.5">Anonim</span>'
    : "";

  const replyTarget = comment.replyToName
    ? '<span class="text-gray-400 mx-1 text-xs font-normal">&gt;</span><span class="text-[#00e599] font-semibold text-xs">' +
      comment.replyToName
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;") +
      "</span>"
    : "";

  const repliesHtml =
    comment.replies && comment.replies.length > 0
      ? '<div class="mt-3 pl-3 sm:pl-4 space-y-3 border-l border-gray-800/80">' +
        comment.replies.map(renderTikTokCommentServerSide).join("") +
        "</div>"
      : "";

  const safeName = (comment.name || "Anonim")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const safeContent = (comment.content || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const avatarUrl =
    comment.avatarUrl ||
    "https://ui-avatars.com/api/?name=Anonim&background=1f2b42&color=94a3b8&bold=true";

  return `
    <div id="comment-${comment.id}" class="flex items-start space-x-3 text-xs">
      <img src="${avatarUrl}" alt="Avatar" class="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-700/80 object-cover shrink-0 mt-0.5">
      <div class="flex-1 min-w-0">
        <div class="flex items-center flex-wrap">
          <span class="font-semibold text-gray-400 text-xs">${safeName}</span>
          ${replyTarget}
          ${anonBadge}
        </div>
        <p class="text-xs sm:text-sm text-gray-100 font-normal mt-0.5 leading-relaxed break-words whitespace-pre-line">${safeContent}</p>
        <div class="flex items-center space-x-3 mt-1.5 text-[11px] text-gray-500">
          <span>${comment.formattedTime || "Baru saja"}</span>
          <button type="button" data-id="${comment.id}" data-name="${safeName}" onclick="handleReplyClick(this)" class="font-bold text-gray-400 hover:text-white transition">Balas</button>
        </div>
        ${repliesHtml}
      </div>
    </div>
  `;
}

export function renderDashboardHtml(
  initialStats?: { total: number; today: number },
  initialComments?: CommentNode[],
  initialPagination?: { page: number; totalPages: number; totalComments: number },
): string {
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
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body class="min-h-screen flex flex-col antialiased selection:bg-[#00e599] selection:text-gray-950">

  <!-- TOP NAVBAR (MINIMALIST & MOBILE-OPTIMIZED) -->
  <header class="sticky top-0 z-30 border-b border-gray-800/80 bg-[#0d121f]/90 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
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

  <!-- MAIN LAYOUT WRAPPER (DESKTOP 2-COLUMN / MOBILE SINGLE COLUMN) -->
  <div class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col lg:flex-row gap-6 items-start">

    <!-- MAIN DOCUMENTATION CONTAINER -->
    <main class="flex-1 min-w-0 w-full space-y-6 sm:space-y-8">

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
          <span id="stat-total" class="text-base sm:text-lg font-bold text-white mt-0.5 block">${initialStats ? initialStats.total + " Akun" : "0 Akun"}</span>
        </div>
        <div class="bg-[#0d121f] p-3 rounded-xl border border-gray-800/80">
          <span class="text-[11px] text-gray-400 block">Aktivasi Hari Ini</span>
          <span id="stat-today" class="text-base sm:text-lg font-bold text-[#00e599] mt-0.5 block">${initialStats ? initialStats.today + " Akun" : "0 Akun"}</span>
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

    <!-- MAIN NAVIGATION TABS (DOCS vs PLAYGROUND) -->
    <div class="flex items-center space-x-2 border-b border-gray-800 pb-3">
      <button type="button" id="main-tab-docs-btn" onclick="switchMainTab('docs')"
        class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 bg-[#00e599] text-gray-950 shadow-md shadow-[#00e599]/20">
        <i class="fa-solid fa-book-bookmark text-xs sm:text-sm"></i>
        <span>Docs</span>
      </button>
      <button type="button" id="main-tab-playground-btn" onclick="switchMainTab('playground')"
        class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 text-gray-400 hover:text-white hover:bg-gray-800/80">
        <i class="fa-solid fa-flask text-xs sm:text-sm"></i>
        <span>Playground</span>
      </button>
    </div>

    <!-- MAIN TAB 1: DOCS CONTAINER -->
    <div id="main-tab-content-docs" class="space-y-6 sm:space-y-8">
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
      </div>
      <!-- END OF ENDPOINTS SECTION -->
    </div>
    <!-- END OF TAB 1: DOCS CONTAINER -->

    <!-- MAIN TAB 2: PLAYGROUND CONTAINER (3 CARDS) -->
    <div id="main-tab-content-playground" class="hidden space-y-6">
      <div class="p-4 rounded-xl bg-[#00e599]/10 border border-[#00e599]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-300">
        <div class="flex items-center space-x-2.5">
          <i class="fa-solid fa-flask text-base text-[#00e599] shrink-0"></i>
          <div>
            <span class="font-bold text-white block">API Playground Tester</span>
            <span class="text-gray-400 text-[11px]">Uji coba langsung endpoint pengiriman link dan verifikasi lisensi Pro Alight Motion.</span>
          </div>
        </div>
      </div>

      <!-- 2 Cards Layout: Card 1 (Kirim Link) & Card 2 (Verify Link) -->
      <div class="space-y-6">

        <!-- CARD 1: KIRIM MAGIC LINK -->
        <section class="doc-card p-5 sm:p-6 space-y-4 border-[#00e599]/30 flex flex-col justify-between">
          <div class="space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-gray-800">
              <div class="flex items-center space-x-2.5">
                <div class="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center text-sm">
                  <i class="fa-regular fa-paper-plane"></i>
                </div>
                <div>
                  <h3 class="text-sm sm:text-base font-bold text-white">1. Kirim Magic Link</h3>
                  <div class="flex items-center space-x-2 mt-0.5">
                    <span class="badge-method bg-blue-500/20 text-blue-400 border border-blue-500/30">POST</span>
                    <code class="text-[11px] text-gray-400">/api/am/send-link</code>
                  </div>
                </div>
              </div>
            </div>

            <p class="text-xs text-gray-400 leading-relaxed">
              Kirim tautan login/aktivasi Alight Motion ke alamat email target pengguna.
            </p>

            <form onsubmit="runPlaygroundSendLink(event)" class="space-y-3">
              <div>
                <label class="block text-xs font-semibold text-gray-300 mb-1.5">
                  Target Email <span class="text-[#00e599]">*</span>
                </label>
                <div class="flex items-center bg-[#0d121f] rounded-xl px-3.5 py-2.5 border border-gray-700/80 focus-within:border-[#00e599] transition">
                  <i class="fa-regular fa-envelope text-gray-500 mr-2.5 text-xs"></i>
                  <input type="email" id="pg-sendlink-email" required placeholder="user@gmail.com"
                    class="bg-transparent border-0 p-0 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none w-full">
                </div>
              </div>

              <div class="flex items-center justify-between gap-2 pt-1 flex-wrap">
                <div class="flex items-center space-x-2">
                  <button type="submit" id="pg-sendlink-submit"
                    class="px-3.5 py-2 rounded-xl bg-[#00e599] hover:bg-[#1affaa] text-gray-950 text-xs font-bold transition flex items-center space-x-2 shadow-lg shadow-[#00e599]/20 active:scale-95 disabled:opacity-50">
                    <i class="fa-solid fa-paper-plane"></i>
                    <span>Kirim Request</span>
                  </button>
                  <button type="button" onclick="fillSampleSendLink()"
                    class="px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition active:scale-95">
                    Contoh
                  </button>
                </div>
                <button type="button" onclick="resetPlaygroundSendLink()" class="text-xs text-gray-500 hover:text-white transition">
                  Reset
                </button>
              </div>
            </form>
          </div>

          <!-- Response Viewer -->
          <div id="pg-sendlink-result" class="hidden space-y-2 pt-3 border-t border-gray-800/80 mt-2">
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center space-x-2">
                <span class="text-gray-400">Response Status:</span>
                <span id="pg-sendlink-status" class="px-2 py-0.5 rounded font-mono font-bold text-[11px]">200 OK</span>
              </div>
              <span id="pg-sendlink-time" class="text-gray-500 font-mono text-[11px]">0 ms</span>
            </div>
            <pre class="bg-[#0d121f] p-3 sm:p-4 rounded-xl text-xs overflow-x-auto border border-gray-800 font-mono text-gray-300 max-h-56"><code id="pg-sendlink-output">{}</code></pre>
          </div>
        </section>

        <!-- CARD 2: VERIFIKASI & AKTIVASI PRO -->
        <section class="doc-card p-5 sm:p-6 space-y-4 border-[#00e599]/30 flex flex-col justify-between">
          <div class="space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-gray-800">
              <div class="flex items-center space-x-2.5">
                <div class="w-8 h-8 rounded-lg bg-emerald-500/15 text-[#00e599] flex items-center justify-center text-sm">
                  <i class="fa-solid fa-shield-halved"></i>
                </div>
                <div>
                  <h3 class="text-sm sm:text-base font-bold text-white">2. Verifikasi &amp; Aktivasi Pro</h3>
                  <div class="flex items-center space-x-2 mt-0.5">
                    <span class="badge-method bg-emerald-500/20 text-[#00e599] border border-emerald-500/30">POST</span>
                    <code class="text-[11px] text-gray-400">/api/am/verify</code>
                  </div>
                </div>
              </div>
            </div>

            <p class="text-xs text-gray-400 leading-relaxed">
              Verifikasi link email dan otomatis aktivasi langganan Alight Motion Pro 1 Tahun.
            </p>

            <form onsubmit="runPlaygroundVerify(event)" class="space-y-3">
              <div>
                <label class="block text-xs font-semibold text-gray-300 mb-1.5">
                  Target Email <span class="text-[#00e599]">*</span>
                </label>
                <div class="flex items-center bg-[#0d121f] rounded-xl px-3.5 py-2.5 border border-gray-700/80 focus-within:border-[#00e599] transition">
                  <i class="fa-regular fa-envelope text-gray-500 mr-2.5 text-xs"></i>
                  <input type="email" id="pg-verify-email" required placeholder="user@gmail.com"
                    class="bg-transparent border-0 p-0 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none w-full">
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-300 mb-1.5">
                  Magic Link / OOB Code dari Email <span class="text-[#00e599]">*</span>
                </label>
                <div class="flex items-start bg-[#0d121f] rounded-xl px-3.5 py-2.5 border border-gray-700/80 focus-within:border-[#00e599] transition">
                  <i class="fa-solid fa-link text-gray-500 mr-2.5 mt-1 text-xs shrink-0"></i>
                  <textarea id="pg-verify-link" required rows="1" placeholder="https://alightcreative.com/?link=... atau oobCode"
                    oninput="handleLinkTextareaInput(this)"
                    class="bg-transparent border-0 p-0 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none w-full resize-none break-all whitespace-pre-wrap no-scrollbar leading-relaxed"
                    style="min-height: 24px; max-height: 140px;"></textarea>
                </div>
                <p class="text-[10px] text-gray-500 mt-1">Link panjang otomatis break-line &amp; auto-expand menyesuaikan isi teks.</p>
              </div>

              <div class="flex items-center justify-between gap-2 pt-1 flex-wrap">
                <div class="flex items-center space-x-2">
                  <button type="submit" id="pg-verify-submit"
                    class="px-3.5 py-2 rounded-xl bg-[#00e599] hover:bg-[#1affaa] text-gray-950 text-xs font-bold transition flex items-center space-x-2 shadow-lg shadow-[#00e599]/20 active:scale-95 disabled:opacity-50">
                    <i class="fa-solid fa-shield-halved"></i>
                    <span>Verifikasi</span>
                  </button>
                  <button type="button" onclick="fillSampleVerify()"
                    class="px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition active:scale-95">
                    Contoh
                  </button>
                </div>
                <button type="button" onclick="resetPlaygroundVerify()" class="text-xs text-gray-500 hover:text-white transition">
                  Reset
                </button>
              </div>
            </form>
          </div>

          <!-- Response Viewer -->
          <div id="pg-verify-result" class="hidden space-y-2 pt-3 border-t border-gray-800/80 mt-2">
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center space-x-2">
                <span class="text-gray-400">Response Status:</span>
                <span id="pg-verify-status" class="px-2 py-0.5 rounded font-mono font-bold text-[11px]">200 OK</span>
              </div>
              <span id="pg-verify-time" class="text-gray-500 font-mono text-[11px]">0 ms</span>
            </div>
            <pre class="bg-[#0d121f] p-3 sm:p-4 rounded-xl text-xs overflow-x-auto border border-gray-800 font-mono text-gray-300 max-h-56"><code id="pg-verify-output">{}</code></pre>
          </div>
        </section>

        <!-- CARD 3: TIKTOK AM PRESET FINDER -->
        <section class="doc-card p-5 sm:p-6 space-y-4 border-[#00e599]/30 flex flex-col justify-between">
          <div class="space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-gray-800">
              <div class="flex items-center space-x-2.5">
                <div class="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center text-sm">
                  <i class="fa-solid fa-wand-magic-sparkles"></i>
                </div>
                <div>
                  <h3 class="text-sm sm:text-base font-bold text-white">3. Cari Preset TikTok</h3>
                  <div class="flex items-center space-x-2 mt-0.5">
                    <span class="badge-method bg-purple-500/20 text-purple-400 border border-purple-500/30">POST</span>
                    <code class="text-[11px] text-gray-400">/api/am/preset/find</code>
                  </div>
                </div>
              </div>
            </div>

            <p class="text-xs text-gray-400 leading-relaxed">
              Pindai link preset Alight Motion otomatis dari caption &amp; komentar video TikTok.
            </p>

            <form onsubmit="runPlaygroundPreset(event)" class="space-y-3">
              <div>
                <label class="block text-xs font-semibold text-gray-300 mb-1.5">
                  URL Video TikTok <span class="text-[#00e599]">*</span>
                </label>
                <div class="flex items-start bg-[#0d121f] rounded-xl px-3.5 py-2.5 border border-gray-700/80 focus-within:border-[#00e599] transition">
                  <i class="fa-brands fa-tiktok text-gray-500 mr-2.5 mt-1 text-xs shrink-0"></i>
                  <textarea id="pg-preset-url" required rows="1" placeholder="https://vt.tiktok.com/ZSxxxxxxx/ atau link video TikTok"
                    oninput="handlePresetTextareaInput(this)"
                    class="bg-transparent border-0 p-0 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none w-full resize-none break-all whitespace-pre-wrap no-scrollbar leading-relaxed"
                    style="min-height: 24px; max-height: 140px;"></textarea>
                </div>
                <p class="text-[10px] text-gray-500 mt-1">Link TikTok otomatis break-line &amp; auto-expand.</p>
              </div>

              <div class="flex items-center justify-between gap-2 pt-1 flex-wrap">
                <div class="flex items-center space-x-2">
                  <button type="submit" id="pg-preset-submit"
                    class="px-3.5 py-2 rounded-xl bg-[#00e599] hover:bg-[#1affaa] text-gray-950 text-xs font-bold transition flex items-center space-x-2 shadow-lg shadow-[#00e599]/20 active:scale-95 disabled:opacity-50">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <span>Cari Preset</span>
                  </button>
                  <button type="button" onclick="fillSamplePreset()"
                    class="px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition active:scale-95">
                    Contoh
                  </button>
                </div>
                <button type="button" onclick="resetPlaygroundPreset()" class="text-xs text-gray-500 hover:text-white transition">
                  Reset
                </button>
              </div>
            </form>
          </div>

          <!-- Response Viewer -->
          <div id="pg-preset-result" class="hidden space-y-2 pt-3 border-t border-gray-800/80 mt-2">
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center space-x-2">
                <span class="text-gray-400">Response Status:</span>
                <span id="pg-preset-status" class="px-2 py-0.5 rounded font-mono font-bold text-[11px]">200 OK</span>
              </div>
              <span id="pg-preset-time" class="text-gray-500 font-mono text-[11px]">0 ms</span>
            </div>
            <pre class="bg-[#0d121f] p-3 sm:p-4 rounded-xl text-xs overflow-x-auto border border-gray-800 font-mono text-gray-300 max-h-56"><code id="pg-preset-output">{}</code></pre>
          </div>
        </section>

      </div>
    </div>
    <!-- END OF TAB 2: PLAYGROUND CONTAINER -->

      <!-- PANDUAN BANTUAN & PANDUAN PENGGUNAAN (HELP CENTER DI WEB UI) -->
      <section class="doc-card p-5 sm:p-6 space-y-5" id="help-center">
        <div class="flex items-center space-x-2.5 pb-3 border-b border-gray-800">
          <div class="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center text-sm">
            <i class="fa-solid fa-circle-question"></i>
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-bold text-white">Panduan Bantuan &amp; FAQ</h2>
            <p class="text-xs text-gray-400">Petunjuk aktivasi, panduan bot, dan solusi kendala umum.</p>
          </div>
        </div>

        <!-- FAQ Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div class="bg-[#0d121f] p-4 rounded-xl border border-gray-800 space-y-2">
            <span class="font-bold text-[#00e599] flex items-center">
              <i class="fa-solid fa-envelope-circle-check mr-2"></i>Email tidak masuk?
            </span>
            <p class="text-gray-300 leading-relaxed">
              Pastikan alamat email sudah terdaftar di Alight Motion. Periksa folder <strong>Spam</strong>, <strong>Junk</strong>, atau tab <strong>Promosi</strong> di Gmail. Tunggu 1&ndash;2 menit.
            </p>
          </div>

          <div class="bg-[#0d121f] p-4 rounded-xl border border-gray-800 space-y-2">
            <span class="font-bold text-[#00e599] flex items-center">
              <i class="fa-solid fa-clock-rotate-left mr-2"></i>Link Kadaluarsa (Expired)?
            </span>
            <p class="text-gray-300 leading-relaxed">
              Magic link dari Firebase hanya berlaku 15 menit. Jika kadaluarsa, cukup kirim ulang perintah <code class="text-[#00e599]">!amprem</code> atau submit ulang email di form.
            </p>
          </div>

          <div class="bg-[#0d121f] p-4 rounded-xl border border-gray-800 space-y-2">
            <span class="font-bold text-[#00e599] flex items-center">
              <i class="fa-solid fa-star mr-2"></i>Fitur Pro yang Didapat?
            </span>
            <p class="text-gray-300 leading-relaxed">
              Lisensi Alight Motion Pro VIP 1 Tahun resmi aktif: bebas watermark saat export video, akses penuh semua efek premium, import preset XML &amp; font tanpa batas.
            </p>
          </div>

          <div class="bg-[#0d121f] p-4 rounded-xl border border-gray-800 space-y-2">
            <span class="font-bold text-[#00e599] flex items-center">
              <i class="fa-solid fa-robot mr-2"></i>Daftar Perintah Bot WhatsApp
            </span>
            <p class="text-gray-300 leading-relaxed">
              Gunakan <code class="text-[#00e599]">!amprem &lt;email&gt;</code> untuk kirim link, <code class="text-[#00e599]">!ampreset &lt;url&gt;</code> untuk cari preset VT, dan balas link untuk aktivasi.
            </p>
          </div>
        </div>

        <div class="p-3.5 rounded-xl bg-[#00e599]/10 border border-[#00e599]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div class="flex items-center space-x-2.5">
            <i class="fa-brands fa-whatsapp text-xl text-[#00e599]"></i>
            <div>
              <span class="font-bold text-white block">Butuh Bantuan Lebih Lanjut?</span>
              <span class="text-gray-400 text-[11px]">Hubungi WhatsApp kami di +44 7762 422507 atau TikTok @justdhifbieber</span>
            </div>
          </div>
          <a href="https://wa.me/447762422507" target="_blank" rel="noopener noreferrer"
            class="px-3.5 py-1.5 rounded-lg bg-[#00e599] text-gray-950 font-bold text-xs hover:bg-[#1affaa] transition shrink-0 text-center">
            Chat WhatsApp
          </a>
        </div>
      </section>
    </main>

    <!-- TIKTOK-STYLE COMMENT CONTAINER (DESKTOP SIDEBAR / MOBILE BOTTOM SHEET) -->
  <div id="comment-sheet" class="fixed bottom-0 left-0 right-0 z-[100] max-w-lg mx-auto w-full h-[85vh] max-h-[760px] bg-[#0d121f] text-white rounded-t-3xl border-t border-x border-gray-800/80 shadow-2xl flex flex-col transform translate-y-full transition-transform duration-300 ease-out lg:static lg:transform-none lg:translate-y-0 lg:z-auto lg:max-w-none lg:w-[380px] xl:w-[420px] lg:h-[calc(100vh-6.5rem)] lg:max-h-[850px] lg:rounded-2xl lg:border lg:border-gray-800/80 lg:shadow-xl lg:sticky lg:top-20 lg:shrink-0">
    
    <!-- Header Sheet (Handle & Counter ala TikTok) -->
    <div class="px-4 pt-2.5 pb-2 border-b border-gray-800/80 shrink-0 select-none">
      <div class="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-2 cursor-pointer lg:hidden" onclick="closeCommentSheet()"></div>
      <div class="relative flex items-center justify-center lg:justify-between">
        <h3 class="font-bold text-sm sm:text-base text-white flex items-center">
          <span id="sheet-title-count">${initialComments ? initialComments.length : "0"}</span>&nbsp;komentar
          </h3>
        <button type="button" onclick="closeCommentSheet()" class="lg:hidden absolute right-0 p-1 text-gray-400 hover:text-white transition">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>
    </div>

    <!-- Scrollable Comments Feed -->
    <div id="comments-sheet-list" class="flex-1 overflow-y-auto px-4 py-3 space-y-4 overscroll-contain">
      ${
        initialComments
          ? initialComments.length === 0
            ? '<div class="text-center py-16 text-gray-500 text-xs">' +
              '<i class="fa-regular fa-comment-dots text-3xl block mb-2 text-gray-600"></i>' +
              "Belum ada komentar. Jadilah yang pertama berkomentar!" +
              "</div>"
            : initialComments.map(renderTikTokCommentServerSide).join("")
          : '<div class="flex flex-col items-center justify-center py-20 text-gray-400 space-y-3 select-none animate-in fade-in duration-150">' +
              '<div class="relative w-11 h-11 flex items-center justify-center">' +
                '<div class="absolute inset-0 rounded-full bg-[#00e599]/20 blur-md animate-pulse"></div>' +
                '<img src="/logo.svg" alt="Loading" class="w-10 h-10 animate-spin relative z-10 drop-shadow-[0_0_12px_rgba(0,229,153,0.5)]">' +
              '</div>' +
              '<span class="text-xs text-gray-400 font-medium tracking-wide">Memuat komentar...</span>' +
            '</div>'
      }
    </div>

    <!-- Pagination Controls (5 Root Comments per Page) -->
    <div id="comment-pagination-bar" class="px-3.5 py-2 border-t border-gray-800/80 bg-[#0d121f] flex items-center justify-between text-xs text-gray-400 select-none shrink-0">
      <button type="button" id="btn-comment-prev" onclick="goToCommentPage(-1)" disabled
        class="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:pointer-events-none text-gray-300 text-[11px] font-semibold transition flex items-center space-x-1">
        <i class="fa-solid fa-chevron-left text-[10px]"></i>
        <span>Sebelumnya</span>
      </button>
      <span id="comment-page-indicator" class="font-medium text-gray-400 text-[11px]">${initialPagination ? 'Hal ' + initialPagination.page + ' dari ' + initialPagination.totalPages : 'Hal 1 dari 1'}</span>
      <button type="button" id="btn-comment-next" onclick="goToCommentPage(1)" ${initialPagination && initialPagination.totalPages > 1 ? '' : 'disabled'}
        class="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:pointer-events-none text-gray-300 text-[11px] font-semibold transition flex items-center space-x-1">
        <span>Selanjutnya</span>
        <i class="fa-solid fa-chevron-right text-[10px]"></i>
      </button>
    </div>

    <!-- Bottom Input Area (TikTok Style) -->
    <div class="border-t border-gray-800/80 bg-[#0d121f] p-3 shrink-0 relative">

      <!-- FULL EMOJI KEYBOARD POPUP -->
      <div id="emoji-picker-container" class="hidden absolute bottom-full left-3 right-3 mb-2 bg-[#131927] border border-gray-700/80 rounded-2xl shadow-2xl p-3 z-50 flex flex-col max-h-80 select-none animate-in fade-in duration-150">
        <!-- Search bar, Backspace & Close -->
        <div class="flex items-center space-x-2 pb-2 mb-2 border-b border-gray-800/80">
          <div class="flex-1 flex items-center bg-[#1a2234] rounded-lg px-2.5 py-1 text-xs text-gray-300">
            <i class="fa-solid fa-magnifying-glass text-gray-500 mr-2 text-[11px]"></i>
            <input type="text" id="emoji-search-input" oninput="filterEmojis(this.value)" placeholder="Cari emoji..." class="bg-transparent border-0 p-0 text-xs text-white placeholder-gray-500 focus:outline-none w-full">
          </div>
          <button type="button" onclick="handleEmojiBackspace(event)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-red-400 text-xs transition active:scale-90 shrink-0" title="Hapus (Backspace)">
            <i class="fa-solid fa-delete-left text-xs"></i>
          </button>
          <button type="button" onclick="closeEmojiPicker(event)" class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white text-xs transition active:scale-90 shrink-0" title="Tutup">
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <!-- Emoji Keyboard Category Tabs (9 Standard Categories) -->
        <div id="emoji-category-tabs" class="flex items-center justify-between px-1 py-1 overflow-x-auto no-scrollbar text-lg border-b border-gray-800/80 mb-2 gap-1 bg-[#0d121f]/60 rounded-xl shrink-0"></div>

        <!-- Emoji Grid List (Scrollable) -->
        <div id="emoji-grid-list" class="flex-1 overflow-y-auto max-h-52 grid grid-cols-8 sm:grid-cols-9 gap-1 text-2xl py-1 pr-1 overscroll-contain no-scrollbar"></div>
      </div>
      
      <!-- Banner Reply Indicator (aktif jika sedang membalas) -->
      <div id="sheet-reply-banner" class="hidden flex items-center justify-between pb-2 text-xs text-gray-400">
        <div class="flex items-center space-x-1.5">
          <i class="fa-solid fa-reply text-[10px] text-[#00e599]"></i>
          <span>Membalas <strong id="sheet-reply-target" class="text-[#00e599]">@User</strong></span>
        </div>
        <button type="button" onclick="cancelReplyMode()" class="text-gray-500 hover:text-white text-xs">
          <i class="fa-solid fa-xmark mr-1"></i>Batal
        </button>
      </div>



      <!-- Header Input: Nama & Toggle Anonim (TANPA BOX INPUT - Borderless & Flat) -->
      <div class="flex items-center justify-between gap-3 pb-2 text-xs border-b border-gray-800/60 mb-2.5">
        <div class="flex items-center space-x-2 flex-1 min-w-0">
          <img id="sheet-user-avatar" src="https://ui-avatars.com/api/?name=User&background=00e599&color=0d121f&bold=true" alt="Avatar" class="w-6 h-6 rounded-full border border-gray-700/80 object-cover shrink-0">
          <input type="text" id="sheet-author-name" oninput="updateSheetAvatar()" placeholder="Nama kamu..." maxlength="50"
            class="bg-transparent border-0 p-0 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-0 w-full disabled:opacity-40">
        </div>
        <label class="flex items-center space-x-1.5 cursor-pointer select-none shrink-0">
          <input type="checkbox" id="sheet-toggle-anon" onchange="toggleSheetAnonymous(this.checked)" class="rounded bg-gray-800 border-gray-700 text-[#00e599] focus:ring-0 w-3.5 h-3.5">
          <span class="text-[11px] text-gray-400">Anonim</span>
        </label>
      </div>

      <!-- Main Input Bar (TikTok Rounded Pill Style with Auto Break Line) -->
      <form id="sheet-comment-form" onsubmit="submitSheetComment(event)" class="flex items-end space-x-2">
        <div class="flex-1 bg-[#1a2234] rounded-2xl px-4 py-2 flex items-center border border-transparent focus-within:border-[#00e599]/60 transition min-h-[38px]">
          <textarea id="sheet-comment-input" rows="1" placeholder="Tambahkan komentar..." required maxlength="1000" oninput="handleCommentInput(this)" onkeydown="handleCommentKeyDown(event)"
            class="bg-transparent border-0 p-0 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-0 w-full resize-none leading-relaxed max-h-28 overflow-y-auto block no-scrollbar"></textarea>
        </div>

        <button type="button" id="sheet-btn-emoji" onclick="toggleEmojiPicker(event)"
          class="w-9 h-9 rounded-full bg-[#1a2234] hover:bg-gray-800 text-gray-400 hover:text-[#00e599] flex items-center justify-center transition shadow-md shrink-0 active:scale-95 mb-0.5 border border-transparent hover:border-gray-700"
          title="Pilih emoji">
          <i class="fa-regular fa-face-smile text-lg"></i>
        </button>

        <button type="submit" id="sheet-btn-send"
          class="w-9 h-9 rounded-full bg-[#00e599] hover:bg-[#1affaa] text-gray-950 font-bold flex items-center justify-center transition shadow-md shrink-0 active:scale-95 disabled:opacity-40 mb-0.5">
          <i class="fa-solid fa-arrow-up text-sm"></i>
        </button>
      </form>

    </div>

  </div>
  </div>



<!-- TOAST NOTIFICATION -->
  <div id="toast" class="fixed bottom-5 right-5 z-50 flex items-center space-x-2.5 px-4 py-2.5 rounded-xl bg-[#131927] text-white border border-[#00e599]/40 shadow-xl transition-all duration-300 transform translate-y-20 opacity-0 text-xs">
    <i class="fa-solid fa-circle-check text-[#00e599]"></i>
    <span id="toast-msg">Tersalin ke clipboard!</span>
  </div>

  <!-- MINIMALIST FOOTER -->
  <footer class="border-t border-gray-800/80 py-6 mt-8 text-center text-xs text-gray-500 bg-[#0d121f]">
    <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
      <div class="flex items-center space-x-2">
        <img src="${LOGO_DATA_URI}" alt="Logo" class="w-5 h-5 rounded-md object-cover">
        <span class="text-gray-300 font-semibold">Alight Motion Pro API</span>
      </div>
      <p class="text-[11px] text-gray-500">Crafted with 💚 by <strong>Justdhif</strong> &copy; 2026. Clean Architecture.</p>
    </div>
  </footer>

<!-- TIKTOK-STYLE FLOATING COMMENT BUTTON (FAB - MOBILE ONLY) -->
  <button id="fab-open-comments" type="button" onclick="openCommentSheet()"
    class="lg:hidden fixed bottom-6 right-5 sm:right-8 z-40 flex items-center space-x-2 px-4 py-3 rounded-full bg-[#00e599] hover:bg-[#1affaa] text-gray-950 font-bold text-xs sm:text-sm shadow-xl shadow-[#00e599]/30 transition-all duration-300 transform hover:scale-105 active:scale-95 group">
    <i class="fa-solid fa-comment-dots text-base"></i>
    <span class="font-bold">Komentar</span>
    <span id="fab-count" class="px-2 py-0.5 rounded-full bg-gray-950/20 text-gray-950 text-xs font-black">
      ${initialComments ? initialComments.length : "0"}
    </span>
  </button>

  <!-- TIKTOK-STYLE COMMENT BOTTOM SHEET BACKDROP (MOBILE ONLY) -->
  <div id="comment-sheet-backdrop" class="lg:hidden fixed inset-0 w-full h-full bg-black/80 backdrop-blur-md z-[99] opacity-0 pointer-events-none transition-opacity duration-300" onclick="closeCommentSheet()"></div>

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

    // --- Main Tab Switching (Docs vs Playground) ---
    function switchMainTab(tab) {
      var docsBtn = document.getElementById('main-tab-docs-btn');
      var pgBtn = document.getElementById('main-tab-playground-btn');
      var docsContent = document.getElementById('main-tab-content-docs');
      var pgContent = document.getElementById('main-tab-content-playground');

      if (tab === 'docs') {
        if (docsBtn) docsBtn.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 bg-[#00e599] text-gray-950 shadow-md shadow-[#00e599]/20';
        if (pgBtn) pgBtn.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 text-gray-400 hover:text-white hover:bg-gray-800/80';
        if (docsContent) docsContent.classList.remove('hidden');
        if (pgContent) pgContent.classList.add('hidden');
      } else {
        if (docsBtn) docsBtn.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 text-gray-400 hover:text-white hover:bg-gray-800/80';
        if (pgBtn) pgBtn.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 bg-[#00e599] text-gray-950 shadow-md shadow-[#00e599]/20';
        if (docsContent) docsContent.classList.add('hidden');
        if (pgContent) pgContent.classList.remove('hidden');
      }
    }

    // Auto-expanding textarea for preset url input
    function handlePresetTextareaInput(el) {
      if (!el) return;
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 140) + 'px';
    }

    function fillSamplePreset() {
      var urlInput = document.getElementById('pg-preset-url');
      if (urlInput) {
        urlInput.value = 'https://vt.tiktok.com/ZSxxxxxxx/';
        handlePresetTextareaInput(urlInput);
      }
    }

    function resetPlaygroundPreset() {
      var urlInput = document.getElementById('pg-preset-url');
      var result = document.getElementById('pg-preset-result');
      if (urlInput) {
        urlInput.value = '';
        urlInput.style.height = 'auto';
      }
      if (result) result.classList.add('hidden');
    }

    async function runPlaygroundPreset(e) {
      e.preventDefault();
      var urlInput = document.getElementById('pg-preset-url');
      var submitBtn = document.getElementById('pg-preset-submit');
      var resultBox = document.getElementById('pg-preset-result');
      var statusBadge = document.getElementById('pg-preset-status');
      var timeEl = document.getElementById('pg-preset-time');
      var outputCode = document.getElementById('pg-preset-output');

      var url = urlInput ? urlInput.value.trim() : '';
      if (!url) return;

      submitBtn.disabled = true;
      var originalBtnHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1.5"></i><span>Memindai...</span>';

      var t0 = performance.now();
      try {
        var res = await fetch('/api/am/preset/find', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: url })
        });
        var t1 = performance.now();
        var json = await res.json();
        var elapsed = Math.round(t1 - t0);

        if (resultBox) resultBox.classList.remove('hidden');
        if (timeEl) timeEl.innerText = elapsed + ' ms';
        if (statusBadge) {
          statusBadge.innerText = res.status + ' ' + (res.ok ? 'OK' : 'Error');
          statusBadge.className = 'px-2 py-0.5 rounded font-mono font-bold text-[11px] ' +
            (res.ok ? 'bg-emerald-500/20 text-[#00e599] border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40');
        }
        if (outputCode) {
          outputCode.innerText = JSON.stringify(json, null, 2);
          outputCode.className = res.ok ? 'text-[#00e599]' : 'text-red-300';
        }
      } catch (err) {
        var elapsed = Math.round(performance.now() - t0);
        if (resultBox) resultBox.classList.remove('hidden');
        if (timeEl) timeEl.innerText = elapsed + ' ms';
        if (statusBadge) {
          statusBadge.innerText = 'Network Error';
          statusBadge.className = 'px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-red-500/20 text-red-400 border border-red-500/40';
        }
        if (outputCode) {
          outputCode.innerText = JSON.stringify({ success: false, message: 'Gagal terhubung ke server', error: String(err) }, null, 2);
          outputCode.className = 'text-red-300';
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }

    // Auto-expanding textarea for verify link input
    function handleLinkTextareaInput(el) {
      if (!el) return;
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 140) + 'px';
    }

    // --- Interactive API Playground Logic ---
    function switchPlaygroundTab(tab) {
      var sendBtn = document.getElementById('tab-btn-sendlink');
      var verifyBtn = document.getElementById('tab-btn-verify');
      var sendPanel = document.getElementById('playground-sendlink-panel');
      var verifyPanel = document.getElementById('playground-verify-panel');

      if (tab === 'sendlink') {
        if (sendBtn) sendBtn.className = 'px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 bg-[#00e599] text-gray-950 shadow-md shadow-[#00e599]/20';
        if (verifyBtn) verifyBtn.className = 'px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 text-gray-400 hover:text-white hover:bg-gray-800/80';
        if (sendPanel) sendPanel.classList.remove('hidden');
        if (verifyPanel) verifyPanel.classList.add('hidden');
      } else {
        if (sendBtn) sendBtn.className = 'px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 text-gray-400 hover:text-white hover:bg-gray-800/80';
        if (verifyBtn) verifyBtn.className = 'px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 bg-[#00e599] text-gray-950 shadow-md shadow-[#00e599]/20';
        if (sendPanel) sendPanel.classList.add('hidden');
        if (verifyPanel) verifyPanel.classList.remove('hidden');
      }
    }

    function fillSampleSendLink() {
      var input = document.getElementById('pg-sendlink-email');
      if (input) input.value = 'contoh.user@gmail.com';
    }

    function resetPlaygroundSendLink() {
      var input = document.getElementById('pg-sendlink-email');
      var result = document.getElementById('pg-sendlink-result');
      if (input) input.value = '';
      if (result) result.classList.add('hidden');
    }

    async function runPlaygroundSendLink(e) {
      e.preventDefault();
      var input = document.getElementById('pg-sendlink-email');
      var submitBtn = document.getElementById('pg-sendlink-submit');
      var resultBox = document.getElementById('pg-sendlink-result');
      var statusBadge = document.getElementById('pg-sendlink-status');
      var timeEl = document.getElementById('pg-sendlink-time');
      var outputCode = document.getElementById('pg-sendlink-output');

      var email = input ? input.value.trim() : '';
      if (!email) return;

      submitBtn.disabled = true;
      var originalBtnHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1.5"></i><span>Mengirim...</span>';

      var t0 = performance.now();
      try {
        var res = await fetch('/api/am/send-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email })
        });
        var t1 = performance.now();
        var json = await res.json();
        var elapsed = Math.round(t1 - t0);

        if (resultBox) resultBox.classList.remove('hidden');
        if (timeEl) timeEl.innerText = elapsed + ' ms';
        if (statusBadge) {
          statusBadge.innerText = res.status + ' ' + (res.ok ? 'OK' : 'Error');
          statusBadge.className = 'px-2 py-0.5 rounded font-mono font-bold text-[11px] ' +
            (res.ok ? 'bg-emerald-500/20 text-[#00e599] border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40');
        }
        if (outputCode) {
          outputCode.innerText = JSON.stringify(json, null, 2);
          outputCode.className = res.ok ? 'text-[#00e599]' : 'text-red-300';
        }
      } catch (err) {
        var elapsed = Math.round(performance.now() - t0);
        if (resultBox) resultBox.classList.remove('hidden');
        if (timeEl) timeEl.innerText = elapsed + ' ms';
        if (statusBadge) {
          statusBadge.innerText = 'Network Error';
          statusBadge.className = 'px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-red-500/20 text-red-400 border border-red-500/40';
        }
        if (outputCode) {
          outputCode.innerText = JSON.stringify({ success: false, message: 'Gagal terhubung ke server', error: String(err) }, null, 2);
          outputCode.className = 'text-red-300';
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }

    function fillSampleVerify() {
      var emailInput = document.getElementById('pg-verify-email');
      var linkInput = document.getElementById('pg-verify-link');
      if (emailInput) emailInput.value = 'contoh.user@gmail.com';
      if (linkInput) {
        linkInput.value = 'https://alightcreative.com/?link=https%3A%2F%2Falightcreative.com%2F%3FoobCode%3Dsample_code_12345%26mode%3DsignIn';
        handleLinkTextareaInput(linkInput);
      }
    }

    function resetPlaygroundVerify() {
      var emailInput = document.getElementById('pg-verify-email');
      var linkInput = document.getElementById('pg-verify-link');
      var result = document.getElementById('pg-verify-result');
      if (emailInput) emailInput.value = '';
      if (linkInput) {
        linkInput.value = '';
        linkInput.style.height = 'auto';
      }
      if (result) result.classList.add('hidden');
    }

    async function runPlaygroundVerify(e) {
      e.preventDefault();
      var emailInput = document.getElementById('pg-verify-email');
      var linkInput = document.getElementById('pg-verify-link');
      var submitBtn = document.getElementById('pg-verify-submit');
      var resultBox = document.getElementById('pg-verify-result');
      var statusBadge = document.getElementById('pg-verify-status');
      var timeEl = document.getElementById('pg-verify-time');
      var outputCode = document.getElementById('pg-verify-output');

      var email = emailInput ? emailInput.value.trim() : '';
      var link = linkInput ? linkInput.value.trim() : '';
      if (!email || !link) return;

      submitBtn.disabled = true;
      var originalBtnHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1.5"></i><span>Memverifikasi...</span>';

      var t0 = performance.now();
      try {
        var res = await fetch('/api/am/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, link: link })
        });
        var t1 = performance.now();
        var json = await res.json();
        var elapsed = Math.round(t1 - t0);

        if (resultBox) resultBox.classList.remove('hidden');
        if (timeEl) timeEl.innerText = elapsed + ' ms';
        if (statusBadge) {
          statusBadge.innerText = res.status + ' ' + (res.ok ? 'OK' : 'Error');
          statusBadge.className = 'px-2 py-0.5 rounded font-mono font-bold text-[11px] ' +
            (res.ok ? 'bg-emerald-500/20 text-[#00e599] border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40');
        }
        if (outputCode) {
          outputCode.innerText = JSON.stringify(json, null, 2);
          outputCode.className = res.ok ? 'text-[#00e599]' : 'text-red-300';
        }
      } catch (err) {
        var elapsed = Math.round(performance.now() - t0);
        if (resultBox) resultBox.classList.remove('hidden');
        if (timeEl) timeEl.innerText = elapsed + ' ms';
        if (statusBadge) {
          statusBadge.innerText = 'Network Error';
          statusBadge.className = 'px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-red-500/20 text-red-400 border border-red-500/40';
        }
        if (outputCode) {
          outputCode.innerText = JSON.stringify({ success: false, message: 'Gagal terhubung ke server', error: String(err) }, null, 2);
          outputCode.className = 'text-red-300';
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }

    
    
    // --- TikTok-Style Comment Sheet Logic ---
    var activeParentId = null;

    function openCommentSheet() {
      if (window.innerWidth >= 1024) return;
      var sheet = document.getElementById('comment-sheet');
      var backdrop = document.getElementById('comment-sheet-backdrop');
      if (sheet && backdrop) {
        backdrop.classList.remove('opacity-0', 'pointer-events-none');
        backdrop.classList.add('opacity-100');
        sheet.classList.remove('translate-y-full');
        sheet.classList.add('translate-y-0');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeCommentSheet() {
      if (window.innerWidth >= 1024) return;
      var sheet = document.getElementById('comment-sheet');
      var backdrop = document.getElementById('comment-sheet-backdrop');
      if (sheet && backdrop) {
        backdrop.classList.remove('opacity-100');
        backdrop.classList.add('opacity-0', 'pointer-events-none');
        sheet.classList.remove('translate-y-0');
        sheet.classList.add('translate-y-full');
        document.body.style.overflow = '';
        closeEmojiPicker();
        cancelReplyMode();
      }
    }

    function handleReplyClick(btn) {
      if (!btn) return;
      var parentId = btn.getAttribute('data-id');
      var targetName = btn.getAttribute('data-name');
      setReplyMode(parentId, targetName);
    }

    function setReplyMode(parentId, targetName) {
      activeParentId = parentId;
      var banner = document.getElementById('sheet-reply-banner');
      var targetEl = document.getElementById('sheet-reply-target');
      var inputEl = document.getElementById('sheet-comment-input');
      if (banner && targetEl) {
        targetEl.innerText = '@' + targetName;
        banner.classList.remove('hidden');
      }
      if (inputEl) {
        inputEl.placeholder = 'Balas @' + targetName + '...';
        inputEl.focus();
      }
    }

    function cancelReplyMode() {
      activeParentId = null;
      var banner = document.getElementById('sheet-reply-banner');
      var inputEl = document.getElementById('sheet-comment-input');
      if (banner) banner.classList.add('hidden');
      if (inputEl) inputEl.placeholder = 'Tambahkan komentar...'; inputEl.style.height = 'auto';
    }

    function handleCommentInput(el) {
      if (!el) return;
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 112) + 'px';
    }

    function handleCommentKeyDown(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        var form = document.getElementById('sheet-comment-form');
        if (form) form.requestSubmit();
      }
    }


    // --- Complete 9-Category Emoji Keyboard Logic ---
    var EMOJI_CATEGORIES = [
      {
        name: 'Wajah & Emosi',
        icon: '😀',
        emojis: [
          '😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','🫠','😉','😊','😇',
          '🥰','😍','🤩','😘','😗','😚','😙','😋','😛','😜','🤪','😝','🤑','🤗',
          '🤭','🫢','🫣','🤫','🤔','🫡','🤐','🤨','😐','😑','😶','🫥','😏','😒',
          '🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🤧',
          '🥵','🥶','🥴','😵','😵‍💫','🤯','🤠','🥳','🥸','😎','🤓','🧐','😕','🫤',
          '😟','🙁','☹️','😮','😯','😲','😳','🥺','🥹','😦','😧','😰','😥','😢',
          '😭','😱','😖','😣','😞','😓','😩','😫','🥱','😤','😡','😠','🤬','😈',
          '👿','💀','☠️','💩','🤡','👹','👺','👻','👽','👾','🤖'
        ]
      },
      {
        name: 'Orang & Tubuh',
        icon: '🧑',
        emojis: [
          '👋','🤚','🖐️','✋','🖖','👌','🤌','🤏','✌️','🤞','🫰','🤟','🤘','🤙',
          '👈','👉','👆','🖕','👇','☝️','🫵','👍','👎','✊','👊','🤛','🤜','👏',
          '🙌','🫶','👐','🤲','🤝','🙏','✍️','💅','🤳','💪','🦾','🦿','🦵','🦶',
          '👂','🦻','👃','🧠','🫀','🫁','🦷','🦴','👀','👁️','👅','👄','🫦','👶',
          '🧒','👦','👧','🧑','👱','👨','🧔','🧔‍♂️','🧔‍♀️','👩','🧓','👴','👵'
        ]
      },
      {
        name: 'Hewan & Alam',
        icon: '🐶',
        emojis: [
          '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐻‍❄️','🐨','🐯','🦁','🐮','🐷',
          '🐽','🐸','🐵','🙈','🙉','🙊','🐒','🐔','🐧','🐦','🐤','🐣','🐥','🦆',
          '🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🪱','🐛','🦋','🐌','🐞','🐜',
          '🪰','🪲','🪳','🦟','🦗','🕷️','🕸️','🦂','🐢','🐍','🦎','🦖','🦕','🐙',
          '🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🐊','🐅','🐆',
          '🌲','🌳','🌴','🌱','🌿','☘️','🍀','🎍','🪴','🍃','🍂','🍁','🍄','🌾',
          '💐','🌷','🌹','🥀','🌺','🌸','🌼','🌻','🌞','🌝','🌛','🌜','🌚','🌕',
          '🌖','🌗','🌘','🌑','🌒','🌓','🌔','🌙','🪐','💫','⭐️','🌟','✨','⚡',
          '☄️','💥','🔥','🌪️','🌈','☀️','🌤️','⛅','🌥️','☁️','🌧️','⛈️','🌩️','❄️',
          '☃️','⛄','🌬️','💨','💧','💦','🫧','☔','☂️','🌊','🌫️'
        ]
      },
      {
        name: 'Makanan & Minuman',
        icon: '🍔',
        emojis: [
          '🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭',
          '🍍','🥥','🥝','🍅','🍆','🥑','🥦','🥬','🥒','🌶️','🫑','🌽','🥕','🫒',
          '🧄','🧅','🥔','🍠','🥐','🥯','🍞','🥖','🥨','🧀','🥚','🍳','🧈','🥞',
          '🧇','🥓','🥩','🍗','🍖','🌭','🍔','🍟','🍕','🫓','🥪','🥙','🧆','🌮',
          '🌯','🫔','🥗','🥘','🍝','🍜','🍲','🍛','🍣','🍱','🥟','🦪','🍤','🍙',
          '🍚','🍘','🍥','🥮','🍢','🍡','🍧','🍨','🍦','🥧','🧁','🍰','🎂','🍮',
          '🍭','🍬','🍫','🍿','🍩','🍪','🌰','🥜','🍯','🥛','🍼','🫖','☕','🍵',
          '🧃','🥤','🧋','🍶','🍺','🍻','🥂','🍷','🥃','🍸','🍹','🧉','🍾','🧊'
        ]
      },
      {
        name: 'Aktivitas & Olahraga',
        icon: '⚽',
        emojis: [
          '⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🎱','🪀','🏓','🏸','🏒',
          '🏑','🥍','🏏','🪃','🥅','⛳','🪁','🏹','🎣','🤿','🥊','🥋','🎽','🛹',
          '🛼','🛷','⛸️','🥌','🎿','⛷️','🏂','🪂','🏋️','🤼','🤸','⛹️','🤺','🤾',
          '🏌️','🏇','🧘','🏄','🏊','🤽','🚣','🧗','🚵','🚴','🏆','🥇','🥈','🥉',
          '🏅','🎖️','🎫','🎟️','🎪','🤹','🎭','🩰','🎨','🎬','🎤','🎧','🎼','🎹',
          '🥁','🎷','🎺','🎸','🪕','🎻','🎲','♟️','🎯','🎳','🎮','🎰','🧩'
        ]
      },
      {
        name: 'Kendaraan & Tempat',
        icon: '🚗',
        emojis: [
          '🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑','🚒','🚐','🛻','🚚','🚛','🚜',
          '🛵','🏍️','🛺','🚲','🛴','🚏','🛣️','🛤️','⛽','🚨','🚥','🚦','🛑','🚧',
          '⚓','⛵','🛶','🚤','🛳️','⛴️','🚢','✈️','🛩️','🛫','🛬','💺','🚁','🚡',
          '🛰️','🚀','🛸','🌋','🗻','🏔️','🏕️','🏖️','🏜️','🏝️','🏞️','🏟️','🏛️','🏗️',
          '🏘️','🏠','🏡','🏢','🏥','🏦','🏨','🏪','🏫','🏬','🏭','🏰','🗼','🗽',
          '⛪','🕌','⛩️','⛲','⛺','🌃','🏙️','🌄','🌅','🌆','🌇','🌉','🎡','🎢'
        ]
      },
      {
        name: 'Benda & Objek',
        icon: '💡',
        emojis: [
          '💡','🔦','🕯️','🪔','📱','📲','💻','🖥️','🖨️','⌨️','🖱️','💾','💿','📀',
          '📷','📸','📹','🎥','📽️','📻','🎙️','⏱️','⏲️','⏰','🕰️','⌛','⏳','📡',
          '🔋','🔌','🪫','💸','💵','💴','💶','💷','🪙','💳','💎','⚖️','🧰','🔧',
          '🔨','🛠️','⛏️','🪓','🪚','🔩','⚙️','🧲','💣','🧨','🔪','🗡️','⚔️','🛡️',
          '🔮','🪄','🧿','🪬','💈','🔭','🔬','🩹','🩺','💊','💉','🩸','🧬','🧪',
          '🌡️','🧹','🪣','🧼','🪥','🪒','📦','🎁','🎈','🧧','✉️','📧','💌','📦',
          '🏷️','🔒','🔓','🔑','🗝️'
        ]
      },
      {
        name: 'Simbol & Hati',
        icon: '❤️',
        emojis: [
          '❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❤️‍🔥','❤️‍🩹','❣️','💕',
          '💞','💓','💗','💖','💘','💝','💟','☮️','✝️','☪️','🕉️','☸️','✡️','🔯',
          '🕎','☯️','☦️','🛐','⛎','♈','♉','♊','♋','♌','♍','♎','♏','♐',
          '♑','♒','♓','🆔','📴','📳','🈶','🈚','🈸','🈺','🈷️','✴️','🆚','💮',
          '🉐','㊙️','㊗️','🈴','🈵','🈹','🈲','🅰️','🅱️','🆎','🆑','🅾️','🆘','❌',
          '⭕','🛑','⛔','📛','🚫','💯','💢','♨️','🚷','🚯','🚳','🔞','📵','🚭',
          '❗','❕','❓','❔','‼️','⁉️','🔅','🔆','⚠️','🚸','🔰','♻️','✅','❎',
          '🌐','💠','💤','🏧','🚾','♿','🅿️','🚻','🎦','📶','🆖','🆗','🆙','🆒',
          '🆕','🆓','🔟','🔢','0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣',
          '9️⃣','🔘','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🟤','🔺','🔻','🔸',
          '🔹','🔶','🔷','🟥','🟧','🟨','🟩','🟦','🟪','⬛','⬜','🟫','🔔','🔕',
          '🎵','🎶'
        ]
      },
      {
        name: 'Bendera',
        icon: '🚩',
        emojis: [
          '🚩','🏁','🎌','🏴','🏳️','🏳️‍🌈','🏳️‍⚧️','🏴‍☠️','🇮🇩','🇲🇾','🇸🇬','🇵🇭','🇹🇭',
          '🇻🇳','🇯🇵','🇰🇷','🇨🇳','🇺🇸','🇬🇧','🇦🇺','🇩🇪','🇫🇷','🇮🇹','🇪🇸','🇧🇷','🇦🇷',
          '🇵🇸','🇸🇦','🇹🇷','🇮🇳','🇳🇱','🇷🇺','🇨🇦','🇲🇽','🇿🇦','🇪🇬'
        ]
      }
    ];

    var currentEmojiCategory = 0;

    function toggleEmojiPicker(e) {
      if (e) e.stopPropagation();
      var container = document.getElementById('emoji-picker-container');
      if (!container) return;
      var isHidden = container.classList.contains('hidden');
      if (isHidden) {
        container.classList.remove('hidden');
        renderEmojiTabs();
        renderEmojiGrid(currentEmojiCategory);
        var search = document.getElementById('emoji-search-input');
        if (search) search.value = '';
      } else {
        container.classList.add('hidden');
      }
    }

    function closeEmojiPicker(e) {
      if (e) e.stopPropagation();
      var container = document.getElementById('emoji-picker-container');
      if (container) container.classList.add('hidden');
    }

    function selectEmojiCategory(e, index) {
      if (e) e.stopPropagation();
      currentEmojiCategory = index;
      var tabsEl = document.getElementById('emoji-category-tabs');
      if (tabsEl) {
        var buttons = tabsEl.querySelectorAll('button');
        buttons.forEach(function(b, i) {
          if (i === index) {
            b.className = 'w-8 h-8 flex items-center justify-center rounded-lg text-lg transition active:scale-90 bg-[#00e599]/20 text-white border border-[#00e599]/40 shadow-sm shadow-[#00e599]/20 shrink-0';
          } else {
            b.className = 'w-8 h-8 flex items-center justify-center rounded-lg text-lg transition active:scale-90 text-gray-400 hover:text-white border border-transparent hover:bg-gray-800 shrink-0';
          }
        });
      }
      var search = document.getElementById('emoji-search-input');
      if (search && search.value) search.value = '';
      renderEmojiGrid(index);
    }

    function renderEmojiTabs() {
      var tabsEl = document.getElementById('emoji-category-tabs');
      if (!tabsEl) return;
      tabsEl.innerHTML = EMOJI_CATEGORIES.map(function(cat, idx) {
        var activeClass = idx === currentEmojiCategory
          ? 'bg-[#00e599]/20 text-white border-[#00e599]/40 shadow-sm shadow-[#00e599]/20'
          : 'text-gray-400 hover:text-white border-transparent hover:bg-gray-800';
        return '<button type="button" onclick="selectEmojiCategory(event, ' + idx + ')" class="w-8 h-8 flex items-center justify-center rounded-lg text-lg transition active:scale-90 border shrink-0 ' + activeClass + '" title="' + cat.name + '">' +
          cat.icon +
        '</button>';
      }).join('');
    }

    function renderEmojiGrid(categoryIdx, filterText) {
      var gridEl = document.getElementById('emoji-grid-list');
      if (!gridEl) return;
      var emojisToRender = [];
      if (filterText && filterText.trim()) {
        var q = filterText.trim().toLowerCase();
        EMOJI_CATEGORIES.forEach(function(cat) {
          cat.emojis.forEach(function(em) {
            if (!emojisToRender.includes(em)) emojisToRender.push(em);
          });
        });
      } else {
        emojisToRender = EMOJI_CATEGORIES[categoryIdx] ? EMOJI_CATEGORIES[categoryIdx].emojis : [];
      }

      gridEl.innerHTML = emojisToRender.map(function(em) {
        return '<button type="button" data-emoji="' + em + '" onclick="handleEmojiItemClick(event, this)" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 hover:scale-125 transition active:scale-90 text-xl cursor-pointer select-none">' +
          em +
        '</button>';
      }).join('');
    }

    function handleEmojiItemClick(e, btn) {
      if (e) e.stopPropagation();
      var emoji = btn.getAttribute('data-emoji');
      if (emoji) insertEmoji(emoji);
    }

    function filterEmojis(val) {
      renderEmojiGrid(currentEmojiCategory, val);
    }

    function handleEmojiBackspace(e) {
      if (e) e.stopPropagation();
      var inputEl = document.getElementById('sheet-comment-input');
      if (!inputEl) return;
      var start = inputEl.selectionStart;
      var end = inputEl.selectionEnd;
      var val = inputEl.value;
      if (start > 0 || end > 0) {
        if (start === end) {
          var chars = Array.from(val.substring(0, start));
          chars.pop();
          var newStart = chars.join('');
          inputEl.value = newStart + val.substring(end);
          inputEl.selectionStart = inputEl.selectionEnd = newStart.length;
        } else {
          inputEl.value = val.substring(0, start) + val.substring(end);
          inputEl.selectionStart = inputEl.selectionEnd = start;
        }
        handleCommentInput(inputEl);
        inputEl.focus();
      }
    }

    // Insert emoji at cursor position
    function insertEmoji(emoji) {
      var inputEl = document.getElementById('sheet-comment-input');
      if (!inputEl) return;
      var start = inputEl.selectionStart;
      var end = inputEl.selectionEnd;
      var val = inputEl.value;
      if (typeof start === 'number' && typeof end === 'number') {
        inputEl.value = val.substring(0, start) + emoji + val.substring(end);
        inputEl.selectionStart = inputEl.selectionEnd = start + emoji.length;
      } else {
        inputEl.value += emoji;
      }
      handleCommentInput(inputEl);
      inputEl.focus();
    }

    function toggleSheetAnonymous(isChecked) {
      var nameInput = document.getElementById('sheet-author-name');
      var avatarImg = document.getElementById('sheet-user-avatar');
      if (nameInput) {
        nameInput.disabled = isChecked;
        if (isChecked) {
          nameInput.value = '';
          nameInput.placeholder = 'Anonim';
          if (avatarImg) avatarImg.src = 'https://ui-avatars.com/api/?name=Anonim&background=1f2b42&color=94a3b8&bold=true';
        } else {
          nameInput.placeholder = 'Nama kamu...';
          updateSheetAvatar();
        }
      }
    }

    function updateSheetAvatar() {
      var nameInput = document.getElementById('sheet-author-name');
      var avatarImg = document.getElementById('sheet-user-avatar');
      var anonCheck = document.getElementById('sheet-toggle-anon');
      if (anonCheck && anonCheck.checked) return;

      var name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'User';
      if (avatarImg) {
        avatarImg.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=00e599&color=0d121f&bold=true';
      }
    }

    // --- Fetch Comments with 5 Root Comments Pagination ---
    var currentCommentPage = 1;
    var totalCommentPages = 1;

    async function loadComments(page) {
      if (typeof page === 'number') {
        currentCommentPage = page;
      }

      var listEl = document.getElementById('comments-sheet-list');
      var prevBtn = document.getElementById('btn-comment-prev');
      var nextBtn = document.getElementById('btn-comment-next');

      // UI Loader animasi logo.svg saat memuat komentar halaman
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = true;
      if (listEl) {
        listEl.innerHTML =
          '<div class="flex flex-col items-center justify-center py-20 text-gray-400 space-y-3 select-none animate-in fade-in duration-150">' +
            '<div class="relative w-11 h-11 flex items-center justify-center">' +
              '<div class="absolute inset-0 rounded-full bg-[#00e599]/25 blur-md animate-pulse"></div>' +
              '<img src="/logo.svg" alt="Loading" class="w-10 h-10 animate-spin relative z-10 drop-shadow-[0_0_12px_rgba(0,229,153,0.5)]">' +
            '</div>' +
            '<span class="text-xs text-gray-400 font-medium tracking-wide">Memuat komentar...</span>' +
          '</div>';
      }

      try {
        var res = await fetch('/api/comments?page=' + currentCommentPage + '&limit=5');
        var json = await res.json();
        var listEl = document.getElementById('comments-sheet-list');
        var sheetCount = document.getElementById('sheet-title-count');
        var fabCount = document.getElementById('fab-count');
        var pageIndicator = document.getElementById('comment-page-indicator');
        var prevBtn = document.getElementById('btn-comment-prev');
        var nextBtn = document.getElementById('btn-comment-next');

        if (!res.ok || !json.success || !Array.isArray(json.comments)) {
          if (listEl && listEl.innerText.includes('Memuat komentar')) {
            listEl.innerHTML =
              '<div class="text-center py-16 text-gray-500 text-xs">' +
                '<i class="fa-regular fa-comment-dots text-3xl block mb-2 text-gray-600"></i>' +
                'Belum ada komentar. Jadilah yang pertama berkomentar!' +
              '</div>';
          }
          return;
        }

        var total = json.totalComments || 0;
        currentCommentPage = json.page || 1;
        totalCommentPages = json.totalPages || 1;

        if (sheetCount) sheetCount.innerText = total;
        if (fabCount) fabCount.innerText = total;

        if (pageIndicator) {
          pageIndicator.innerText = 'Hal ' + currentCommentPage + ' dari ' + totalCommentPages;
        }
        if (prevBtn) {
          prevBtn.disabled = !json.hasPrevPage;
        }
        if (nextBtn) {
          nextBtn.disabled = !json.hasNextPage;
        }

        if (json.comments.length === 0) {
          listEl.innerHTML =
            '<div class="text-center py-16 text-gray-500 text-xs">' +
              '<i class="fa-regular fa-comment-dots text-3xl block mb-2 text-gray-600"></i>' +
              'Belum ada komentar. Jadilah yang pertama berkomentar!' +
            '</div>';
          return;
        }

        listEl.innerHTML = json.comments.map(function(c) { return renderTikTokCommentHtml(c); }).join('');
      } catch (err) {
        console.error('Gagal memuat komentar:', err);
        var listEl = document.getElementById('comments-sheet-list');
        if (listEl) {
          listEl.innerHTML =
            '<div class="text-center py-12 text-red-400 text-xs">' +
              'Gagal memuat komentar. Silakan refresh halaman.' +
            '</div>';
        }
      }
    }

    function goToCommentPage(delta) {
      var targetPage = currentCommentPage + delta;
      if (targetPage >= 1 && targetPage <= totalCommentPages) {
        loadComments(targetPage);
        var listEl = document.getElementById('comments-sheet-list');
        if (listEl) listEl.scrollTop = 0;
      }
    }

    function escapeHtml(str) {
      if (str === null || str === undefined) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function renderTikTokCommentHtml(comment) {
      var anonBadge = comment.isAnonymous
        ? '<span class="text-[9px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 font-normal border border-gray-700/60 ml-1.5">Anonim</span>'
        : '';

      var replyTarget = comment.replyToName
        ? '<span class="text-gray-400 mx-1 text-xs font-normal">&gt;</span><span class="text-[#00e599] font-semibold text-xs">' + escapeHtml(comment.replyToName) + '</span>'
        : '';

      var repliesHtml = (comment.replies && comment.replies.length > 0)
        ? '<div class="mt-3 pl-3 sm:pl-4 space-y-3 border-l border-gray-800/80">' +
            comment.replies.map(function(r) { return renderTikTokCommentHtml(r); }).join('') +
          '</div>'
        : '';

      var avatar = comment.avatarUrl || ('https://ui-avatars.com/api/?name=' + encodeURIComponent(comment.name || 'Anonim') + '&background=1f2b42&color=94a3b8&bold=true');

      return (
        '<div id="comment-' + comment.id + '" class="flex items-start space-x-3 text-xs">' +
          '<img src="' + escapeHtml(avatar) + '" alt="Avatar" class="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-700/80 object-cover shrink-0 mt-0.5">' +
          '<div class="flex-1 min-w-0">' +
            '<div class="flex items-center flex-wrap">' +
              '<span class="font-semibold text-gray-400 text-xs">' + escapeHtml(comment.name) + '</span>' +
              replyTarget +
              anonBadge +
            '</div>' +
            '<p class="text-xs sm:text-sm text-gray-100 font-normal mt-0.5 leading-relaxed break-words whitespace-pre-line">' + escapeHtml(comment.content) + '</p>' +
            '<div class="flex items-center space-x-3 mt-1.5 text-[11px] text-gray-500">' +
              '<span>' + escapeHtml(comment.formattedTime || 'Baru saja') + '</span>' +
              '<button type="button" data-id="' + comment.id + '" data-name="' + escapeHtml(comment.name) + '" onclick="handleReplyClick(this)" class="font-bold text-gray-400 hover:text-white transition">Balas</button>' +
            '</div>' +
            repliesHtml +
          '</div>' +
        '</div>'
      );
    }

    async function submitSheetComment(e) {
      e.preventDefault();
      var nameInput = document.getElementById('sheet-author-name');
      var anonToggle = document.getElementById('sheet-toggle-anon');
      var contentInput = document.getElementById('sheet-comment-input');
      var btn = document.getElementById('sheet-btn-send');

      var isAnonymous = Boolean(anonToggle && anonToggle.checked);
      var name = isAnonymous ? 'Anonim' : (nameInput ? nameInput.value : '').trim();
      var content = (contentInput ? contentInput.value : '').trim();

      if (!content) return;

      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-xs"></i>';

      try {
        var res = await fetch('/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parentId: activeParentId, name: name, isAnonymous: isAnonymous, content: content }),
        });
        var json = await res.json();
        if (json.success) {
          contentInput.value = '';
          contentInput.style.height = 'auto';
          cancelReplyMode();
          showToast('Komentar berhasil dipublikasikan!');
          await loadComments(1);
          var listEl = document.getElementById('comments-sheet-list');
          if (listEl) listEl.scrollTop = 0;
        } else {
          showToast(json.message || 'Gagal mengirim komentar.');
        }
      } catch (err) {
        showToast('Gagal terhubung ke server.');
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-arrow-up text-sm"></i>';
      }
    }


    document.addEventListener('click', function(e) {
      var picker = document.getElementById('emoji-picker-container');
      var btn = document.getElementById('sheet-btn-emoji');
      if (picker && !picker.classList.contains('hidden')) {
        if (!picker.contains(e.target) && btn && !btn.contains(e.target)) {
          closeEmojiPicker();
        }
      }
    });

    window.addEventListener('resize', function() {
      if (window.innerWidth >= 1024) {
        document.body.style.overflow = '';
        var backdrop = document.getElementById('comment-sheet-backdrop');
        if (backdrop) {
          backdrop.classList.remove('opacity-100');
          backdrop.classList.add('opacity-0', 'pointer-events-none');
        }
      }
    });

    // Prevent all clicks inside emoji picker from bubbling to document
      var pickerEl = document.getElementById('emoji-picker-container');
      if (pickerEl) {
        pickerEl.addEventListener('click', function(e) {
          e.stopPropagation();
        });
      }

      window.addEventListener('DOMContentLoaded', () => {
      loadComments();
    });
  </script>
</body>
</html>`;
}
