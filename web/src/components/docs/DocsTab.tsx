import { EndpointCard } from "./EndpointCard";
import { BotCommands } from "./BotCommands";
import { FaqSection } from "./FaqSection";
import { WhatsAppBanner } from "./WhatsAppBanner";

export function DocsTab() {
  const sendLinkRequest = `{
  "email": "user@gmail.com"
}`;

  const sendLinkCurl = `curl -X POST https://your-domain.com/api/am/send-link \\
  -H "Content-Type: application/json" \\
  -d '{"email": "user@gmail.com"}'`;

  const sendLinkResponse = `{
  "success": true,
  "message": "Link verifikasi Alight Motion berhasil dikirim ke user@gmail.com. Silakan periksa kotak masuk atau spam email Anda.",
  "data": {
    "email": "user@gmail.com",
    "expiresIn": "15 menit"
  }
}`;

  const verifyRequest = `{
  "link": "https://alightcreative.com/?link=...&oobCode=xxxxxx",
  "email": "user@gmail.com" // opsional jika sebelumnya memanggil /send-link
}`;

  const verifyCurl = `curl -X POST https://your-domain.com/api/am/verify \\
  -H "Content-Type: application/json" \\
  -d '{"link": "https://alightcreative.com/?link=...&oobCode=xxxxxx", "email": "user@gmail.com"}'`;

  const verifyResponse = `{
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
}`;

  const presetRequest = `{
  "url": "https://vt.tiktok.com/ZSxxxxxxx/ atau https://youtu.be/xxxx"
}`;

  const presetCurl = `curl -X POST https://your-domain.com/api/am/preset/find \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://vt.tiktok.com/ZSxxxxxxx/"}'`;

  const presetResponse = `{
  "success": true,
  "message": "Berhasil menemukan 2 link preset Alight Motion!",
  "platform": "tiktok",
  "data": {
    "count": 2,
    "presets": [
      {
        "type": "alight_creative",
        "url": "https://alightcreative.com/am/share/u/...",
        "author": "creator_am"
      },
      {
        "type": "google_drive",
        "url": "https://drive.google.com/file/d/...",
        "author": "creator_am"
      }
    ]
  }
}`;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* SECTION HEADER */}
      <div className="flex items-center space-x-2.5">
        <i className="fa-solid fa-code text-[#00e599] text-base"></i>
        <h2 className="text-lg font-bold text-white">Daftar Endpoint API</h2>
      </div>

      <div className="space-y-6">
        {/* Endpoint 1: Send Link */}
        <EndpointCard
          method="POST"
          path="/api/am/send-link"
          title="1. Kirim Magic Link Alight Motion ke Email"
          description="Mengirimkan tautan verifikasi masuk Firebase Alight Motion langsung ke kotak masuk email pengguna."
          requestPayload={sendLinkRequest}
          curlSnippet={sendLinkCurl}
          responsePayload={sendLinkResponse}
        />

        {/* Endpoint 2: Verify & Activate */}
        <EndpointCard
          method="POST"
          path="/api/am/verify"
          title="2. Verifikasi &amp; Aktivasi Alight Motion Pro VIP"
          description="Memverifikasi tautan masuk dari email dan langsung mengaktifkan langganan Alight Motion Pro 1 Tahun resmi."
          requestPayload={verifyRequest}
          curlSnippet={verifyCurl}
          responsePayload={verifyResponse}
        />

        {/* Endpoint 3: Find Preset */}
        <EndpointCard
          method="POST"
          path="/api/am/preset/find"
          title="3. Multi-Platform Find Preset (TikTok &amp; YouTube)"
          description="Memindai komentar dan deskripsi video TikTok/YouTube untuk menemukan link preset (alightcreative, drive) atau info join saluran."
          requestPayload={presetRequest}
          curlSnippet={presetCurl}
          responsePayload={presetResponse}
        />

        {/* Endpoint 4: Bot Commands Webhook */}
        <BotCommands />

        {/* FAQ Section */}
        <FaqSection />

        {/* WhatsApp Assistance Banner */}
        <WhatsAppBanner />
      </div>
    </div>
  );
}
