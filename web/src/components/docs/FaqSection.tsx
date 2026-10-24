import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function FaqSection() {
  return (
    <Card className="p-6 bg-[#131927]">
      <div className="flex items-center space-x-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold shrink-0">
          <i className="fa-regular fa-circle-question"></i>
        </div>
        <div>
          <h2 className="text-base font-bold text-white">Panduan Bantuan &amp; FAQ</h2>
          <p className="text-xs text-gray-400">Petunjuk aktivasi, panduan bot, dan solusi kendala umum.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="bg-[#0d121f] p-4 rounded-xl border border-gray-800 space-y-2">
          <span className="font-bold text-[#00e599] flex items-center text-xs sm:text-sm">
            <i className="fa-solid fa-envelope-circle-check mr-2"></i>Email tidak masuk?
          </span>
          <p className="text-gray-300 leading-relaxed">
            Pastikan alamat email sudah terdaftar di Alight Motion. Periksa folder <strong>Spam</strong>, <strong>Junk</strong>, atau tab <strong>Promosi</strong> di Gmail. Tunggu 1&ndash;2 menit.
          </p>
        </div>

        <div className="bg-[#0d121f] p-4 rounded-xl border border-gray-800 space-y-2">
          <span className="font-bold text-[#00e599] flex items-center text-xs sm:text-sm">
            <i className="fa-solid fa-clock-rotate-left mr-2"></i>Link Kadaluarsa (Expired)?
          </span>
          <p className="text-gray-300 leading-relaxed">
            Magic link dari Firebase hanya berlaku 15 menit. Jika kadaluarsa, cukup kirim ulang perintah <code className="text-[#00e599]">!amprem</code> atau submit ulang email di form.
          </p>
        </div>

        <div className="bg-[#0d121f] p-4 rounded-xl border border-gray-800 space-y-2">
          <span className="font-bold text-[#00e599] flex items-center text-xs sm:text-sm">
            <i className="fa-solid fa-star mr-2"></i>Fitur Pro yang Didapat?
          </span>
          <p className="text-gray-300 leading-relaxed">
            Lisensi Alight Motion Pro VIP 1 Tahun resmi aktif: bebas watermark saat export video, akses penuh semua efek premium, import preset XML &amp; font tanpa batas.
          </p>
        </div>

        <div className="bg-[#0d121f] p-4 rounded-xl border border-gray-800 space-y-2">
          <span className="font-bold text-[#00e599] flex items-center text-xs sm:text-sm">
            <i className="fa-solid fa-robot mr-2"></i>Daftar Perintah Bot WhatsApp
          </span>
          <p className="text-gray-300 leading-relaxed">
            Gunakan <code className="text-[#00e599]">!amprem &lt;email&gt;</code> untuk kirim link, <code className="text-[#00e599]">!ampreset &lt;url&gt;</code> untuk cari preset VT/YT, dan balas link untuk aktivasi.
          </p>
        </div>
      </div>
    </Card>
  );
}
