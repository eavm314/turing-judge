'use client';

import { useState } from 'react';

import { AutomatonType } from '@prisma/client';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import { deleteAutomatonAction } from '@/actions/projects';
import { EmptyTableRow, InputSearch, TableHeadButton } from '@/components/ui/my-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SortDirection } from '@/constants/table';
import { type AutomatonProjectItem } from '@/lib/schemas';
import { useModal } from '@/providers/modal-provider';
import ProjectItem from './item';
import { useToast } from '@/hooks/use-toast';
import { useServerAction } from '@/hooks/use-server-action';
import { useSession } from '@/providers/user-provider';
import { PROJECTS_LIMIT } from '@/constants/app';

type TableColumn = keyof AutomatonProjectItem;

export default function AutomatonProjects({
  projectItems,
}: {
  projectItems: AutomatonProjectItem[];
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<TableColumn>('updatedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);

  const { showConfirm } = useModal();
  const deleteAutomaton = useServerAction(deleteAutomatonAction);

  const { user } = useSession();

  const handleDeleteAutomaton = async (id: string) => {
    const confirmation = await showConfirm({
      title: 'Delete Automaton',
      message: 'Are you sure you want to delete this automaton? This action cannot be undone.',
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (!confirmation) return;
    await deleteAutomaton.execute(id);
  };

  const handleSort = (column: TableColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? SortDirection.DESC : SortDirection.ASC);
    } else {
      setSortColumn(column);
      setSortDirection(SortDirection.ASC);
    }
  };

  const filteredItems = projectItems.filter(item => {
    const matchesSearch =
      !searchQuery || item.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !typeFilter || item.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    let comparison = 0;

    if (sortColumn === 'title') {
      if (!a.title) return -1;
      if (!b.title) return 1;
      comparison = a.title.localeCompare(b.title);
    } else if (sortColumn === 'type') {
      comparison = a.type.localeCompare(b.type);
    } else if (sortColumn === 'createdAt') {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
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
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-4">
        <InputSearch value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        <Select
          value={typeFilter}
          onValueChange={value => setTypeFilter(value === 'all' ? '' : value)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.values(AutomatonType).map(type => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="text-sm text-muted-foreground">{projectItems.length} / {PROJECTS_LIMIT[user!.role]} Projects</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeadButton onClick={() => handleSort('title')}>
              Title {getSortIcon('title')}
            </TableHeadButton>
            <TableHeadButton onClick={() => handleSort('type')}>
              Type {getSortIcon('type')}
            </TableHeadButton>
            <TableHeadButton onClick={() => handleSort('createdAt')}>
              Created At {getSortIcon('createdAt')}
            </TableHeadButton>
            <TableHeadButton onClick={() => handleSort('updatedAt')}>
              Updated At {getSortIcon('updatedAt')}
            </TableHeadButton>
            <TableHead className="w-16 p-0" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.length > 0 ? (
            sortedItems.map(item => (
              <ProjectItem key={item.id} item={item} onDelete={handleDeleteAutomaton} />
            ))
          ) : (
            <EmptyTableRow colSpan={5} text="No automatons created yet." />
          )}
        </TableBody>
      </Table>
    </div>
  );
}
