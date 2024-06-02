import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { ShowSidebarButton } from '@/components/show-sidebar-button';
import { userBoardsQuery } from '@/lib/queries/user-boards-query';

interface Props {
	children: React.ReactNode;
}

const RootLayout: React.FC<Props> = ({ children }) => {
	const userBoardsPromise = userBoardsQuery();
	return (
		<div className='flex flex-1 bg-light dark:bg-dark-400 h-screen overflow-y-hidden'>
			<Sidebar userBoardsPromise={userBoardsPromise} />

			<div className='flex flex-1 flex-col overflow-hidden'>
				<Header userBoardsPromise={userBoardsPromise} />
				<div className='overflow-x-scroll flex-1'>{children}</div>
				<ShowSidebarButton />
			</div>
		</div>
	);
};

export default RootLayout;
