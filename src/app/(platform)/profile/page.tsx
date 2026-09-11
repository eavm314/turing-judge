import { redirect } from 'next/navigation';

import { getMyProfile } from '@/actions/users';
import { LinkedAccounts } from '@/components/profile/linked-accounts';
import { PasswordSection } from '@/components/profile/password-section';
import { ProfileForm } from '@/components/profile/profile-form';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { QueryError } from '@/components/ui/query-error';
import { Label } from '@/components/ui/label';

export default async function ProfilePage() {
  const result = await getMyProfile();
  if (!result.success) {
    if (result.code === 'UNAUTHENTICATED' || result.code === 'NOT_FOUND') redirect('/');
    return (
      <main className="container flex-1 mx-auto max-w-3xl py-10 px-4">
        <h1 className="mb-4">My Profile</h1>
        <QueryError message={result.message} />
      </main>
    );
  }
  const profile = result.data;

  return (
    <main className="container flex-1 mx-auto max-w-3xl py-10 px-4">
      <h1 className="mb-4">My Profile</h1>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Update your name and profile picture.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input value={profile.email} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Role</Label>
                <div>
                  <Badge variant="secondary">{profile.role}</Badge>
                </div>
              </div>
            </div>
            <ProfileForm name={profile.name} image={profile.image} />
          </CardContent>
        </Card>
        <PasswordSection hasPassword={profile.hasPassword} />
        <LinkedAccounts accounts={profile.accounts} />
      </div>
    </main>
  );
}
