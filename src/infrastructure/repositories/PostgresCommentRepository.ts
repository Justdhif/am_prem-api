import crypto from 'crypto';
import { asc } from 'drizzle-orm';
import { ICommentRepository, CreateCommentParams } from '../../domain/repositories/ICommentRepository.js';
import { Comment, CommentNode } from '../../domain/entities/Comment.js';
import { db, pool, schema } from '../database/drizzle.js';
import { FileCommentRepository } from './FileCommentRepository.js';

export class PostgresCommentRepository implements ICommentRepository {
  private isTableInitialized = false;
  private readonly fallbackRepo: FileCommentRepository;

  constructor() {
    this.fallbackRepo = new FileCommentRepository();
  }

  private async ensureTable(): Promise<void> {
    if (this.isTableInitialized || !pool) return;

    const query = `
      CREATE TABLE IF NOT EXISTS comments (
        id VARCHAR(50) PRIMARY KEY,
        parent_id VARCHAR(50) NULL,
        name VARCHAR(100) NOT NULL,
        is_anonymous BOOLEAN DEFAULT FALSE,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
      CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
    `;

    try {
      await pool.query(query);
      this.isTableInitialized = true;
    } catch (err: any) {
      console.warn('⚠️ Gagal inisialisasi tabel comments Postgres, beralih ke fallback:', err.message);
    }
  }

  public async createComment(params: CreateCommentParams): Promise<Comment> {
    if (!db) {
      return this.fallbackRepo.createComment(params);
    }

    try {
      await this.ensureTable();

      const id = 'cm_' + crypto.randomUUID().replace(/-/g, '').slice(0, 16);
      const isAnon = Boolean(params.isAnonymous);
      const parentId = params.parentId || null;

      const inserted = await db
        .insert(schema.comments)
        .values({
          id,
          parentId,
          name: params.name,
          isAnonymous: isAnon,
          content: params.content,
        })
        .returning();

      const row = inserted[0];
      return {
        id: row.id,
        parentId: row.parentId,
        name: row.name,
        isAnonymous: row.isAnonymous,
        content: row.content,
        createdAt: new Date(row.createdAt).toISOString(),
      };
    } catch (err: any) {
      console.warn('⚠️ Drizzle createComment gagal, beralih ke fallback:', err.message);
      return this.fallbackRepo.createComment(params);
    }
  }

  public async getCommentsTree(): Promise<CommentNode[]> {
    if (!db) {
      return this.fallbackRepo.getCommentsTree();
    }

    try {
      await this.ensureTable();

      const rows = await db
        .select()
        .from(schema.comments)
        .orderBy(asc(schema.comments.createdAt));

      const flatList: Comment[] = rows.map((row) => ({
        id: row.id,
        parentId: row.parentId,
        name: row.name,
        isAnonymous: row.isAnonymous,
        content: row.content,
        createdAt: new Date(row.createdAt).toISOString(),
      }));

      return this.fallbackRepo.buildTree(flatList);
    } catch (err: any) {
      console.warn('⚠️ Drizzle getCommentsTree gagal, beralih ke fallback:', err.message);
      return this.fallbackRepo.getCommentsTree();
    }
  }
}
