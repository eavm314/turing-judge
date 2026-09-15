import { Suspense } from 'react';

import { getProblemsCount, getProblemSet } from '@/actions/problems';
import {
  FiltersBar,
  ProblemsPagination,
  SortableTableHeader,
} from '@/components/problems/problemset/interactive';
import ProblemSetItem from '@/components/problems/problemset/item';
import { EmptyTableRow, LoadingTableRow } from '@/components/ui/my-table';
import { ErrorToast } from '@/components/ui/query-error';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableHeader } from '@/components/ui/table';
import { type ServerActionResult } from '@/lib/actions/result';
import { optionsSchema, type ProblemSetOptions } from '@/lib/schemas/problem-set';

type CountResult = Promise<ServerActionResult<number>>;

export default async function ProblemsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const options = optionsSchema.parse(await searchParams);
  const problemsCount = getProblemsCount(options.search, options.difficulty);

  return (
    <main className="container flex-1 mx-auto py-6 px-4 scroll-smooth">
      <h1 className="mb-4">Problem Set</h1>
      <div className="space-y-3">
        <FiltersBar search={options.search} difficulty={options.difficulty ?? ''} />
        <Separator />
        <Suspense fallback={<Skeleton className="h-5 w-36" />}>
          <ProblemsFound count={problemsCount} />
        </Suspense>
        <Table>
          <TableHeader>
            <SortableTableHeader currentKey={options.sortKey} currentDir={options.direction} />
          </TableHeader>
          <TableBody>
            <Suspense fallback={<LoadingTableRow colSpan={3} rows={options.take} />}>
              <ProblemItems options={options} />
            </Suspense>
          </TableBody>
        </Table>
        <Suspense fallback={<Skeleton className="h-10 w-72 mx-auto" />}>
          <PaginationBar count={problemsCount} page={options.page} take={options.take} />
        </Suspense>
      </div>
    </main>
  );
}

async function ProblemsFound({ count }: { count: CountResult }) {
  const problemsCount = await count;

  return (
    <div className="text-sm text-muted-foreground">
      {problemsCount.success ? `${problemsCount.data} problems found` : problemsCount.message}
    </div>
  );
}

async function PaginationBar({
  count,
  page,
  take,
}: {
  count: CountResult;
  page: number;
  take: number;
}) {
  const problemsCount = await count;
  if (!problemsCount.success) return null;

  return <ProblemsPagination page={page} maxPages={Math.ceil(problemsCount.data / take)} />;
}

async function ProblemItems({ options }: { options: ProblemSetOptions }) {
  const problems = await getProblemSet(options);

  if (!problems.success) {
    return (
      <>
        <EmptyTableRow colSpan={3} text={problems.message} />
        <ErrorToast message={problems.message} />
      </>
    );
  }

  return problems.data.length > 0 ? (
    problems.data.map(problem => <ProblemSetItem key={problem.id} problem={problem} />)
  ) : (
    <EmptyTableRow colSpan={3} text="No problems found." />
  );
}
