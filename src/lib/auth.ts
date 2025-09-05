import NextAuth, { type AuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        // 🔹 Temporary hardcoded user (replace with DB later)
        if (
          credentials.email === 'admin@test.com' &&
          credentials.password === '1234'
        ) {
          return {
            id: '1',
            name: 'Admin',
            email: credentials.email,
            role: 'admin',
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/auth',
  },
  session: { strategy: 'jwt' },
} as const;

export const handler = NextAuth(authOptions);
