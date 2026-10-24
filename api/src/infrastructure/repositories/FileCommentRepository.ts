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

    // 1. Buat node untuk setiap komentar
    for (const c of flatList) {
      const isAnon = c.isAnonymous;
      const avatarUrl = isAnon
        ? 'https://ui-avatars.com/api/?name=Anonim&background=1f2b42&color=94a3b8&bold=true'
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=00e599&color=0d121f&bold=true`;

      map.set(c.id, {
        ...c,
        avatarUrl,
        replyToName: null,
        replies: [],
      });
    }

    // 2. Hubungkan balasan ke akar utamanya (agar sejajar di level 1)
    for (const c of flatList) {
      const node = map.get(c.id)!;
      if (!c.parentId || !map.has(c.parentId)) {
        roots.push(node);
      } else {
        const directParent = map.get(c.parentId)!;

        // Cari akar paling atas (root comment)
        let curr = directParent;
        while (curr.parentId && map.has(curr.parentId)) {
          curr = map.get(curr.parentId)!;
        }
        const rootParent = curr;

        // Jika membalas balasan lain (bukan langsung ke root comment), cantumkan nama target
        if (directParent.id !== rootParent.id) {
          node.replyToName = directParent.name;
        }

        rootParent.replies.push(node);
      }
    }

    // 3. Urutkan komentar root: terbaru di atas (DESC)
    roots.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // 4. Urutkan semua balasan di bawah root secara kronologis (ASC)
    for (const r of roots) {
      if (r.replies && r.replies.length > 0) {
        r.replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }
    }

    return roots;
  }
}
