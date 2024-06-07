import Image from 'next/image';

import {
	Dialog,
	DialogTitle,
	DialogHeader,
	DialogTrigger,
	DialogContent,
	DialogDescription,
} from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { UpdateTaskModal } from '@/components/tasks/update-task-modal';
import { ChangeTaskStatusSelect } from '@/components/tasks/change-task-status-select';
import { SubtaskToggleCheckbox } from '@/components/subtasks/subtask-toggle-checkbox';

import ellipsisIcon from '@/public/icon-vertical-ellipsis.svg';

import type { TaskWithSubtasks } from '@/db/schema';
import { DeleteTaskAlertDialog } from './delete-task-alert-dialog';

interface Props {
	task: TaskWithSubtasks;
}

export const TaskDetailsModal = ({ task }: Props) => {
	const completedSubtasks = task.subtasks.filter(
		subtask => subtask.isCompleted
	).length;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<button
					key={task.id}
					className='w-full p-4 shadow-md rounded-lg bg-white dark:bg-mattBlack flex flex-col gap-1 focus:outline-none'>
					<h3 className='font-bold text-black dark:text-white text-lg text-start'>
						{task.title}
					</h3>
					<span className='font-bold text-grayish'>
						{completedSubtasks} of {task.subtasks.length} subtasks
					</span>
				</button>
			</DialogTrigger>
			<DialogContent
				className='w-11/12 max-w-[480px]'
				showCloseButton={false}>
				<DialogHeader>
					<DialogTitle asChild>
						<div className='w-full flex items-start justify-between'>
							{/* Title */}
							<h1 className='w-11/12 text-lg font-extrabold tracking-normal'>
								{task.title}
							</h1>
							{/* Edit - Delete */}

							<DropdownMenu modal={false}>
								<DropdownMenuTrigger asChild>
									<button className='focus:outline-none'>
										<Image
											src={ellipsisIcon}
											alt='ellipsis icon'
										/>
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className='dark:opacity-100 dark:bg-dark-400'>
									<div className='size-full text-grayish relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'>
										<UpdateTaskModal task={task} />
									</div>
									<div className='size-full text-danger relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'>
										<DeleteTaskAlertDialog taskId={task.id} />
									</div>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</DialogTitle>
				</DialogHeader>
				<div className='flex flex-col gap-5'>
					<section id='task-description'>
						<DialogDescription className='font-medium text-sm leading-6 !text-grayish'>
							{task.description}
						</DialogDescription>
					</section>
					<section
						id='task-subtasks'
						className='space-y-2'>
						<div>
							<h2 className='font-extrabold text-[13px] text-grayish'>
								Subtasks ({completedSubtasks} of {task.subtasks.length})
							</h2>
						</div>
						<ul className='space-y-2'>
							{task.subtasks.map(subtask => (
								<li key={subtask.id}>
									<SubtaskToggleCheckbox subtask={subtask} />
								</li>
							))}
						</ul>
					</section>
					<section id='task-status'>
						<ChangeTaskStatusSelect task={task} />
					</section>
				</div>
			</DialogContent>
		</Dialog>
	);
};
