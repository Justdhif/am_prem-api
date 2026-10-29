import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch(
      "https://www.tiktok.com/oembed?url=https://www.tiktok.com/@justdhifbieber",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        },
        next: { revalidate: 3600 },
      }
    );

    if (res.ok) {
      const oembed = await res.json();
      return NextResponse.json({
        success: true,
        data: {
          username: "justdhifbieber",
          displayName: oembed.author_name || "𝗝υѕƚ𝗗𝗵ιƒ — order di bio",
          profileUrl: oembed.author_url || "https://www.tiktok.com/@justdhifbieber",
          title: oembed.title || "Creator Profile",
          embedHtml: oembed.html || null,
        },
      });
    }
  } catch (error) {
    console.warn("[TikTok API] Gagal mengambil data oembed:", error);
  }

  // Fallback data
  return NextResponse.json({
    success: true,
    data: {
      username: "justdhifbieber",
      displayName: "𝗝υѕƚ𝗗𝗵ιƒ — order di bio",
      profileUrl: "https://www.tiktok.com/@justdhifbieber",
      title: "Creator Profile",
      embedHtml: null,
    },
  });
}
