import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

import { Providers } from '@/components/providers';

const font = Plus_Jakarta_Sans({
	weight: ['200', '300', '400', '500', '600', '700', '800'],
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Kanban Task Management',
	description: 'Kanban Task Management | Frontend Mentor Challenge',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='en'
			suppressHydrationWarning>
			<body className={font.className}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
