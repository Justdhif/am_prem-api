import { z } from 'zod';

export const addCommentSchema = z.object({
  parentId: z.string().optional().nullable(),
  name: z.string().max(50, 'Nama maksimal 50 karakter').optional(),
  isAnonymous: z.boolean().optional().default(false),
  content: z
    .string()
    .min(1, 'Isi komentar tidak boleh kosong')
    .max(1000, 'Isi komentar maksimal 1000 karakter'),
});

export type AddCommentInput = z.infer<typeof addCommentSchema>;
