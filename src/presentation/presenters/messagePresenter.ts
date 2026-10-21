import { StatsData } from '../../domain/entities/Stats.js';
import { AlightMotionUser } from '../../domain/entities/User.js';

export class MessagePresenter {
  public static formatHelpText(): string {
    return (
      `*乂 PANDUAN ALIGHT MOTION PRO VIP 乂*\n` +
      `_⚡ Powered by Justdhif_\n\n` +
      `API ini digunakan untuk aktivasi lisensi Pro VIP 1 Tahun secara otomatis.\n\n` +
      `*Alur Penggunaan (Workflow):*\n` +
      `1. *Kirim Permintaan Link*\n` +
      `   Kirim request POST ke \`/api/am/send-link\` dengan body:\n` +
      `   \`{ "email": "user@gmail.com" }\`\n\n` +
      `2. *Buka Email Masuk*\n` +
      `   Buka aplikasi email/Gmail target, cari email dari Alight Motion di Inbox atau Spam.\n` +
      `   Salin tautan dari tombol *"Sign in to Alight Motion"*.\n\n` +
      `3. *Aktivasi Lisensi Pro VIP*\n` +
      `   Kirim request POST ke \`/api/am/verify\` dengan body:\n` +
      `   \`{ "email": "user@gmail.com", "link": "<link_dari_email>" }\`\n` +
      `   _(Catatan: email bersifat opsional jika menggunakan session dari step 1)_\n\n` +
      `4. *Login di Aplikasi Alight Motion*\n` +
      `   Buka aplikasi Alight Motion di HP dan login menggunakan email tersebut.\n` +
      `   Akun otomatis Pro VIP tanpa watermark & fitur premium terbuka!\n\n` +
      `*Fitur Tambahan (Preset Finder):*\n` +
      `• *!ampreset <url_tiktok>* : Mencari link preset AM dari caption & komentar video TikTok.\n\n` +
      `⚡ _Official Service by Justdhif_`
    );
  }

  public static formatStatsText(stats: StatsData): string {
    return (
      `*乂 STATISTIK ALIGHT MOTION PRO 乂*\n` +
      `_⚡ Service by Justdhif_\n\n` +
      `• *Total Akun Aktif:* ${stats.total} Akun\n` +
      `• *Aktivasi Hari Ini:* ${stats.today} Akun\n` +
      `• *Status Server:* Online 🟢\n\n` +
      `Ketik *!amhelp* untuk panduan lengkap.\n\n` +
      `⚡ _Powered by Justdhif_`
    );
  }

  public static formatSendLinkSuccessText(email: string): string {
    return (
      `*乂 ALIGHT MOTION PRO 乂*\n` +
      `_⚡ by Justdhif_\n\n` +
      `• *Status:* Link Terkirim ✉️\n` +
      `• *Email:* ${email}\n\n` +
      `*Langkah Selanjutnya:*\n` +
      `1. Buka Gmail / folder Spam dari Alight Motion.\n` +
      `2. Salin link tombol *"Sign in to Alight Motion"*.\n` +
      `3. Kirim ke bot:\n` +
      `   *!amverify ${email} <link>*\n\n` +
      `💡 _Tips: Di chat ini, Anda juga bisa langsung mengetik *!amverify <link>* tanpa mengulang email!_\n\n` +
      `⚡ _Justdhif Alight Motion Service_`
    );
  }

  public static formatVerifySuccessText(user: AlightMotionUser): string {
    return (
      `*🎉 ALIGHT MOTION PRO VIP AKTIF 🎉*\n\n` +
      `• *Email:* ${user.email}\n` +
      `• *Tier:* ${user.tier} ⭐\n` +
      `• *Status:* ACTIVE 🟢\n` +
      `• *Lisensi:* ${user.subscription}\n` +
      `• *Berlaku:* s/d ${user.validUntil}\n` +
      `• *Order ID:* ${user.orderId || '-'}\n\n` +
      `*Cara Menggunakan:*\n` +
      `1. Buka aplikasi Alight Motion di HP Anda.\n` +
      `2. Masuk / Login menggunakan email di atas.\n` +
      `3. Selamat menikmati fitur Pro tanpa watermark & semua efek VIP terbuka! 🎬✨\n\n` +
      `⚡ _Selamat berkarya! Powered by Justdhif_`
    );
  }

  public static formatVerifyWarningText(email: string, premiumError?: string | null): string {
    return (
      `*⚠️ STATUS AKUN*\n\n` +
      `• *Email:* ${email}\n` +
      `• *Status:* LOGIN BERHASIL (Belum VIP)\n\n` +
      `Info aktivasi premium: ${premiumError || 'Gagal mengaitkan lisensi.'}\n` +
      `Silakan coba kirim link baru beberapa saat lagi.\n\n` +
      `⚡ _Service by Justdhif_`
    );
  }

  public static formatVerifyErrorText(errorMessage: string): string {
    return `❌ *Verifikasi Gagal*\n\n${errorMessage}\n\n⚡ _Justdhif AM Service_`;
  }

  public static formatVerifyUsageHelpText(): string {
    return (
      `⚠️ *Format Verifikasi Belum Benar*\n\n` +
      `Gunakan:\n` +
      `*!amverify emailmu@gmail.com <link_dari_email>*\n\n` +
      `Contoh:\n` +
      `!amverify user@gmail.com https://alightcreative.com/?link=...&oobCode=xxxx\n\n` +
      `💡 *Belum punya link?* Ketik *!amprem emailmu@gmail.com* terlebih dahulu.\n\n` +
      `⚡ _Justdhif AM Service_`
    );
  }

  public static formatSendLinkUsageHelpText(): string {
    return (
      `⚠️ *Format Belum Lengkap*\n\n` +
      `Gunakan: *!amprem emailmu@gmail.com*\n\n` +
      `Contoh:\n` +
      `!amprem user@gmail.com\n\n` +
      `⚡ _Justdhif AM Service_`
    );
  }

  public static formatUnknownCommandText(command: string): string {
    return (
      `⚠️ Perintah *${command}* tidak dikenali.\n\n` +
      `Daftar perintah Alight Motion yang tersedia:\n` +
      `• *!amhelp* : Panduan lengkap\n` +
      `• *!amstats* : Statistik aktivasi\n` +
      `• *!amprem <email>* : Kirim link verifikasi\n` +
      `• *!amverify <link>* : Aktivasi lisensi Pro VIP\n\n` +
      `⚡ _Justdhif Alight Motion Service_`
    );
  }
}
