"use client"

import Link from "next/link"

import { MoreHorizontal, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { type AutomatonLibraryItem } from "@/lib/automaton/types"

interface AutomatonItemProps {
  automaton: AutomatonLibraryItem
  onDelete: (id: string) => void
}

export default function AutomatonItem({ automaton, onDelete }: AutomatonItemProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="grid grid-cols-12 gap-6 py-3 px-4 items-center hover:bg-muted/50">
      {/* Name */}
      <div className="col-span-5">
        <Link href={`/editor/${automaton.id}`} className="font-medium hover:underline">
          {automaton.title}
        </Link>
      </div>

      {/* Type */}
      <div className="col-span-2 flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          {automaton.type}
        </Badge>
      </div>

      {/* Created Date */}
      <div className="col-span-2 text-sm text-muted-foreground">{formatDate(automaton.createdAt)}</div>

      {/* Modified Date */}
      <div className="col-span-2 text-sm text-muted-foreground">{formatDate(automaton.updatedAt)}</div>

      {/* Actions */}
      <div className="col-span-1 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={() => onDelete(automaton.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

