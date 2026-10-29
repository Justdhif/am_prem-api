const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/+$/, "");

export interface CommentItem {
  id: string;
  name: string;
  isAnonymous: boolean;
  content: string;
  avatarUrl?: string;
  formattedTime?: string;
  createdAt: string;
  parentId?: string | null;
  replyToName?: string | null;
  replies?: CommentItem[];
}

export interface CommentsResponse {
  success: boolean;
  comments: CommentItem[];
  page?: number;
  limit?: number;
  totalRootComments?: number;
  totalComments?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  pagination?: {
    page: number;
    limit: number;
    totalComments: number;
    totalPages: number;
  };
}

export interface DailyStatItem {
  date: string;
  count: number;
}

export interface StatsResponse {
  success: boolean;
  totalActivations: number;
  todayActivations: number;
  status: string;
  formattedText?: string;
  history?: DailyStatItem[];
}

async function safeJson<T = any>(res: Response, fallback: T = {} as T): Promise<T> {
  try {
    const text = await res.text();
    if (!text || !text.trim()) return fallback;
    return JSON.parse(text) as T;
  } catch (err) {
    console.warn(`[apiClient] Failed to parse JSON from ${res.url} (status ${res.status}):`, err);
    return fallback;
  }
}

export const apiClient = {
  async getStats(): Promise<StatsResponse> {
    const res = await fetch(`${API_BASE_URL}/api/am/stats`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Gagal mengambil data statistik");
    const json = await safeJson(res, { success: false, data: {} } as any);
    return {
      success: Boolean(json.success),
      totalActivations: json.data?.totalPremium ?? json.totalActivations ?? json.totalPremium ?? 0,
      todayActivations: json.data?.todayPremium ?? json.todayActivations ?? json.todayPremium ?? 0,
      status: json.data?.status ?? json.status ?? "ready",
      formattedText: json.formattedText,
      history: json.data?.history || [],
    };
  },

  async sendLink(email: string) {
    const res = await fetch(`${API_BASE_URL}/api/am/send-link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await safeJson<any>(res, { success: false, message: "Gagal terhubung ke server" });
    return { ok: res.ok, status: res.status, data };
  },

  async verifyLink(email: string, link: string) {
    const res = await fetch(`${API_BASE_URL}/api/am/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email || undefined, link }),
    });
    const data = await safeJson<any>(res, { success: false, message: "Gagal memverifikasi akun" });
    return { ok: res.ok, status: res.status, data };
  },

  async findPreset(url: string) {
    const res = await fetch(`${API_BASE_URL}/api/am/preset/find`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await safeJson<any>(res, { success: false, message: "Gagal mencari preset" });
    return { ok: res.ok, status: res.status, data };
  },

  async getComments(page = 1): Promise<CommentsResponse> {
    const res = await fetch(`/api/comments?page=${page}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Gagal memuat komentar");
    return safeJson<CommentsResponse>(res, { success: false, comments: [] });
  },

  async postComment(payload: {
    name?: string;
    isAnonymous?: boolean;
    content: string;
    parentId?: string;
  }) {
    const res = await fetch(`/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await safeJson<any>(res, { success: false, message: "Gagal mengirim komentar" });
    return { ok: res.ok, status: res.status, data };
  },
};
