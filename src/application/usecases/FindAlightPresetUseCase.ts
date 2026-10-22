import { ITikTokGateway } from '../../domain/gateways/ITikTokGateway.js';
import {
  PresetItem,
  PresetType,
  PresetSource,
  TikTokPresetFinderResult,
} from '../../domain/entities/Preset.js';
import { FindPresetInputDto, FindPresetOutputDto } from '../dto/presetFinder.dto.js';

export class FindAlightPresetUseCase {
  constructor(private readonly tikTokGateway: ITikTokGateway) {}

  public async execute(input: FindPresetInputDto): Promise<FindPresetOutputDto> {
    const rawUrl = input.url?.trim();
    if (!rawUrl) {
      throw new Error('URL video TikTok wajib diisi.');
    }

    // Ekstrak URL valid dari input
    const extractedUrl = this.tikTokGateway.extractTikTokUrl(rawUrl);
    if (!extractedUrl) {
      throw new Error(
        'Format URL TikTok tidak valid. Gunakan link video TikTok seperti: https://vt.tiktok.com/xxxx atau https://www.tiktok.com/@user/video/xxxx'
      );
    }

    // Ambil data video dan komentar
    const { metadata, comments } = await this.tikTokGateway.fetchVideoAndComments(extractedUrl);

    // Koleksi preset yang ditemukan (gunakan Set untuk mencegah duplikasi URL)
    const seenUrls = new Set<string>();
    const presets: PresetItem[] = [];

    // 1. Pindai Caption / Deskripsi Video
    if (metadata.title) {
      const captionPresets = this.extractPresetsFromText(
        metadata.title,
        'caption',
        metadata.author.username,
        true
      );
      for (const item of captionPresets) {
        if (!seenUrls.has(item.url.toLowerCase())) {
          seenUrls.add(item.url.toLowerCase());
          presets.push(item);
        }
      }
    }

    // 2. Pindai Komentar Video (prioritaskan komentar kreator dan pinned)
    const sortedComments = [...comments].sort((a, b) => {
      // Prioritas 1: Pinned / Creator
      if (a.isAuthorPinned && !b.isAuthorPinned) return -1;
      if (!a.isAuthorPinned && b.isAuthorPinned) return 1;
      if (a.isCreator && !b.isCreator) return -1;
      if (!a.isCreator && b.isCreator) return 1;
      return (b.likeCount || 0) - (a.likeCount || 0);
    });

    for (const comment of sortedComments) {
      if (!comment.text) continue;

      const commentPresets = this.extractPresetsFromText(
        comment.text,
        'comment',
        comment.author.username || comment.author.nickname || 'Pengguna',
        Boolean(comment.isCreator)
      );

      for (const item of commentPresets) {
        if (!seenUrls.has(item.url.toLowerCase())) {
          seenUrls.add(item.url.toLowerCase());
          presets.push(item);
        }
      }
    }

    // Susun format respon teks (untuk WhatsApp & Markdown)
    const formattedText = this.buildFormattedMessage(metadata, presets, comments.length);

    const resultData: TikTokPresetFinderResult = {
      video: metadata,
      presets,
      totalPresetsFound: presets.length,
      totalCommentsScanned: comments.length,
      caption: metadata.title,
      formattedText,
    };

    const message =
      presets.length > 0
        ? `Berhasil menemukan ${presets.length} link preset Alight Motion dari video TikTok!`
        : `Tidak ditemukan link preset Alight Motion di caption maupun ${comments.length} komentar video ini.`;

    return {
      success: true,
      message,
      data: resultData,
    };
  }

  /**
   * Ekstrak seluruh link preset dari potongan teks (caption atau comment)
   */
  public extractPresetsFromText(
    text: string,
    source: PresetSource,
    author: string,
    isCreator: boolean
  ): PresetItem[] {
    const results: PresetItem[] = [];
    if (!text) return results;

    // Pola regex spesifik untuk Alight Motion dan sumber preset
    const patterns: Array<{ type: PresetType; regex: RegExp; label: string }> = [
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

    for (const { type, regex, label } of patterns) {
      const matches = text.match(regex);
      if (matches) {
        for (let match of matches) {
          // Bersihkan trailing punctuation dan markdown formatting
          match = match.replace(/[\.\,\)\]\>\'\"\;\:\*\_\~]+$/, '');

          // Pastikan prefix https://
          let cleanUrl = match;
          if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
            cleanUrl = 'https://' + cleanUrl;
          }

          results.push({
            url: cleanUrl,
            type,
            source,
            label,
            context: text.substring(0, 150),
            author,
            isCreator,
          });
        }
      }
    }

    return results;
  }

  /**
   * Format pesan teks khas Justdhif untuk chat bot WhatsApp
   */
  private buildFormattedMessage(
    metadata: any,
    presets: PresetItem[],
    commentsCount: number
  ): string {
    const lines: string[] = [];
    lines.push('*乂 TIKTOK ALIGHT MOTION PRESET FINDER 乂*');
    lines.push('');
    lines.push(`• *Creator:* @${metadata.author.username || 'unknown'}`);
    if (metadata.title) {
      const shortTitle =
        metadata.title.length > 80 ? metadata.title.substring(0, 77) + '...' : metadata.title;
      lines.push(`• *Judul:* ${shortTitle}`);
    }
    lines.push(`• *Komentar Dipindai:* ${commentsCount}`);
    lines.push(`• *Preset Ditemukan:* ${presets.length}`);
    lines.push('');

    if (presets.length === 0) {
      lines.push('⚠️ *Status:* Tidak ada link preset (alight.link / Drive / MediaFire) yang ditemukan.');
      lines.push('Pastikan kreator menaruh link preset di caption atau kolom komentar.');
    } else {
      lines.push('📂 *LINK PRESET DITEMUKAN:*');
      lines.push('');
      presets.forEach((p, index) => {
        const sourceBadge = p.source === 'caption' ? '📌 Dari Caption' : `💬 Dari Komentar (@${p.author})`;
        lines.push(`${index + 1}. *[${p.label}]* - ${sourceBadge}`);
        lines.push(`   🔗 ${p.url}`);
        lines.push('');
      });
      lines.push('💡 _Klik tautan di atas untuk langsung membuka dan mengimpor preset di aplikasi Alight Motion._');
    }

    lines.push('');
    lines.push('—');
    lines.push('*⚡ Alight Motion API by Justdhif*');

    return lines.join('\n');
  }
}
