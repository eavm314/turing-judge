'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import { InputSearch, TableHeadButton } from '@/components/ui/my-table';

import { TableRow } from '@/components/ui/table';

export const ProblemsInputSearch = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
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
