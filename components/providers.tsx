'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from './ui/sonner';
import { ThemeProvider } from './theme-provider';

const queryClient = new QueryClient();

interface Props {
	children: React.ReactNode;
}

export const Providers = ({ children }: Props) => {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider
				attribute='class'
				defaultTheme='system'
				enableSystem
				disableTransitionOnChange>
				{children}
				<ReactQueryDevtools initialIsOpen={false} />
				<Toaster />
			</ThemeProvider>
		</QueryClientProvider>
	);
};
