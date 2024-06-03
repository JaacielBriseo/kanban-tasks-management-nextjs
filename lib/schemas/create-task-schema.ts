import { z } from 'zod';

export const createTaskSchema = z.object({
	title: z.string().min(1, 'Task title must be at least 1 characters.'),
	description: z
		.string()
		.min(1, 'Task description must be at least 1 characters.'),
	columnId: z.string(),
	subtasks: z
		.array(z.string().min(1, 'Subtask must be at least 1 characters.'))
		.default([]),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;