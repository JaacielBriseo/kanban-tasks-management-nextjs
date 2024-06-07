'use server';

import { db } from '@/db/db';

export const userBoardsQuery = async () => {
	try {
		const user = await db.query.usersTable.findFirst({
			where: (users, { eq }) => eq(users.email, 'demo@user.com'),
		});

		if (!user) {
			return [];
		}

		const boards = await db.query.boardsTable.findMany({
			where: (boardsTable, { eq }) => eq(boardsTable.userId, user.id),
			with: {
				columns: true,
			},
		});

		return boards;
	} catch (error) {
		console.error(error);

		return [];
	}
};
