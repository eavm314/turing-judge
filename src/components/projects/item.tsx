"use client"

import Link from "next/link"

import { Trash2 } from "lucide-react"

import { type AutomatonProjectItem } from "@/dtos"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/ui/utils"
import { formatDateTime } from "@/utils/date"

interface AutomatonItemProps {
  item: AutomatonProjectItem
  onDelete: (id: string) => void
}

export default function ProjectItem({ item, onDelete }: AutomatonItemProps) {
  return (
    <TableRow className="py-3 px-4 hover:bg-muted/50">
      <TableCell className="w-2/5">
        <Link href={`/editor/${item.id}`} className="font-medium hover:underline">
          <span className={cn("text-nowrap md:text-base", !item.title && 'italic opacity-60')}>{item.title || 'Untitled'}</span>
        </Link>
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className="text-xs">
          {item.type}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">{formatDateTime(item.createdAt)}</TableCell>
      <TableCell className="text-sm text-muted-foreground">{formatDateTime(item.updatedAt)}</TableCell>
      <TableCell className="flex justify-end">
        <Button variant="ghost" size="icon"
          className="size-8 text-destructive hover:text-destructive"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="size-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </TableCell>
    </TableRow>
  )
}

