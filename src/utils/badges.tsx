import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/ui/utils";
import { ProblemDifficulty, Status, Verdict } from "@prisma/client"

export const DifficultyBadge = ({ difficulty }: { difficulty: ProblemDifficulty }) => {
  let values;
  switch (difficulty) {
    case ProblemDifficulty.EASY:
      values = { color: "bg-green-200 text-green-800 hover:bg-green-200/80", text: 'Easy' };
      break;
    case ProblemDifficulty.MEDIUM:
      values = { color: "bg-yellow-200 text-yellow-800 hover:bg-yellow-200/80", text: 'Medium' };
      break;
    case ProblemDifficulty.HARD:
      values = { color: "bg-red-200 text-red-800 hover:bg-red-200/80", text: 'Hard' };
      break;
    case ProblemDifficulty.EXPERT:
      values = { color: "bg-purple-200 text-purple-800 hover:bg-purple-200/80", text: 'Expert' };
      break;
    default:
      values = { color: "bg-gray-200 text-gray-800 hover:bg-gray-200/80", text: 'Unknown' };
  }
  return <Badge className={cn(values.color, "md:text-sm")}>{values.text}</Badge>;
}

export const StatusBadge = ({ verdict, status }: { verdict: Verdict | null, status: Status }) => {
  const result = verdict || status;
  let values;
  switch (result) {
    case Verdict.ACCEPTED:
      values = { color: "bg-green-100 text-green-800 hover:bg-green-100/80", text: 'Accepted' };
      break;
    case Verdict.WRONG_RESULT:
      values = { color: "bg-red-100 text-red-800 hover:bg-red-100/80", text: 'Wrong Result' };
      break;
    case Status.PENDING:
      values = { color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80", text: 'Pending' };
      break;
    default:
      values = { color: "bg-gray-100 text-gray-800 hover:bg-gray-100/80", text: 'Unknown' };

  }
  return <Badge className={cn(values.color, "md:text-sm")}>{values.text}</Badge>;
}