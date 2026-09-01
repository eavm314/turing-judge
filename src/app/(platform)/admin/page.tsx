import { getUsers, getUsersCount } from '@/actions/admin';
import { CreateUserDialog } from '@/components/admin/users/create-user-dialog';
import {
  UsersFiltersBar,
  UsersPagination,
  UsersSortableHeader,
} from '@/components/admin/users/interactive';
import UserItem from '@/components/admin/users/item';
import { EmptyTableRow } from '@/components/ui/my-table';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableHeader } from '@/components/ui/table';
import { adminUsersOptionsSchema, type AdminUsersOptions } from '@/lib/schemas/admin-users';

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const options = adminUsersOptionsSchema.parse(await searchParams);

  const usersCount = await getUsersCount(options.search, options.role);
  const maxPages = Math.ceil(usersCount / options.take);

  return (
    <main className="container flex-1 mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-4">
        <h1>User Management</h1>
        <CreateUserDialog />
      </div>
      <div className="space-y-3">
        <UsersFiltersBar search={options.search} role={options.role ?? ''} />
        <Separator />
        <div className="text-sm text-muted-foreground">{usersCount} users found</div>
        <Table>
          <TableHeader>
            <UsersSortableHeader currentKey={options.sortKey} currentDir={options.direction} />
          </TableHeader>
          <TableBody>
            <UserItems options={options} />
          </TableBody>
        </Table>
        <UsersPagination page={options.page} maxPages={maxPages} />
      </div>
    </main>
  );
}

async function UserItems({ options }: { options: AdminUsersOptions }) {
  const users = await getUsers(options);

  return users.length > 0 ? (
    users.map(user => <UserItem key={user.id} user={user} />)
  ) : (
    <EmptyTableRow colSpan={6} text="No users found." />
  );
}
