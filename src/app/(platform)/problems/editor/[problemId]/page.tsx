import { Suspense } from 'react';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getProblemEditable } from '@/actions/problems';
import { ProblemForm } from '@/components/problems/editor/problem-form';
import { ProblemFormSkeleton } from '@/components/problems/editor/skeletons';
import { QueryError } from '@/components/ui/query-error';

export const metadata: Metadata = {
  title: 'Edit Problem',
  description: 'Update the statement, constraints and test cases of a problem you author.',
};

export default async function EditProblemPage({
  params,
}: {
  params: Promise<{ problemId: string }>;
}) {
  const { problemId } = await params;

  return (
    <main className="container mx-auto p-4 flex-1">
      <h1 className="mb-4">Edit Problem</h1>
      <Suspense fallback={<ProblemFormSkeleton />}>
        <EditableProblem problemId={problemId} />
      </Suspense>
    </main>
  );
}

async function EditableProblem({ problemId }: { problemId: string }) {
  const problemData = await getProblemEditable(problemId);
  if (!problemData.success) {
    if (problemData.code === 'NOT_FOUND') notFound();
    return <QueryError message={problemData.message} />;
  }

  return <ProblemForm problemId={problemId} problemData={problemData.data} />;
}
