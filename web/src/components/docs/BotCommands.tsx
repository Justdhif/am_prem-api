import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "./CodeBlock";

export function BotCommands() {
  const exampleJson = `{
  "text": "!amprem user@gmail.com",
  "senderId": "628123456789@s.whatsapp.net"
}`;

  const responseJson = `{
  "success": true,
  "reply": "Link aktivasi Alight Motion telah dikirimkan ke user@gmail.com. Silakan buka email Anda, salin link verifikasinya, dan kirimkan ke sini untuk aktivasi!"
}`;

  return (
    <Card className="space-y-4">
      <CardHeader className="border-b border-gray-800/80 pb-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant="methodPost">POST</Badge>
          <code className="text-white font-mono text-sm sm:text-base font-bold">
            /api/am/command
          </code>
        </div>
        <CardTitle className="text-sm sm:text-base text-gray-200 mt-2">
          Webhook Bot WhatsApp / Telegram Handler
        </CardTitle>
        <CardDescription>
          Endpoint pemroses pesan otomatis yang bisa dihubungkan ke bot WhatsApp (Baileys/Wppconnect), Telegram Bot, atau Discord Webhook.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
            Contoh Perintah Teks yang Didukung
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
            <div className="bg-[#0d121f] p-2.5 rounded-lg border border-gray-800 font-mono text-[#00e599]">
              !amprem user@gmail.com
            </div>
            <div className="bg-[#0d121f] p-2.5 rounded-lg border border-gray-800 font-mono text-[#00e599]">
              !ampreset &lt;url_video&gt;
            </div>
            <div className="bg-[#0d121f] p-2.5 rounded-lg border border-gray-800 font-mono text-[#00e599]">
              !amstats
            </div>
            <div className="bg-[#0d121f] p-2.5 rounded-lg border border-gray-800 font-mono text-[#00e599]">
              !amhelp
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
            Payload Masuk
          </span>
          <CodeBlock code={exampleJson} />
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
            Response Bot (200 OK)
          </span>
          <CodeBlock code={responseJson} isSuccessResponse />
        </div>
      </CardContent>
    </Card>
  );
}
