import { z } from 'zod';

// Regex untuk mendeteksi null bytes atau karakter kontrol berbahaya
const noControlChars = (val: string) => !/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(val);

export const sendLinkSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .trim()
    .toLowerCase()
    .max(100, { message: 'Email terlalu panjang (maksimum 100 karakter).' })
    .email({ message: 'Format email tidak valid. Pastikan penulisan email sudah benar.' })
    .refine(noControlChars, { message: 'Email mengandung karakter yang tidak diizinkan.' }),
  sessionId: z
    .string()
    .trim()
    .max(100, { message: 'Session ID terlalu panjang (maksimum 100 karakter).' })
    .refine(noControlChars)
    .optional(),
  senderId: z
    .string()
    .trim()
    .max(100, { message: 'Sender ID terlalu panjang (maksimum 100 karakter).' })
    .refine(noControlChars)
    .optional(),
});

export const verifyMagicLinkSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .max(100, { message: 'Email terlalu panjang (maksimum 100 karakter).' })
      .email({ message: 'Format email tidak valid. Pastikan penulisan email sudah benar.' })
      .refine(noControlChars)
      .optional(),
    link: z
      .string()
      .trim()
      .min(5, { message: 'Link tidak boleh kosong' })
      .max(2048, { message: 'Tautan terlalu panjang (maksimum 2048 karakter).' })
      .refine(noControlChars, { message: 'Tautan mengandung karakter tidak valid.' })
      .optional(),
    magicLink: z
      .string()
      .trim()
      .min(5, { message: 'Magic link tidak boleh kosong' })
      .max(2048, { message: 'Tautan terlalu panjang (maksimum 2048 karakter).' })
      .refine(noControlChars)
      .optional(),
    oobCode: z
      .string()
      .trim()
      .min(5, { message: 'oobCode tidak boleh kosong' })
      .max(500, { message: 'oobCode terlalu panjang.' })
      .refine(noControlChars)
      .optional(),
    sessionId: z
      .string()
      .trim()
      .max(100, { message: 'Session ID terlalu panjang.' })
      .refine(noControlChars)
      .optional(),
    senderId: z
      .string()
      .trim()
      .max(100, { message: 'Sender ID terlalu panjang.' })
      .refine(noControlChars)
      .optional(),
  })
  .refine(({ link, magicLink, oobCode }) => Boolean(link || magicLink || oobCode), {
    message: 'Parameter link, magicLink, atau oobCode wajib disertakan.',
    path: ['link'],
  });

export const commandSchema = z.object({
  text: z
    .string({
      required_error: 'Perintah (text) wajib disertakan.',
    })
    .trim()
    .min(1, { message: 'Perintah (text) tidak boleh kosong.' })
    .max(500, { message: 'Perintah teks terlalu panjang (maksimum 500 karakter).' })
    .refine(noControlChars, { message: 'Perintah mengandung karakter kontrol tidak valid.' }),
  senderId: z
    .string()
    .trim()
    .max(100, { message: 'Sender ID terlalu panjang.' })
    .refine(noControlChars)
    .optional(),
  jid: z
    .string()
    .trim()
    .max(100, { message: 'JID terlalu panjang.' })
    .refine(noControlChars)
    .optional(),
});

export type SendLinkInput = z.infer<typeof sendLinkSchema>;
export type VerifyMagicLinkInput = z.infer<typeof verifyMagicLinkSchema>;
export type CommandInput = z.infer<typeof commandSchema>;
