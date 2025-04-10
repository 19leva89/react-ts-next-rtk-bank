import type { Metadata } from 'next'
import { PropsWithChildren } from 'react'
import { Geist, Jost } from 'next/font/google'

import './normalize.css'
import './globals.css'
import StoreProvider from '@/components/shared/providers/store-provider'

const jost = Jost({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600'],
	variable: '--font-jost',
	display: 'swap',
})

const geistSans = Geist({
	subsets: ['latin'],
	variable: '--font-geist-sans',
})

export const metadata: Metadata = {
	title: 'Bank',
	description: 'Bank app for transfer money',
}

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<body className={`${jost.variable} ${geistSans.variable}`}>
				<div id="root">
					<StoreProvider>{children}</StoreProvider>
				</div>
			</body>
		</html>
	)
}
