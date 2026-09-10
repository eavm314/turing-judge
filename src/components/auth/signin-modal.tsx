'use client';

import { SignInForm } from '@/components/auth/signin-form';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useSession } from '@/providers/user-provider';

export function SignInModal() {
  const { openSignIn, setOpenSignIn } = useSession();
  return (
    <Dialog open={openSignIn} onOpenChange={setOpenSignIn}>
      <DialogContent>
        <DialogTitle className="hidden">Sign In</DialogTitle>
        <div className="py-6 px-4 space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome!</h1>
            <p className="text-muted-foreground">Sign in to your account to continue:</p>
          </div>
          <SignInForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
