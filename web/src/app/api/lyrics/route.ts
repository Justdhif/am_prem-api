import { NextRequest, NextResponse } from "next/server";
import { parseLrcLyrics } from "@/components/player/lyricsData";

export const revalidate = 3600; // Cache 1 hour

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const track = searchParams.get("track") || "nervousness";
  const artist = searchParams.get("artist") || "Joon";
  const duration = parseFloat(searchParams.get("duration") || "215");

  try {
    const url = `https://lrclib.net/api/search?track_name=${encodeURIComponent(track)}&artist_name=${encodeURIComponent(artist)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "AlightMotionProWeb/1.0 (https://github.com/Justdhif/am_prem-api)",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`LRCLIB returned status ${res.status}`);
    }

    const text = await res.text();
    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Empty response from LRCLIB" }, { status: 404 });
    }

    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Invalid JSON response from LRCLIB" }, { status: 502 });
    }
    if (Array.isArray(data)) {
      const match = data.find((item: { syncedLyrics?: string }) => Boolean(item.syncedLyrics));
      if (match?.syncedLyrics) {
        const parsed = parseLrcLyrics(match.syncedLyrics, duration);
        return NextResponse.json({
          source: "lrclib",
          id: match.id,
          trackName: match.trackName,
          artistName: match.artistName,
          lyrics: parsed,
          rawLrc: match.syncedLyrics,
        });
      }
    }

    return NextResponse.json(
      { error: "No synced lyrics found in LRCLIB" },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("Failed to fetch lyrics from lrclib.net:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch from lrclib.net" },
      { status: 502 }
    );
  }
}
