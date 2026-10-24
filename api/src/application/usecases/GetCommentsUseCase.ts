import { ICommentRepository } from '../../domain/repositories/ICommentRepository.js';
import { CommentNode } from '../../domain/entities/Comment.js';
import { GetCommentsInputDto, GetCommentsOutputDto } from '../dto/comment.dto.js';

export class GetCommentsUseCase {
  constructor(private readonly commentRepository: ICommentRepository) {}

  public async execute(input?: GetCommentsInputDto): Promise<GetCommentsOutputDto> {
    const rawPage = input?.page ? Number(input.page) : 1;
    const rawLimit = input?.limit ? Number(input.limit) : 5;

    const page = Math.max(1, isNaN(rawPage) ? 1 : rawPage);
    const limit = Math.max(1, isNaN(rawLimit) ? 5 : rawLimit);

    const fullTree = await this.commentRepository.getCommentsTree();

    const countAll = (nodes: CommentNode[]): number => {
      let count = 0;
      for (const node of nodes) {
        count += 1;
        if (node.replies && node.replies.length > 0) {
          count += countAll(node.replies);
        }
      }
      return count;
    };

    const totalRootComments = fullTree.length;
    const totalComments = countAll(fullTree);
    const totalPages = Math.max(1, Math.ceil(totalRootComments / limit));
    const validPage = Math.min(page, totalPages);

    const startIndex = (validPage - 1) * limit;
    const paginatedRoots = fullTree.slice(startIndex, startIndex + limit);

    const attachFormattedTime = (nodes: CommentNode[]): CommentNode[] => {
      return nodes.map((node) => ({
        ...node,
        formattedTime: this.formatRelativeTime(new Date(node.createdAt)),
        replies: attachFormattedTime(node.replies || []),
      }));
    };

    const formattedComments = attachFormattedTime(paginatedRoots);

    return {
      success: true,
      page: validPage,
      limit,
      totalRootComments,
      totalComments,
      totalPages,
      hasNextPage: validPage < totalPages,
      hasPrevPage: validPage > 1,
      comments: formattedComments,
    };
  }

  private formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 45) return 'Baru saja';
    if (diffMin < 60) return `${diffMin} menit yang lalu`;
    if (diffHour < 24) return `${diffHour} jam yang lalu`;
    if (diffDay === 1) return 'Kemarin';
    if (diffDay < 7) return `${diffDay} hari yang lalu`;

    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}
