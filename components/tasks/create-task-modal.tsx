'use client';

import { useState } from 'react';

import Image from 'next/image';
import { useParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import { boardColumnsQuery } from '@/lib/queries/board-columns-query';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { CreateTaskForm } from './create-task-form';

import iconAddTaskMobile from '@/public/icon-add-task-mobile.svg';

export const CreateTaskModal = () => {
	const [isOpen, setIsOpen] = useState(false);

	const params = useParams();

	const boardId = params.boardId;

	const { data: columns } = useQuery({
		queryKey: [`columns.from.${boardId}`],
		queryFn: async () => {
			return await boardColumnsQuery(Number(boardId));
		},
		enabled: !!boardId && !isNaN(Number(boardId)),
		initialData: [],
	});

	return (
		<Dialog
			open={isOpen}
			onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<button
					disabled={columns.length === 0}
					className='px-4 bg-main rounded-3xl py-2 disabled:bg-main/40 disabled:cursor-not-allowed'>
					<Image
						src={iconAddTaskMobile}
						alt='Add Task'
					/>
					<span className='sr-only'>Add Task</span>
				</button>
			</DialogTrigger>
			<DialogContent
				className='w-11/12 max-w-[480px]'
				showCloseButton={false}>
				<DialogHeader>
					<DialogTitle className='font-bold text-lg md:text-xl text-start'>
						Add New Task
					</DialogTitle>
				</DialogHeader>
				<CreateTaskForm
					onAfterSuccess={() => setIsOpen(false)}
					columns={columns}
				/>
			</DialogContent>
		</Dialog>
	);
};
