'use client';
import * as React from 'react';

import { useTheme } from 'next-themes';

import iconLightTheme from '@/public/icon-light-theme.svg';
import iconDarkTheme from '@/public/icon-dark-theme.svg';
import Image from 'next/image';

export const ThemeSwitcher = () => {
	const { setTheme, theme } = useTheme();

	return (
		<div className='flex items-center justify-evenly p-5 rounded-md bg-light dark:bg-dark-400'>
			<Image
				src={iconLightTheme}
				alt='Light Theme'
				className='size-5'
			/>

			{/* Switch like input */}

			<div className='relative inline-flex items-center'>
				<input
					type='checkbox'
					id='theme-switcher'
					name='theme-switcher'
					className='peer sr-only'
					aria-label='Toggle Theme'
					checked={theme === 'dark'}
					onChange={event => {
						setTheme(event.target.checked ? 'dark' : 'light');
					}}
				/>
				<label
					className="cursor-pointer h-6 w-11 rounded-full border after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] bg-main peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-green-300"
					htmlFor='theme-switcher'></label>
			</div>

			<Image
				src={iconDarkTheme}
				alt='Dark Theme'
				className='size-5'
			/>
		</div>
	);
};
