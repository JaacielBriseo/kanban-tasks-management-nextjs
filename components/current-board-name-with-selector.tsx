'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';

import { ThemeSwitcher } from '@/components/theme-switcher';
import { BoardsSelector } from '@/components/boards-selector';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import iconChevronDown from '@/public/icon-chevron-down.svg';

interface Props {
	boards: Array<{
		id: number;
		name: string;
		createdAt: Date;
		updatedAt: Date;
		deletedAt: Date | null;
		userId: number;
	}>;
}

export const CurrentBoardNameWithSelector = ({ boards }: Props) => {
	const params = useParams();
	const currentBoardId = params.boardId?.toString() || '';

	const currentBoard = boards.find(
		board => board.id === Number(currentBoardId)
	);

	const currentBoardName = currentBoard?.name || 'Choose a board';

	return (
		<Dialog>
			<DialogTrigger className='flex items-center gap-1 group'>
				<span className='font-black text-lg truncate md:text-2xl'>
					{currentBoardName}
				</span>
				<Image
					src={iconChevronDown}
					alt='Open Board Selector'
					className='group-data-[state=open]:rotate-180 transition-transform duration-300 ease-in-out'
				/>
			</DialogTrigger>
			<DialogContent
				className='w-11/12 max-w-[375px] rounded-xl overflow-hidden border-0'
				showCloseButton={false}>
				<BoardsSelector boards={boards} />
				<ThemeSwitcher />
			</DialogContent>
		</Dialog>
	);
};
