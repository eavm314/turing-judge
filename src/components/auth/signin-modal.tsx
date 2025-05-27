'use client';

import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/ui/icons';
import { handleSignIn } from '@/lib/auth/client-handlers';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useSession } from '@/providers/user-provider';

export function SignInModal() {
  const { openSignIn, setOpenSignIn } = useSession();
  return (
    <Dialog open={openSignIn} onOpenChange={setOpenSignIn}>
      <DialogContent>
        <DialogTitle className="hidden">Sign In</DialogTitle>
        <div className="py-6 px-4 space-y-10">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome!</h1>
            <p className="text-muted-foreground">
              Choose your favorite provider to sign in to your account:
            </p>
          </div>
          <div className="flex flex-col gap-4 items-center">
            <Button
              className="w-60"
              variant="outline"
              type="button"
              onClick={() => handleSignIn('google')}
            >
              <GoogleIcon className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
