'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

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
import { TableRow } from '@/components/ui/table';
import { cn } from '@/lib/ui/utils';

export const ProblemsInputSearch = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (value: string) => {
    const params = new URLSearchParams();
    params.set('search', value);
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <InputSearch defaultValue={searchParams.get('search')?.toString()} onEnter={handleSearch} />
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
    // scrollTo(0, 100);
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
