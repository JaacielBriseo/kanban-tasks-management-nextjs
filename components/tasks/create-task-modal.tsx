'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

import iconAddTaskMobile from '@/public/icon-add-task-mobile.svg';
import Image from 'next/image';
import { CreateTaskForm } from './create-task-form';
import { useState } from 'react';

export const CreateTaskModal = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog
			open={isOpen}
			onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<button className='px-4 bg-main rounded-3xl py-2'>
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
				<CreateTaskForm onAfterSuccess={() => setIsOpen(false)} />
			</DialogContent>
		</Dialog>
	);
};
