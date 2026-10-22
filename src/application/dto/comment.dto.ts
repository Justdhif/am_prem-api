import { CommentNode } from '../../domain/entities/Comment.js';

export interface AddCommentInputDto {
  parentId?: string | null;
  name?: string;
  isAnonymous?: boolean;
  content: string;
}

export interface AddCommentOutputDto {
  success: boolean;
  message: string;
  data: {
    id: string;
    parentId: string | null;
    name: string;
    isAnonymous: boolean;
    content: string;
    avatarUrl: string;
    createdAt: string;
  };
}

export interface GetCommentsOutputDto {
  success: boolean;
  totalComments: number;
  comments: CommentNode[];
}
