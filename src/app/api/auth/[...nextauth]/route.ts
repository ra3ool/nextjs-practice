import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import NextAuth, { type AuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const prisma = new PrismaClient();

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

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) return null;

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth',
  },
  session: { strategy: 'jwt' },
} as const;

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
