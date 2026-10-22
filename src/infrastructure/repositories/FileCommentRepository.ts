import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { ICommentRepository, CreateCommentParams } from '../../domain/repositories/ICommentRepository.js';
import { Comment, CommentNode } from '../../domain/entities/Comment.js';

export class FileCommentRepository implements ICommentRepository {
  private readonly filePath: string;
  private inMemoryComments: Comment[] = [];

  constructor() {
    this.filePath = process.env.VERCEL
      ? path.resolve('/tmp', 'comments.json')
      : path.resolve(process.cwd(), 'data', 'comments.json');
    this.loadComments();
  }

  private ensureDirectoryExists(targetPath: string): void {
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch {
        // Abaikan jika tidak diizinkan membuat direktori
      }
    }
  }

  private loadComments(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf8').trim();
        if (raw) {
          this.inMemoryComments = JSON.parse(raw);
        }
      }
    } catch {
      this.inMemoryComments = [];
    }
  }

  private saveComments(): void {
    try {
      this.ensureDirectoryExists(this.filePath);
      fs.writeFileSync(this.filePath, JSON.stringify(this.inMemoryComments, null, 2), 'utf8');
    } catch {
      // Jika sistem file readonly (misal di Vercel), simpan di memori saja
    }
  }

  public async createComment(params: CreateCommentParams): Promise<Comment> {
    const newComment: Comment = {
      id: 'cm_' + crypto.randomUUID().replace(/-/g, '').slice(0, 16),
      parentId: params.parentId || null,
      name: params.name,
      isAnonymous: Boolean(params.isAnonymous),
      content: params.content,
      createdAt: new Date().toISOString(),
    };

    this.inMemoryComments.push(newComment);
    this.saveComments();
    return newComment;
  }

  public async getCommentsTree(): Promise<CommentNode[]> {
    this.loadComments();
    return this.buildTree(this.inMemoryComments);
  }

  public buildTree(flatList: Comment[]): CommentNode[] {
    const map = new Map<string, CommentNode>();
    const roots: CommentNode[] = [];

    // Buat node untuk setiap komentar
    for (const c of flatList) {
      const isAnon = c.isAnonymous;
      const avatarUrl = isAnon
        ? 'https://ui-avatars.com/api/?name=Anonim&background=1f2b42&color=94a3b8&bold=true'
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=00e599&color=0d121f&bold=true`;

      map.set(c.id, {
        ...c,
        avatarUrl,
        replies: [],
      });
    }

    // Sambungkan parent-child
    for (const c of flatList) {
      const node = map.get(c.id)!;
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId)!.replies.push(node);
      } else {
        roots.push(node);
      }
    }

    // Urutkan akar: komentar terbaru di atas (DESC)
    roots.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Urutkan balasan: kronologis (ASC)
    const sortRepliesAsc = (nodes: CommentNode[]) => {
      for (const n of nodes) {
        if (n.replies && n.replies.length > 0) {
          n.replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          sortRepliesAsc(n.replies);
        }
      }
    };
    sortRepliesAsc(roots);

    return roots;
  }
}
