'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button, type ButtonProps } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { handleSignOut } from '@/lib/auth/client-handlers';
import { useSession } from '@/providers/user-provider';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Library, LogIn, LogOut, PenLine } from 'lucide-react';

export function AccountMenu({ variant }: { variant?: ButtonProps['variant'] }) {
  const [open, setOpen] = useState(false);
  const { user, setOpenSignIn } = useSession();

  if (!user)
    return (
      <Button className="px-3" variant={variant} onClick={() => setOpenSignIn(true)}>
        Sign In <LogIn size={16} />
      </Button>
    );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer hover:opacity-80 size-9">
          <AvatarImage
            src={user.image ?? undefined}
            alt={user.name ?? 'User'}
            className="object-cover"
          />
          <AvatarFallback className="font-bold text-xl">{user.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="text-neutral-foreground">{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/projects">
          <DropdownMenuItem onClick={() => setOpen(false)}>
            <Library size={16} /> My Projects
          </DropdownMenuItem>
        </Link>
        {user.role === 'EDITOR' && (
          <Link href="/problems/editor">
            <DropdownMenuItem onClick={() => setOpen(false)}>
              <PenLine size={16} /> Problems Editor
            </DropdownMenuItem>
          </Link>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut size={16} /> Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
