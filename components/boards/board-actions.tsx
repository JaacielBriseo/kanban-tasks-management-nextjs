'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EditBoardModal } from '@/components/boards/edit-board-modal';
import { DeleteBoardAlertDialog } from '@/components/boards/delete-board-alert-dialog';

import ellipsis from '@/public/icon-vertical-ellipsis.svg';

import type { BoardWithColumns } from '@/db/schema';

interface Props {
	boards: Array<BoardWithColumns>;
}

export const BoardActions = ({ boards }: Props) => {
	const params = useParams();

	const boardId = params.boardId?.toString() || '';

	const selectedBoard = boards.find(board => board.id === Number(boardId));

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button>
					<Image
						src={ellipsis}
						alt='Ellipsis'
					/>
					<span className='sr-only'>Open Board Menu</span>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align='start'
				sideOffset={10}
				className='w-[192px] h-[94px] mr-5 space-y-2 dark:bg-dark-400 flex items-center'>
				{!selectedBoard ? null : (
					<div className='px-2 space-y-3'>
						<EditBoardModal board={selectedBoard} />
						<DeleteBoardAlertDialog
							boardId={selectedBoard.id}
							boardName={selectedBoard.name}
						/>
					</div>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
