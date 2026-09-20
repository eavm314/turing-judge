import { Suspense } from 'react';

import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { PlusCircle } from 'lucide-react';

import { getUserProblems } from '@/actions/problems';
import UserProblems from '@/components/problems/editor/user-problems';
import { UserProblemsSkeleton } from '@/components/problems/editor/skeletons';
import { Button } from '@/components/ui/button';
import { QueryError } from '@/components/ui/query-error';

export const metadata: Metadata = {
  title: 'Problems Editor',
  description: 'Create, edit and publish the problems you author.',
};

export default function ProblemsEditorPage() {
  return (
    <main className="container flex-1 mx-auto py-10 px-4">
      <div className="flex justify-between mb-4">
        <h1>Problems Editor</h1>
        <Button asChild>
          <Link href="/problems/editor/new">
            <PlusCircle size={20} /> New Problem
          </Link>
        </Button>
      </div>
      <Suspense fallback={<UserProblemsSkeleton />}>
        <EditableProblems />
      </Suspense>
    </main>
  );
}

async function EditableProblems() {
  const problems = await getUserProblems();
  if (!problems.success) {
    if (problems.code === 'UNAUTHENTICATED') redirect('/signin');
    return <QueryError message={problems.message} />;
  }

  return <UserProblems problems={problems.data} />;
}
