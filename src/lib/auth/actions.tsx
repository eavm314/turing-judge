"use server"
import { signIn as NextAuthSignIn } from "@/lib/auth"

export const signIn = async () => NextAuthSignIn();

export const signInGoogle = async () => NextAuthSignIn("google");