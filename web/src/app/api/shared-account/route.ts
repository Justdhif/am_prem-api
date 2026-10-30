import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const DEFAULT_EMAIL = "ampremcommunity@maxxspace.com";

// Permanent Mail.tm JWT token for ampremcommunity@maxxspace.com (never expires, no exp field)
const STATIC_TOKEN =
  process.env.SHARED_MAIL_TOKEN ||
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3OTMzNDY4NjAsInJvbGVzIjpbIlJPTEVfVVNFUiJdLCJhZGRyZXNzIjoiYW1wcmVtY29tbXVuaXR5QG1heHhzcGFjZS5jb20iLCJpZCI6IjZhZTQzZjhkNmUzMmExNmRmYjAxNDU5MiIsIm1lcmN1cmUiOnsic3Vic2NyaWJlIjpbIi9hY2NvdW50cy82YWU0M2Y4ZDZlMzJhMTZkZmIwMTQ1OTIiXX19.1JrtjMk2B13e1enfF1iW6WcVyc4LLPLBJHW5KdwYVU0o6TFvH5j6GFCbApL6mqYLLR94YRRIYwJoNFkcEdYvvg";

const MAIL_TM_HEADERS = {
  Accept: "application/json, text/plain, */*",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
};

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
  if (
    hrefMatch &&
    (hrefMatch[1].includes("firebaseapp.com") ||
      hrefMatch[1].includes("alightcreative.com") ||
      hrefMatch[1].includes("auth_action") ||
      hrefMatch[1].includes("auth/action"))
  ) {
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

export async function GET() {
  const emailToUse = (process.env.SHARED_FREE_EMAIL || DEFAULT_EMAIL).trim();

  try {
    // Ambil daftar pesan terbaru langsung menggunakan token
    const messagesRes = await fetch("https://api.mail.tm/messages?page=1", {
      headers: {
        ...MAIL_TM_HEADERS,
        Authorization: `Bearer ${STATIC_TOKEN}`,
      },
      cache: "no-store",
    });

    if (!messagesRes.ok) {
      const errText = await messagesRes.text().catch(() => "");
      return NextResponse.json(
        {
          success: false,
          version: "2026-10-30-v3-token",
          email: emailToUse,
          error: `Gagal mengambil pesan dari mailbox: HTTP ${messagesRes.status} ${errText}`,
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
              ...MAIL_TM_HEADERS,
              Authorization: `Bearer ${STATIC_TOKEN}`,
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
      version: "2026-10-30-v3-token",
      email: emailToUse,
      total: messagesData["hydra:totalItems"] || 0,
      messages: validMessages,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        version: "2026-10-30-v3-token",
        email: emailToUse,
        error: error.message || "Terjadi kesalahan internal server",
        messages: [],
      },
      { status: 500 }
    );
  }
}
