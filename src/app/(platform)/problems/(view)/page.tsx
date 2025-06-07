import { getProblemsCount, getProblemSet } from '@/actions/problems';
import {
  ProblemsInputSearch,
  ProblemsPagination,
  SortableTableHeader,
} from '@/components/problems/problemset/interactive';
import ProblemSetItem from '@/components/problems/problemset/item';
import { EmptyTableRow } from '@/components/ui/my-table';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableHeader } from '@/components/ui/table';
import { optionsSchema, type ProblemSetOptions } from '@/lib/schemas/problem-set';

export default async function ProblemsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const options = optionsSchema.parse(await searchParams);

  const problemsCount = await getProblemsCount(options.search, options.difficulty);
  const maxPages = Math.ceil(problemsCount / options.take);

  return (
    <main className="container flex-1 mx-auto py-6 px-4 scroll-smooth">
      <h1 className="mb-4">Problem Set</h1>
      <div className="space-y-4">
        <div>
          <ProblemsInputSearch />
        </div>

        <Separator />

        <div className="text-sm text-muted-foreground">{problemsCount} problems found</div>
        <Table>
          <TableHeader>
            <SortableTableHeader currentKey={options.sortKey} currentDir={options.direction} />
          </TableHeader>
          <TableBody>
            <ProblemItems options={options} />
          </TableBody>
        </Table>
        <ProblemsPagination page={options.page} maxPages={maxPages} />
      </div>
    </main>
  );
}

async function ProblemItems({ options }: { options: ProblemSetOptions }) {
  const problems = await getProblemSet(options);

  return problems.length > 0 ? (
    problems.map(problem => <ProblemSetItem key={problem.id} problem={problem} />)
  ) : (
    <EmptyTableRow colSpan={3} text="No problems found." />
  );
}
