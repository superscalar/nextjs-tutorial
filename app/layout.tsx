import '@/app/ui/global.css'
import { inter } from '@/app/ui/fonts.ts'

type ReactChildren = { children: React.ReactNode; };
export default function RootLayout( {children}: ReactChildren) {
	return (
		<html lang="en">
		<body className={`${inter.className}`}>{children}</body>
		</html>
	);
}