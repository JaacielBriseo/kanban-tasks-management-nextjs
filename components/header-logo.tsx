'use client';

import Link from 'next/link';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { useSidebar } from '@/lib/hooks/use-sidebar';

import logoMobile from '@/public/logo-mobile.svg';
import sidebarLogoDark from '@/public/logo-dark.svg';
import sidebarLogoLight from '@/public/logo-light.svg';

export const HeaderLogo = () => {
	const { isSidebarOpen } = useSidebar();

	return (
		<Link href='/'>
			<div>
				<Image
					src={logoMobile}
					alt='Mobile Logo'
					className='md:hidden'
				/>
				<div
					className={cn('mb-1 hidden md:block', {
						'!hidden': isSidebarOpen,
					})}>
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
			</div>
		</Link>
	);
};
