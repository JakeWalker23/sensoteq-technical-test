import { z } from 'zod';

export const FilmSearchQuerySchema = z.object({
  title: z.string().trim().min(1).optional(),
  length: z.coerce.number().int().positive().optional(), // accepts "60" as string
  limit: z.coerce.number().int().positive().max(200).optional().default(50),

  offset: z.coerce.number().int().min(0).optional().default(0),
});
export type FilmSearchQuery = z.infer<typeof FilmSearchQuerySchema>;