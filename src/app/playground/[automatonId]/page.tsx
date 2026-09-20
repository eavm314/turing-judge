import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getAutomatonById, getProjectTitle } from '@/actions/projects';
import Playground from '@/components/playground';
import { QueryError } from '@/components/ui/query-error';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ automatonId: string }>;
}): Promise<Metadata> {
  const result = await getProjectTitle((await params).automatonId);
  if (!result.success) return { title: 'Playground' };

  return { title: `${result.data ?? 'Untitled Automaton'} | Playground` };
}

export default async function PlaygroundPageById({
  params,
}: {
  params: Promise<{ automatonId: string }>;
}) {
  const result = await getAutomatonById((await params).automatonId);
  if (!result.success) {
    if (result.code === 'NOT_FOUND') notFound();
    return <QueryError message={result.message} />;
  }

  return <Playground data={result.data} />;
}
