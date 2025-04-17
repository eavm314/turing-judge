
import { type ProblemView } from "@/dtos"
import { Constraints } from "./constraints"
import { SubmitSolution } from "./submit-solution"
import { cn } from "@/lib/ui/utils"
import { MarkdownWrapper } from "@/components/ui/markdown-wrapper"
import { getDifficultyBadge } from "@/utils/badges"

export default function ProblemContent({ problem }: { problem: ProblemView }) {
  const { color, text } = getDifficultyBadge(problem.difficulty);
  return (
    <div className="flex gap-4 flex-col md:flex-row">
      <div className="flex-1">
        <div className="flex gap-2 justify-between items-center">
          <div className={cn("px-2 py-1 rounded text-sm", color)}>{text}</div>
        </div>
        <div className="prose prose-headings:my-4 prose-headings:p-0 max-w-none dark:prose-invert">
          <MarkdownWrapper content={problem.statement} />
        </div>
      </div>

      <div className="space-y-8">
        <Constraints constraints={problem.constraints} />
        <SubmitSolution />
      </div>
    </div>
  )
}

