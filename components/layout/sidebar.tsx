'use client';

import sidebarLogoLight from '@/public/logo-light.svg';
import sidebarLogoDark from '@/public/logo-dark.svg';
import Image from 'next/image';
import { BoardsSelector } from '../boards-selector';
import { userBoardsQuery } from '@/lib/queries/user-boards-query';
import { ThemeSwitcher } from '../theme-switcher';

import iconHideSidebar from '@/public/icon-hide-sidebar.svg';
import { useSidebar } from '@/lib/hooks/use-sidebar';
import { cn } from '@/lib/utils';
interface Props {
	userBoardsPromise: ReturnType<typeof userBoardsQuery>;
}
export const Sidebar = ({ userBoardsPromise }: Props) => {
	const { isSidebarOpen, toggleSidebar } = useSidebar();

	return (
		<aside
			className={cn(
				'h-full flex flex-col overflow-hidden justify-between border-r z-10 bg-white dark:bg-mattBlack dark:border-[#3E3F4E] transition-all duration-300 ease-in-out',
				{
					'w-[300px] opacity-100 visible p-5': isSidebarOpen,
					'w-0 opacity-0 invisible p-0': !isSidebarOpen,
				}
			)}>
			<div className='space-y-10'>
				<div>
					<Image
						src={sidebarLogoDark}
						alt='Logo'
						className='dark:hidden block'
					/>

					<Image
						src={sidebarLogoLight}
						alt='Logo'
						className='hidden dark:block'
					/>
				</div>
				<div>
					<BoardsSelector userBoardsPromise={userBoardsPromise} />
				</div>
			</div>
			<div className='flex flex-col gap-5'>
				<ThemeSwitcher />
				<button
					onClick={toggleSidebar}
					className='flex items-center gap-2'>
					<Image
						src={iconHideSidebar}
						alt='Hide Sidebar'
						className='size-4'
					/>
					<span className='font-bold text-sm text-grayish'>Hide Sidebar</span>
				</button>
			</div>
		</aside>
	);
};
