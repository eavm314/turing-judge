"use client"

import Link from "next/link";
import { useState } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { handleSignIn, handleSignOut } from "@/lib/auth/client-handlers";
import { useSession } from "@/providers/user-provider";

export function AccountMenu({ variant }: { variant?: ButtonProps["variant"] }) {
  const [open, setOpen] = useState(false);
  const user = useSession();

  if (!user) return <Button variant={variant} onClick={handleSignIn}>Sign In</Button>;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">User</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/projects" className="cursor-pointer w-full">
            My Projects
          </Link>
        </DropdownMenuItem>
        {user.role === 'EDITOR' &&
          <DropdownMenuItem>
            <Link href="/problems/editor" className="cursor-pointer w-full">
              Problems Editor
            </Link>
          </DropdownMenuItem>
        }
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <button className="w-full text-left" onClick={handleSignOut}>Log Out</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}