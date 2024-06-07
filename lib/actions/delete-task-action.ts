'use server';

import { revalidatePath } from 'next/cache';

import { eq } from 'drizzle-orm';

import { db } from '@/db/db';
import { tasksTable, type Task } from '@/db/schema';

export const deleteTaskAction = async (taskId: Task['id']) => {
	try {
		//TODO: Implement user authentication and authorization when enabled

		await db.delete(tasksTable).where(eq(tasksTable.id, taskId));

		revalidatePath('/[boardId]', 'page');

		return {
			ok: true,
			message: 'Task deleted.',
		};
	} catch (error) {
		console.error(error);

		return {
			ok: false,
			error: 'Unhandled error, please try again later.',
		};
	}
};
