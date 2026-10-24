import { ICommentRepository } from '../../domain/repositories/ICommentRepository.js';
import { AddCommentInputDto, AddCommentOutputDto } from '../dto/comment.dto.js';

export class AddCommentUseCase {
  constructor(private readonly commentRepository: ICommentRepository) {}

  public async execute(input: AddCommentInputDto): Promise<AddCommentOutputDto> {
    const rawContent = (input.content || '').trim();
    if (!rawContent) {
      throw new Error('Isi komentar tidak boleh kosong.');
    }

    if (rawContent.length > 1000) {
      throw new Error('Komentar maksimal 1000 karakter.');
    }

    const isAnonymous = Boolean(input.isAnonymous);
    let displayName = (input.name || '').trim();

    if (isAnonymous || !displayName) {
      displayName = 'Anonim';
    } else if (displayName.length > 50) {
      displayName = displayName.substring(0, 50);
    }

    // Sanitasi sederhana untuk teks komentar
    const sanitizedContent = rawContent
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const created = await this.commentRepository.createComment({
      parentId: input.parentId || null,
      name: displayName,
      isAnonymous,
      content: sanitizedContent,
    });

    const avatarUrl = isAnonymous
      ? 'https://ui-avatars.com/api/?name=Anonim&background=1f2b42&color=94a3b8&bold=true'
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=00e599&color=0d121f&bold=true`;

    return {
      success: true,
      message: 'Komentar berhasil dipublikasikan!',
      data: {
        id: created.id,
        parentId: created.parentId,
        name: created.name,
        isAnonymous: created.isAnonymous,
        content: created.content,
        avatarUrl,
        createdAt: new Date(created.createdAt).toISOString(),
      },
    };
  }
}
