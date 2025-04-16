"use client"

import { PlusCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CodeEditor } from "@/components/ui/code-editor"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/ui/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"
import { useParams } from "next/navigation";

// Mock data for automatons
const automatons = [
  { id: "1", name: "Finite State Machine", type: "FSM" },
  { id: "2", name: "Pushdown Automaton", type: "PDA" },
  { id: "3", name: "Turing Machine", type: "TM" },
  { id: "4", name: "Deterministic Finite Automaton", type: "DFA" },
  { id: "5", name: "Non-deterministic Finite Automaton", type: "NFA" },
]

export function SubmitSolution() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [code, setCode] = useState(
    '{\n  "states": [],\n  "alphabet": [],\n  "transitions": {},\n  "initialState": "",\n  "acceptStates": []\n}',
  )
  const [submitting, setSubmitting] = useState(false)

  const { problemId } = useParams();

  const selectedAutomaton = automatons.find((automaton) => automaton.id === value)

  const handleSubmit = async () => {
    setSubmitting(true)

    try {
      // Validate JSON
      const parsedCode = JSON.parse(code)

      // In a real application, you would send this data to your backend
      console.log("Submitting solution for problem:", problemId)
      console.log("Selected automaton:", selectedAutomaton)
      console.log("Code:", parsedCode)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success message or redirect
      alert("Solution submitted successfully!")
    } catch (error) {
      alert("Invalid JSON. Please check your code.")
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button><PlusCircle /> New Solution </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Submit Solution</DialogTitle>
          <DialogDescription>
            Select an automaton from your projects or provide a new one.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2 max-w-md">
            <label className="text-sm font-medium">Select Automaton</label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                  {selectedAutomaton ? selectedAutomaton.name : "Select automaton..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search automaton..." />
                  <CommandList>
                    <CommandEmpty>No automaton found.</CommandEmpty>
                    <CommandGroup>
                      {automatons.map((automaton) => (
                        <CommandItem
                          key={automaton.id}
                          value={automaton.id}
                          onSelect={(currentValue) => {
                            setValue(currentValue === value ? "" : currentValue)
                            setOpen(false)
                          }}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            {automaton.name}
                            <Badge variant="outline" className="ml-2">
                              {automaton.type}
                            </Badge>
                          </div>
                          <Check className={cn("ml-auto h-4 w-4", value === automaton.id ? "opacity-100" : "opacity-0")} />
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
              <CodeEditor value={code} onChange={setCode} />
            </div>
          </div>

        </div>
        <DialogFooter className="flex justify-end">
          <Button onClick={handleSubmit}>
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