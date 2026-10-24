import axios from 'axios';
import {
  IYouTubeGateway,
  YouTubeVideoData,
  YouTubeVideoMetadata,
  YouTubeCommentItem,
} from '../../domain/gateways/IYouTubeGateway.js';

export class YouTubeGateway implements IYouTubeGateway {
  private readonly defaultTimeout = 12000;

  /**
   * Mengekstrak URL YouTube dan ID Video dari teks input
   * Mendukung:
   * - https://www.youtube.com/watch?v=xxxx
   * - https://youtu.be/xxxx
   * - https://www.youtube.com/shorts/xxxx
   * - https://m.youtube.com/watch?v=xxxx
   */
  public extractYouTubeUrl(text: string): { url: string; videoId: string } | null {
    if (!text) return null;
    const match = text.match(
      /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_\-]{11})/i
    );
    if (match) {
      return {
        url: `https://www.youtube.com/watch?v=${match[1]}`,
        videoId: match[1],
      };
    }
    return null;
  }

  /**
   * Mengambil metadata video (judul, channel, deskripsi) dan komentar YouTube
   */
  public async fetchVideoAndComments(urlOrId: string): Promise<YouTubeVideoData> {
    let videoId = urlOrId;
    const extracted = this.extractYouTubeUrl(urlOrId);
    if (extracted) {
      videoId = extracted.videoId;
    }

    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const res = await axios.get(watchUrl, {
      timeout: this.defaultTimeout,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });

    const html: string = res.data;

    // 1. Ekstrak Detail Video dari ytInitialPlayerResponse
    let title = '';
    let authorName = '';
    let authorId = '';
    let description = '';
    let viewCount = 0;

    const playerMatch =
      html.match(/var ytInitialPlayerResponse = ({.+?});/s) ||
      html.match(/ytInitialPlayerResponse\s*=\s*({.+?});/s);

    if (playerMatch) {
      try {
        const playerData = JSON.parse(playerMatch[1]);
        const details = playerData.videoDetails || {};
        title = details.title || '';
        authorName = details.author || '';
        authorId = details.channelId || '';
        description = details.shortDescription || '';
        viewCount = parseInt(details.viewCount || '0', 10);
      } catch {}
    }

    // Fallback title dari <title> tag jika player response belum dapat
    if (!title) {
      const titleTag = html.match(/<title>(.*?)<\/title>/);
      if (titleTag) {
        title = titleTag[1].replace(' - YouTube', '').trim();
      }
    }

    const metadata: YouTubeVideoMetadata = {
      id: videoId,
      url: watchUrl,
      title,
      description,
      author: {
        id: authorId,
        username: authorName || 'unknown',
        nickname: authorName,
      },
      stats: {
        views: viewCount,
      },
    };

    // 2. Ekstrak Komentar Video via InnerTube API
    const comments: YouTubeCommentItem[] = [];
    try {
      const apiKeyMatch = html.match(/"INNERTUBE_API_KEY":"([^"]+)"/);
      const clientVersionMatch = html.match(/"INNERTUBE_CLIENT_VERSION":"([^"]+)"/);

      const dataMatch =
        html.match(/ytInitialData\s*=\s*({.+?});\s*<\/script>/s) ||
        html.match(/var ytInitialData\s*=\s*({.+?});/s);

      if (apiKeyMatch && dataMatch) {
        const ytInitialData = JSON.parse(dataMatch[1]);
        let continuationToken: string | null = null;

        const findToken = (obj: any) => {
          if (!obj || typeof obj !== 'object') return;
          if (obj.continuationEndpoint?.continuationCommand?.token) {
            continuationToken = obj.continuationEndpoint.continuationCommand.token;
            return;
          }
          for (const key of Object.keys(obj)) {
            findToken(obj[key]);
            if (continuationToken) return;
          }
        };
        findToken(ytInitialData);

        if (continuationToken) {
          const nextRes = await axios.post(
            `https://www.youtube.com/youtubei/v1/next?key=${apiKeyMatch[1]}`,
            {
              context: {
                client: {
                  clientName: 'WEB',
                  clientVersion: clientVersionMatch ? clientVersionMatch[1] : '2.20240101.00.00',
                  hl: 'id',
                  gl: 'ID',
                },
              },
              continuation: continuationToken,
            },
            {
              timeout: 10000,
              headers: {
                'Content-Type': 'application/json',
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              },
            }
          );

          // Metode A: Entity Batch Update mutations (Modern YouTube UI)
          const mutations = nextRes.data.frameworkUpdates?.entityBatchUpdate?.mutations || [];
          for (const m of mutations) {
            const cep = m.payload?.commentEntityPayload;
            if (cep) {
              const text = cep.properties?.content?.content || '';
              const author = cep.author?.displayName || '';
              const isCreator = Boolean(cep.author?.isCreator);
              const likeCount = parseInt(cep.toolbar?.likeCountNotliked || '0', 10) || 0;

              if (text) {
                comments.push({
                  id: cep.properties?.commentId || cep.key || '',
                  text,
                  author: {
                    username: author,
                    nickname: author,
                  },
                  isCreator,
                  isPinned: false,
                  likeCount,
                });
              }
            }
          }

          // Metode B: Legacy commentRenderer fallback jika mutations kosong
          if (comments.length === 0) {
            const findLegacyComments = (obj: any) => {
              if (!obj || typeof obj !== 'object') return;
              if (obj.commentRenderer) {
                const cr = obj.commentRenderer;
                const text = cr.contentText?.runs?.map((r: any) => r.text).join('') || '';
                const author = cr.authorText?.simpleText || '';
                const isCreator = Boolean(cr.authorIsChannelOwner);
                const isPinned = Boolean(cr.pinnedCommentBadge);
                const likeCount = parseInt(cr.likeCount || '0', 10) || 0;
                if (text) {
                  comments.push({
                    id: cr.commentId || '',
                    text,
                    author: { username: author, nickname: author },
                    isCreator,
                    isPinned,
                    likeCount,
                  });
                }
              }
              for (const k of Object.keys(obj)) {
                findLegacyComments(obj[k]);
              }
            };
            findLegacyComments(nextRes.data);
          }
        }
      }
    } catch {
      // Jika fetch komentar gagal/dinonaktifkan, tetap kembalikan metadata video
    }

    return { metadata, comments };
  }
}
