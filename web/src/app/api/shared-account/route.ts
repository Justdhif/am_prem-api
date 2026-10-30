import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const SHARED_EMAIL = process.env.SHARED_FREE_EMAIL || "ampremcommunity@sharklasers.com";
const GUERRILLA_USER = process.env.SHARED_GUERRILLA_USER || "ampremcommunity";

function extractLoginLink(htmlContent?: string, textContent?: string, email?: string): string | null {
  const combined = `${textContent || ""} ${htmlContent || ""}`;

  // 1. Prioritaskan tautan dalam tag <a href="..."> dari HTML
  let link: string | null = null;
  const hrefMatch = combined.match(/href=['"](https?:\/\/[^'"]+)['"]/i);
  if (
    hrefMatch &&
    (hrefMatch[1].includes("firebaseapp.com") ||
      hrefMatch[1].includes("alightcreative.com") ||
      hrefMatch[1].includes("auth_action") ||
      hrefMatch[1].includes("auth/action"))
  ) {
    link = hrefMatch[1].replace(/&amp;/g, "&");
  } else {
    // 2. Fallback regex untuk URL Alight Creative / Firebase auth
    const generalMatch = combined.match(
      /(https?:\/\/(?:alight-creative\.firebaseapp\.com|alightcreative\.com)[^\s"'<>]+)/i
    );
    if (generalMatch) {
      link = generalMatch[1].replace(/&amp;/g, "&");
    }
  }

  if (!link) return null;

  // Injeksi parameter email ke dalam Firebase link agar Firebase SDK di Alight Motion
  // tidak gagal validasi "email provided does not match sign-in email address"
  if (email) {
    try {
      if (link.includes("alight-creative.firebaseapp.com/__/auth/links?link=")) {
        const urlObj = new URL(link);
        const innerLinkStr = urlObj.searchParams.get("link");
        if (innerLinkStr) {
          const innerUrl = new URL(innerLinkStr);
          if (!innerUrl.searchParams.has("email")) {
            innerUrl.searchParams.set("email", email);
          }
          urlObj.searchParams.set("link", innerUrl.toString());
          link = urlObj.toString();
        }
      } else if (link.includes("alightcreative.com")) {
        const urlObj = new URL(link);
        if (!urlObj.searchParams.has("email")) {
          urlObj.searchParams.set("email", email);
        }
        link = urlObj.toString();
      }
    } catch {
      // jika gagal parse URL, tetap gunakan link asli
    }
  }

  return link;
}

export async function GET() {
  try {
    // 1. Dapatkan sesi baru dari Guerrilla Mail
    const initRes = await fetch("https://api.guerrillamail.com/ajax.php?f=get_email_address", {
      cache: "no-store",
    });

    if (!initRes.ok) {
      return NextResponse.json(
        {
          success: false,
          email: SHARED_EMAIL,
          error: "Gagal menginisialisasi sesi mailbox publik",
          messages: [],
        },
        { status: 502 }
      );
    }

    const initData = await initRes.json();
    const sid = initData.sid_token;

    // 2. Set username mailbox ke ampremcommunity
    await fetch(
      `https://api.guerrillamail.com/ajax.php?f=set_email_user&email_user=${encodeURIComponent(
        GUERRILLA_USER
      )}&lang=en&sid_token=${sid}`,
      { cache: "no-store" }
    );

    // 3. Periksa daftar email masuk
    const checkRes = await fetch(
      `https://api.guerrillamail.com/ajax.php?f=check_email&seq=0&sid_token=${sid}`,
      { cache: "no-store" }
    );

    if (!checkRes.ok) {
      return NextResponse.json(
        {
          success: false,
          email: SHARED_EMAIL,
          error: "Gagal mengambil daftar email masuk",
          messages: [],
        },
        { status: 502 }
      );
    }

    const checkData = await checkRes.json();
    const rawList = Array.isArray(checkData.list) ? checkData.list : [];

    // Filter pesan sambutan default Guerrilla Mail
    const actualMessages = rawList.filter(
      (m: any) =>
        m.mail_from !== "no-reply@guerrillamail.com" &&
        !String(m.mail_subject || "").toLowerCase().includes("welcome to guerrilla mail")
    );

    // 4. Ambil detail konten tiap pesan untuk ekstrak magic login link
    const now = Date.now();
    const detailedMessages = await Promise.all(
      actualMessages.slice(0, 5).map(async (m: any) => {
        try {
          const createdAtDate = new Date(Number(m.mail_timestamp) * 1000);
          const ageMs = now - createdAtDate.getTime();

          // Batasi masa aktif tautan login maksimal 1 menit (60 detik)
          if (ageMs > 60 * 1000) {
            return null;
          }

          const mailRes = await fetch(
            `https://api.guerrillamail.com/ajax.php?f=fetch_email&email_id=${m.mail_id}&sid_token=${sid}`,
            { cache: "no-store" }
          );

          if (!mailRes.ok) return null;
          const mailData = await mailRes.json();

          const loginLink = extractLoginLink(mailData.mail_body, mailData.mail_excerpt, SHARED_EMAIL);

          return {
            id: String(m.mail_id),
            from: "Alight Creative Official",
            subject: "Tautan Masuk Alight Motion",
            rawSubject: m.mail_subject,
            createdAt: createdAtDate.toISOString(),
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
      email: SHARED_EMAIL,
      total: validMessages.length,
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
