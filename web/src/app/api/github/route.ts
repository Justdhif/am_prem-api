import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DEFAULT_GITHUB_DATA = {
  username: "Justdhif",
  displayName: "Nadhif Ararya",
  profileUrl: "https://github.com/Justdhif",
  avatarUrl: "https://avatars.githubusercontent.com/u/155049684?v=4",
  bio: "try to be better",
  stats: {
    repos: "19",
    followers: "7",
    following: "7",
  },
};

export async function GET() {
  try {
    const res = await fetch("https://api.github.com/users/Justdhif", {
      headers: {
        "User-Agent": "Antigravity-AlightMotionPrem-App",
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        success: true,
        data: {
          username: data.login || "Justdhif",
          displayName: data.name || "Nadhif Ararya",
          profileUrl: data.html_url || "https://github.com/Justdhif",
          avatarUrl: data.avatar_url || DEFAULT_GITHUB_DATA.avatarUrl,
          bio: data.bio || "try to be better",
          stats: {
            repos: String(data.public_repos ?? DEFAULT_GITHUB_DATA.stats.repos),
            followers: String(data.followers ?? DEFAULT_GITHUB_DATA.stats.followers),
            following: String(data.following ?? DEFAULT_GITHUB_DATA.stats.following),
          },
        },
      });
    }

    // Fallback if rate limited by GitHub
    return NextResponse.json({
      success: true,
      data: DEFAULT_GITHUB_DATA,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      data: DEFAULT_GITHUB_DATA,
    });
  }
}
