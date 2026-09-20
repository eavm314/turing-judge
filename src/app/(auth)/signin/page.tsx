'use client';
import { signIn } from '@/actions/auth';
import { SignInForm } from '@/components/auth/signin-form';
import { useSession } from '@/providers/user-provider';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const provider = searchParams.get('provider');
  const error = searchParams.get('error');

  const { user, setOpenSignIn } = useSession();

  useEffect(() => {
    if (user) {
      setOpenSignIn(false);
      window.close();
      router.replace('/');
    } else if (provider) {
      signIn(provider);
    }
  }, [user, provider]);

  if (user || provider) return null;

  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8 border rounded-xl p-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome!</h1>
          <p className="text-muted-foreground">Sign in to your account to continue:</p>
        </div>
        {error && (
          <p className="text-sm text-destructive text-center">
            Something went wrong signing you in. Please try again.
          </p>
        )}
        <SignInForm onSuccess={() => router.replace('/')} />
      </div>
    </main>
  );
}
