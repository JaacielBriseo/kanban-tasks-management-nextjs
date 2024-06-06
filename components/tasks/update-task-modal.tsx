'use client';

import { useState } from 'react';

import { UpdateTaskForm } from './update-task-form';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

import type { TaskWithSubtasks } from '@/db/schema';

interface Props {
	task: TaskWithSubtasks;
}

export const UpdateTaskModal = ({ task }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Dialog
			open={isOpen}
			onOpenChange={setIsOpen}>
			<DialogTrigger className='size-full text-start focus:outline-none'>
				Edit
			</DialogTrigger>
			<DialogContent
				className='w-11/12 max-w-[480px]'
				overlayClassName='bg-black/30'
				showCloseButton={false}>
				<DialogHeader>
					<DialogTitle className='font-bold text-lg md:text-xl text-start'>
						Edit Task
					</DialogTitle>
				</DialogHeader>
				<UpdateTaskForm
					task={task}
					onAfterSuccess={() => setIsOpen(false)}
				/>
			</DialogContent>
		</Dialog>
	);
};
