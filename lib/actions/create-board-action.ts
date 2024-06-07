'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/db/db';
import { boardsTable, columnsTable } from '@/db/schema';

import type { CreateBoardSchema } from '@/lib/schemas/create-board-schema';

type SuccessResponse = {
	ok: true;
	message: string;
	boardId: number;
};

type ErrorResponse = {
	ok: false;
	error: string;
};

type CreateBoardActionResponse = SuccessResponse | ErrorResponse;

export const createBoardAction = async (
	data: CreateBoardSchema
): Promise<CreateBoardActionResponse> => {
	try {
		const defaultUser = await db.query.usersTable.findFirst({
			where: (users, { eq }) => eq(users.email, 'demo@user.com'),
			with: {
				boards: true,
			},
		});

		if (!defaultUser) {
			return {
				ok: false,
				error: 'User not found.',
			};
		}

		if (defaultUser.boards.length >= 10) {
			return {
				ok: false,
				error: 'You have reached the maximum number of boards.',
			};
		}

		const [board] = await db
			.insert(boardsTable)
			.values({
				userId: defaultUser.id,
				name: data.boardName,
			})
			.returning();

		if (data.boardColumns.length >= 10) {
			return {
				ok: false,
				error: 'You have reached the maximum number of columns.',
			};
		}

		if (data.boardColumns.length > 0) {
			await db.insert(columnsTable).values(
				data.boardColumns.map(({ name, color }) => ({
					name,
					color,
					boardId: board.id,
				}))
			);
		}

		revalidatePath('/[boardId]', 'page');

		return {
			ok: true,
			message: 'Board created successfully.',
			boardId: board.id,
		};
	} catch (error) {
		console.error(error);
		return {
			ok: false,
			error: 'Something went wrong. Please try again.',
		};
	}
};
