"use client"

import { useState } from "react"

import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import ProjectItem from "@/components/projects/project-item"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type AutomatonProjectItem } from "@/actions/types"
import { deleteAutomaton } from "@/actions/projects"
import { useModal } from "@/providers/modal-provider"

export type SortField = "title" | "type" | "createdAt" | "updatedAt";
export type SortDirection = "asc" | "desc";

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
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase());

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
      if (!a.title || !b.title) return 0;
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
    <div className="space-y-4">
      <div className="bg-card rounded-lg p-4 shadow-sm">
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

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">{sortedItems.length} automata found</div>
        </div>

        {sortedItems.length > 0 ? (
          <div className="border rounded-md">
            {/* Table Header */}
            <div className="grid grid-cols-12 border-b bg-muted/50 font-medium text-sm">
              <Button
                variant="ghost"
                className="col-span-5 justify-start p-3 h-auto font-medium"
                onClick={() => handleSort("title")}
              >
                Title {getSortIcon("title")}
              </Button>
              <Button
                variant="ghost"
                className="col-span-2 justify-start p-3 h-auto font-medium"
                onClick={() => handleSort("type")}
              >
                Type {getSortIcon("type")}
              </Button>
              <Button
                variant="ghost"
                className="col-span-2 justify-start p-3 h-auto font-medium"
                onClick={() => handleSort("createdAt")}
              >
                Created {getSortIcon("createdAt")}
              </Button>
              <Button
                variant="ghost"
                className="col-span-2 justify-start p-3 h-auto font-medium"
                onClick={() => handleSort("updatedAt")}
              >
                Modified {getSortIcon("updatedAt")}
              </Button>
              <div className="col-span-1"></div> {/* Space for actions */}
            </div>

            {/* Table Body */}
            <div className="divide-y">
              {sortedItems.map((item) => (
                <ProjectItem key={item.id} item={item} onDelete={handleDeleteAutomaton} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">No automata saved yet</p>
          </div>
        )}
      </div>
    </div>
  )
}