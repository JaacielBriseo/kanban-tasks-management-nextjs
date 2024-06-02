import { z } from 'zod';

export const createBoardSchema = z.object({
	boardName: z.string().min(1, 'Board name must be at least 1 characters.'),
	boardColumns: z.array(z.object({
    name: z.string().min(1, 'Column name must be at least 1 characters.'),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, { message: 'Invalid color code.' }),
  })).default([]),
});

export type CreateBoardSchema = z.infer<typeof createBoardSchema>;
