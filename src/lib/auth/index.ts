import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import PrismaAdapter from "./adapter"
import { type Role } from "@prisma/client";
import { prisma } from "../db/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // @ts-expect-error: Using the overridden adapter
  adapter: PrismaAdapter,
  providers: [
    Google({
      account() { }
    })
  ],
  callbacks: {
    async jwt({ token }) {
      if (token.email) {
        const user = await prisma.user.findUnique({
            where: { email: token.email }
        });

        if (!user) throw new Error("User is not in the database");

        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as Role;
      return session;
    }
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  // debug: true,
})