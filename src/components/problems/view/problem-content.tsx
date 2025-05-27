import { MarkdownWrapper } from '@/components/ui/markdown-wrapper';
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

      <div className="space-y-8">
        <Constraints constraints={problem.constraints} />
        <SubmitSolution />
      </div>
    </div>
  );
}
