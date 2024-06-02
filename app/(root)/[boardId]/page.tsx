import { db } from '@/db/db';

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
							subtasks: true,
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
						className='space-y-5'>
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
							{column.tasks.map(task => {
								const completedSubtasks = task.subtasks.filter(
									subtask => subtask.isCompleted
								).length;

								return (
									<li
										key={task.id}
										className='w-[280px] p-4 shadow-md rounded-lg bg-white flex flex-col gap-1'>
										<h3 className='font-bold text-black text-lg'>
											{task.title}
										</h3>
										<span className='font-bold text-grayish'>
											{completedSubtasks} of {task.subtasks.length} subtasks
										</span>
									</li>
								);
							})}
						</ul>
					</li>
				))}
			</ul>
		</main>
	);
};

export default BoardByIdPage;
