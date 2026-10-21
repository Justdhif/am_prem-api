import { PresetItem, TikTokVideoMetadata } from '../../domain/entities/Preset.js';

export interface FindPresetInputDto {
  url: string;
}

export interface FindPresetOutputDto {
  success: boolean;
  message: string;
  data: {
    video: TikTokVideoMetadata;
    presets: PresetItem[];
    totalPresetsFound: number;
    totalCommentsScanned: number;
    caption: string;
    formattedText: string;
  };
}
