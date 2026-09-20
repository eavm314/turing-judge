'use client';

import Link from 'next/link';

import { KeyRound } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TableCell, TableRow } from '@/components/ui/table';
import { type AdminUserItem } from '@/lib/schemas';
import { RoleBadge } from '@/utils/badges';
import { formatDate } from '@/utils/date';
import { RowActions } from './row-actions';

export default function UserItem({ user }: { user: AdminUserItem }) {
  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>
        <Link href={`/admin/users/${user.id}`} className="flex items-center gap-3 group">
          <Avatar className="size-8">
            <AvatarImage
              src={user.image ?? undefined}
              alt={user.name ?? 'User'}
              className="object-cover"
            />
            <AvatarFallback className="font-bold">{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-nowrap group-hover:underline">{user.name}</span>
          {user.hasPassword && (
            <KeyRound
              size={14}
              className="text-muted-foreground shrink-0"
              aria-label="Password sign-in enabled"
            />
          )}
        </Link>
      </TableCell>
      <TableCell className="hidden md:table-cell">{user.email}</TableCell>
      <TableCell className="text-center">
        <RoleBadge role={user.role} />
      </TableCell>
      <TableCell className="hidden lg:table-cell text-center">
        {user.counts.projects} / {user.counts.problems} / {user.counts.submissions}
      </TableCell>
      <TableCell className="hidden md:table-cell whitespace-nowrap">
        {formatDate(user.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <RowActions user={user} />
      </TableCell>
    </TableRow>
  );
}
