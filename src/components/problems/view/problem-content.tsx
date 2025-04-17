import { type ProblemView } from "@/dtos"
import ReactMarkdown from "react-markdown"
import { Constraints } from "./constraints"
import { SubmitSolution } from "./submit-solution"
import { ProblemDifficulty } from "@prisma/client"
import { cn } from "@/lib/ui/utils"

const getFormatedDifficulty = (difficulty: ProblemDifficulty) => {
  const colorMap = {
    [ProblemDifficulty.UNKNOWN]: "bg-gray-100 text-gray-800",
    [ProblemDifficulty.EASY]: "bg-green-100 text-green-800",
    [ProblemDifficulty.MEDIUM]: "bg-yellow-100 text-yellow-800",
    [ProblemDifficulty.HARD]: "bg-red-100 text-red-800",
    [ProblemDifficulty.EXPERT]: "bg-purple-100 text-purple-800",
  };
  const text = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
  return { color: colorMap[difficulty], text };
}

export default function ProblemContent({ problem }: { problem: ProblemView }) {
  const { color, text } = getFormatedDifficulty(problem.difficulty);
  return (
    <div className="flex gap-4 flex-col md:flex-row">
      <div className="flex-1">
        <div className="flex gap-2 justify-between items-center">
          <div className={cn("px-2 py-1 rounded text-sm", color)}>{text}</div>
        </div>
        <div className="prose prose-headings:my-4 prose-headings:p-0 max-w-none dark:prose-invert">
          <ReactMarkdown>{problem.statement || ""}</ReactMarkdown>
        </div>
      </div>

      <div className="space-y-8">
        <Constraints constraints={problem.constraints} />
        <SubmitSolution />
      </div>
    </div>
  )
}

