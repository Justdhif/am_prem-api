import { z } from 'zod';

export const findPresetSchema = z.object({
  url: z
    .string({ required_error: 'URL video TikTok wajib diisi' })
    .trim()
    .min(5, 'URL TikTok terlalu pendek')
    .max(1024, 'URL TikTok terlalu panjang')
    .refine(
      (val) => /tiktok\.com/i.test(val),
      'URL harus berupa tautan video TikTok yang valid (contoh: https://vt.tiktok.com/xxxx atau https://www.tiktok.com/@user/video/xxxx)'
    ),
});

export type FindPresetSchema = z.infer<typeof findPresetSchema>;
