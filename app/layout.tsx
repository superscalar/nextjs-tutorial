import '@/app/ui/global.css'
import { inter } from '@/app/ui/fonts.ts'
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

type ReactChildren = { children: React.ReactNode; };
export default function RootLayout( {children}: ReactChildren) {
	return (
		<html lang="en">
		<body className={`${inter.className}`}>{children}</body>
		</html>
	);
}