import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GithubIcon, GoogleIcon } from '@/components/ui/icons';
import { type LinkedAccount } from '@/lib/schemas';
import { formatDate } from '@/utils/date';

const PROVIDERS = [
  { id: 'google', name: 'Google', Icon: GoogleIcon },
  { id: 'github', name: 'GitHub', Icon: GithubIcon },
];

export function LinkedAccounts({ accounts }: { accounts: LinkedAccount[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Linked Accounts</CardTitle>
        <CardDescription>
          A provider links automatically the first time you sign in with an account that uses this
          same email address.
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
                  {linked && (
                    <p className="text-xs text-muted-foreground">
                      Linked on {formatDate(linked.createdAt)}
                    </p>
                  )}
                </div>
              </div>
              <Badge variant={linked ? 'secondary' : 'outline'}>
                {linked ? 'Linked' : 'Not linked'}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
