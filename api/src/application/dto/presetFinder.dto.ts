import { PresetItem, VideoMetadata, VideoPlatform } from '../../domain/entities/Preset.js';

export interface FindPresetInputDto {
  url: string;
}

export interface FindPresetOutputDto {
  success: boolean;
  message: string;
  data: {
    video: VideoMetadata;
    platform: VideoPlatform;
    presets: PresetItem[];
    directPresets: PresetItem[];
    channelInvites: PresetItem[];
    totalPresetsFound: number;
    totalCommentsScanned: number;
    caption: string;
    description?: string;
    formattedText: string;
  };
}
