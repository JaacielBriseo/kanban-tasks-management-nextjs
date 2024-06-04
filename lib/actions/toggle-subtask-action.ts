'use server';

import { revalidatePath } from 'next/cache';

import { eq } from 'drizzle-orm';

import { db } from '@/db/db';
import { Subtask, subtasksTable } from '@/db/schema';

type SuccessResponse = {
	ok: true;
	message: string;
};

type ErrorResponse = {
	ok: false;
	error: string;
};

type ToggleSubtaskActionResponse = SuccessResponse | ErrorResponse;

export const toggleSubtaskAction = async (
	subtaskId: Subtask['id']
): Promise<ToggleSubtaskActionResponse> => {
	try {
		const subtask = await db.query.subtasksTable.findFirst({
			where: (subtask, comparisonAlgorithm) =>
				comparisonAlgorithm.eq(subtask.id, subtaskId),
		});

		if (!subtask) {
			return {
				ok: false,
				error: 'Subtask not found.',
			};
		}

		await db
			.update(subtasksTable)
			.set({
				isCompleted: !subtask.isCompleted,
			})
			.where(eq(subtasksTable.id, subtaskId));

    revalidatePath('/[boardId]');
      
		return {
			ok: true,
			message: 'Subtask toggled successfully.',
		};
	} catch (error) {
		console.error(error);

		return {
			ok: false,
			error: 'Unhandle error occured. Please try again later.',
		};
	}
};
