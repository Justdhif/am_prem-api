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

export interface GetCommentsInputDto {
  page?: number;
  limit?: number;
}

export interface GetCommentsOutputDto {
  success: boolean;
  page: number;
  limit: number;
  totalRootComments: number;
  totalComments: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  comments: CommentNode[];
}
