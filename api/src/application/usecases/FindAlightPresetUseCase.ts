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
    }

    // 6. Pisahkan ke 2 Prioritas:
    // Prioritas 1: Link preset langsung (alight.link, alightcreative, drive, mediafire, sfile)
    // Prioritas 2: Ajakan join saluran / join sl (WhatsApp Channel, Telegram, Link Bio)
    const directPresets = allItems.filter((item) => item.priority === 'preset_link');
    const channelInvites = allItems.filter((item) => item.priority === 'join_saluran');

    // Urutkan: Prioritas 1 di atas, lalu Prioritas 2 di bawahnya
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
   * Ekstrak seluruh link preset dan ajakan join saluran dari potongan teks
   * Menerapkan 2 Tingkat Prioritas:
   * 1. Prioritas 1: Link Langsung Alight Motion, Google Drive, Mediafire, Sfile, Shortlink
   * 2. Prioritas 2: Ajakan "Join Saluran" / "Join SL", Saluran WhatsApp, Telegram, Link Bio
   */
  public extractPresetsFromText(
    text: string,
    source: PresetSource,
    author: string,
    isCreator: boolean
  ): PresetItem[] {
    const results: PresetItem[] = [];
    if (!text) return results;

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
