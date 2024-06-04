import { z } from 'zod';

export const updateTaskSchema = z.object({
	id: z.number(),
	title: z.string().min(1, 'Task title must be at least 1 characters.'),
	description: z
		.string()
		.min(1, 'Task description must be at least 1 characters.'),
	columnId: z.string(),
	subtasks: z
		.array(
			z.object({
				title: z.string().min(1, 'Subtask must be at least 1 characters.'),
				subtaskId: z.string().optional(),
			})
		)
		.default([]),
});

export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
