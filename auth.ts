import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';

import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt'; // why is bcrypt async anyway? doesn't make much sense

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
	...authConfig,
	providers: [
		Credentials({
		  async authorize(credentials) {
			const parsedCredentials = z
			  .object({ email: z.string().email(), password: z.string().min(6) })
			  .safeParse(credentials);
			  
			if (parsedCredentials.success) {
				const { email, password } = parsedCredentials.data;
				const user = await getUser(email);
				if (!user) return null; // assuming user is undefined when returned from the DB? but that should trigger the error in getUser? then, when it's []? after all, [] is also falsey. but then why not compare with [] to be sure? or check length == 0? is it idiomatic to ask !user?
				
				const passwordsMatch = await bcrypt.compare(password, user.password);
				if (passwordsMatch) { return user; }
			}		
			
			console.log("Invalid credentials"); // how to tell this to the user? will the null below be used in the frontend?
			return null;
		  },
		}),
	],
});

