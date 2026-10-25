import { NextResponse } from "next/server";
import { parseLrcLyrics, LyricLine } from "@/components/player/lyricsData";

export const revalidate = 3600; // Cache 1 hour

export async function GET() {
  try {
    const url = "https://lrclib.net/api/search?track_name=nervousness&artist_name=Joon";
    const res = await fetch(url, {
      headers: {
        "User-Agent": "AlightMotionProWeb/1.0 (https://github.com/Justdhif/am_prem-api)",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`LRCLIB returned status ${res.status}`);
    }

    const data = await res.json();
    if (Array.isArray(data)) {
      const match = data.find((item: { syncedLyrics?: string }) => Boolean(item.syncedLyrics));
      if (match?.syncedLyrics) {
        const parsed = parseLrcLyrics(match.syncedLyrics, 215);
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
