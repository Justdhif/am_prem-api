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
