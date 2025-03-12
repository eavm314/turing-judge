import { JsonFSM } from "@/lib/automaton/FiniteStateMachine";

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