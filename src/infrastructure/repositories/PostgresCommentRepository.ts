import pg from 'pg';
import crypto from 'crypto';
import { ICommentRepository, CreateCommentParams } from '../../domain/repositories/ICommentRepository.js';
import { Comment, CommentNode } from '../../domain/entities/Comment.js';
import { config } from '../config/index.js';
import { FileCommentRepository } from './FileCommentRepository.js';

export class PostgresCommentRepository implements ICommentRepository {
  private pool: pg.Pool | null = null;
  private isTableInitialized = false;
  private readonly fallbackRepo: FileCommentRepository;

  constructor() {
    this.fallbackRepo = new FileCommentRepository();

    if (config.database.url) {
      this.pool = new pg.Pool({
        connectionString: config.database.url,
        ssl: { rejectUnauthorized: false },
        max: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 8000,
      });

      this.pool.on('error', (err) => {
        console.warn('⚠️ Postgres Comments Pool Warning:', err.message);
      });
    }
  }

  private async ensureTable(): Promise<void> {
    if (this.isTableInitialized || !this.pool) return;

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
      await this.pool.query(query);
      this.isTableInitialized = true;
    } catch (err: any) {
      console.warn('⚠️ Gagal inisialisasi tabel comments Postgres, beralih ke fallback:', err.message);
    }
  }

  public async createComment(params: CreateCommentParams): Promise<Comment> {
    if (!this.pool) {
      return this.fallbackRepo.createComment(params);
    }

    try {
      await this.ensureTable();

      const id = 'cm_' + crypto.randomUUID().replace(/-/g, '').slice(0, 16);
      const isAnon = Boolean(params.isAnonymous);
      const parentId = params.parentId || null;

      const query = `
        INSERT INTO comments (id, parent_id, name, is_anonymous, content, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING id, parent_id, name, is_anonymous, content, created_at;
      `;

      const result = await this.pool.query(query, [
        id,
        parentId,
        params.name,
        isAnon,
        params.content,
      ]);

      const row = result.rows[0];
      const created: Comment = {
        id: row.id,
        parentId: row.parent_id,
        name: row.name,
        isAnonymous: Boolean(row.is_anonymous),
        content: row.content,
        createdAt: new Date(row.created_at).toISOString(),
      };

      return created;
    } catch (err: any) {
      console.warn('⚠️ Postgres createComment gagal, beralih ke fallback:', err.message);
      return this.fallbackRepo.createComment(params);
    }
  }

  public async getCommentsTree(): Promise<CommentNode[]> {
    if (!this.pool) {
      return this.fallbackRepo.getCommentsTree();
    }

    try {
      await this.ensureTable();

      const query = `
        SELECT id, parent_id, name, is_anonymous, content, created_at
        FROM comments
        ORDER BY created_at ASC;
      `;

      const result = await this.pool.query(query);

      const flatList: Comment[] = result.rows.map((row) => ({
        id: row.id,
        parentId: row.parent_id,
        name: row.name,
        isAnonymous: Boolean(row.is_anonymous),
        content: row.content,
        createdAt: new Date(row.created_at).toISOString(),
      }));

      return this.fallbackRepo.buildTree(flatList);
    } catch (err: any) {
      console.warn('⚠️ Postgres getCommentsTree gagal, beralih ke fallback:', err.message);
      return this.fallbackRepo.getCommentsTree();
    }
  }
}
