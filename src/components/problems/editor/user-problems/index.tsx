"use client"

import { useState } from "react"

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"

import { EmptyTableRow, InputSearch, TableHeadButton } from "@/components/ui/my-table"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SortDirection } from "@/constants/table"
import { type ProblemEditorItem as ProblemItem } from "@/dtos"
import ProblemEditorItem from "./item"

type TableColumn = keyof ProblemItem;

export default function UserProblems({ problems }: { problems: ProblemItem[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<TableColumn>("updatedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);

  const handleSort = (field: TableColumn) => {
    if (sortColumn === field) {
      setSortDirection(sortDirection === "asc" ? SortDirection.DESC : SortDirection.ASC);
    } else {
      setSortColumn(field);
      setSortDirection(SortDirection.ASC);
    }
  }

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = !searchQuery || problem.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  })

  const sortedProblems = [...filteredProblems].sort((a, b) => {
    let comparison = 0;

    if (sortColumn === "title") {
      comparison = a.title.localeCompare(b.title);
    } else if (sortColumn === "isPublic") {
      comparison = Number(a.isPublic) - Number(b.isPublic);
    } else if (sortColumn === "updatedAt") {
      comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    } else if (sortColumn === "createdAt") {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }

    return sortDirection === "asc" ? comparison : -comparison;
  })

  const getSortIcon = (column: TableColumn) => {
    if (sortColumn !== column) return <ArrowUpDown className="ml-1 h-4 w-4" />
    return sortDirection === "asc" ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
  }

  return (
    <div className="space-y-4">
      <div>
        <InputSearch value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">{problems.length} problems found</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeadButton onClick={() => handleSort("title")}>
                Title {getSortIcon("title")}
              </TableHeadButton>
              <TableHeadButton onClick={() => handleSort("isPublic")}>
                Public {getSortIcon("isPublic")}
              </TableHeadButton>
              <TableHeadButton onClick={() => handleSort("updatedAt")}>
                Updated At {getSortIcon("updatedAt")}
              </TableHeadButton>
              <TableHeadButton onClick={() => handleSort("createdAt")}>
                Created At {getSortIcon("createdAt")}
              </TableHeadButton>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProblems.length > 0 ?
              sortedProblems.map((problem) => (
                <ProblemEditorItem key={problem.id} problem={problem} />
              )) : (
                <EmptyTableRow colSpan={4} text="No problems created yet." />
              )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}