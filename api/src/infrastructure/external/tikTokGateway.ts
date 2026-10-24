import axios from 'axios';
import { ITikTokGateway, TikTokVideoData } from '../../domain/gateways/ITikTokGateway.js';
import { TikTokCommentItem, TikTokVideoMetadata } from '../../domain/entities/Preset.js';

export class TikTokGateway implements ITikTokGateway {
  private readonly defaultTimeout = 12000;

  /**
   * Mengekstrak URL TikTok dari teks apapun
   */
  public extractTikTokUrl(text: string): string | null {
    if (!text) return null;
    const match = text.match(
      /https?:\/\/(?:(?:vt|vm|www|m)\.)?tiktok\.com\/(?:@[a-zA-Z0-9_\.]+\/video\/\d+|[a-zA-Z0-9_\/]+)/i
    );
    return match ? match[0] : null;
  }

  /**
   * Mengambil data video dan komentar TikTok
   */
  public async fetchVideoAndComments(tiktokUrl: string): Promise<TikTokVideoData> {
    try {
      // 1. Coba gunakan TikWM API terlebih dahulu (sangat stabil untuk video dan comments)
      return await this.fetchViaTikwm(tiktokUrl);
    } catch (tikwmError: any) {
      // 2. Fallback ke Direct TikTok Mobile Gateway jika TikWM terkendala
      try {
        return await this.fetchViaDirectTikTok(tiktokUrl);
      } catch (directError: any) {
        throw new Error(
          `Gagal mengambil data video TikTok: ${tikwmError?.message || 'Layanan tidak merespons.'}`
        );
      }
    }
  }

  /**
   * Ambil metadata dan komentar melalui TikWM
   */
  private async fetchViaTikwm(url: string): Promise<TikTokVideoData> {
    const encodedUrl = encodeURIComponent(url);

    // Ambil detail video
    const videoRes = await axios.get(`https://www.tikwm.com/api/?url=${encodedUrl}`, {
      timeout: this.defaultTimeout,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!videoRes.data || videoRes.data.code !== 0 || !videoRes.data.data) {
      throw new Error(videoRes.data?.msg || 'Video TikTok tidak ditemukan atau berstatus privat.');
    }

    const d = videoRes.data.data;
    const metadata: TikTokVideoMetadata = {
      id: d.id || '',
      platform: 'tiktok',
      url: url,
      title: d.title || '',
      author: {
        id: d.author?.id,
        username: d.author?.unique_id || 'unknown',
        nickname: d.author?.nickname,
        avatar: d.author?.avatar,
      },
      cover: d.cover,
      stats: {
        likes: d.digg_count,
        comments: d.comment_count,
        shares: d.share_count,
        views: d.play_count,
      },
    };

    // Ambil komentar video
    const comments: TikTokCommentItem[] = [];
    try {
      const commentRes = await axios.get(
        `https://www.tikwm.com/api/comment/list?url=${encodedUrl}&count=50`,
        {
          timeout: this.defaultTimeout,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        }
      );

      if (commentRes.data?.code === 0 && Array.isArray(commentRes.data?.data?.comments)) {
        const rawComments = commentRes.data.data.comments;
        for (const c of rawComments) {
          const isCreator =
            Boolean(c.author_pin) ||
            (metadata.author.id && c.user?.id && String(c.user.id) === String(metadata.author.id)) ||
            (metadata.author.username &&
              c.user?.unique_id &&
              c.user.unique_id.toLowerCase() === metadata.author.username.toLowerCase());

          comments.push({
            id: c.id || '',
            text: c.text || '',
            author: {
              id: c.user?.id,
              username: c.user?.unique_id || '',
              nickname: c.user?.nickname,
            },
            isAuthorPinned: Boolean(c.author_pin),
            isCreator: Boolean(isCreator),
            likeCount: c.digg_count || 0,
            createdAt: c.create_time,
          });
        }

        // Pindai juga balasan komentar (reply comments)
        // Kreator sering kali menaruh link preset di balasan komentar mereka sendiri atau pin
        const commentsWithReplies = rawComments.filter(
          (c: any) => typeof c.reply_total === 'number' && c.reply_total > 0
        );

        if (commentsWithReplies.length > 0 && d.id) {
          // Prioritaskan komentar kreator/pinned dulu, lalu komentar dengan replies terbanyak
          const prioritized = [...commentsWithReplies].sort((a: any, b: any) => {
            const aIsCreator =
              Boolean(a.author_pin) ||
              (metadata.author.id && a.user?.id && String(a.user.id) === String(metadata.author.id)) ||
              (metadata.author.username &&
                a.user?.unique_id &&
                a.user.unique_id.toLowerCase() === metadata.author.username.toLowerCase());
            const bIsCreator =
              Boolean(b.author_pin) ||
              (metadata.author.id && b.user?.id && String(b.user.id) === String(metadata.author.id)) ||
              (metadata.author.username &&
                b.user?.unique_id &&
                b.user.unique_id.toLowerCase() === metadata.author.username.toLowerCase());

            if (aIsCreator && !bIsCreator) return -1;
            if (!aIsCreator && bIsCreator) return 1;
            return (b.reply_total || 0) - (a.reply_total || 0);
          });

          // Ambil balasan hingga 10 komentar induk secara paralel
          const targetParents = prioritized.slice(0, 10);
          const replyPromises = targetParents.map(async (parent: any) => {
            try {
              const replyRes = await axios.get(
                `https://www.tikwm.com/api/comment/reply?comment_id=${parent.id}&video_id=${d.id}&count=50`,
                {
                  timeout: 6000,
                  headers: {
                    'User-Agent':
                      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                  },
                }
              );

              if (replyRes.data?.code === 0 && Array.isArray(replyRes.data?.data?.comments)) {
                for (const r of replyRes.data.data.comments) {
                  const isReplyCreator =
                    (metadata.author.id && r.user?.id && String(r.user.id) === String(metadata.author.id)) ||
                    (metadata.author.username &&
                      r.user?.unique_id &&
                      r.user.unique_id.toLowerCase() === metadata.author.username.toLowerCase());

                  comments.push({
                    id: r.id || '',
                    text: r.text || '',
                    author: {
                      id: r.user?.id,
                      username: r.user?.unique_id || '',
                      nickname: r.user?.nickname,
                    },
                    isAuthorPinned: false,
                    isCreator: Boolean(isReplyCreator),
                    likeCount: r.digg_count || 0,
                    createdAt: r.create_time,
                  });
                }
              }
            } catch {
              // Abaikan jika fetch reply untuk komentar tertentu timeout/gagal
            }
          });

          await Promise.allSettled(replyPromises);
        }
      }
    } catch {
      // Jika fetch komentar gagal, tetap return metadata video dengan comments kosong
    }

    return { metadata, comments };
  }

  /**
   * Fallback direct request ke TikTok Aweme API
   */
  private async fetchViaDirectTikTok(url: string): Promise<TikTokVideoData> {
    // 1. Resolve redirect jika menggunakan link pendek
    let resolvedUrl = url;
    if (url.includes('vt.tiktok.com') || url.includes('vm.tiktok.com')) {
      const headRes = await axios.get(url, {
        maxRedirects: 5,
        timeout: 8000,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
      resolvedUrl = headRes.request?.res?.responseUrl || url;
    }

    // Ekstrak ID video
    const idMatch = resolvedUrl.match(/\/video\/(\d+)/) || resolvedUrl.match(/\/v\/(\d+)/);
    const videoId = idMatch ? idMatch[1] : '';

    if (!videoId) {
      throw new Error('Tidak dapat mengekstrak ID video dari link TikTok ini.');
    }

    const feedRes = await axios.get(
      `https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=${videoId}`,
      {
        timeout: 10000,
        headers: {
          'User-Agent':
            'com.zhiliaoapp.musically/2022600030 (Linux; U; Android 7.1.2; es_ES; SM-G988N; Build/NRD90M;tt-ok/3.12.13.1)',
        },
      }
    );

    const aweme = feedRes.data?.aweme_list?.[0];
    if (!aweme) {
      throw new Error('Video tidak ditemukan di TikTok Aweme Feed.');
    }

    const metadata: TikTokVideoMetadata = {
      id: aweme.aweme_id || videoId,
      platform: 'tiktok',
      url: url,
      title: aweme.desc || '',
      author: {
        id: aweme.author?.uid,
        username: aweme.author?.unique_id || 'unknown',
        nickname: aweme.author?.nickname,
      },
      stats: {
        likes: aweme.statistics?.digg_count,
        comments: aweme.statistics?.comment_count,
        shares: aweme.statistics?.share_count,
      },
    };

    const comments: TikTokCommentItem[] = [];
    try {
      const commentRes = await axios.get(
        `https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/comment/list/?aweme_id=${videoId}&cursor=0&count=50`,
        {
          timeout: 10000,
          headers: {
            'User-Agent':
              'com.zhiliaoapp.musically/2022600030 (Linux; U; Android 7.1.2; es_ES; SM-G988N; Build/NRD90M;tt-ok/3.12.13.1)',
          },
        }
      );

      if (Array.isArray(commentRes.data?.comments)) {
        for (const c of commentRes.data.comments) {
          comments.push({
            id: c.cid || '',
            text: c.text || '',
            author: {
              id: c.user?.uid,
              username: c.user?.unique_id || '',
              nickname: c.user?.nickname,
            },
            isAuthorPinned: Boolean(c.is_author_pin),
            isCreator: String(c.user?.uid) === String(aweme.author?.uid),
            likeCount: c.digg_count || 0,
            createdAt: c.create_time,
          });

          // Pindai juga balasan komentar jika tersedia di payload aweme
          if (Array.isArray(c.reply_comment)) {
            for (const r of c.reply_comment) {
              comments.push({
                id: r.cid || '',
                text: r.text || '',
                author: {
                  id: r.user?.uid,
                  username: r.user?.unique_id || '',
                  nickname: r.user?.nickname,
                },
                isAuthorPinned: false,
                isCreator: String(r.user?.uid) === String(aweme.author?.uid),
                likeCount: r.digg_count || 0,
                createdAt: r.create_time,
              });
            }
          }
        }
      }
    } catch {
      // Abaikan jika comments endpoint gagal
    }

    return { metadata, comments };
  }
}
