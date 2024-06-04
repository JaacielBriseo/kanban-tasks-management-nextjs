'use server';

import { revalidatePath } from 'next/cache';

import { eq } from 'drizzle-orm';

import { db } from '@/db/db';
import { subtasksTable, tasksTable } from '@/db/schema';

import type { UpdateTaskSchema } from '../schemas/update-task-schema';

type SuccessResponse = {
	ok: true;
	message: string;
};

type ErrorResponse = {
	ok: false;
	error: string;
};

type UpdateTaskActionResponse = SuccessResponse | ErrorResponse;

export const updateTaskAction = async (
	taskUpdateData: UpdateTaskSchema
): Promise<UpdateTaskActionResponse> => {
	try {
		const parentColumn = await db.query.columnsTable.findFirst({
			where: (columns, { eq }) =>
				eq(columns.id, Number(taskUpdateData.columnId)),
		});

		if (!parentColumn) {
			return {
				ok: false,
				error: 'Column not found.',
			};
		}

		const [updatedTask] = await db
			.update(tasksTable)
			.set({
				title: taskUpdateData.title,
				description: taskUpdateData.description,
				columnId: parentColumn.id,
				status: parentColumn.name,
			})
			.where(eq(tasksTable.id, taskUpdateData.id))
			.returning();

		if (taskUpdateData.subtasks.length > 0) {
			for (const subtask of taskUpdateData.subtasks) {
				const { title, subtaskId } = subtask;

				const existingSubtask = await db.query.subtasksTable.findFirst({
					where: (subtasks, { eq }) => eq(subtasks.id, Number(subtaskId)),
				});

				if (existingSubtask) {
					await db
						.update(subtasksTable)
						.set({ title })
						.where(eq(subtasksTable.id, existingSubtask.id));
				} else {
					await db
						.insert(subtasksTable)
						.values({ title, taskId: updatedTask.id, isCompleted: false });
				}
			}
		}

		revalidatePath('/[boardId]');

		return {
			ok: true,
			message: 'Task updated successfully.',
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Error updating task. Please try again.',
		};
	}
};
