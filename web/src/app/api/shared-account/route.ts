import { NextResponse } from "next/server";

const SHARED_EMAIL = process.env.SHARED_FREE_EMAIL || "ampremcommunity@maxxspace.com";
const SHARED_PASSWORD = process.env.SHARED_FREE_PASSWORD || "AmPremSecretPassword2026!";

interface MessageMember {
  id: string;
  from: { address: string; name: string };
  subject: string;
  intro: string;
  createdAt: string;
}

export async function GET() {
  try {
    // 1. Dapatkan token auth dari mail.tm
    const tokenRes = await fetch("https://api.mail.tm/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: SHARED_EMAIL,
        password: SHARED_PASSWORD,
      }),
      cache: "no-store",
    });

    if (!tokenRes.ok) {
      return NextResponse.json(
        {
          success: false,
          email: SHARED_EMAIL,
          error: "Gagal mengautentikasi ke mailbox publik",
          messages: [],
        },
        { status: 502 }
      );
    }

    const { token } = await tokenRes.json();

    // 2. Ambil daftar pesan terbaru
    const messagesRes = await fetch("https://api.mail.tm/messages?page=1", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!messagesRes.ok) {
      return NextResponse.json(
        {
          success: false,
          email: SHARED_EMAIL,
          error: "Gagal mengambil pesan dari mailbox",
          messages: [],
        },
        { status: 502 }
      );
    }

    const messagesData = await messagesRes.json();
    const members: MessageMember[] = messagesData["hydra:member"] || [];

    // 3. Ambil detail untuk maksimal 5 pesan teratas untuk mengekstrak login link Alight Motion
    const detailedMessages = await Promise.all(
      members.slice(0, 5).map(async (msg) => {
        try {
          const detailRes = await fetch(`https://api.mail.tm/messages/${msg.id}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          });
          if (!detailRes.ok) return null;
          const detail = await detailRes.json();

          const rawText = detail.text || "";
          const rawHtml = Array.isArray(detail.html) ? detail.html.join(" ") : detail.html || "";
          const content = `${rawText} ${rawHtml}`;

          // Ekstrak tautan login / verifikasi Alight Motion
          // Format umum: https://alightcreative.com/__/auth/action?... atau link Firebase
          const linkRegex = /(https?:\/\/[^\s"'>]+(?:alightcreative\.com|\.firebaseapp\.com|\/auth\/action)[^\s"'>]+)/i;
          const match = content.match(linkRegex);

          return {
            id: msg.id,
            from: msg.from.address || msg.from.name || "Alight Motion",
            subject: msg.subject,
            createdAt: msg.createdAt,
            loginLink: match ? match[1].replace(/&amp;/g, "&") : null,
          };
        } catch {
          return null;
        }
      })
    );

    const validMessages = detailedMessages.filter(Boolean);

    return NextResponse.json({
      success: true,
      email: SHARED_EMAIL,
      total: messagesData["hydra:totalItems"] || 0,
      messages: validMessages,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        email: SHARED_EMAIL,
        error: error.message || "Terjadi kesalahan internal server",
        messages: [],
      },
      { status: 500 }
    );
  }
}
