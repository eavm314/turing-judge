import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import PrismaAdapter from "./adapter"
import { type Role } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // @ts-ignore
  adapter: PrismaAdapter,
  providers: [
    Google({
      account() { }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role as Role;
      return session;
    }
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  }
  // debug: true,
})