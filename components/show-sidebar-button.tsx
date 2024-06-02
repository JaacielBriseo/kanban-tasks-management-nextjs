'use client';

import { useSidebar } from '@/lib/hooks/use-sidebar';
import showSidebarIcon from '@/public/icon-show-sidebar.svg';
import Image from 'next/image';

export const ShowSidebarButton = () => {
	const { toggleSidebar, isSidebarOpen } = useSidebar();
	return (
		<button
			onClick={toggleSidebar}
			className={`hidden md:flex absolute bottom-14 bg-main py-4 w-14 rounded-full -left-5 items-end justify-end ${
				isSidebarOpen ? 'opacity-0' : 'opacity-100'
			}`}>
			<Image
				src={showSidebarIcon}
				alt='Hide Sidebar'
				className='mr-3 scale-125'
			/>
		</button>
	);
};
