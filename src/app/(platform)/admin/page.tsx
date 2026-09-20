import { Suspense } from 'react';

import type { Metadata } from 'next';

import { getUsers, getUsersCount } from '@/actions/admin';
import { CreateUserDialog } from '@/components/admin/users/create-user-dialog';
import {
  UsersFiltersBar,
  UsersPagination,
  UsersSortableHeader,
} from '@/components/admin/users/interactive';
import UserItem from '@/components/admin/users/item';
import { EmptyTableRow, LoadingTableRow } from '@/components/ui/my-table';
import { ErrorToast } from '@/components/ui/query-error';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableHeader } from '@/components/ui/table';
import { type ServerActionResult } from '@/lib/actions/result';
import { adminUsersOptionsSchema, type AdminUsersOptions } from '@/lib/schemas/admin-users';

type CountResult = Promise<ServerActionResult<number>>;

export const metadata: Metadata = {
  title: 'User Management',
  description: 'Review platform users, their roles and the resources they own.',
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const options = adminUsersOptionsSchema.parse(await searchParams);
  const usersCount = getUsersCount(options.search, options.role);

  return (
    <main className="container flex-1 mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-4">
        <h1>User Management</h1>
        <CreateUserDialog />
      </div>
      <div className="space-y-3">
        <UsersFiltersBar search={options.search} role={options.role ?? ''} />
        <Separator />
        <Suspense fallback={<Skeleton className="h-5 w-36" />}>
          <UsersFound count={usersCount} />
        </Suspense>
        <Table>
          <TableHeader>
            <UsersSortableHeader currentKey={options.sortKey} currentDir={options.direction} />
          </TableHeader>
          <TableBody>
            <Suspense fallback={<LoadingTableRow colSpan={6} rows={options.take} />}>
              <UserItems options={options} />
            </Suspense>
          </TableBody>
        </Table>
        <Suspense fallback={<Skeleton className="h-10 w-72 mx-auto" />}>
          <PaginationBar count={usersCount} page={options.page} take={options.take} />
        </Suspense>
      </div>
    </main>
  );
}

async function UsersFound({ count }: { count: CountResult }) {
  const usersCount = await count;

  return (
    <div className="text-sm text-muted-foreground">
      {usersCount.success ? `${usersCount.data} users found` : usersCount.message}
    </div>
  );
}

async function PaginationBar({
  count,
  page,
  take,
}: {
  count: CountResult;
  page: number;
  take: number;
}) {
  const usersCount = await count;
  if (!usersCount.success) return null;

  return <UsersPagination page={page} maxPages={Math.ceil(usersCount.data / take)} />;
}

async function UserItems({ options }: { options: AdminUsersOptions }) {
  const users = await getUsers(options);

  if (!users.success) {
    return (
      <>
        <EmptyTableRow colSpan={6} text={users.message} />
        <ErrorToast message={users.message} />
      </>
    );
  }

  return users.data.length > 0 ? (
    users.data.map(user => <UserItem key={user.id} user={user} />)
  ) : (
    <EmptyTableRow colSpan={6} text="No users found." />
  );
}
