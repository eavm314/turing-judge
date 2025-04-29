"use client"

import { useEffect, useState } from "react";

import { Check, ChevronsUpDown, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { type CustomContentProps, useModal } from "@/providers/modal-provider";
import { type AutomatonProjectItem } from "@/dtos";
import { cn } from "@/lib/ui/utils";
import { validateCode } from "@/lib/schemas/automaton-code";

interface SolutionData {
  selectedProject: string | null;
  automatonCode: string | null;
}

const initialCode = '{\n  "states": [],\n  "alphabet": [],\n  "transitions": {},\n  "initialState": "",\n  "acceptStates": []\n}';

const SolutionForm = ({
  value,
  setValue,
  errors,
  setErrors,
}: CustomContentProps<SolutionData>) => {
  const [openCombo, setOpenCombo] = useState(false)
  const [selectedId, setSelectedId] = useState("")
  const [code, setCode] = useState(initialCode)
  const [projects, setProjects] = useState<AutomatonProjectItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const fetchAutomatons = async () => {
      const response = await fetch(`/api/queries/projects`);
      const data = await response.json();
      setProjects(data);
    }

    fetchAutomatons();
  }, []);

  useEffect(() => {
    if (selectedId !== "") {
      setValue({ selectedProject: selectedId, automatonCode: null });
      setErrors({ code: undefined });
    } else {
      const error = validateCode(code);
      setValue({ selectedProject: null, automatonCode: code });
      setErrors({ code: error });
    }
  }, [selectedId, code]);

  if (value === null) return null;

  const filteredProjects = projects
    .filter((project) => !searchQuery || project.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  const selectedProject = projects.find((project) => project.id === selectedId);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Automaton</label>
        <Popover open={openCombo} onOpenChange={setOpenCombo}>
          <div className="flex gap-4">
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full justify-between">
                {selectedProject ? (
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">
                      {selectedProject.type}
                    </Badge>
                    <span className={!selectedProject.title ? 'italic opacity-60' : undefined}>{selectedProject.title || 'Untitled'}</span>
                  </div>
                ) : "Select automaton..."}
                <ChevronsUpDown className="ml-2 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <Button variant="outline" size="icon" onClick={() => setSelectedId("")}><X className="text-destructive" /></Button>
          </div>
          <PopoverContent className="w-full p-0">
            <Command filter={() => 1}>
              <CommandInput placeholder="Search automaton..." value={searchQuery} onValueChange={setSearchQuery} />
              <CommandList>
                <CommandEmpty>No automaton found.</CommandEmpty>
                <CommandGroup>
                  {filteredProjects.map((automaton) => (
                    <CommandItem
                      key={automaton.id}
                      value={automaton.id}
                      onSelect={(currentValue) => {
                        setSelectedId(currentValue === selectedId ? "" : currentValue);
                        setOpenCombo(false);
                      }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2">
                          {automaton.type}
                        </Badge>
                        <span className={!automaton.title ? 'italic opacity-60' : undefined}>{automaton.title || 'Untitled'}</span>
                      </div>
                      <Check className={cn("ml-auto h-4 w-4", selectedId === automaton.id ? "opacity-100" : "opacity-0")} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Solution Code (JSON)</label>
        <div className="border rounded-md">
          <CodeEditor initialValue={initialCode} onChange={setCode} mode={selectedId ? 'disabled' : 'editable'} />
        </div>
        {errors.code && <p className="text-xs text-destructive">{errors.code}</p>}
      </div>
    </div>
  );
}

export const useSolutionForm = () => {
  const { showCustomModal } = useModal()

  const sumbitSolution = () => showCustomModal<SolutionData>({
    className: "max-w-[540px]",
    title: "Submit Solution",
    message: "Select an automaton from your projects or provide a new one.",
    customContent: SolutionForm,
  });

  return sumbitSolution;
}