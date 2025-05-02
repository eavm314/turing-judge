"use client";

import Link from "next/link";

import { TableCell, TableRow } from "@/components/ui/table";

import { Trash2 } from "lucide-react";
import { type ProblemEditorItem as ProblemItem } from "@/lib/schemas";
import { formatDateTime } from "@/utils/date";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface ProblemItemProps {
  problem: ProblemItem;
  onDelete: (id: string) => void;
  onPublic: (id: string, value: boolean) => void;
}

export default function ProblemEditorItem({
  problem,
  onPublic,
  onDelete,
}: ProblemItemProps) {
  return (
    <TableRow className="hover:bg-muted/40">
      <TableCell className="w-2/5">
        <Link
          href={`/problems/editor/${problem.id}`}
          className="font-medium hover:underline decoration-neutral-foreground"
        >
          <span className="text-nowrap md:text-base text-neutral-foreground">{problem.title}</span>
        </Link>
      </TableCell>
      <TableCell>
        <Switch
          checked={problem.isPublic}
          onCheckedChange={(value) => onPublic(problem.id, value)}
        />
      </TableCell>
      <TableCell>{formatDateTime(problem.updatedAt)}</TableCell>
      <TableCell>{formatDateTime(problem.createdAt)}</TableCell>
      <TableCell className="flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-destructive hover:bg-destructive hover:text-destructive-foreground"
          onClick={() => onDelete(problem.id)}
        >
          <Trash2 className="size-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </TableCell>
    </TableRow>
  );
}
