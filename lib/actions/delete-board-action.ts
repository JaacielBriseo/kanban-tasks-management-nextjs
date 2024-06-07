'use server';

import { revalidatePath } from 'next/cache';

import { eq } from 'drizzle-orm';

import { db } from '@/db/db';
import { boardsTable, type Board } from '@/db/schema';

export const deleteBoardAction = async (boardId: Board['id']) => {
	try {
		//TODO: Implement user authentication and authorization when enabled

		await db.delete(boardsTable).where(eq(boardsTable.id, boardId));

		revalidatePath('/[boardId]', 'page');

		return {
			ok: true,
			message: 'Board deleted.',
		};
	} catch (error) {
		console.error(error);

		return {
			ok: false,
			error: 'Unhandled error, please try again later.',
		};
	}
};
