'use server';

import { boardsTable, columnsTable, type Board } from '@/db/schema';
import { db } from '@/db/db';
import { EditBoardSchema } from '../schemas/edit-board-schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

interface Args {
	boardId: Board['id'];
	data: EditBoardSchema;
}

export const editBoardAction = async ({ boardId, data }: Args) => {
	try {
		const board = await db.query.boardsTable.findFirst({
			where: (boards, { eq }) => eq(boards.id, boardId),
		});

		if (!board) {
			return {
				ok: false,
				error: 'Board not found.',
			};
		}

		await db
			.update(boardsTable)
			.set({
				name: data.boardName,
			})
			.where(eq(boardsTable.id, boardId));

		for (const column of data.boardColumns) {
			// 1. Delete column -> column.id exists and column.shouldDelete = true
			// 2. Update column -> column.id exists and column.shouldDelete = false
			// 3. Add column -> column.id does not exist and column.shouldDelete = false
			const columnId = column.id;

			const shouldDelete = column.shouldDelete;

			if (shouldDelete && columnId) {
				await db.delete(columnsTable).where(eq(columnsTable.id, columnId));
			} else if (!shouldDelete && columnId) {
				await db
					.update(columnsTable)
					.set({
						name: column.name,
						color: column.color,
					})
					.where(eq(columnsTable.id, columnId));
			} else {
				await db.insert(columnsTable).values({
					name: column.name,
					color: column.color,
					boardId: boardId,
				});
			}
		}

		revalidatePath('/[boardId]', 'page');

		return {
			ok: true,
			message: 'Board updated.',
		};
	} catch (error) {
		console.error(error);

		return {
			ok: false,
			error: 'Unable to edit board. Please try again later.',
		};
	}
};
