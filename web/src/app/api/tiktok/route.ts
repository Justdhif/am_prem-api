import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const username = "justdhifbieber";
  const profileUrl = `https://www.tiktok.com/@${username}`;

  let displayName = "JusłDhıƒ — order di bio";
  let avatarUrl = "/images/logos/logo-web.webp";
  let followers = "330";
  let following = "7";
  let likes = "355";
  const bio = "🗎 @ayaa\nrandom account\n\nam prem 1k? order:\nhttps://linkbio-justdhif.vercel.app/";

  try {
    const res = await fetch(profileUrl, {
      headers: {
        "User-Agent": "Twitterbot/1.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
      },
      cache: "no-store",
    });

    if (res.ok) {
      const html = await res.text();

      // Extract display name from og:title (strip "di TikTok" or "on TikTok")
      const titleMatch = html.match(
        /<meta\s+property="og:title"\s+content="([^"]*)"/i
      );
      if (titleMatch) {
        displayName = titleMatch[1]
          .replace(/\s+(?:di|on)\s+TikTok.*$/i, "")
          .trim();
      }

      // Extract live avatar from og:image
      const imgMatch = html.match(
        /<meta\s+property="og:image"\s+content="([^"]*)"/i
      );
      if (imgMatch && imgMatch[1]) {
        avatarUrl = imgMatch[1].replace(/&amp;/g, "&");
      }

      // Extract exact live stats from og:description
      // Format: "@justdhifbieber 330 Followers, 7 Following, 355 Likes - Watch awesome short videos..."
      const descMatch = html.match(
        /<meta\s+property="og:description"\s+content="([^"]*)"/i
      );
      if (descMatch) {
        const desc = descMatch[1];
        const statMatch = desc.match(
          /([\d\.,KMkm]+)\s+Followers,\s*([\d\.,KMkm]+)\s+Following,\s*([\d\.,KMkm]+)\s+Likes/i
        );
        if (statMatch) {
          followers = statMatch[1];
          following = statMatch[2];
          likes = statMatch[3];
        }
      }
    }
  } catch (error) {
    console.warn("[TikTok API] Live scraping warning:", error);
  }

  return NextResponse.json({
    success: true,
    data: {
      username,
      displayName,
      profileUrl,
      avatarUrl,
      bio,
      verified: true,
      stats: {
        following,
        followers,
        likes,
      },
      tags: [
        "Aktivasi AM Pro 1K",
        "Preset XML Alight Motion",
        "Resmi & Bergaransi",
      ],
    },
  });
}
