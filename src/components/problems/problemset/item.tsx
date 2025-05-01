"use client";

import Link from "next/link";

import { TableCell, TableRow } from "@/components/ui/table";
import { type ProblemSetItem } from "@/dtos";
import { DifficultyBadge } from "@/utils/badges";
import { formatDate } from "@/utils/date";

export default function ProblemSetItem({
  problem,
}: {
  problem: ProblemSetItem;
}) {
  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="w-2/5">
        <Link
          href={`/problems/${problem.id}`}
          className="font-medium hover:underline decoration-neutral-foreground"
        >
          <span className="text-nowrap md:text-base text-neutral-foreground">{problem.title}</span>
        </Link>
      </TableCell>
      <TableCell className="text-center">
        <DifficultyBadge difficulty={problem.difficulty} />
      </TableCell>
      <TableCell className="w-72">{formatDate(problem.updatedAt)}</TableCell>
    </TableRow>
  );
}
