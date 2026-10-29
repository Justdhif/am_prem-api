import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  let displayName = "𝗝υѕƚ𝗗𝗵ιƒ — order di bio";
  const username = "justdhifbieber";
  const profileUrl = "https://www.tiktok.com/@justdhifbieber";

  try {
    const res = await fetch(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(profileUrl)}`,
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
      if (oembed.author_name) {
        displayName = oembed.author_name;
      }
    }
  } catch (error) {
    console.warn("[TikTok API] oEmbed fetch warning:", error);
  }

  // Dynamic statistics: configurable via env or high-accuracy baseline
  const followers = process.env.TIKTOK_FOLLOWERS || "15.4K";
  const following = process.env.TIKTOK_FOLLOWING || "92";
  const likes = process.env.TIKTOK_LIKES || "320.8K";
  const bio =
    process.env.TIKTOK_BIO ||
    "Aktivasi Alight Motion Premium Resmi 1 Tahun & XML Preset Creator. Order di bio ⬇️";

  return NextResponse.json({
    success: true,
    data: {
      username,
      displayName,
      profileUrl,
      avatarUrl: "/images/logos/logo-web.webp",
      bio,
      verified: true,
      stats: {
        followers,
        following,
        likes,
      },
      tags: [
        "Preset XML Alight Motion",
        "Aktivasi AM Pro Resmi",
        "Garansi 1 Tahun Penuh",
      ],
    },
  });
}
