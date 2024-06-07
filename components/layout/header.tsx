import { use } from 'react';

import { userBoardsQuery } from '@/lib/queries/user-boards-query';

import { HeaderLogo } from '@/components/header-logo';
import { BoardActions } from '@/components/boards/board-actions';
import { CreateTaskModal } from '@/components/tasks/create-task-modal';
import { CurrentBoardNameWithSelector } from '@/components/current-board-name-with-selector';

interface Props {
	userBoardsPromise: ReturnType<typeof userBoardsQuery>;
}

export const Header = ({ userBoardsPromise }: Props) => {
	const userBoards = use(userBoardsPromise);

	return (
		<header className='p-5 bg-white dark:bg-mattBlack w-full flex justify-between shadow dark:shadow-none z-10 border-b border-b-transparent dark:border-b dark:border-[#3E3F4E]'>
			<div className='flex items-center gap-3'>
				<HeaderLogo />

				<CurrentBoardNameWithSelector boards={userBoards} />
			</div>

			<div className='flex items-center gap-5'>
				<CreateTaskModal />

				<BoardActions boards={userBoards} />
			</div>
		</header>
	);
};
