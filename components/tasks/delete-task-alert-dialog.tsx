'use client';

import { useTransition } from 'react';

import { toast } from 'sonner';

import { deleteTaskAction } from '@/lib/actions/delete-task-action';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import type { Task } from '@/db/schema';

interface Props {
	taskId: Task['id'];
}

export const DeleteTaskAlertDialog = ({ taskId }: Props) => {
	const [isPending, startTransition] = useTransition();

	const handleDelete = () => {
		startTransition(async () => {
			const response = await deleteTaskAction(taskId);

			if (response.ok) {
				toast.success(response.message);
			} else {
				toast.error(response.error);
			}
		});
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<button className='size-full text-start focus:outline-none'>
					Delete
				</button>
			</AlertDialogTrigger>
			<AlertDialogContent className='w-11/12 max-w-[480px] space-y-5'>
				<AlertDialogHeader className='space-y-5'>
					<AlertDialogTitle className='text-danger font-semibold text-lg'>
						Delete this task?
					</AlertDialogTitle>
					<AlertDialogDescription className='text-grayish'>
						Are you sure you want to delete the ‘Build settings UI’ task and its
						subtasks? This action cannot be reversed.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className='flex flex-col md:flex-row'>
					<AlertDialogAction asChild>
						<Button
							variant='destructive'
							disabled={isPending}
							className='bg-danger hover:bg-danger-400 rounded-full w-full font-bold dark:text-white'
							onClick={handleDelete}>
							Confirm
						</Button>
					</AlertDialogAction>
					<AlertDialogCancel
						disabled={isPending}
						className='bg-main/10 text-main rounded-full w-full font-bold dark:bg-white hover:text-main/80 hover:bg-main/20'>
						Cancel
					</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
