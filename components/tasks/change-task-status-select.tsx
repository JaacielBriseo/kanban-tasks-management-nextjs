'use client';

import { useOptimistic, useTransition } from 'react';

import { useParams } from 'next/navigation';

import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

import { boardColumnsQuery } from '@/lib/queries/board-columns-query';
import { changeTaskStatusAction } from '@/lib/actions/change-task-status-action';

import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';

import type { Task } from '@/db/schema';

interface Props {
	task: Task;
}

export const ChangeTaskStatusSelect = ({ task }: Props) => {
	const params = useParams();
	const [isPending, startTransition] = useTransition();

	const boardId = params.boardId?.toString() || '';
	const { data: columns } = useQuery({
		queryKey: [`columns.from.${boardId}`],
		queryFn: async () => {
			return await boardColumnsQuery(Number(boardId));
		},
		enabled: !!boardId && !isNaN(Number(boardId)),
		initialData: [],
	});

	const [optimisticStatusId, setOptimisticStatusId] = useOptimistic(
		task.columnId.toString(),
		(previous, newColumnId) => {
			return (
				columns.find(column => column.id === newColumnId)?.id.toString() ||
				previous
			);
		}
	);

	const onSelectChange = (newColumnId: string) => {
		const numberColumnId = Number(newColumnId);

		if (isNaN(numberColumnId)) {
			toast.error('Invalid column ID');
			return;
		}

		startTransition(async () => {
			setOptimisticStatusId(numberColumnId);

			const response = await changeTaskStatusAction(task.id, numberColumnId);

			if (!response.ok) {
				toast.error(response.error);
			}
		});
	};

	return (
		<div className='space-y-2'>
			<div className='flex items-center gap-1'>
				<span className='font-semibold text-sm text-grayish'>Status</span>
				{isPending && (
					<span className='animate-spin inline-block'>&#x21bb;</span>
				)}
			</div>
			<Select
				defaultValue={optimisticStatusId}
				onValueChange={onSelectChange}
        >
				<SelectTrigger
					iconClassName='text-main opacity-100 size-5 stroke-[2.5]'
					className='border-0 ring-input ring-1 active:ring-main focus:ring-main focus-within:ring-main'>
					<SelectValue placeholder='Select a status' />
				</SelectTrigger>
				<SelectContent>
					{columns.map(column => (
						<SelectItem
							key={column.id}
							value={column.id.toString()}>
							{column.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};
