import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function ProblemCreationLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Redirect to docs home if not an editor or admin
  const userRole = session?.user?.role;
  if (!session || !userRole || !['EDITOR', 'ADMIN'].includes(userRole)) {
    redirect('/docs');
  }

  return <>{children}</>;
}
