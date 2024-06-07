'use client';

import { useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { deleteBoardAction } from '@/lib/actions/delete-board-action';

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

import type { Board } from '@/db/schema';

interface Props {
	boardId: Board['id'];
	boardName: Board['name'];
}

export const DeleteBoardAlertDialog = ({ boardId, boardName }: Props) => {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handleDelete = () => {
		startTransition(async () => {
			const response = await deleteBoardAction(boardId);

			if (response.ok) {
				toast.success(response.message);

				router.push('/');
				router.refresh();
			} else {
				toast.error(response.error);
			}
		});
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<button className='size-full text-start focus:outline-none text-destructive dark:text-danger'>
					Delete Board
				</button>
			</AlertDialogTrigger>
			<AlertDialogContent className='w-11/12 max-w-[480px] space-y-5'>
				<AlertDialogHeader className='space-y-5'>
					<AlertDialogTitle className='text-danger font-semibold text-lg'>
						Delete this board?
					</AlertDialogTitle>
					<AlertDialogDescription className='text-grayish'>
						Are you sure you want to delete the &apos;{boardName}&apos; board?
						This action will remove all columns and tasks and cannot be
						reversed.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className='flex flex-col md:flex-row'>
					<AlertDialogAction asChild>
						<Button
							disabled={isPending}
							variant='destructive'
							className='bg-danger hover:bg-danger/70 rounded-full w-full font-bold dark:text-white'
							onClick={handleDelete}>
							Confirm
						</Button>
					</AlertDialogAction>
					<AlertDialogCancel
						disabled={isPending}
						className='bg-main/10 text-main rounded-full w-full font-bold dark:bg-white'>
						Cancel
					</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
