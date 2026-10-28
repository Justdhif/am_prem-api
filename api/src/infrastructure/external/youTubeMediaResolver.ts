import axios from 'axios';

export interface YouTubeMediaResult {
  videoUrl?: string;
  audioUrl?: string;
  downloads: {
    type: 'video' | 'audio';
    quality: string;
    url: string;
  }[];
}

export class YouTubeMediaResolver {
  private static readonly TIMEOUT = 8000;

  /**
   * Coba selesaikan direct stream MP4 dan MP3 dari YouTube
   * Didesain fail-safe agar tidak menghambat response finder jika converter lambat.
   */
  public static async resolveMedia(urlOrId: string): Promise<YouTubeMediaResult> {
    const videoId = this.extractVideoId(urlOrId) || urlOrId;
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const downloads: { type: 'video' | 'audio'; quality: string; url: string }[] = [];

    let videoUrl: string | undefined;
    let audioUrl: string | undefined;

    try {
      // Jalankan query MP4 dan MP3 secara parallel dengan timeout aman
      const [mp4Res, mp3Res] = await Promise.allSettled([
        this.convertViaConvert1s(watchUrl, 'mp4', '720p'),
        this.convertViaConvert1s(watchUrl, 'mp3', ''),
      ]);

      if (mp4Res.status === 'fulfilled' && mp4Res.value) {
        videoUrl = mp4Res.value;
        downloads.push({
          type: 'video',
          quality: '720p (MP4)',
          url: mp4Res.value,
        });
      }

      if (mp3Res.status === 'fulfilled' && mp3Res.value) {
        audioUrl = mp3Res.value;
        downloads.push({
          type: 'audio',
          quality: 'Audio MP3',
          url: mp3Res.value,
        });
      }

      // Fallback ke ytmp3 converter jika convert1s tidak menghasilkan
      if (!videoUrl || !audioUrl) {
        const fallback = await this.convertViaYtMp3Mobi(videoId);
        if (fallback.videoUrl && !videoUrl) {
          videoUrl = fallback.videoUrl;
          downloads.push({
            type: 'video',
            quality: '720p (MP4)',
            url: fallback.videoUrl,
          });
        }
        if (fallback.audioUrl && !audioUrl) {
          audioUrl = fallback.audioUrl;
          downloads.push({
            type: 'audio',
            quality: 'Audio MP3',
            url: fallback.audioUrl,
          });
        }
      }
    } catch {
      // Fail-safe: jangan gagalkan response finder jika konverter eksternal bermasalah
    }

    return { videoUrl, audioUrl, downloads };
  }

  private static extractVideoId(url: string): string | null {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_\-]{11})/i
    );
    return match ? match[1] : null;
  }

  private static async convertViaConvert1s(
    url: string,
    format: 'mp4' | 'mp3',
    quality: string
  ): Promise<string | null> {
    try {
      const headers = {
        Origin: 'https://media.ytmp3.gg',
        Referer: 'https://media.ytmp3.gg/',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Content-Type': 'application/json',
      };

      const res = await axios.post(
        'https://hub.convert1s.com/api/download',
        {
          url,
          os: 'macos',
          output: {
            type: format === 'mp4' ? 'video' : 'audio',
            format,
            quality: quality || '720p',
          },
          audio: { bitrate: '128k' },
        },
        { headers, timeout: this.TIMEOUT }
      );

      const conv = res.data;
      if (!conv || !conv.statusUrl) return null;

      let downloadUrl: string | null = null;
      let attempts = 0;
      while (!downloadUrl && attempts < 8) {
        await new Promise((r) => setTimeout(r, 1200));
        const poll = await axios.get(conv.statusUrl, { headers, timeout: 4000 });
        attempts++;
        if (poll.data?.status === 'completed' && poll.data?.downloadUrl) {
          downloadUrl = poll.data.downloadUrl;
          break;
        }
        if (poll.data?.status === 'error' || poll.data?.status === 'failed') break;
      }

      return downloadUrl;
    } catch {
      return null;
    }
  }

  private static async convertViaYtMp3Mobi(
    videoId: string
  ): Promise<{ videoUrl?: string; audioUrl?: string }> {
    try {
      const client = axios.create({
        headers: {
          Origin: 'https://ytmp3.mobi',
          Referer: 'https://ytmp3.mobi/en8/',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          Accept: '*/*',
        },
        timeout: this.TIMEOUT,
      });

      const { data: initData } = await client.get(
        `https://a.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=${Math.random()}`
      );
      if (!initData?.convertURL) return {};

      const resolveStream = async (format: 'mp4' | 'mp3'): Promise<string | null> => {
        let { data: convData } = await client.get(
          `${initData.convertURL}&v=${videoId}&f=${format}&_=${Math.random()}`
        );

        while (convData && convData.redirect > 0 && convData.redirectURL) {
          const redirRes = await client.get(
            `${convData.redirectURL}&v=${videoId}&f=${format}&_=${Math.random()}`
          );
          convData = redirRes.data;
        }

        if (convData && !convData.error) {
          let progress = 0;
          let finalUrl = convData.downloadURL;
          let attempts = 0;
          while (progress < 3 && attempts < 6) {
            await new Promise((r) => setTimeout(r, 1500));
            const { data: progData } = await client.get(
              `${convData.progressURL}&_=${Math.random()}`
            );
            progress = progData?.progress ?? 0;
            if (progData?.downloadURL) finalUrl = progData.downloadURL;
            if (progress === 4) break;
            attempts++;
          }
          if (finalUrl && progress >= 3) {
            return finalUrl.startsWith('//') ? `https:${finalUrl}` : finalUrl;
          }
        }
        return null;
      };

      const [vUrl, aUrl] = await Promise.all([resolveStream('mp4'), resolveStream('mp3')]);
      return {
        videoUrl: vUrl || undefined,
        audioUrl: aUrl || undefined,
      };
    } catch {
      return {};
    }
  }
}
