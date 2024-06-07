'use client';

import { useState } from 'react';

import Image from 'next/image';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

import iconBoardPurple from '@/public/icon-board-purple.svg';
import { EditBoardForm } from './edit-board-form';
import { Board, BoardWithColumns } from '@/db/schema';

interface Props {
	board: BoardWithColumns;
}

export const EditBoardModal = ({ board }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Dialog
			open={isOpen}
			onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<button className='text-grayish focus:outline-none size-full text-start'>Edit Board</button>
			</DialogTrigger>
			<DialogContent
				className='w-11/12 max-w-[480px]'
				showCloseButton={false}>
				<DialogHeader>
					<DialogTitle className='font-bold text-[18px] text-start'>
						Edit Board
					</DialogTitle>
				</DialogHeader>
				<div>
					<EditBoardForm
						board={board}
						afterSubmitFn={() => setIsOpen(false)}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
};
