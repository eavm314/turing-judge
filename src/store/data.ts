import { JsonFSM } from "@/lib/automaton/FiniteStateMachine";
import { AutomatonLibraryItem } from "@/lib/automaton/types";

export const examples: Record<string, JsonFSM> = {
  "dfa": {
    alphabet: ["0", "1"],
    states: [
      { name: "q0", position: { x: -300, y: 0 }, transitions: { "0": ["q2"], "1": ["q0"] } },
      { name: "q1", position: { x: 300, y: 0 }, transitions: { "0": ["q1"], "1": ["q1"] } },
      { name: "q2", position: { x: 0, y: 0 }, transitions: { "0": ["q2"], "1": ["q1"] } },
    ],
    initial: "q0",
    finals: ["q1"]
  },
  "nfa": {
    alphabet: ["0", "1"],
    states: [
      { name: "q0", position: { x: -300, y: 0 }, transitions: { "0": ["q0", "q1"], "1": ["q0"] } },
      { name: "q1", position: { x: 0, y: 0 }, transitions: { "1": ["q2"] } },
      { name: "q2", position: { x: 300, y: 0 }, transitions: {} },
    ],
    initial: "q0",
    finals: ["q2"]
  }
}

// Helper function to generate random dates within the last year
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Generate dates for the automata
const now = new Date()
const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())

export const automataData: AutomatonLibraryItem[] = [
  {
    id: "dfa-even-binary",
    title: "Even Binary Numbers",
    type: "FSM",
    isPublic: true,
    createdAt: randomDate(oneYearAgo, new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())),
    updatedAt: randomDate(new Date(now.getFullYear(), now.getMonth() - 2, now.getDate()), now),
  },
  {
    id: "nfa-ends-with-01",
    title: "Ends with 01",
    type: "FSM",
    isPublic: true,
    createdAt: randomDate(oneYearAgo, new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())),
    updatedAt: randomDate(new Date(now.getFullYear(), now.getMonth() - 2, now.getDate()), now),
  },
  {
    id: "pda-palindrome",
    title: "Palindrome",
    type: "PDA",
    isPublic: false,
    createdAt: randomDate(oneYearAgo, new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())),
    updatedAt: randomDate(new Date(now.getFullYear(), now.getMonth() - 2, now.getDate()), now),
  },
  {
    id: "tm-addition",
    title: "Addition",
    type: "TM",
    isPublic: true,
    createdAt: randomDate(oneYearAgo, new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())),
    updatedAt: randomDate(new Date(now.getFullYear(), now.getMonth() - 2, now.getDate()), now),
  },
  {
    id: "tm-subtraction",
    title: "Subtraction",
    type: "TM",
    isPublic: false,
    createdAt: randomDate(oneYearAgo, new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())),
    updatedAt: randomDate(new Date(now.getFullYear(), now.getMonth() - 2, now.getDate()), now),
  },
]