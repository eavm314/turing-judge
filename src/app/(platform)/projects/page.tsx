import { Suspense } from 'react';

import { redirect } from 'next/navigation';

import { getUserProjects } from '@/actions/projects';
import AutomataLibrary from '@/components/projects';
import { ProjectsSkeleton } from '@/components/projects/skeleton';
import { QueryError } from '@/components/ui/query-error';

export default function ProjectsPage() {
  return (
    <main className="container flex-1 mx-auto py-10 px-4">
      <h1 className="mb-4">My Projects</h1>
      <Suspense fallback={<ProjectsSkeleton />}>
        <UserProjects />
      </Suspense>
    </main>
  );
}

async function UserProjects() {
  const savedAutomata = await getUserProjects();
  if (!savedAutomata.success) {
    if (savedAutomata.code === 'UNAUTHENTICATED') redirect('/signin');
    return <QueryError message={savedAutomata.message} />;
  }

  return <AutomataLibrary projectItems={savedAutomata.data} />;
}
