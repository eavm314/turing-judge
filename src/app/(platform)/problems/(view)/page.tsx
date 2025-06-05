import { getProblemSet } from '@/actions/problems';
import {
  ProblemsInputSearch,
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

  return (
    <main className="container flex-1 mx-auto py-10 px-4">
      <h1 className="mb-4">Problem Set</h1>
      <div className="space-y-4">
        <div>
          <ProblemsInputSearch />
        </div>

        <Separator />

        <div className="space-y-2">
          {/* <div className="text-sm text-muted-foreground">{problems.length} problems found</div> */}
          <Table>
            <TableHeader>
              <SortableTableHeader currentKey={options.sortKey} currentDir={options.direction} />
            </TableHeader>
            <TableBody>
              <ProblemItems options={options} />
            </TableBody>
          </Table>
        </div>
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
