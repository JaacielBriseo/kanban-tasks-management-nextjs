'use server';

import { db } from '@/db/db';

export const boardColumnsQuery = async (boardId: number) => {
	try {
		const board = await db.query.boardsTable.findFirst({
			where: (boardsTable, { eq }) => eq(boardsTable.id, boardId),
		});
		console.log({
			board
		});

		if (!board) {
			return [];
		}


		const columns = await db.query.columnsTable.findMany({
			where: (columnsTable, { eq }) => eq(columnsTable.boardId, board.id),
		});

		return columns;
	} catch (error) {
		console.error(error);

		return [];
	}
};
