import { Suspense } from 'react';

import { redirect } from 'next/navigation';

import { getMyProfile } from '@/actions/users';
import { LinkedAccounts } from '@/components/profile/linked-accounts';
import { PasswordSection } from '@/components/profile/password-section';
import { ProfileForm } from '@/components/profile/profile-form';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QueryError } from '@/components/ui/query-error';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  return (
    <main className="container flex-1 mx-auto max-w-3xl py-10 px-4">
      <h1 className="mb-4">My Profile</h1>
      <Suspense fallback={<ProfileSkeleton />}>
        <MyProfile />
      </Suspense>
    </main>
  );
}

async function MyProfile() {
  const result = await getMyProfile();
  if (!result.success) {
    if (result.code === 'UNAUTHENTICATED' || result.code === 'NOT_FOUND') redirect('/');
    return <QueryError message={result.message} />;
  }
  const profile = result.data;

  return (
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
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }, (_, index) => (
        <Card key={index}>
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
