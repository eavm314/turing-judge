"use client"

import Link from "next/link"

import { TableCell, TableRow } from "@/components/ui/table"
import { type ProblemEditorItem as ProblemItem } from "@/dtos"
import { formatDateTime } from "@/utils/date"

export default function ProblemEditorItem({ problem }: { problem: ProblemItem }) {
  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="w-2/5">
        <Link href={`/problems/${problem.id}`} className="font-medium hover:underline">
          <span className="text-nowrap md:text-base">{problem.title}</span>
        </Link>
      </TableCell>
      <TableCell>{String(problem.isPublic)}</TableCell>
      <TableCell>{formatDateTime(problem.updatedAt)}</TableCell>
      <TableCell>{formatDateTime(problem.createdAt)}</TableCell>
    </TableRow>
  )
}