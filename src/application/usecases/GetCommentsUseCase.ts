import { ICommentRepository } from '../../domain/repositories/ICommentRepository.js';
import { CommentNode } from '../../domain/entities/Comment.js';
import { GetCommentsOutputDto } from '../dto/comment.dto.js';

export class GetCommentsUseCase {
  constructor(private readonly commentRepository: ICommentRepository) {}

  public async execute(): Promise<GetCommentsOutputDto> {
    const tree = await this.commentRepository.getCommentsTree();

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

    const attachFormattedTime = (nodes: CommentNode[]): CommentNode[] => {
      return nodes.map((node) => ({
        ...node,
        formattedTime: this.formatRelativeTime(new Date(node.createdAt)),
        replies: attachFormattedTime(node.replies || []),
      }));
    };

    const formattedTree = attachFormattedTime(tree);

    return {
      success: true,
      totalComments: countAll(formattedTree),
      comments: formattedTree,
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
