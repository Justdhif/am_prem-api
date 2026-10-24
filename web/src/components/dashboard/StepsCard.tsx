import { Card } from "@/components/ui/card";

export function StepsCard() {
  return (
    <Card className="p-6 bg-[#131927]">
      <div className="flex items-center space-x-2.5 mb-4">
        <i className="fa-solid fa-wand-magic-sparkles text-[#00e599] text-base"></i>
        <h2 className="text-base font-bold text-white">Alur Aktivasi 2 Langkah</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Step 1 */}
        <div className="bg-[#0d121f] p-4 rounded-xl border border-gray-800 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-[#00e599] text-gray-950 font-black flex items-center justify-center text-xs shrink-0">
              1
            </span>
            <span className="font-bold text-white text-sm">Kirim Link ke Email</span>
          </div>
          <p className="text-gray-400 leading-relaxed">
            Panggil <code className="text-[#00e599]">POST /api/am/send-link</code> dengan menyertakan target email Anda. Sistem akan memicu Firebase untuk mengirim magic link verifikasi.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-[#0d121f] p-4 rounded-xl border border-gray-800 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-[#00e599] text-gray-950 font-black flex items-center justify-center text-xs shrink-0">
              2
            </span>
            <span className="font-bold text-white text-sm">Verifikasi &amp; Aktivasi Pro</span>
          </div>
          <p className="text-gray-400 leading-relaxed">
            Salin full link dari email (atau cukup oobCode) lalu kirimkan ke <code className="text-[#00e599]">POST /api/am/verify</code>. Akun Anda langsung aktif VIP 1 Tahun!
          </p>
        </div>
      </div>
    </Card>
  );
}
