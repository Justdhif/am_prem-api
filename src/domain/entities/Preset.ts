export type PresetType =
  | 'alight_link'
  | 'alight_creative'
  | 'google_drive'
  | 'mediafire'
  | 'sfile'
  | 'shortlink'
  | 'other';

export type PresetSource = 'caption' | 'comment';

export interface PresetItem {
  url: string;
  type: PresetType;
  source: PresetSource;
  label: string;
  context: string;
  author?: string;
  isCreator?: boolean;
}

export interface TikTokVideoAuthor {
  id?: string;
  username: string;
  nickname?: string;
  avatar?: string;
}

export interface TikTokVideoMetadata {
  id: string;
  url: string;
  title: string;
  author: TikTokVideoAuthor;
  cover?: string;
  stats?: {
    likes?: number;
    comments?: number;
    shares?: number;
    views?: number;
  };
}

export interface TikTokCommentItem {
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

export interface TikTokPresetFinderResult {
  video: TikTokVideoMetadata;
  presets: PresetItem[];
  totalPresetsFound: number;
  totalCommentsScanned: number;
  caption: string;
  formattedText: string;
}
