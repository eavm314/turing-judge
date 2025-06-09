'use client';

import { useState } from 'react';

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { ProblemDifficulty } from '@prisma/client';

import { EmptyTableRow, InputSearch, TableHeadButton } from '@/components/ui/my-table';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableHeader, TableRow } from '@/components/ui/table';
import { SortDirection } from '@/constants/table';
import { type ProblemSetItem as ProblemItem } from '@/lib/schemas';
import ProblemSetItem from './item';

type TableColumn = keyof ProblemItem;

export default function ProblemSet({ problems }: { problems: ProblemItem[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<TableColumn>('updatedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);

  const handleSort = (field: TableColumn) => {
    if (sortColumn === field) {
      setSortDirection(sortDirection === 'asc' ? SortDirection.DESC : SortDirection.ASC);
    } else {
      setSortColumn(field);
      setSortDirection(SortDirection.ASC);
    }
  };

  const filteredProblems = problems.filter(problem => {
    const matchesSearch =
      !searchQuery || problem.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const sortedProblems = [...filteredProblems].sort((a, b) => {
    let comparison = 0;

    if (sortColumn === 'title') {
      if (!a.title || !b.title) return 0;
      comparison = a.title.localeCompare(b.title);
    } else if (sortColumn === 'difficulty') {
      const difficultyOrder = Object.values(ProblemDifficulty);
      comparison = difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty);
    } else if (sortColumn === 'updatedAt') {
      comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const getSortIcon = (column: TableColumn) => {
    if (sortColumn !== column) return <ArrowUpDown className="ml-1 h-4 w-4" />;
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-1 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4" />
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <InputSearch value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">{problems.length} problems found</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeadButton onClick={() => handleSort('title')}>
                Title {getSortIcon('title')}
              </TableHeadButton>
              <TableHeadButton className="text-center" onClick={() => handleSort('difficulty')}>
                Difficulty {getSortIcon('difficulty')}
              </TableHeadButton>
              <TableHeadButton onClick={() => handleSort('updatedAt')}>
                Published On {getSortIcon('updatedAt')}
              </TableHeadButton>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProblems.length > 0 ? (
              sortedProblems.map(problem => <ProblemSetItem key={problem.id} problem={problem} />)
            ) : (
              <EmptyTableRow colSpan={3} text="No problems available yet." />
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
