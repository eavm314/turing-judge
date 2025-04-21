import Link from "next/link"
import type { Metadata } from "next"
import { SignInForm } from "@/components/auth/signin-form"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign In to your account",
}

export default function SignInPage() {
  return (
    <main className="container mx-auto h-screen flex items-center justify-center">
      <div className="py-10 px-4 space-y-10 border-4 rounded-xl">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome!</h1>
          <p className="text-sm text-accent-foreground">Choose your favorite provider to sign in to your account:</p>
        </div>
        <SignInForm />
        {/* <p className="px-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
          Sign up
          </Link>
          </p> */}
      </div>
    </main>
  )
}

