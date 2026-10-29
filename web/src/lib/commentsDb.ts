import { neon } from "@neondatabase/serverless";
import crypto from "crypto";

export interface DbComment {
  id: string;
  parentId: string | null;
  name: string;
  isAnonymous: boolean;
  content: string;
  createdAt: string;
}

export interface CommentNode extends DbComment {
  avatarUrl: string;
  replyToName: string | null;
  formattedTime?: string;
  replies: CommentNode[];
}

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_y7TUMAVvtWz3@ep-round-night-b3dxsp8w-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

function getSql() {
  return neon(DATABASE_URL);
}

let isTableReady = false;

export async function ensureCommentsTable() {
  if (isTableReady) return;
  try {
    const sql = getSql();
    await sql.query(`
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
    `);
    isTableReady = true;
  } catch (err: any) {
    console.warn("[CommentsDB] ensureTable error:", err.message);
  }
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 45) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit yang lalu`;
  if (diffHour < 24) return `${diffHour} jam yang lalu`;
  if (diffDay === 1) return "Kemarin";
  if (diffDay < 7) return `${diffDay} hari yang lalu`;

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function buildCommentsTree(flatList: DbComment[]): CommentNode[] {
  const map = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  for (const c of flatList) {
    const avatarUrl = c.isAnonymous
      ? "https://ui-avatars.com/api/?name=Anonim&background=1f2b42&color=94a3b8&bold=true"
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          c.name
        )}&background=00e599&color=0d121f&bold=true`;

    map.set(c.id, {
      ...c,
      avatarUrl,
      replyToName: null,
      replies: [],
    });
  }

  for (const c of flatList) {
    const node = map.get(c.id)!;
    if (!c.parentId || !map.has(c.parentId)) {
      roots.push(node);
    } else {
      const directParent = map.get(c.parentId)!;
      let curr = directParent;
      while (curr.parentId && map.has(curr.parentId)) {
        curr = map.get(curr.parentId)!;
      }
      const rootParent = curr;

      if (directParent.id !== rootParent.id) {
        node.replyToName = directParent.name;
      }

      rootParent.replies.push(node);
    }
  }

  // Terbaru di atas
  roots.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Balasan diurutkan secara kronologis (ASC)
  for (const r of roots) {
    if (r.replies && r.replies.length > 0) {
      r.replies.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }
  }

  return roots;
}

export async function getAllCommentsTree(): Promise<CommentNode[]> {
  await ensureCommentsTable();
  const sql = getSql();
  const rows = (await sql.query(`
    SELECT 
      id, 
      parent_id as "parentId", 
      name, 
      is_anonymous as "isAnonymous", 
      content, 
      created_at as "createdAt" 
    FROM comments 
    ORDER BY created_at ASC
  `)) as any[];

  const flatList: DbComment[] = (rows || []).map((row) => ({
    id: row.id,
    parentId: row.parentId,
    name: row.name,
    isAnonymous: Boolean(row.isAnonymous),
    content: row.content,
    createdAt: new Date(row.createdAt).toISOString(),
  }));

  return buildCommentsTree(flatList);
}

export async function createCommentInDb(params: {
  parentId?: string | null;
  name: string;
  isAnonymous: boolean;
  content: string;
}): Promise<DbComment> {
  await ensureCommentsTable();
  const sql = getSql();
  const id = "cm_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  const parentId = params.parentId || null;
  const isAnonymous = Boolean(params.isAnonymous);

  const rows = (await sql.query(
    `
    INSERT INTO comments (id, parent_id, name, is_anonymous, content)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING 
      id, 
      parent_id as "parentId", 
      name, 
      is_anonymous as "isAnonymous", 
      content, 
      created_at as "createdAt"
  `,
    [id, parentId, params.name, isAnonymous, params.content]
  )) as any[];

  const row = rows[0];
  return {
    id: row.id,
    parentId: row.parentId,
    name: row.name,
    isAnonymous: Boolean(row.isAnonymous),
    content: row.content,
    createdAt: new Date(row.createdAt).toISOString(),
  };
}
