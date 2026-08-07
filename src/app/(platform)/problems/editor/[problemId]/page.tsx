import { getProblemEditable } from '@/actions/problems';
import { ProblemForm } from '@/components/problems/editor/problem-form';

export default async function EditProblemPage({
  params,
}: {
  params: Promise<{ problemId: string }>;
}) {
  const { problemId } = await params;
  const problemData = await getProblemEditable(problemId);
  return (
    <main className="container mx-auto p-4 flex-1">
      <h1 className="mb-4">Edit Problem</h1>
      <ProblemForm problemId={problemId} problemData={problemData} />
    </main>
  );
}
