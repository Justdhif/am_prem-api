import { TikTokVideoMetadata, TikTokCommentItem } from '../entities/Preset.js';

export interface TikTokVideoData {
  metadata: TikTokVideoMetadata;
  comments: TikTokCommentItem[];
}

export interface ITikTokGateway {
  /**
   * Mengurai URL TikTok (termasuk resolve redirect link pendek seperti vt.tiktok.com atau vm.tiktok.com)
   * Mengambil data video (caption, judul, author) dan daftar komentar teratas / pinned.
   */
  fetchVideoAndComments(tiktokUrl: string): Promise<TikTokVideoData>;

  /**
   * Mengekstrak URL TikTok dari teks masukan (bisa teks bebas atau command chat)
   */
  extractTikTokUrl(text: string): string | null;
}
