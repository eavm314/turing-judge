"use client"

import { PlusCircle, X } from "lucide-react";

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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

import { submitSolution } from "@/actions/submissions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AutomatonProjectItem } from "@/dtos";
import { cn } from "@/lib/ui/utils";
import { useSession } from "@/providers/user-provider";
import { Check, ChevronsUpDown } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { validateCode } from "@/lib/schemas/automaton-code";
import { useToast } from "@/hooks/use-toast";

const initialCode = '{\n  "states": [],\n  "alphabet": [],\n  "transitions": {},\n  "initialState": "",\n  "acceptStates": []\n}';

export function SubmitSolution() {
  const [openDialog, setOpenDialog] = useState(false)
  const [openCombo, setOpenCombo] = useState(false)

  const [selectedId, setSelectedId] = useState("")
  const [code, setCode] = useState(initialCode)
  const [submitting, setSubmitting] = useState(false)

  const [automatons, setAutomatons] = useState<AutomatonProjectItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { problemId } = useParams();
  const { user, setOpenSignIn } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAutomatons = async () => {
      const response = await fetch(`/api/queries/projects`);
      const data = await response.json();
      setAutomatons(data);
    }

    fetchAutomatons();
  }, []);

  const handleOpen = async (open: boolean) => {
    if (!open || user) {
      setOpenDialog(open);
    } else {
      setOpenSignIn(true);
    }
    if (!open) {
      setSelectedId("");
      setCode(initialCode);
      setSearchQuery("");
    }
  }

  const selectedAutomaton = automatons.find((automaton) => automaton.id === selectedId);
  const codeError = selectedAutomaton ? '' : validateCode(code);

  const handleSubmit = async () => {
    if (codeError) return;
    setSubmitting(true);

    if (selectedAutomaton) {
      await submitSolution(problemId as string, selectedAutomaton.id, null);
    } else {
      const parsedCode = JSON.parse(code);
      await submitSolution(problemId as string, null, parsedCode);
    }

    toast({
      title: 'Solution submitted successfully!',
      variant: 'success',
    });

    setSelectedId("");
    setCode(initialCode);
    setSearchQuery("");
    setOpenDialog(false)
    setSubmitting(false)
  }

  const filteredAutomatons = automatons.filter((auto) => !searchQuery || auto.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Dialog open={openDialog} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button><PlusCircle size={20} /> Submit Solution </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Submit Solution</DialogTitle>
          <DialogDescription>
            Select an automaton from your projects or provide a new one.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Automaton</label>
            <Popover open={openCombo} onOpenChange={setOpenCombo}>
              <div className="flex gap-4">
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={openCombo} className="w-full justify-between">
                    {selectedAutomaton ? (
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2">
                          {selectedAutomaton.type}
                        </Badge>
                        <span className={!selectedAutomaton.title ? 'italic opacity-60' : undefined}>{selectedAutomaton.title || 'Untitled'}</span>
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
                      {filteredAutomatons.map((automaton) => (
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
            {codeError && <p className="text-xs text-destructive">{codeError}</p>}
          </div>

        </div>
        <DialogFooter className="flex justify-end">
          <Button onClick={handleSubmit} disabled={submitting || !!codeError}>
            {submitting ? "Submitting..." : "Submit Solution"}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}