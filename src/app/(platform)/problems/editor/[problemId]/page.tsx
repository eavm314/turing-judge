import { notFound } from 'next/navigation';

import { getProblemEditable } from '@/actions/problems';
import { ProblemForm } from '@/components/problems/editor/problem-form';
import { QueryError } from '@/components/ui/query-error';

export default async function EditProblemPage({
  params,
}: {
  params: Promise<{ problemId: string }>;
}) {
  const { problemId } = await params;
  const problemData = await getProblemEditable(problemId);
  if (!problemData.success && problemData.code === 'NOT_FOUND') {
    notFound();
  }

  return (
    <main className="container mx-auto p-4 flex-1">
      <h1 className="mb-4">Edit Problem</h1>
      {problemData.success ? (
        <ProblemForm problemId={problemId} problemData={problemData.data} />
      ) : (
        <QueryError message={problemData.message} />
      )}
    </main>
  );
}
