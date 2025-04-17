"use client"

import Link from "next/link"


import { type ProblemSetItem } from "@/dtos"
import { Badge } from "@/components/ui/badge"
import { getDifficultyBadge } from "@/utils/badges"
import { cn } from "@/lib/ui/utils"

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export default function ProblemSetItem({ problem }: { problem: ProblemSetItem }) {
  const { color, text } = getDifficultyBadge(problem.difficulty);
  return (
    <div className="grid grid-cols-12 gap-6 py-3 px-4 items-center hover:bg-muted/50">
      {/* Name */}
      <div className="col-span-5">
        <Link href={`/problems/${problem.id}`} className="font-medium hover:underline">
          {problem.title}
        </Link>
      </div>

      {/* Type */}
      <div className="col-span-2 flex items-center gap-2">
        <Badge variant="secondary" className={cn(color, "text-sm")}>
          {text}
        </Badge>
      </div>

      {/* Created Date */}
      <div className="col-span-2 text-sm text-muted-foreground">{formatDate(problem.createdAt)}</div>

      {/* Modified Date */}
      <div className="col-span-2 text-sm text-muted-foreground">{formatDate(problem.updatedAt)}</div>
    </div>
  )
}

