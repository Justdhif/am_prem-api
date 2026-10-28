import Link from "next/link";

export function HomeOverview() {
  const serviceCards = [
    {
      title: "Aktivasi Alight Motion Pro VIP",
      href: "/aktivasi",
      badge: "Lisensi Resmi 1 Tahun",
      icon: "fa-solid fa-crown",
      iconColor: "text-[#00e599]",
      borderColor: "hover:border-[#00e599]/60",
      glowColor: "group-hover:shadow-[0_0_30px_rgba(0,229,153,0.15)]",
      description:
        "Aktifkan lisensi Alight Motion Pro VIP resmi 1 Tahun gratis melalui verifikasi magic link email tanpa watermark dan semua efek terbuka.",
      cta: "Mulai Aktivasi Akun",
    },
    {
      title: "Preset Finder Multi-Platform",
      href: "/preset",
      badge: "TikTok & YouTube",
      icon: "fa-solid fa-wand-magic-sparkles",
      iconColor: "text-amber-400",
      borderColor: "hover:border-amber-400/60",
      glowColor: "group-hover:shadow-[0_0_30px_rgba(251,191,36,0.15)]",
      description:
        "Ekstrak dan temukan link preset XML dan tautan Alight Creative resmi dari komentar video TikTok atau YouTube secara instan.",
      cta: "Cari Preset Video",
    },
    {
      title: "Dokumentasi & REST API",
      href: "/docs",
      badge: "Integrasi Bot / Webhook",
      icon: "fa-solid fa-book-bookmark",
      iconColor: "text-blue-400",
      borderColor: "hover:border-blue-400/60",
      glowColor: "group-hover:shadow-[0_0_30px_rgba(96,165,250,0.15)]",
      description:
        "Panduan lengkap endpoint API aktivasi dan scraper preset untuk integrasi ke bot Telegram, WhatsApp, atau sistem backend Anda sendiri.",
      cta: "Buka Dokumentasi",
    },
  ];

  const features = [
    {
      icon: "fa-solid fa-shield-halved",
      title: "Resmi & Anti-Banned",
      desc: "Lisensi diaktivasi langsung ke server Firebase Alight Creative resmi. 100% aman tanpa modifikasi APK berbahaya.",
    },
    {
      icon: "fa-solid fa-ban",
      title: "Bebas Watermark",
      desc: "Ekspor seluruh hasil karya video animasi tanpa tanda air logo Alight Motion sama sekali.",
    },
    {
      icon: "fa-solid fa-layer-group",
      title: "Semua Efek & Preset Terbuka",
      desc: "Gunakan 100+ efek visual premium, kurva kecepatan eksklusif, dan kemampuan impor file XML tanpa batas.",
    },
    {
      icon: "fa-solid fa-film",
      title: "Ekspor Kualitas Tinggi",
      desc: "Dukungan render video resolusi hingga 4K pada 60 FPS untuk hasil motion graphic yang tajam dan mulus.",
    },
  ];

  const faqs = [
    {
      q: "Apakah layanan aktivasi ini memerlukan mod APK?",
      a: "Sama sekali tidak. Anda cukup mengunduh aplikasi Alight Motion resmi langsung dari Google Play Store atau Apple App Store. Aktivasi diterapkan ke akun email Anda.",
    },
    {
      q: "Bagaimana cara kerja verifikasi magic link?",
      a: "Sistem memicu Firebase Auth untuk mengirim tautan masuk resmi ke email Anda. Saat tautan tersebut diverifikasi melalui sistem kami, lisensi Pro VIP 1 Tahun langsung dipasangkan ke ID akun Anda.",
    },
    {
      q: "Bagaimana cara menggunakan Preset Finder?",
      a: "Cukup salin URL video TikTok atau YouTube yang membagikan preset, lalu tempelkan di halaman Preset Finder. Scraper kami akan menelusuri komentar kreator dan pengguna untuk menemukan link XML Google Drive atau Alight Link.",
    },
    {
      q: "Bisakah saya mengintegrasikan layanan ini ke bot saya?",
      a: "Tentu saja. Kami menyediakan endpoint REST API publik yang siap pakai. Silakan pelajari panduan lengkap dan contoh request di menu Dokumentasi API.",
    },
  ];

  return (
    <div className="space-y-8 sm:space-y-10 text-left w-full">
      {/* 1. PRIMARY NAVIGATION HUB (Route Cards) */}
      <section className="space-y-3.5">
        <div className="flex items-center space-x-2">
          <i className="fa-solid fa-compass text-[#00e599] text-sm"></i>
          <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
            Pusat Layanan &amp; Navigasi
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {serviceCards.map((card, i) => (
            <Link
              key={i}
              href={card.href}
              className={`group relative p-5 sm:p-6 bg-[#121826] border border-gray-800/90 rounded-2xl transition duration-300 flex flex-col justify-between space-y-4 cursor-pointer ${card.borderColor} ${card.glowColor}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl bg-gray-800/60 border border-gray-700/60 flex items-center justify-center ${card.iconColor} text-lg shadow-sm group-hover:scale-105 transition`}>
                    <i className={card.icon}></i>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 font-semibold border border-gray-700">
                    {card.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#00e599] transition tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed mt-1.5">
                    {card.description}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-1.5 text-xs font-bold text-[#00e599] group-hover:translate-x-1 transition duration-200">
                <span>{card.cta}</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. OVERVIEW FITUR ALIGHT MOTION PRO VIP */}
      <section className="p-6 sm:p-7 rounded-2xl bg-[#121826]/70 border border-gray-800/90 space-y-5">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#00e599]">
            <i className="fa-solid fa-star text-[11px]"></i>
            <span>Keunggulan Layanan</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Kenapa Menggunakan Alight Motion Pro VIP?
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-2xl">
            Tingkatkan kualitas editing video Anda dengan akses penuh ke ekosistem resmi Alight Motion tanpa kompromi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {features.map((feat, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#0d121f] border border-gray-800/80 space-y-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#00e599]/10 text-[#00e599] flex items-center justify-center text-sm shrink-0 border border-[#00e599]/20">
                  <i className={feat.icon}></i>
                </div>
                <h4 className="text-sm font-bold text-white">{feat.title}</h4>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed pl-10">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FAQ SECTION (Overview Pertanyaan Umum) */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <i className="fa-regular fa-circle-question text-[#00e599]"></i>
            <span>Pertanyaan yang Sering Diajukan (FAQ)</span>
          </h2>
          <p className="text-xs text-gray-400">
            Penjelasan ringkas seputar aktivasi lisensi, scraper preset, dan integrasi API.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {faqs.map((faq, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#121826]/80 border border-gray-800/80 space-y-1.5">
              <h4 className="text-xs sm:text-sm font-bold text-white flex items-start space-x-2">
                <span className="text-[#00e599] font-black text-xs shrink-0 mt-0.5">Q:</span>
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed pl-4">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
