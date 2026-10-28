export type PresetType =
  | 'alight_link'
  | 'alight_creative'
  | 'google_drive'
  | 'mediafire'
  | 'sfile'
  | 'shortlink'
  | 'whatsapp_channel'
  | 'channel_invite'
  | 'other';

export type PresetPriority = 'preset_link' | 'join_saluran';

export type PresetSource = 'caption' | 'description' | 'comment';

export type VideoPlatform = 'tiktok' | 'youtube';

export interface PresetItem {
  url: string;
  type: PresetType;
  priority: PresetPriority; // 'preset_link' (Prioritas 1) | 'join_saluran' (Prioritas 2)
  source: PresetSource;
  label: string;
  context: string;
  author?: string;
  isCreator?: boolean;
}

export interface VideoAuthor {
  id?: string;
  username: string;
  nickname?: string;
  avatar?: string;
}

export interface MediaDownloadItem {
  type: 'video' | 'audio';
  quality?: string;
  url: string;
}

export interface VideoMetadata {
  id: string;
  platform?: VideoPlatform;
  url: string;
  title: string;
  description?: string;
  author: VideoAuthor;
  cover?: string;
  videoUrl?: string; // Direct video MP4 url (with audio)
  hdVideoUrl?: string; // HD MP4 if available
  audioUrl?: string; // Direct audio MP3 url
  embedUrl?: string; // Embed player URL (especially for YouTube)
  downloads?: MediaDownloadItem[];
  stats?: {
    likes?: number;
    comments?: number;
    shares?: number;
    views?: number;
  };
}

export interface CommentItem {
  id: string;
  text: string;
  author: {
    id?: string;
    username: string;
    nickname?: string;
  };
  isAuthorPinned?: boolean;
  isCreator?: boolean;
  likeCount?: number;
  createdAt?: number;
}

export interface PresetFinderResult {
  video: VideoMetadata;
  platform: VideoPlatform;
  presets: PresetItem[]; // Semua item terurut (Prioritas 1 lalu Prioritas 2)
  directPresets: PresetItem[]; // Prioritas 1: Link preset Alight / Drive / Mediafire dll
  channelInvites: PresetItem[]; // Prioritas 2: Join Saluran / WA Channel / Link Bio
  totalPresetsFound: number;
  totalCommentsScanned: number;
  caption: string;
  description?: string;
  formattedText: string;
}

// Backwards compatibility aliases
export type TikTokVideoAuthor = VideoAuthor;
export type TikTokVideoMetadata = VideoMetadata;
export type TikTokCommentItem = CommentItem;
export type TikTokPresetFinderResult = PresetFinderResult;
