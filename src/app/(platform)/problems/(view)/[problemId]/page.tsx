import { Suspense } from 'react';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getProblemTitle, getProblemView } from '@/actions/problems';
import { ProblemContent, ProblemContentSkeleton, Submissions } from '@/components/problems/view';
import { SetSection } from '@/components/problems/view/set-section';
import { QueryError } from '@/components/ui/query-error';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ problemId: string }>;
}): Promise<Metadata> {
  const result = await getProblemTitle((await params).problemId);
  if (!result.success) return { title: 'Problem' };

  return {
    title: result.data,
    description: `Solve "${result.data}" by designing an automaton and submitting it to the judge.`,
  };
}

export default async function ProblemPage({
  params,
  searchParams,
}: {
  params: Promise<{ problemId: string }>;
  searchParams: Promise<{ section: string | undefined }>;
}) {
  const { problemId } = await params;
  const { section } = await searchParams;

  const currentTab = section === 'submissions' ? 'submissions' : 'statement';

  return (
    <main className="mx-4 md:mx-10 my-4 flex-1">
      <Tabs defaultValue={currentTab}>
        <TabsList className="grid w-full grid-cols-2 text-4xl">
          <TabsTrigger value="statement">Problem Statement</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>
        <TabsContent value="statement" className="pt-4">
          <Suspense fallback={<ProblemContentSkeleton />}>
            <ProblemStatement problemId={problemId} />
          </Suspense>
          <SetSection section="statement" />
        </TabsContent>
        <TabsContent value="submissions" className="pt-4">
          <Submissions problemId={problemId} />
          <SetSection section="submissions" />
        </TabsContent>
      </Tabs>
    </main>
  );
}

async function ProblemStatement({ problemId }: { problemId: string }) {
  const result = await getProblemView(problemId);
  if (!result.success) {
    if (result.code === 'NOT_FOUND') notFound();
    return <QueryError message={result.message} />;
  }

  return <ProblemContent problem={result.data} />;
}
