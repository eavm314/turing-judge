"use client"

import { useState } from "react"

import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react"

import { deleteAutomaton } from "@/actions/projects"
import ProjectItem from "@/components/projects/project-item"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { type AutomatonProjectItem } from "@/dtos"
import { useModal } from "@/providers/modal-provider"

const tableFields = ["title", "type", "createdAt", "updatedAt"] as const;
type SortField = typeof tableFields[number];

const tableHeaders = {
  "title": "Title",
  "type": "Type",
  "createdAt": "Created At",
  "updatedAt": "Updated At",
};

type SortDirection = "asc" | "desc";

export default function AutomatonProjects({ projectItems }: { projectItems: AutomatonProjectItem[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const { showConfirm } = useModal();

  const handleDeleteAutomaton = async (id: string) => {
    const confirmation = await showConfirm({
      title: "Delete Automaton",
      message: "Are you sure you want to delete this automaton? This action cannot be undone.",
      confirmLabel: "Delete",
    });
    if (!confirmation) return;
    await deleteAutomaton(id);
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  }

  // Filter automata
  const filteredItems = projectItems.filter((item) => {
    // Search filter
    const matchesSearch = !searchQuery || item.title?.toLowerCase().includes(searchQuery.toLowerCase());

    // Type filter
    let matchesType = true;
    if (typeFilter) {
      if (typeFilter === "FSM") {
        matchesType = item.type === "FSM";
      } else if (typeFilter === "PDA") {
        matchesType = item.type === "PDA";
      } else if (typeFilter === "TM") {
        matchesType = item.type === "TM";
      }
    }

    return matchesSearch && matchesType;
  })

  // Sort automata
  const sortedItems = [...filteredItems].sort((a, b) => {
    let comparison = 0;

    if (sortField === "title") {
      if (!a.title) return -1;
      if (!b.title) return 1;
      comparison = a.title.localeCompare(b.title);
    } else if (sortField === "type") {
      comparison = a.type.localeCompare(b.type);
    } else if (sortField === "createdAt") {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortField === "updatedAt") {
      comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    }

    return sortDirection === "asc" ? comparison : -comparison;
  })

  const types = ["FSM", "PDA", "TM"];

  // Helper to render sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-4 w-4" />
    return sortDirection === "asc" ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="bg-card rounded-lg md:px-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search automata..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={typeFilter || ""} onValueChange={(value) => setTypeFilter(value === "all" ? null : value)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/80">
              {tableFields.map((field) => (
                <TableHead key={field} className="p-0">
                  <Button
                    variant="ghost"
                    className="w-full p-2 justify-start md:text-base"
                    onClick={() => handleSort(field)}
                  >
                    {tableHeaders[field]}{getSortIcon(field)}
                  </Button>
                </TableHead>
              ))}
              <TableHead className="w-16 p-0" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.length > 0 ?
              sortedItems.map((item) => (
                <ProjectItem key={item.id} item={item} onDelete={handleDeleteAutomaton} />
              )) : (
                <TableRow className="h-14 text-center text-muted-foreground">
                  <TableCell colSpan={5}>
                    No automata saved yet
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}