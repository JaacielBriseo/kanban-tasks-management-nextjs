import { z } from 'zod';

export const editBoardSchema = z.object({
	boardName: z.string().min(1, 'Board name must be at least 1 characters.'),
	boardColumns: z
		.array(
			z.object({
				id: z.number().optional(),
				name: z.string().min(1, 'Column name must be at least 1 characters.'),
				color: z
					.string()
					.regex(/^#[0-9A-F]{6}$/i, { message: 'Invalid color code.' }),
				shouldDelete: z.boolean().default(false),
			})
		)
		.default([]),
});

export type EditBoardSchema = z.infer<typeof editBoardSchema>;
