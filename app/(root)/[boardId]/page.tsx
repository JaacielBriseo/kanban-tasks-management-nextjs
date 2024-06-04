import { db } from '@/db/db';

import { TaskDetailsModal } from '@/components/tasks/task-details-modal';

interface Props {
	params: { boardId: string };
}

const BoardByIdPage: React.FC<Props> = async ({ params }) => {
	const board = await db.query.boardsTable.findFirst({
		where: (boardsTable, { eq }) => eq(boardsTable.id, Number(params.boardId)),
		with: {
			columns: {
				with: {
					tasks: {
						with: {
							subtasks: {
								orderBy: (subtasks, utils) => [utils.desc(subtasks.id)],
							},
						},
					},
				},
			},
		},
	});

	if (!board) {
		return <div>Board not found</div>;
	}

	return (
		<main className='p-5 size-full'>
			{/* Columns */}
			<ul className='flex gap-5'>
				{board.columns.map(column => (
					<li
						key={column.id}
						className='space-y-5 w-[280px]'>
						<div className='flex items-center gap-1'>
							<div
								style={{
									backgroundColor: column.color,
								}}
								className='size-[15px] rounded-full'
							/>
							<h2 className='font-bold text-sm leading-4 tracking-widest uppercase text-grayish'>
								{column.name} ({column.tasks.length})
							</h2>
						</div>
						{/* Tasks */}
						<ul className='space-y-5'>
							{column.tasks.map(task => (
								<li
									key={task.id}
									className='w-full'>
									{/* Task ticket */}
									<TaskDetailsModal task={task} />
								</li>
							))}
						</ul>
					</li>
				))}
			</ul>
		</main>
	);
};

export default BoardByIdPage;
