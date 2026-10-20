import { z } from 'zod';

export const sendLinkSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .trim()
    .email({ message: 'Format email tidak valid. Pastikan penulisan email sudah benar.' })
    .toLowerCase(),
  sessionId: z.string().trim().optional(),
  senderId: z.string().trim().optional(),
});

export const verifyMagicLinkSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email({ message: 'Format email tidak valid. Pastikan penulisan email sudah benar.' })
      .toLowerCase()
      .optional(),
    link: z.string().trim().min(5, { message: 'Link tidak boleh kosong' }).optional(),
    magicLink: z.string().trim().min(5, { message: 'Magic link tidak boleh kosong' }).optional(),
    oobCode: z.string().trim().min(5, { message: 'oobCode tidak boleh kosong' }).optional(),
    sessionId: z.string().trim().optional(),
    senderId: z.string().trim().optional(),
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
    .min(1, { message: 'Perintah (text) tidak boleh kosong.' }),
  senderId: z.string().trim().optional(),
  jid: z.string().trim().optional(),
});

export type SendLinkInput = z.infer<typeof sendLinkSchema>;
export type VerifyMagicLinkInput = z.infer<typeof verifyMagicLinkSchema>;
export type CommandInput = z.infer<typeof commandSchema>;
