'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

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
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { TableHead, TableRow } from '@/components/ui/table';
import { useChange } from '@/hooks/use-change';
import { cn } from '@/lib/ui/utils';
import { RoleBadge } from '@/utils/badges';
import { Role } from '@prisma/browser';

export const UsersFiltersBar = ({ search, role }: { search: string; role: string }) => {
  const pathname = usePathname();
  const { replace } = useRouter();

  const [localSearch, setLocalSearch] = useState(search);
  const [localRole, setLocalRole] = useState(role);

  useChange(search, val => setLocalSearch(val));
  useChange(role, val => setLocalRole(val));

  const updateParams = (newSearch: string, newRole: string) => {
    const params = new URLSearchParams();
    if (newSearch) params.set('search', newSearch);
    if (newRole) params.set('role', newRole);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <InputSearch
        value={localSearch}
        onChange={e => setLocalSearch(e.target.value)}
        onEnter={() => updateParams(localSearch, localRole)}
      />
      <Select
        value={localRole || 'all'}
        onValueChange={val => {
          const newRole = val === 'all' ? '' : val;
          setLocalRole(newRole);
          updateParams(localSearch, newRole);
        }}
      >
        <SelectTrigger className="w-[130px]">
          {role ? role.at(0) + role.slice(1).toLowerCase() : 'All'}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {Object.values(Role).map(roleOption => (
            <SelectItem key={roleOption} value={roleOption}>
              <RoleBadge role={roleOption} />
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

export const UsersSortableHeader = ({
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
      <TableHeadButton onClick={() => handleSort('name')}>
        Name {getSortIcon('name')}
      </TableHeadButton>
      <TableHeadButton className="hidden md:table-cell" onClick={() => handleSort('email')}>
        Email {getSortIcon('email')}
      </TableHeadButton>
      <TableHeadButton className="text-center" onClick={() => handleSort('role')}>
        Role {getSortIcon('role')}
      </TableHeadButton>
      <TableHead className="hidden lg:table-cell text-center text-nowrap">
        Projects / Problems / Submissions
      </TableHead>
      <TableHeadButton className="hidden md:table-cell" onClick={() => handleSort('createdAt')}>
        Joined {getSortIcon('createdAt')}
      </TableHeadButton>
      <TableHead />
    </TableRow>
  );
};

export const UsersPagination = ({ page, maxPages }: { page: number; maxPages: number }) => {
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
