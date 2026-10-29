export interface FonnteNotificationPayload {
  name: string;
  isAnonymous: boolean;
  content: string;
  parentId?: string | null;
  createdAt?: string | Date;
}

export async function sendFonnteCommentNotification(
  payload: FonnteNotificationPayload
): Promise<boolean> {
  const token = process.env.FONNTE_TOKEN;
  const target = process.env.FONNTE_TARGET;

  if (!token || !target) {
    console.warn("[Fonnte] FONNTE_TOKEN atau FONNTE_TARGET belum diset di environment variables.");
    return false;
  }

  try {
    const now = new Date();
    const timeStr = now.toLocaleDateString("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const senderType = payload.isAnonymous ? "👤 (Anonim)" : "👤 Pengguna";
    const isReply = Boolean(payload.parentId);

    const message = [
      `🔔 *${isReply ? "Balasan Komentar Baru" : "Komentar Diskusi Baru"}!*`,
      `━━━━━━━━━━━━━━━━━━━`,
      `*Pengirim:* ${payload.name} ${senderType}`,
      `*Waktu:* ${timeStr} WIB`,
      `*Tipe:* ${isReply ? "Balasan Komentar" : "Komentar Utama"}`,
      ``,
      `💬 *Isi Komentar:*`,
      `"${payload.content}"`,
      `━━━━━━━━━━━━━━━━━━━`,
      `🌐 *Alight Motion Premium Web*`,
    ].join("\n");

    const formData = new URLSearchParams();
    formData.append("target", target);
    formData.append("message", message);
    formData.append("countryCode", "62");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const result = (await response.json()) as any;
    if (result && result.status) {
      console.log(`[Fonnte] Notifikasi komentar berhasil dikirim ke ${target}`);
      return true;
    } else {
      console.warn(`[Fonnte] Gagal mengirim pesan:`, result);
      return false;
    }
  } catch (err: any) {
    console.error("[Fonnte] Error pengiriman notifikasi WA:", err?.message || err);
    return false;
  }
}
