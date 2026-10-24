import { z } from 'zod';

export const findPresetSchema = z.object({
  url: z
    .string({ required_error: 'URL video TikTok atau YouTube wajib diisi' })
    .trim()
    .min(5, 'URL video terlalu pendek')
    .max(1024, 'URL video terlalu panjang')
    .refine(
      (val) => /tiktok\.com|youtube\.com|youtu\.be/i.test(val),
      'URL harus berupa tautan video TikTok (https://vt.tiktok.com/xxxx) atau YouTube (https://youtu.be/xxxx atau https://youtube.com/watch?v=xxxx)'
    ),
});

export type FindPresetSchema = z.infer<typeof findPresetSchema>;
