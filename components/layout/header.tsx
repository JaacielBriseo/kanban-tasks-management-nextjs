import Image from 'next/image';

import { userBoardsQuery } from '@/lib/queries/user-boards-query';

import { HeaderLogo } from '@/components/header-logo';
import { CurrentBoardNameWithSelector } from '@/components/current-board-name-with-selector';

import ellipsis from '@/public/icon-vertical-ellipsis.svg';
import iconAddTaskMobile from '@/public/icon-add-task-mobile.svg';

interface Props {
	userBoardsPromise: ReturnType<typeof userBoardsQuery>;
}

export const Header = async ({ userBoardsPromise }: Props) => {
	return (
		<header className='p-5 bg-white dark:bg-mattBlack w-full flex justify-between shadow dark:shadow-none z-10 border-b border-b-transparent dark:border-b dark:border-[#3E3F4E]'>
			<div className='flex items-center gap-3'>
				<HeaderLogo />

				<CurrentBoardNameWithSelector userBoardsPromise={userBoardsPromise} />
			</div>

			<div className='flex items-center gap-5'>
				{/* TODO: Add Task Action */}
				<button className='px-4 bg-main rounded-3xl py-2'>
					<Image
						src={iconAddTaskMobile}
						alt='Add Task'
					/>
					<span className='sr-only'>Add Task</span>
				</button>

				{/* TODO: Board actions */}
				<button>
					<Image
						src={ellipsis}
						alt='Ellipsis'
					/>
					<span className='sr-only'>Open Board Menu</span>
				</button>
			</div>
		</header>
	);
};
