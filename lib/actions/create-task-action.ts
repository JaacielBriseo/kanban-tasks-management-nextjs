'use server';

import { subtasksTable, tasksTable } from '@/db/schema';
import { CreateTaskSchema } from '../schemas/create-task-schema';
import { db } from '@/db/db';
import { revalidatePath } from 'next/cache';

type SuccessResponse = {
	ok: true;
	message: string;
};

type ErrorResponse = {
	ok: false;
	error: string;
};

type CreateTaskActionResponse = SuccessResponse | ErrorResponse;

export const createTaskAction = async (
	values: CreateTaskSchema
): Promise<CreateTaskActionResponse> => {
	try {
		const parentColumn = await db.query.columnsTable.findFirst({
			where: (columns, { eq }) => eq(columns.id, values.columnId),
		});

		if (!parentColumn) {
			return {
				ok: false,
				error: 'Column not found.',
			};
		}

		const [task] = await db
			.insert(tasksTable)
			.values({
				title: values.title,
				description: values.description,
				columnId: parentColumn.id,
				status: parentColumn.name,
			})
			.returning();

		if (values.subtasks.length > 0) {
			const subtasks = values.subtasks.map(subtask => ({
				title: subtask,
				isCompleted: false,
				taskId: task.id,
			}));

			await db.insert(subtasksTable).values(subtasks);
		}

		revalidatePath('/[boardId]');

		return {
			ok: true,
			message: 'Task created successfully.',
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Error creating task. Please try again.',
		};
	}
};
