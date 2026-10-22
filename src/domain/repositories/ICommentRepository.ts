import { Comment, CommentNode } from '../entities/Comment.js';

export interface CreateCommentParams {
  parentId?: string | null;
  name: string;
  isAnonymous?: boolean;
  content: string;
}

export interface ICommentRepository {
  createComment(params: CreateCommentParams): Promise<Comment>;
  getCommentsTree(): Promise<CommentNode[]>;
}
