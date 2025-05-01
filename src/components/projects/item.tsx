"use client";

import Link from "next/link";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { type AutomatonProjectItem } from "@/dtos";
import { cn } from "@/lib/ui/utils";
import { AutomatonTypeBadge } from "@/utils/badges";
import { formatDateTime } from "@/utils/date";

interface AutomatonItemProps {
  item: AutomatonProjectItem;
  onDelete: (id: string) => void;
}

export default function ProjectItem({ item, onDelete }: AutomatonItemProps) {
  return (
    <TableRow className="py-3 px-4 hover:bg-muted/50">
      <TableCell className="w-2/5">
        <Link
          href={`/playground/${item.id}`}
          className="font-medium hover:underline decoration-neutral-foreground"
        >
          <span
            className={cn(
              "text-nowrap md:text-base text-neutral-foreground",
              !item.title && "italic opacity-60",
            )}
          >
            {item.title || "Untitled"}
          </span>
        </Link>
      </TableCell>
      <TableCell>
        <AutomatonTypeBadge type={item.type} />
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatDateTime(item.createdAt)}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatDateTime(item.updatedAt)}
      </TableCell>
      <TableCell className="flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-destructive hover:bg-destructive hover:text-destructive-foreground"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="size-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </TableCell>
    </TableRow>
  );
}
