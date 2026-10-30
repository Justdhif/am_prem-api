import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const DEFAULT_EMAIL = "ampremcommunity@maxxspace.com";
const DEFAULT_PASSWORD = "AmPremSecretPassword2026!";

interface MessageMember {
  id: string;
  from: { address: string; name: string };
  subject: string;
  intro: string;
  createdAt: string;
}

function extractLoginLink(htmlContent: string, textContent: string): string | null {
  // 1. Prioritaskan tautan dalam tag <a href="..."> dari HTML
  const hrefMatch = htmlContent.match(/href=['"](https?:\/\/[^'"]+)['"]/i);
  if (hrefMatch && (hrefMatch[1].includes("firebaseapp.com") || hrefMatch[1].includes("alightcreative.com"))) {
    return hrefMatch[1].replace(/&amp;/g, "&");
  }

  // 2. Fallback regex untuk URL Alight Creative / Firebase auth
  const combined = `${textContent} ${htmlContent}`;
  const generalMatch = combined.match(
    /(https?:\/\/(?:alight-creative\.firebaseapp\.com|alightcreative\.com)[^\s"'<>]+)/i
  );
  if (generalMatch) {
    return generalMatch[1].replace(/&amp;/g, "&");
  }

  return null;
}

async function getMailTmToken(email: string, pass: string): Promise<{ token: string | null; debug?: string }> {
  try {
    const res = await fetch("https://api.mail.tm/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        address: email.trim(),
        password: pass.trim(),
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return { token: null, debug: `HTTP ${res.status}: ${errText}` };
    }

    const data = await res.json();
    return { token: data.token || null, debug: "OK" };
  } catch (err: any) {
    return { token: null, debug: `Exception: ${err?.message || err}` };
  }
}

export async function GET() {
  const emailToUse = (process.env.SHARED_FREE_EMAIL || DEFAULT_EMAIL).trim();
  const passToUse = (process.env.SHARED_FREE_PASSWORD || DEFAULT_PASSWORD).trim();

  // Dapatkan token (dengan retry ke DEFAULT_PASSWORD jika env bermasalah)
  let authResult = await getMailTmToken(emailToUse, passToUse);
  if (!authResult.token && (emailToUse !== DEFAULT_EMAIL || passToUse !== DEFAULT_PASSWORD)) {
    authResult = await getMailTmToken(DEFAULT_EMAIL, DEFAULT_PASSWORD);
  }

  if (!authResult.token) {
    return NextResponse.json(
      {
        success: false,
        version: "2026-10-30-v2",
        email: emailToUse,
        error: `Gagal mengautentikasi ke mailbox publik (${authResult.debug})`,
        messages: [],
      },
      { status: 502 }
    );
  }

  const token = authResult.token;

  try {
    // Ambil daftar pesan terbaru
    const messagesRes = await fetch("https://api.mail.tm/messages?page=1", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      cache: "no-store",
    });

    if (!messagesRes.ok) {
      return NextResponse.json(
        {
          success: false,
          email: emailToUse,
          error: "Gagal mengambil pesan dari mailbox",
          messages: [],
        },
        { status: 502 }
      );
    }

    const messagesData = await messagesRes.json();
    const members: MessageMember[] = messagesData["hydra:member"] || [];

    // Ambil detail maksimal 6 pesan teratas
    const detailedMessages = await Promise.all(
      members.slice(0, 6).map(async (msg) => {
        try {
          const detailRes = await fetch(`https://api.mail.tm/messages/${msg.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
            cache: "no-store",
          });

          if (!detailRes.ok) return null;
          const detail = await detailRes.json();

          const rawText = detail.text || "";
          const rawHtml = Array.isArray(detail.html)
            ? detail.html.join(" ")
            : typeof detail.html === "string"
            ? detail.html
            : "";

          const loginLink = extractLoginLink(rawHtml, rawText);

          return {
            id: msg.id,
            from: msg.from.address || msg.from.name || "Alight Creative",
            subject: msg.subject,
            createdAt: msg.createdAt,
            loginLink,
          };
        } catch {
          return null;
        }
      })
    );

    const validMessages = detailedMessages.filter(Boolean);

    return NextResponse.json({
      success: true,
      email: emailToUse,
      total: messagesData["hydra:totalItems"] || 0,
      messages: validMessages,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        email: emailToUse,
        error: error.message || "Terjadi kesalahan internal server",
        messages: [],
      },
      { status: 500 }
    );
  }
}
