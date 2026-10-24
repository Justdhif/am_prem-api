export function WhatsAppBanner() {
  return (
    <div className="p-4 rounded-xl bg-[#00e599]/10 border border-[#00e599]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-center space-x-3">
        <i className="fa-brands fa-whatsapp text-2xl text-[#00e599] shrink-0"></i>
        <div>
          <span className="font-bold text-white block text-sm">Butuh Bantuan Lebih Lanjut?</span>
          <span className="text-gray-400 text-xs">
            Hubungi WhatsApp kami di +44 7762 422507 atau TikTok @justdhifbieber
          </span>
        </div>
      </div>
      <a
        href="https://wa.me/447762422507"
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 rounded-xl bg-[#00e599] text-gray-950 font-bold text-xs hover:bg-[#1affaa] transition shrink-0 text-center active:scale-95 shadow-md shadow-[#00e599]/20"
      >
        Chat WhatsApp
      </a>
    </div>
  );
}
