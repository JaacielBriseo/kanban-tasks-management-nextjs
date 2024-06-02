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
import { CreateBoardForm } from './create-board-form';

import iconBoardPurple from '@/public/icon-board-purple.svg';

export const CreateNewBoardModal = () => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Dialog
			open={isOpen}
			onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<button className='py-4 text-main font-bold flex items-center'>
					<Image
						src={iconBoardPurple}
						alt='Create New Board'
						className='size-5'
					/>
					&nbsp; +Create New Board
				</button>
			</DialogTrigger>
			<DialogContent
				className='w-11/12 max-w-[480px]'
				showCloseButton={false}>
				<DialogHeader>
					<DialogTitle className='font-bold text-[18px] text-start'>
						Add New Board
					</DialogTitle>
				</DialogHeader>
				<div>
					<CreateBoardForm afterSubmitFn={() => setIsOpen(false)} />
				</div>
			</DialogContent>
		</Dialog>
	);
};
