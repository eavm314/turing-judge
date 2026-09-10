import { notFound } from 'next/navigation';

import { getUserResources } from '@/actions/admin';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyTableRow } from '@/components/ui/my-table';
import { QueryError } from '@/components/ui/query-error';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AutomatonTypeBadge, DifficultyBadge, RoleBadge, StatusBadge } from '@/utils/badges';
import { formatDate, formatDateTime } from '@/utils/date';

export default async function AdminUserPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const result = await getUserResources(userId);
  if (!result.success) {
    if (result.code === 'NOT_FOUND') notFound();
    return (
      <main className="container flex-1 mx-auto py-6 px-4">
        <QueryError message={result.message} />
      </main>
    );
  }
  const user = result.data;

  return (
    <main className="container flex-1 mx-auto py-6 px-4 space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage
                src={user.image ?? undefined}
                alt={user.name ?? 'User'}
                className="object-cover"
              />
              <AvatarFallback className="font-bold text-2xl">{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold">{user.name}</h1>
                <RoleBadge role={user.role} />
              </div>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground">Joined {formatDate(user.createdAt)}</p>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <p className="text-2xl font-semibold">{user.totals.projects}</p>
                <p className="text-xs text-muted-foreground">Projects</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">{user.totals.problems}</p>
                <p className="text-xs text-muted-foreground">Problems</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">{user.totals.submissions}</p>
                <p className="text-xs text-muted-foreground">Submissions</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="projects">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="problems">Problems</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>
        <TabsContent value="projects">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="text-center">Type</TableHead>
                <TableHead className="text-center">Visibility</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.projects.length > 0 ? (
                user.projects.map(project => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title ?? 'Untitled'}</TableCell>
                    <TableCell className="text-center">
                      <AutomatonTypeBadge type={project.type} />
                    </TableCell>
                    <TableCell className="text-center">
                      {project.isPublic ? 'Public' : 'Private'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(project.updatedAt)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <EmptyTableRow colSpan={4} text="No projects found." />
              )}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="problems">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="text-center">Difficulty</TableHead>
                <TableHead className="text-center">Visibility</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.problems.length > 0 ? (
                user.problems.map(problem => (
                  <TableRow key={problem.id}>
                    <TableCell className="font-medium">{problem.title}</TableCell>
                    <TableCell className="text-center">
                      <DifficultyBadge difficulty={problem.difficulty} />
                    </TableCell>
                    <TableCell className="text-center">
                      {problem.isPublic ? 'Public' : 'Private'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(problem.updatedAt)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <EmptyTableRow colSpan={4} text="No problems found." />
              )}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="submissions">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Problem</TableHead>
                <TableHead className="text-center">Result</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.submissions.length > 0 ? (
                user.submissions.map(submission => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.problemTitle}</TableCell>
                    <TableCell className="text-center">
                      <StatusBadge verdict={submission.verdict} status={submission.status} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDateTime(submission.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <EmptyTableRow colSpan={3} text="No submissions found." />
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </main>
  );
}
