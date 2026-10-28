export interface PresetLinkItem {
  type: "5mb" | "xml" | "sound" | "channel";
  label: string;
  url: string;
  fileName?: string;
}

export interface TrendingPreset {
  id: string;
  title: string;
  creator: string;
  creatorHandle: string;
  platform: "tiktok" | "youtube";
  category: "jj-presets" | "cinematic" | "color-grading" | "velocity" | "gameplay";
  categoryLabel: string;
  soundTitle: string;
  likes: number;
  commentsCount: number;
  views: number;
  updatedAt: string;
  videoUrl: string;
  links: PresetLinkItem[];
}

export interface SavedPreset {
  id: string;
  title: string;
  creator: string;
  platform: string;
  url: string;
  type: "5mb" | "xml" | "sound" | "channel";
  savedAt: string;
}

export const QUICK_SAMPLE_LINKS = [
  {
    label: "VT 5MB & XML (@vkriedtz2)",
    url: "https://vt.tiktok.com/ZSjR1rQ4h/",
    platform: "tiktok",
  },
  {
    label: "VT Multi-Preset (@wyxzwangyy)",
    url: "https://vt.tiktok.com/ZSjR8tV4x/",
    platform: "tiktok",
  },
  {
    label: "YouTube Kane (@OpetGanteng2)",
    url: "https://youtu.be/dQw4w9WgXcQ",
    platform: "youtube",
  },
];

export const CATEGORY_FILTERS = [
  { id: "all", label: "Semua Kategori" },
  { id: "jj-presets", label: "JJ Presets" },
  { id: "cinematic", label: "Cinematic" },
  { id: "color-grading", label: "Color Grading" },
  { id: "velocity", label: "Velocity & Slowmo" },
  { id: "gameplay", label: "Gameplay ML/FF" },
] as const;

export const TRENDING_PRESETS: TrendingPreset[] = [
  {
    id: "tt-01",
    title: "PRESET AM JEDAG JEDUG FYP TIKTOK TERBARU 2026 || DJ KANE MENGKANE FULL BEAT 60FPS",
    creator: "hirowangyy",
    creatorHandle: "@hirowangyy",
    platform: "tiktok",
    category: "jj-presets",
    categoryLabel: "JJ Presets",
    soundTitle: "DJ Kane Mengkane Full Beat FYP 2026",
    likes: 154200,
    commentsCount: 2940,
    views: 1340400,
    updatedAt: "Baru saja",
    videoUrl: "https://www.tiktok.com/@hirowangyy",
    links: [
      {
        type: "5mb",
        label: "Preset 1 — Prst 5MB (Alight Creative)",
        url: "https://alightcreative.com/am/share/u/lsuJsXCEpvMaMCblZ7s9tX2oeNK2/p/CdPtgL3rYO-ec22bf791c90da43",
      },
      {
        type: "xml",
        label: "Preset 1 — Prst XML (Google Drive)",
        url: "https://drive.google.com/file/d/1YzF8Eohce6rGlccqAKj4rbRZEuWN-vbi/view?usp=drivesdk",
        fileName: "FYP_DJKane_60fps.xml",
      },
      {
        type: "sound",
        label: "Sound Audio (Google Drive)",
        url: "https://drive.google.com/file/d/1KjW8EKVTIDGzx631V6kmW2yd_wGExScQ/view?usp=drivesdk",
      },
      {
        type: "5mb",
        label: "Preset 2 — Prst 5MB (Alight Creative)",
        url: "https://alightcreative.com/am/share/u/lsuJsXCEpvMaMCblZ7s9tX2oeNK2/p/KBKGOFDeTO-4dd62b32062c3476",
      },
    ],
  },
  {
    id: "yt-01",
    title: "PRESET AM JJ KANE BASS GLERR || DJ TABRAK TABRAK MASUK X MUKA DUA (5MB & XML)",
    creator: "OpetGanteng2",
    creatorHandle: "@OpetGanteng2",
    platform: "youtube",
    category: "jj-presets",
    categoryLabel: "JJ Presets",
    soundTitle: "DJ Tabrak Tabrak Masuk x Kane Bass Glerr",
    likes: 118900,
    commentsCount: 1840,
    views: 912000,
    updatedAt: "1 jam lalu",
    videoUrl: "https://www.youtube.com/@OpetGanteng2",
    links: [
      {
        type: "5mb",
        label: "Prst 5MB (Alight Motion)",
        url: "https://alightcreative.com/am/share/u/CySFjQ0lYYNYbzkT2Vdd7IumW1r1/p/ckzHhOiPi7-300aaeb8e8c07ae3",
      },
      {
        type: "xml",
        label: "Prst XML (Google Drive)",
        url: "https://drive.google.com/file/d/1heAz4L3Hp5SYcr3faVPqqfc-MkrsSjrk/view?usp=drivesdk",
        fileName: "Kane_TabrakMasuk_60fps.xml",
      },
    ],
  },
  {
    id: "yt-02",
    title: "PRESET AM JEDAG JEDUG 3D SHAKE || DJ MALAM PAGI X KANE REMIX FULL BEAT",
    creator: "aynxzpejeje",
    creatorHandle: "@aynxzpejeje",
    platform: "youtube",
    category: "jj-presets",
    categoryLabel: "JJ Presets",
    soundTitle: "DJ Malam Pagi x Kane Slow Bass",
    likes: 109400,
    commentsCount: 1650,
    views: 842000,
    updatedAt: "3 jam lalu",
    videoUrl: "https://www.youtube.com/@aynxzpejeje",
    links: [
      {
        type: "5mb",
        label: "Prst 5MB (Alight Motion)",
        url: "https://alightcreative.com/am/share/u/CySFjQ0lYYNYbzkT2Vdd7IumW1r1/p/3dShake-992a83f91",
      },
      {
        type: "xml",
        label: "Prst XML (Google Drive)",
        url: "https://drive.google.com/file/d/1vQ8JkzL3928kZ19L4X910a9Kz-drive/view?usp=drivesdk",
        fileName: "MalamPagi_3DShake.xml",
      },
      {
        type: "sound",
        label: "Sound Audio (Drive)",
        url: "https://drive.google.com/file/d/1L93kXkz991La093kLs-sound/view?usp=drivesdk",
      },
    ],
  },
  {
    id: "tt-02",
    title: "PRESET AM VELOCITY X SLOWMO TWIXTOR HALUS FYP TIKTOK || SOUND SPED UP AESTHETIC",
    creator: "velocity_motion",
    creatorHandle: "@velocity_motion",
    platform: "tiktok",
    category: "velocity",
    categoryLabel: "Velocity & Slowmo",
    soundTitle: "Sped Up Aesthetic Vibe Slowmo",
    likes: 98300,
    commentsCount: 1420,
    views: 750000,
    updatedAt: "4 jam lalu",
    videoUrl: "https://www.tiktok.com/@velocity_motion",
    links: [
      {
        type: "5mb",
        label: "Preset 5MB (Alight Creative)",
        url: "https://alightcreative.com/am/share/u/lsuJsXCEpvMaMCblZ7s9tX2oeNK2/p/Velocity-Twixtor-60fps",
      },
      {
        type: "xml",
        label: "Preset XML Drive",
        url: "https://drive.google.com/file/d/1TwixtorSmooth_Velocity_60fps/view?usp=drivesdk",
        fileName: "Twixtor_Smooth_Velocity.xml",
      },
    ],
  },
  {
    id: "tt-03",
    title: "PRESET AM GAMEPLAY MLBB MONTAGE SAVAGE DIBAWAH 5MB || SOUND JJ FULL BEAT",
    creator: "mlbb_edits_am",
    creatorHandle: "@mlbb_edits_am",
    platform: "tiktok",
    category: "gameplay",
    categoryLabel: "Gameplay ML/FF",
    soundTitle: "DJ Savage Beat MLBB Kane",
    likes: 142100,
    commentsCount: 2180,
    views: 1120000,
    updatedAt: "5 jam lalu",
    videoUrl: "https://www.tiktok.com/@mlbb_edits_am",
    links: [
      {
        type: "5mb",
        label: "Preset 5MB (Alight Creative)",
        url: "https://alightcreative.com/am/share/u/lsuJsXCEpvMaMCblZ7s9tX2oeNK2/p/MLBB-Montage-Savage-5MB",
      },
      {
        type: "xml",
        label: "Preset XML (MediaFire)",
        url: "https://www.mediafire.com/file/mlbb_montage_savage_60fps.xml/file",
        fileName: "MLBB_Montage_Savage.xml",
      },
      {
        type: "sound",
        label: "Sound Audio (Google Drive)",
        url: "https://drive.google.com/file/d/1SavageSoundMLBB_Beat/view?usp=drivesdk",
      },
    ],
  },
  {
    id: "tt-04",
    title: "PRESET AM COLOR GRADING HDR CC GLOW 4K ULTRA HD || EFEK JERUK NIPIS VIRAL TIKTOK",
    creator: "cc_glowmaster",
    creatorHandle: "@cc_glowmaster",
    platform: "tiktok",
    category: "color-grading",
    categoryLabel: "Color Grading",
    soundTitle: "Aesthetic Chill Beat Instrumental",
    likes: 87500,
    commentsCount: 960,
    views: 610000,
    updatedAt: "6 jam lalu",
    videoUrl: "https://www.tiktok.com/@cc_glowmaster",
    links: [
      {
        type: "5mb",
        label: "Preset 5MB (Alight Creative)",
        url: "https://alightcreative.com/am/share/u/lsuJsXCEpvMaMCblZ7s9tX2oeNK2/p/CC-Glow-JerukNipis-4K",
      },
      {
        type: "xml",
        label: "Preset XML Drive",
        url: "https://drive.google.com/file/d/1CC_JerukNipis_HDR_Glow.xml/view?usp=drivesdk",
        fileName: "CC_Glow_JerukNipis_4K.xml",
      },
    ],
  },
  {
    id: "yt-03",
    title: "PRESET AM CINEMATIC AESTHETIC STORY WA 16:9 || SOUND INDIE SLOW VIBES 5MB & XML",
    creator: "cinematic_am",
    creatorHandle: "@cinematic_am",
    platform: "youtube",
    category: "cinematic",
    categoryLabel: "Cinematic",
    soundTitle: "Indie Slow Acoustic Guitar Vibes",
    likes: 76200,
    commentsCount: 890,
    views: 530000,
    updatedAt: "7 jam lalu",
    videoUrl: "https://www.youtube.com/@cinematic_am",
    links: [
      {
        type: "5mb",
        label: "Preset 5MB (Alight Creative)",
        url: "https://alightcreative.com/am/share/u/CySFjQ0lYYNYbzkT2Vdd7IumW1r1/p/Cinematic-StoryWA-16-9",
      },
      {
        type: "xml",
        label: "Preset XML Drive",
        url: "https://drive.google.com/file/d/1Cinematic_StoryWA_Indie.xml/view?usp=drivesdk",
        fileName: "Cinematic_StoryWA_16-9.xml",
      },
      {
        type: "sound",
        label: "Sound Audio (Drive)",
        url: "https://drive.google.com/file/d/1Sound_Indie_Slow_Vibes/view?usp=drivesdk",
      },
    ],
  },
  {
    id: "tt-05",
    title: "PRESET AM FREE FIRE PEPENGSHOT JEDAG JEDUG LOBBY DIBAWAH 5MB & XML || TREND FF VIRAL",
    creator: "ff_pepengshot",
    creatorHandle: "@ff_pepengshot",
    platform: "tiktok",
    category: "gameplay",
    categoryLabel: "Gameplay ML/FF",
    soundTitle: "DJ Pepeng Shot Kane Full Bass",
    likes: 125800,
    commentsCount: 1950,
    views: 980000,
    updatedAt: "8 jam lalu",
    videoUrl: "https://www.tiktok.com/@ff_pepengshot",
    links: [
      {
        type: "5mb",
        label: "Preset 5MB (Alight Creative)",
        url: "https://alightcreative.com/am/share/u/lsuJsXCEpvMaMCblZ7s9tX2oeNK2/p/FF-Pepengshot-Lobby-5MB",
      },
      {
        type: "xml",
        label: "Preset XML (MediaFire)",
        url: "https://www.mediafire.com/file/ff_pepengshot_lobby.xml/file",
        fileName: "FF_Pepengshot_Lobby.xml",
      },
      {
        type: "sound",
        label: "Sound Audio (Drive)",
        url: "https://drive.google.com/file/d/1FF_Sound_Pepengshot/view?usp=drivesdk",
      },
    ],
  },
];

/**
 * Client-side Regex extractor to parse links from raw comment/description text
 */
export function extractPresetsFromRawText(text: string): PresetLinkItem[] {
  if (!text) return [];

  const results: PresetLinkItem[] = [];
  const seen = new Set<string>();

  // Extract all URLs
  const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/gi;
  const urls = text.match(urlRegex) || [];

  for (const url of urls) {
    const cleanUrl = url.replace(/[.,;!?)]+$/, "");
    if (seen.has(cleanUrl)) continue;
    seen.add(cleanUrl);

    // 1. Alight Creative 5MB Link
    if (cleanUrl.includes("alightcreative.com") || cleanUrl.includes("alight.link")) {
      results.push({
        type: "5mb",
        label: "Prst 5MB (Alight Creative)",
        url: cleanUrl,
      });
      continue;
    }

    // 2. Google Drive / MediaFire XML
    if (
      cleanUrl.includes("drive.google.com") ||
      cleanUrl.includes("mediafire.com") ||
      cleanUrl.includes("sfile.mobi") ||
      cleanUrl.toLowerCase().endsWith(".xml")
    ) {
      const isSound = /sound|audio|lagu|musik/i.test(text);
      if (isSound && !cleanUrl.toLowerCase().endsWith(".xml")) {
        results.push({
          type: "sound",
          label: "Sound Audio (Drive/Cloud)",
          url: cleanUrl,
        });
      } else {
        results.push({
          type: "xml",
          label: "Prst XML (Google Drive/Cloud)",
          url: cleanUrl,
        });
      }
      continue;
    }

    // 3. Saluran WhatsApp / Telegram
    if (
      cleanUrl.includes("chat.whatsapp.com") ||
      cleanUrl.includes("whatsapp.com/channel") ||
      cleanUrl.includes("t.me/")
    ) {
      results.push({
        type: "channel",
        label: "Join Saluran (SL Preset)",
        url: cleanUrl,
      });
      continue;
    }
  }

  return results;
}
