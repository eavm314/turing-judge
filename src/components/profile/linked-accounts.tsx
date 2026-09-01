'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { unlinkAccount } from '@/actions/users';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { GithubIcon, GoogleIcon } from '@/components/ui/icons';
import { useServerAction } from '@/hooks/use-server-action';
import { handleSignIn } from '@/lib/auth/client-handlers';
import { type LinkedAccount } from '@/lib/schemas';

const PROVIDERS = [
  { id: 'google', name: 'Google', Icon: GoogleIcon },
  { id: 'github', name: 'GitHub', Icon: GithubIcon },
];

interface LinkedAccountsProps {
  accounts: LinkedAccount[];
  hasPassword: boolean;
}

export function LinkedAccounts({ accounts, hasPassword }: LinkedAccountsProps) {
  const { execute, loading } = useServerAction(unlinkAccount);
  const [linking, setLinking] = useState<string | null>(null);
  const [accountToUnlink, setAccountToUnlink] = useState<LinkedAccount | null>(null);

  const canUnlink = hasPassword || accounts.length > 1;

  const onLink = async (provider: string) => {
    setLinking(provider);
    await handleSignIn(provider);
    setLinking(null);
  };

  const onConfirmUnlink = async () => {
    if (!accountToUnlink) return;
    await execute(accountToUnlink.provider, accountToUnlink.providerAccountId);
    setAccountToUnlink(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Linked Accounts</CardTitle>
        <CardDescription>
          Connect providers that use the same email address to sign in with them.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {PROVIDERS.map(({ id, name, Icon }) => {
          const linked = accounts.find(account => account.provider === id);
          return (
            <div key={id} className="flex items-center justify-between rounded-md border p-3">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">{name}</p>
                  <p className="text-xs text-muted-foreground">
                    {linked
                      ? `Linked on ${new Date(linked.createdAt).toLocaleDateString()}`
                      : 'Not linked'}
                  </p>
                </div>
              </div>
              {linked ? (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loading || !canUnlink}
                  title={
                    canUnlink
                      ? undefined
                      : 'Set a password before unlinking your only sign-in method'
                  }
                  onClick={() => setAccountToUnlink(linked)}
                >
                  Unlink
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={linking !== null}
                  onClick={() => onLink(id)}
                >
                  {linking === id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Link
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
      <Dialog
        open={accountToUnlink !== null}
        onOpenChange={open => !open && setAccountToUnlink(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlink account</DialogTitle>
            <DialogDescription>
              You will no longer be able to sign in with this provider. You can link it again at
              any time.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAccountToUnlink(null)}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={loading} onClick={onConfirmUnlink}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Unlink
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
