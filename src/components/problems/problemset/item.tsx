"use client"

import Link from "next/link"

import { type ProblemSetItem } from "@/dtos"
import { Badge } from "@/components/ui/badge"
import { getDifficultyBadge } from "@/utils/badges"
import { cn } from "@/lib/ui/utils"
import { formatDate } from "@/utils/date"
import { TableCell, TableRow } from "@/components/ui/table"

export default function ProblemSetItem({ problem }: { problem: ProblemSetItem }) {
  const { color, text } = getDifficultyBadge(problem.difficulty);
  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="w-2/5">
        <Link href={`/problems/${problem.id}`} className="font-medium hover:underline">
          <span className="text-nowrap md:text-base">{problem.title}</span>
        </Link>
      </TableCell>
      <TableCell>
        <Badge className={cn(color, "text-sm")}>
          {text}
        </Badge>
      </TableCell>
      <TableCell>{formatDate(problem.updatedAt)}</TableCell>
    </TableRow>
  )
}