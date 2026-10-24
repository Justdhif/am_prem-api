const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

export interface StatsResponse {
  success: boolean;
  totalActivations: number;
  todayActivations: number;
  status: string;
  formattedText?: string;
}

export const apiClient = {
  async getStats(): Promise<StatsResponse> {
    const res = await fetch(`${API_BASE_URL}/api/am/stats`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Gagal mengambil data statistik");
    const json = await res.json();
    return {
      success: Boolean(json.success),
      totalActivations: json.data?.totalPremium ?? json.totalActivations ?? json.totalPremium ?? 0,
      todayActivations: json.data?.todayPremium ?? json.todayActivations ?? json.todayPremium ?? 0,
      status: json.data?.status ?? json.status ?? "ready",
      formattedText: json.formattedText,
    };
  },

  async sendLink(email: string) {
    const res = await fetch(`${API_BASE_URL}/api/am/send-link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  },

  async verifyLink(email: string, link: string) {
    const res = await fetch(`${API_BASE_URL}/api/am/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email || undefined, link }),
    });
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  },

  async findPreset(url: string) {
    const res = await fetch(`${API_BASE_URL}/api/am/preset/find`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  },

  async getComments(page = 1): Promise<CommentsResponse> {
    const res = await fetch(`${API_BASE_URL}/api/comments?page=${page}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Gagal memuat komentar");
    return res.json();
  },

  async postComment(payload: {
    name?: string;
    isAnonymous?: boolean;
    content: string;
    parentId?: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  },
};
