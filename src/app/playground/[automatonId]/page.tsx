import { notFound } from 'next/navigation';

import { getAutomatonById } from '@/actions/projects';
import Playground from '@/components/playground';
import { QueryError } from '@/components/ui/query-error';

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
