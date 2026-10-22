export interface Comment {
  id: string;
  parentId: string | null;
  name: string;
  isAnonymous: boolean;
  content: string;
  createdAt: Date | string;
}

export interface CommentNode extends Comment {
  avatarUrl: string;
  replyToName?: string | null;
  formattedTime?: string;
  replies: CommentNode[];
}
