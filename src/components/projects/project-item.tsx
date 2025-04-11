"use client"

import Link from "next/link"

import { Trash2 } from "lucide-react"

import { type AutomatonProjectItem } from "@/actions/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface AutomatonItemProps {
  item: AutomatonProjectItem
  onDelete: (id: string) => void
}
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export default function ProjectItem({ item, onDelete }: AutomatonItemProps) {
  return (
    <div className="grid grid-cols-12 gap-6 py-3 px-4 items-center hover:bg-muted/50">
      {/* Name */}
      <div className="col-span-5">
        <Link href={`/editor/${item.id}`} className="font-medium hover:underline">
          {item.title}
        </Link>
      </div>

      {/* Type */}
      <div className="col-span-2 flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          {item.type}
        </Badge>
      </div>

      {/* Created Date */}
      <div className="col-span-2 text-sm text-muted-foreground">{formatDate(item.createdAt)}</div>

      {/* Modified Date */}
      <div className="col-span-2 text-sm text-muted-foreground">{formatDate(item.updatedAt)}</div>

      {/* Actions */}
      <div className="col-span-1 flex justify-end">
        <Button variant="ghost" size="icon" 
          className="size-8 text-destructive hover:text-destructive"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="size-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </div>
  )
}

