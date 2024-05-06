/*
The auth.config.ts file at the root of our project that exports an authConfig object. This object will contain the configuration options for NextAuth.js. For now, it will only contain the pages option:
/auth.config.ts
*/

import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
 
export const authConfig = {
	pages: {
		signIn: '/login',
	},
	callbacks: {
		// The auth property contains the user's session, and the request property contains the incoming request.
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user;
			const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
			if (isOnDashboard) {
				if (isLoggedIn) { return true; }
				return false; // Redirect unauthenticated users to login page
			} else if (isLoggedIn) {
				return Response.redirect(new URL('/dashboard', nextUrl));
			}
			return true;
		},
	},
	providers: [Credentials({})], // Add providers with an empty array for now
} satisfies NextAuthConfig;