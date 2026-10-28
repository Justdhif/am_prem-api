export interface YouTubeVideoAuthor {
  id?: string;
  username: string;
  nickname?: string;
}

export interface YouTubeVideoMetadata {
  id: string;
  url: string;
  title: string;
  description: string;
  author: YouTubeVideoAuthor;
  cover?: string;
  videoUrl?: string;
  audioUrl?: string;
  embedUrl?: string;
  downloads?: {
    type: 'video' | 'audio';
    quality?: string;
    url: string;
  }[];
  stats?: {
    views?: number;
    likes?: number;
    comments?: number;
  };
}

export interface YouTubeCommentItem {
  id: string;
  text: string;
  author: {
    username: string;
    nickname?: string;
  };
  isCreator: boolean;
  isPinned: boolean;
  likeCount: number;
}

export interface YouTubeVideoData {
  metadata: YouTubeVideoMetadata;
  comments: YouTubeCommentItem[];
}

export interface IYouTubeGateway {
  extractYouTubeUrl(text: string): { url: string; videoId: string } | null;
  fetchVideoAndComments(urlOrId: string): Promise<YouTubeVideoData>;
}
