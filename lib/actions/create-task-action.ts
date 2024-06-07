'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/db/db';

import { subtasksTable, tasksTable } from '@/db/schema';

import type { CreateTaskSchema } from '../schemas/create-task-schema';

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
			where: (columns, { eq }) => eq(columns.id, Number(values.columnId)),
			with: {
				tasks: true,
			},
		});

		if (!parentColumn) {
			return {
				ok: false,
				error: 'Column not found.',
			};
		}

		if (parentColumn.tasks.length >= 35) {
			return {
				ok: false,
				error: 'You have reached the maximum number of tasks.',
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

		revalidatePath('/[boardId]', 'page');

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
