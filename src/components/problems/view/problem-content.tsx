import { MarkdownWrapper } from '@/components/ui/markdown-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { type ProblemView } from '@/lib/schemas';
import { DifficultyBadge } from '@/utils/badges';
import { Constraints } from './constraints';
import { SubmitSolution } from './submit-solution';

export default function ProblemContent({ problem }: { problem: ProblemView }) {
  return (
    <div className="flex gap-4 flex-col md:flex-row">
      <div className="flex-1">
        <div className="flex gap-2 justify-between items-center">
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>
        <MarkdownWrapper content={problem.statement} />
      </div>

      <div className="flex flex-col gap-8 items-center md:ml-10 md:mr-5">
        <Constraints constraints={problem.constraints} />
        <SubmitSolution />
      </div>
    </div>
  );
}

export function ProblemContentSkeleton() {
  return (
    <div className="flex gap-4 flex-col md:flex-row">
      <div className="flex-1 space-y-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-9 w-2/3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-3/6" />
        </div>
      </div>

      <div className="flex flex-col gap-8 items-center md:ml-10 md:mr-5">
        <Skeleton className="mt-4 h-64 w-full md:w-72" />
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  );
}
