'use client';

import Link from 'next/link';
import { useState } from 'react';

import { FolderSearch, KeyRound, Loader2, MoreHorizontal, RefreshCw, UserCog } from 'lucide-react';

import { resetUserPasswordAction, updateUserRoleAction } from '@/actions/admin';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { useServerAction } from '@/hooks/use-server-action';
import { type AdminUserItem } from '@/lib/schemas';
import { useSession } from '@/providers/user-provider';
import { RoleBadge } from '@/utils/badges';
import { generatePassword } from '@/utils/generate-password';
import { Role } from '@prisma/browser';

export function RowActions({ user }: { user: AdminUserItem }) {
  const { user: currentUser } = useSession();
  const isSelf = currentUser?.id === user.id;

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<Role>(user.role);
  const roleAction = useServerAction(updateUserRoleAction);

  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  const [resetDone, setResetDone] = useState(false);
  const resetAction = useServerAction(resetUserPasswordAction);

  const openResetDialog = () => {
    setTempPassword(generatePassword());
    setResetDone(false);
    setResetDialogOpen(true);
  };

  const onConfirmRole = async () => {
    const result = await roleAction.execute({ userId: user.id, role: newRole });
    if (result) setRoleDialogOpen(false);
  };

  const onConfirmReset = async () => {
    const result = await resetAction.execute({ userId: user.id, temporaryPassword: tempPassword });
    if (result) setResetDone(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Link href={`/admin/users/${user.id}`}>
            <DropdownMenuItem>
              <FolderSearch size={16} /> View Resources
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem disabled={isSelf} onClick={() => setRoleDialogOpen(true)}>
            <UserCog size={16} /> Change Role
          </DropdownMenuItem>
          <DropdownMenuItem disabled={isSelf} onClick={openResetDialog}>
            <KeyRound size={16} /> Reset Password
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change role</DialogTitle>
            <DialogDescription>
              Update the role for {user.name ?? user.email}. The change applies on their next
              request.
            </DialogDescription>
          </DialogHeader>
          <Select value={newRole} onValueChange={value => setNewRole(value as Role)}>
            <SelectTrigger className="w-[160px]">
              <RoleBadge role={newRole} />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Role).map(role => (
                <SelectItem key={role} value={role}>
                  <RoleBadge role={role} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button disabled={roleAction.loading || newRole === user.role} onClick={onConfirmRole}>
              {roleAction.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset password</DialogTitle>
            <DialogDescription>
              {resetDone
                ? `Hand this temporary password to ${user.name ?? user.email}. It will not be shown again.`
                : `Set a temporary password for ${user.name ?? user.email} and hand it to them. They can change it from their profile.`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Input
              value={tempPassword}
              readOnly={resetDone}
              onChange={e => setTempPassword(e.target.value)}
              className="font-mono"
            />
            {resetDone ? (
              <CopyButton text={tempPassword} />
            ) : (
              <Button
                variant="outline"
                size="icon"
                aria-label="Generate password"
                onClick={() => setTempPassword(generatePassword())}
              >
                <RefreshCw size={16} />
              </Button>
            )}
          </div>
          <DialogFooter>
            {resetDone ? (
              <Button onClick={() => setResetDialogOpen(false)}>Done</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setResetDialogOpen(false)}>
                  Cancel
                </Button>
                <Button disabled={resetAction.loading} onClick={onConfirmReset}>
                  {resetAction.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Reset Password
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
