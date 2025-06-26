'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ArrowDown, ArrowUp, ArrowUpDown, Eraser } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { InputSearch, TableHeadButton } from '@/components/ui/my-table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TableRow } from '@/components/ui/table';
import { cn } from '@/lib/ui/utils';
import { ProblemDifficulty } from '@prisma/client';
import { DifficultyBadge } from '@/utils/badges';

export const FiltersBar = ({ search, difficulty }: { search: string; difficulty: string }) => {
  const pathname = usePathname();
  const { replace } = useRouter();

  const [localSearch, setLocalSearch] = useState(search);
  const [localDifficulty, setLocalDifficulty] = useState(difficulty);

  useEffect(() => {
    setLocalSearch(search);
    setLocalDifficulty(difficulty);
  }, [search, difficulty]);

  const updateParams = (newSearch: string, newDiff: string) => {
    const params = new URLSearchParams();
    if (newSearch) params.set('search', newSearch);
    if (newDiff) params.set('difficulty', newDiff);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <InputSearch
        value={localSearch}
        onChange={e => setLocalSearch(e.target.value)}
        onEnter={() => updateParams(localSearch, localDifficulty)}
      />
      <Select
        value={localDifficulty || 'all'}
        onValueChange={val => {
          const newDiff = val === 'all' ? '' : val;
          setLocalDifficulty(newDiff);
          updateParams(localSearch, newDiff);
        }}
      >
        <SelectTrigger className="w-[130px]">
          {difficulty ? difficulty.at(0) + difficulty.slice(1).toLowerCase() : 'All'}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {Object.values(ProblemDifficulty).map(diff => (
            <SelectItem key={diff} value={diff}>
              <DifficultyBadge difficulty={diff} />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" size="icon" onClick={() => replace(pathname)}>
        <Eraser size={16} />
      </Button>
    </div>
  );
};

export const SortableTableHeader = ({
  currentKey,
  currentDir,
}: {
  currentKey: string;
  currentDir: string;
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSort = (column: string) => {
    const newDir = currentKey === column && currentDir === 'asc' ? 'desc' : 'asc';
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortKey', column);
    params.set('direction', newDir);
    replace(`${pathname}?${params.toString()}`);
  };

  const getSortIcon = (column: string) => {
    if (currentKey !== column) return <ArrowUpDown className="ml-1 h-4 w-4" />;
    return currentDir === 'asc' ? (
      <ArrowUp className="ml-1 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4" />
    );
  };
  return (
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
  );
};

export const ProblemsPagination = ({ page, maxPages }: { page: number; maxPages: number }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const goTo = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    replace(`${pathname}?${params.toString()}`);
  };

  const pagesArray = [page - 1, page, page + 1].filter(p => p > 0 && p <= maxPages);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => goTo(page - 1)} disabled={page <= 1} />
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis className={cn(pagesArray[0] <= 1 && 'hidden')} />
        </PaginationItem>
        {pagesArray.map(p => (
          <PaginationItem key={p}>
            <PaginationLink onClick={p === page ? undefined : () => goTo(p)} isActive={p === page}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis
            className={cn(
              (pagesArray.length == 0 || pagesArray[pagesArray.length - 1] >= maxPages) && 'hidden',
            )}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext onClick={() => goTo(page + 1)} disabled={page >= maxPages} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
