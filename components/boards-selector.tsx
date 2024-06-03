'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';

import iconBoard from '@/public/icon-board.svg';

import { CreateNewBoardModal } from './boards/create-new-board-modal';

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
export const BoardsSelector = ({ boards }: Props) => {
	const params = useParams();

	const currentBoardId = params.boardId?.toString() || '';

	return (
		<div className='space-y-5'>
			<h2 className='font-bold text-sm leading-5 text-grayish tracking-[2.4px] uppercase'>
				All Boards ({boards.length})
			</h2>
			<ul className='flex flex-col'>
				{boards.map(board => {
					const isActive = board.id === Number(currentBoardId);

					return (
						<li
							key={board.id}
							className='relative h-12 flex items-center '>
							<div
								className={cn(
									'bg-main absolute top-0 w-full h-full -translate-x-12 rounded-full transition-opacity',
									isActive ? 'opacity-100' : 'opacity-0'
								)}
							/>
							<Link
								href={`/${board.id}`}
								className='py-4 flex items-center gap-2 z-10'>
								<Image
									src={iconBoard}
									alt='Board Icon'
									className={cn(
										'size-5 transition-all duration-150 ease-in-out',
										isActive ? 'brightness-200' : ''
									)}
								/>
								<span
									className={cn(
										'font-bold transition-colors duration-150 ease-in-out',
										isActive ? 'text-white' : 'text-grayish'
									)}>
									{board.name}
								</span>
							</Link>
						</li>
					);
				})}
				<li>
					<CreateNewBoardModal />
				</li>
			</ul>
		</div>
	);
};
