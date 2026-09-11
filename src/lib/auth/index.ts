import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import PrismaAdapter from './adapter';
import { type Role } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { credentialsSchema } from '@/lib/schemas/user';
import { rateLimiter } from '@/utils/rate-limit';
import { cookies } from 'next/headers';

const signInLimiter = rateLimiter({
  interval: 15 * 60 * 1000,
  limit: 10,
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  // @ts-expect-error: Using the overridden adapter
  adapter: PrismaAdapter,
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const result = credentialsSchema.safeParse(credentials);
        if (!result.success) return null;

        const { email, password } = result.data;
        if (!signInLimiter(email)) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.password) return null;

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn() {
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get('authjs.session-token')?.value;
      return !sessionToken;
    },
    async jwt({ token }) {
      if (token.email) {
        const user = await prisma.user.findUnique({
          where: { email: token.email },
        });

        if (!user) return null;

        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as Role;
      return session;
    },
  },
  pages: {
    signIn: '/signin',
  },
  session: {
    strategy: 'jwt',
  },
});
