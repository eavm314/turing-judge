import { redirect } from 'next/navigation';

import { getUserProjects } from '@/actions/projects';
import AutomataLibrary from '@/components/projects';
import { QueryError } from '@/components/ui/query-error';

export default async function ProjectsPage() {
  const savedAutomata = await getUserProjects();
  if (!savedAutomata.success && savedAutomata.code === 'UNAUTHENTICATED') {
    redirect('/signin');
  }

  return (
    <main className="container flex-1 mx-auto py-10 px-4">
      <h1 className="mb-4">My Projects</h1>
      {savedAutomata.success ? (
        <AutomataLibrary projectItems={savedAutomata.data} />
      ) : (
        <QueryError message={savedAutomata.message} />
      )}
    </main>
  );
}
