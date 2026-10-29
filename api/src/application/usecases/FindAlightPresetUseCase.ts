import { ITikTokGateway } from '../../domain/gateways/ITikTokGateway.js';
import { IYouTubeGateway } from '../../domain/gateways/IYouTubeGateway.js';
import {
  PresetItem,
  PresetType,
  PresetSource,
  PresetPriority,
  PresetFinderResult,
  VideoPlatform,
} from '../../domain/entities/Preset.js';
import { FindPresetInputDto, FindPresetOutputDto } from '../dto/presetFinder.dto.js';

export class FindAlightPresetUseCase {
  constructor(
    private readonly tikTokGateway: ITikTokGateway,
    private readonly youTubeGateway?: IYouTubeGateway
  ) {}

  public async execute(input: FindPresetInputDto): Promise<FindPresetOutputDto> {
    const rawUrl = input.url?.trim();
    if (!rawUrl) {
      throw new Error('URL video TikTok atau YouTube wajib diisi.');
    }

    // 1. Deteksi Platform (YouTube atau TikTok)
    const ytExtracted = this.youTubeGateway?.extractYouTubeUrl(rawUrl);
    const ttExtracted = this.tikTokGateway.extractTikTokUrl(rawUrl);

    if (!ytExtracted && !ttExtracted) {
      throw new Error(
        'Format URL tidak valid. Masukkan URL video TikTok (contoh: https://vt.tiktok.com/xxxx atau https://www.tiktok.com/@user/video/xxxx) atau YouTube (contoh: https://youtu.be/xxxx atau https://www.youtube.com/watch?v=xxxx).'
      );
    }

    const platform: VideoPlatform = ytExtracted ? 'youtube' : 'tiktok';

    // 2. Ambil metadata dan komentar sesuai platform
    let metadata: any;
    let comments: any[] = [];

    if (platform === 'youtube' && this.youTubeGateway && ytExtracted) {
      const ytData = await this.youTubeGateway.fetchVideoAndComments(ytExtracted.url);
      metadata = {
        ...ytData.metadata,
        platform: 'youtube',
      };
      comments = ytData.comments;
    } else if (ttExtracted) {
      const ttData = await this.tikTokGateway.fetchVideoAndComments(ttExtracted);
      metadata = {
        ...ttData.metadata,
        platform: 'tiktok',
      };
      comments = ttData.comments;
    } else {
      throw new Error('Gagal memproses URL video.');
    }

    // Koleksi preset yang ditemukan (gunakan Set untuk mencegah duplikasi URL/konten)
    const seenItems = new Set<string>();
    const allItems: PresetItem[] = [];
    const candidateYouTubeUrls: string[] = [];

    const addItem = (item: PresetItem) => {
      const key = `${item.priority}:${item.url.toLowerCase()}`;
      if (!seenItems.has(key)) {
        seenItems.add(key);
        allItems.push(item);
      }
    };

    // 3. Pindai Judul / Caption Video
    if (metadata.title) {
      const captionItems = this.extractPresetsFromText(
        metadata.title,
        'caption',
        metadata.author?.username || 'Kreator',
        true
      );
      captionItems.forEach(addItem);

      // Kumpulkan URL YouTube di caption jika video sumber dari TikTok
      if (platform === 'tiktok') {
        const ytUrls = this.extractYouTubeLinksFromText(metadata.title);
        candidateYouTubeUrls.push(...ytUrls);
      }
    }

    // 4. Pindai Deskripsi Video (Khusus YouTube atau jika video memiliki deskripsi)
    if (metadata.description) {
      const descItems = this.extractPresetsFromText(
        metadata.description,
        'description',
        metadata.author?.username || 'Kreator',
        true
      );
      descItems.forEach(addItem);

      if (platform === 'tiktok') {
        const ytUrls = this.extractYouTubeLinksFromText(metadata.description);
        candidateYouTubeUrls.push(...ytUrls);
      }
    }

    // 5. Pindai Komentar Video (prioritaskan komentar kreator dan pinned)
    const sortedComments = [...comments].sort((a, b) => {
      if (a.isAuthorPinned && !b.isAuthorPinned) return -1;
      if (!a.isAuthorPinned && b.isAuthorPinned) return 1;
      if (a.isCreator && !b.isCreator) return -1;
      if (!a.isCreator && b.isCreator) return 1;
      return (b.likeCount || 0) - (a.likeCount || 0);
    });

    for (const comment of sortedComments) {
      if (!comment.text) continue;

      const commentItems = this.extractPresetsFromText(
        comment.text,
        'comment',
        comment.author?.username || comment.author?.nickname || 'Pengguna',
        Boolean(comment.isCreator)
      );

      commentItems.forEach(addItem);

      // Jika dari TikTok, periksa apakah kreator / komentar menyertakan tautan YouTube
      if (platform === 'tiktok') {
        const ytUrls = this.extractYouTubeLinksFromText(comment.text);
        if (ytUrls.length > 0) {
          if (comment.isCreator || comment.isAuthorPinned) {
            candidateYouTubeUrls.unshift(...ytUrls);
          } else {
            candidateYouTubeUrls.push(...ytUrls);
          }
        }
      }
    }

    // =========================================================================
    // STRATEGI PENCARIAN CERDAS (DUA TAHAP):
    // Tahap 1: Cek apakah sudah ada link preset langsung (alight.link / XML)
    // Tahap 2: Jika BELUM ketemu, lakukan pencarian alternatif:
    //          A) Deep-scan ke video YouTube yang dicantumkan kreator di TikTok
    //          B) Highlight saluran WhatsApp / Telegram / Link Bio kreator
    // =========================================================================
    let directPresets = allItems.filter((item) => item.priority === 'preset_link');

    // Jika belum ada link preset langsung di TikTok, periksa video YouTube rujukan kreator
    if (directPresets.length === 0 && candidateYouTubeUrls.length > 0 && this.youTubeGateway && platform === 'tiktok') {
      const uniqueYtUrls = Array.from(new Set(candidateYouTubeUrls));
      for (const ytUrl of uniqueYtUrls.slice(0, 2)) {
        try {
          const ytData = await this.youTubeGateway.fetchVideoAndComments(ytUrl);
          if (ytData.metadata?.description) {
            const ytDescItems = this.extractPresetsFromText(
              ytData.metadata.description,
              'description',
              ytData.metadata.author?.username || 'Kreator YouTube',
              true
            );
            ytDescItems.forEach((item) => {
              if (item.priority === 'preset_link') {
                item.label = `Preset Alight (via YouTube Kreator)`;
                item.context = `Ditemukan dari rujukan YouTube kreator: ${ytUrl}`;
                addItem(item);
              }
            });
          }

          for (const ytComment of ytData.comments) {
            if (!ytComment.text) continue;
            const ytCommentItems = this.extractPresetsFromText(
              ytComment.text,
              'comment',
              ytComment.author?.username || 'Kreator YouTube',
              Boolean(ytComment.isCreator)
            );
            ytCommentItems.forEach((item) => {
              if (item.priority === 'preset_link') {
                item.label = `Preset Alight (via YouTube Kreator)`;
                item.context = `Ditemukan dari komentar YouTube kreator: ${ytUrl}`;
                addItem(item);
              }
            });
          }
        } catch {
          // Abaikan jika penelusuran video YouTube rujukan gagal
        }
      }

      // Evaluasi ulang directPresets setelah deep scan YouTube
      directPresets = allItems.filter((item) => item.priority === 'preset_link');
    }

    const channelInvites = allItems.filter((item) => item.priority === 'join_saluran');

    // Urutkan: Prioritas 1 di atas, lalu Prioritas 2 (Alternatif) di bawahnya
    const presets = [...directPresets, ...channelInvites];

    // Susun format respon teks (untuk WhatsApp & Markdown)
    const formattedText = this.buildFormattedMessage(
      metadata,
      platform,
      directPresets,
      channelInvites,
      comments.length
    );

    const resultData: PresetFinderResult = {
      video: metadata,
      platform,
      presets,
      directPresets,
      channelInvites,
      totalPresetsFound: presets.length,
      totalCommentsScanned: comments.length,
      caption: metadata.title || '',
      description: metadata.description,
      formattedText,
    };

    let message: string;
    if (directPresets.length > 0 && channelInvites.length > 0) {
      message = `Berhasil menemukan ${directPresets.length} link preset Alight Motion dan ${channelInvites.length} saluran kreator!`;
    } else if (directPresets.length > 0) {
      message = `Berhasil menemukan ${directPresets.length} link preset Alight Motion dari video ${platform === 'youtube' ? 'YouTube' : 'TikTok'}!`;
    } else if (channelInvites.length > 0) {
      message = `Ditemukan ${channelInvites.length} ajakan/link Join Saluran (Join SL) dari kreator untuk mengambil preset!`;
    } else {
      message = `Tidak ditemukan link preset Alight Motion maupun ajakan join saluran di deskripsi atau ${comments.length} komentar video ini.`;
    }

    return {
      success: true,
      message,
      data: resultData,
    };
  }

  /**
   * Pembersih Teks Anti-Obfuskasi Cerdas
   * Mengembalikan teks URL asli jika kreator sengaja menyelipkan emoji (misal channel😁😁/xxx)
   * atau memisah link dengan spasi / kata 'titik' / 'dot'.
   */
  public normalizeObfuscatedText(text: string): string {
    if (!text) return '';
    let str = text;

    // 1. Ganti pola (titik), (dot), [dot], [titik] dengan tanda titik '.'
    str = str.replace(/\s*[\(\[\{]?(?:titik|dot)[\)\]\}]?\s*/gi, '.');

    // 2. Bersihkan karakter emoji dari URL atau link yang disisipi emot
    // Contoh di screenshot pengguna: https://whatsapp.com/channel😁😁/0029Vb83UYeEquiWEUOQmG24
    str = str.replace(
      /(?:https?:\/\/)?(?:whatsapp\.com\/channel|chat\.whatsapp\.com|alight\.link|alightcreative\.com|drive\.google\.com|mediafire\.com|sfile\.mobi|sfile\.co|t\.me|telegram\.me|youtu\.be|youtube\.com)[^\s]*/gi,
      (match) => {
        return match.replace(
          /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1FA70}-\u{1FAFF}\u{200d}\u{FE0F}]/gu,
          ''
        );
      }
    );

    // 3. Normalisasi spasi di sekeliling protocol dan domain populer yang sengaja dipisah kreator
    str = str.replace(/https?\s*:\s*\/\s*\/\s*/gi, 'https://');
    str = str.replace(/alight\s*\.\s*link\s*\/\s*/gi, 'alight.link/');
    str = str.replace(/alightcreative\s*\.\s*com\s*\/\s*/gi, 'alightcreative.com/');
    str = str.replace(/mediafire\s*\.\s*com\s*\/\s*/gi, 'mediafire.com/');
    str = str.replace(/sfile\s*\.\s*(?:co|mobi)\s*\/\s*/gi, 'sfile.mobi/');
    str = str.replace(/drive\s*\.\s*google\s*\.\s*com\s*\/\s*/gi, 'drive.google.com/');
    str = str.replace(/whatsapp\s*\.\s*com\s*\/\s*channel\s*\/\s*/gi, 'whatsapp.com/channel/');
    str = str.replace(/chat\s*\.\s*whatsapp\s*\.\s*com\s*\/\s*/gi, 'chat.whatsapp.com/');
    str = str.replace(/youtu\s*\.\s*be\s*\/\s*/gi, 'youtu.be/');
    str = str.replace(/youtube\s*\.\s*com\s*\/\s*/gi, 'youtube.com/');
    str = str.replace(/t\s*\.\s*me\s*\/\s*/gi, 't.me/');

    return str;
  }

  /**
   * Ekstrak URL YouTube yang mungkin dirujuk oleh kreator di dalam teks
   */
  public extractYouTubeLinksFromText(rawText: string): string[] {
    if (!rawText) return [];
    const text = this.normalizeObfuscatedText(rawText);
    const ytRegex = /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_\-]{11})/gi;
    const matches = text.match(ytRegex);
    if (!matches) return [];
    return matches.map((m) => {
      let clean = m.replace(/[\.\,\)\]\>\'\"\;\:\*\_\~]+$/, '');
      if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
        clean = 'https://' + clean;
      }
      return clean;
    });
  }

  /**
   * Ekstrak seluruh link preset dan ajakan join saluran dari potongan teks
   * Menerapkan 2 Tingkat Prioritas:
   * 1. Prioritas 1: Link Langsung Alight Motion, Google Drive, Mediafire, Sfile, Shortlink
   * 2. Prioritas 2 (Alternatif): Saluran WhatsApp, Telegram, Link Bio
   */
  public extractPresetsFromText(
    rawText: string,
    source: PresetSource,
    author: string,
    isCreator: boolean
  ): PresetItem[] {
    const results: PresetItem[] = [];
    if (!rawText) return results;

    const text = this.normalizeObfuscatedText(rawText);
    const seenUrlsInText = new Set<string>();

    // ==========================================
    // PRIORITAS 1: LINK PRESET LANGSUNG
    // ==========================================
    const directPatterns: Array<{ type: PresetType; regex: RegExp; label: string }> = [
      {
        type: 'alight_link',
        regex: /(?:https?:\/\/)?(?:www\.)?alight\.link\/[a-zA-Z0-9_\-\.\/]+/gi,
        label: 'Alight Link (Official)',
      },
      {
        type: 'alight_creative',
        regex: /(?:https?:\/\/)?(?:[a-zA-Z0-9_\-]+\.)?alightcreative\.com\/[^\s"')]+/gi,
        label: 'Alight Creative',
      },
      {
        type: 'google_drive',
        regex: /(?:https?:\/\/)?(?:drive\.google\.com|docs\.google\.com)\/[^\s"')]+/gi,
        label: 'Google Drive (XML/Preset)',
      },
      {
        type: 'mediafire',
        regex: /(?:https?:\/\/)?(?:www\.)?mediafire\.com\/[^\s"')]+/gi,
        label: 'MediaFire File',
      },
      {
        type: 'sfile',
        regex: /(?:https?:\/\/)?(?:www\.)?sfile\.mobi\/[^\s"')]+/gi,
        label: 'Sfile Mobi',
      },
      {
        type: 'shortlink',
        regex: /(?:https?:\/\/)?(?:bit\.ly|tinyurl\.com|s\.id|cutt\.ly|linkvertise\.com)\/[^\s"')]+/gi,
        label: 'Shortlink Preset',
      },
    ];

    for (const { type, regex, label } of directPatterns) {
      const matches = text.match(regex);
      if (matches) {
        for (let match of matches) {
          match = match.replace(/[\.\,\)\]\>\'\"\;\:\*\_\~]+$/, '');
          let cleanUrl = match;
          if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
            cleanUrl = 'https://' + cleanUrl;
          }

          if (!seenUrlsInText.has(cleanUrl.toLowerCase())) {
            seenUrlsInText.add(cleanUrl.toLowerCase());
            results.push({
              url: cleanUrl,
              type,
              priority: 'preset_link',
              source,
              label,
              context: text.substring(0, 180).trim(),
              author,
              isCreator,
            });
          }
        }
      }
    }

    // ==========================================
    // PRIORITAS 2: AJAKAN JOIN SALURAN (JOIN SL)
    // ==========================================
    // 2A. Tautan Saluran (WhatsApp Channel, Telegram, Link Bio)
    const channelLinkPatterns: Array<{ type: PresetType; regex: RegExp; label: string }> = [
      {
        type: 'whatsapp_channel',
        regex: /(?:https?:\/\/)?(?:chat\.whatsapp\.com|whatsapp\.com\/channel)\/[a-zA-Z0-9_\-\.\/]+/gi,
        label: 'Saluran WhatsApp (Join Saluran)',
      },
      {
        type: 'channel_invite',
        regex: /(?:https?:\/\/)?(?:t\.me|telegram\.me)\/[a-zA-Z0-9_\-\.\/]+/gi,
        label: 'Saluran Telegram (Join Saluran)',
      },
      {
        type: 'channel_invite',
        regex: /(?:https?:\/\/)?(?:linktr\.ee|bio\.link|campsite\.bio|heylink\.me)\/[a-zA-Z0-9_\-\.\/]+/gi,
        label: 'Link Bio Profil (Join Saluran)',
      },
    ];

    let foundChannelLink = false;
    for (const { type, regex, label } of channelLinkPatterns) {
      const matches = text.match(regex);
      if (matches) {
        for (let match of matches) {
          match = match.replace(/[\.\,\)\]\>\'\"\;\:\*\_\~]+$/, '');
          let cleanUrl = match;
          if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
            cleanUrl = 'https://' + cleanUrl;
          }

          if (!seenUrlsInText.has(cleanUrl.toLowerCase())) {
            seenUrlsInText.add(cleanUrl.toLowerCase());
            foundChannelLink = true;
            results.push({
              url: cleanUrl,
              type,
              priority: 'join_saluran',
              source,
              label,
              context: text.substring(0, 180).trim(),
              author,
              isCreator,
            });
          }
        }
      }
    }

    // 2B. Deteksi Frasa Teks "Join Saluran" atau "Join SL"
    // Contoh pola netizen/kreator:
    // - "join saluran wa"
    // - "join sl"
    // - "link di saluran wa"
    // - "preset di saluran"
    // - "masuk saluran"
    const joinSaluranPhraseRegex =
      /\b(?:join\s+saluran|join\s+sl|masuk\s+saluran|cek\s+saluran|link\s+saluran|saluran\s+wa|saluran\s+whatsapp|saluran\s+tele|preset\s+(?:ada\s+)?di\s+saluran|xml\s+(?:ada\s+)?di\s+saluran|sl\s+wa)\b/i;

    if (joinSaluranPhraseRegex.test(text)) {
      // Jika belum ada channel link spesifik yang diekstrak dari potongan teks ini,
      // buat entri instruksi join saluran agar pengguna bot/web tahu kreator mempromosikan saluran.
      if (!foundChannelLink) {
        const fallbackUrl = author ? `@${author} (Saluran di Bio)` : 'Cek Saluran di Bio Profil';
        if (!seenUrlsInText.has(fallbackUrl.toLowerCase())) {
          seenUrlsInText.add(fallbackUrl.toLowerCase());
          results.push({
            url: fallbackUrl,
            type: 'channel_invite',
            priority: 'join_saluran',
            source,
            label: 'Ajakan Join Saluran (Join SL)',
            context: text.substring(0, 180).trim(),
            author,
            isCreator,
          });
        }
      }
    }

    return results;
  }

  /**
   * Format pesan teks khas Justdhif untuk chat bot WhatsApp / Discord / Telegram
   */
  private buildFormattedMessage(
    metadata: any,
    platform: VideoPlatform,
    directPresets: PresetItem[],
    channelInvites: PresetItem[],
    commentsCount: number
  ): string {
    const lines: string[] = [];
    const platformName = platform === 'youtube' ? 'YOUTUBE' : 'TIKTOK';
    lines.push(`*乂 ${platformName} ALIGHT MOTION PRESET FINDER 乂*`);
    lines.push('');
    lines.push(`• *Platform:* ${platformName}`);
    lines.push(`• *Creator:* @${metadata.author?.username || 'unknown'}`);
    if (metadata.title) {
      const shortTitle =
        metadata.title.length > 70 ? metadata.title.substring(0, 67) + '...' : metadata.title;
      lines.push(`• *Judul:* ${shortTitle}`);
    }
    lines.push(`• *Komentar Dipindai:* ${commentsCount}`);
    lines.push(
      `• *Total Temuan:* ${directPresets.length + channelInvites.length} (${directPresets.length} Preset Langsung, ${channelInvites.length} Join Saluran)`
    );
    lines.push('');

    // Bagian 1: Prioritas 1 - Link Preset Langsung
    if (directPresets.length > 0) {
      lines.push('⚡ *PRIORITAS 1: LINK PRESET LANGSUNG*');
      directPresets.forEach((p, idx) => {
        let sourceBadge = '📌 Dari Caption';
        if (p.source === 'description') sourceBadge = '📄 Dari Deskripsi Video';
        else if (p.source === 'comment') sourceBadge = `💬 Dari Komentar (@${p.author})`;

        lines.push(`${idx + 1}. *[${p.label}]* - ${sourceBadge}`);
        lines.push(`   🔗 ${p.url}`);
        lines.push('');
      });
      lines.push('💡 _Klik tautan di atas untuk langsung membuka dan mengimpor preset di Alight Motion._');
      lines.push('');
    }

    // Bagian 2: Prioritas 2 - Ajakan Join Saluran / Join SL
    if (channelInvites.length > 0) {
      lines.push('📢 *PRIORITAS 2: AJAKAN JOIN SALURAN (JOIN SL)*');
      lines.push(
        '_Kreator membagikan preset melalui tautan atau ajakan saluran berikut:_'
      );
      lines.push('');
      channelInvites.forEach((c, idx) => {
        let sourceBadge = '📌 Dari Caption';
        if (c.source === 'description') sourceBadge = '📄 Dari Deskripsi Video';
        else if (c.source === 'comment') sourceBadge = `💬 Dari Komentar (@${c.author})`;

        lines.push(`${idx + 1}. *[${c.label}]* - ${sourceBadge}`);
        lines.push(`   🔗 ${c.url}`);
        if (c.context) {
          lines.push(`   💬 _"${c.context.replace(/\n+/g, ' ')}"_`);
        }
        lines.push('');
      });
      lines.push('💡 _Buka saluran WhatsApp / Telegram di atas untuk mengunduh preset dari kreator._');
      lines.push('');
    }

    // Status jika kosong sama sekali
    if (directPresets.length === 0 && channelInvites.length === 0) {
      lines.push('⚠️ *Status:* Tidak ditemukan link preset langsung maupun ajakan join saluran di video ini.');
      lines.push('Pastikan kreator menaruh link preset di deskripsi atau kolom komentar.');
      lines.push('');
    }

    lines.push('—');
    lines.push('*⚡ Alight Motion API by Justdhif*');

    return lines.join('\n');
  }
}
