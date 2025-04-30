"use client";

import Link from "next/link";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleSignOut } from "@/lib/auth/client-handlers";
import { useSession } from "@/providers/user-provider";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Library, LogIn, LogOut, PenLine } from "lucide-react";

export function AccountMenu({ variant }: { variant?: ButtonProps["variant"] }) {
  const [open, setOpen] = useState(false);
  const { user, setOpenSignIn } = useSession();

  if (!user)
    return (
      <Button variant={variant} onClick={() => setOpenSignIn(true)}>
        Sign In <LogIn size={16} />
      </Button>
    );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer hover:opacity-80 size-9">
          <AvatarImage
            src={user.image ?? undefined}
            alt={user.name ?? "User"}
            className="object-cover"
          />
          <AvatarFallback className="font-bold text-xl">
            {user.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="text-neutral-foreground">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setOpen(false)}>
          <Link
            href="/projects"
            className="flex items-center gap-2 cursor-pointer w-full"
          >
            <Library size={16} /> My Projects
          </Link>
        </DropdownMenuItem>
        {user.role === "EDITOR" && (
          <DropdownMenuItem onClick={() => setOpen(false)}>
            <Link
              href="/problems/editor"
              className="flex items-center gap-2 cursor-pointer w-full"
            >
              <PenLine size={16} /> Problems Editor
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <button
            className="flex items-center gap-2 w-full text-left"
            onClick={handleSignOut}
          >
            <LogOut size={16} /> Log Out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
