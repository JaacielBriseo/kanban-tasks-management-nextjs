'use server';

import { revalidatePath } from 'next/cache';

import { eq } from 'drizzle-orm';

import { db } from '@/db/db';

import { type Column, type Task, tasksTable } from '@/db/schema';

type SuccessResponse = {
	ok: true;
	message: string;
};

type ErrorResponse = {
	ok: false;
	error: string;
};

type ChangeTaskStatusResponse = SuccessResponse | ErrorResponse;

export const changeTaskStatusAction = async (
	taskId: Task['id'],
	newColumnId: Column['id']
): Promise<ChangeTaskStatusResponse> => {
	try {
		const task = await db.query.tasksTable.findFirst({
			where: (tasksTable, { eq }) => eq(tasksTable.id, taskId),
		});

		if (!task) {
			return {
				ok: false,
				error: 'Task not found',
			};
		}

		const targetColumn = await db.query.columnsTable.findFirst({
			where: (columnsTable, { eq }) => eq(columnsTable.id, newColumnId),
		});

		if (!targetColumn) {
			return {
				ok: false,
				error: 'Column not found',
			};
		}

		await db
			.update(tasksTable)
			.set({
				columnId: targetColumn.id,
				status: targetColumn.name,
			})
			.where(eq(tasksTable.id, taskId));

		revalidatePath('/[boardId]');

		return {
			ok: true,
			message: 'Task status changed successfully',
		};
	} catch (error) {
		console.error(error);

		return {
			ok: false,
			error: 'Unhandled error occurred while changing task status',
		};
	}
};
