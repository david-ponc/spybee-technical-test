import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { PropsWithChildren } from 'react';

import { QueryProvider } from '~/core/query/provider';
import '~/styles/globals.scss';

const geistSans = Geist({
	variable: '--font-app-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-app-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Spybee | Prueba técnica',
	description: '',
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang='es' className={`${geistSans.variable} ${geistMono.variable}`}>
			<body>
				<NuqsAdapter>
					<QueryProvider>{children}</QueryProvider>
				</NuqsAdapter>
			</body>
		</html>
	);
}
