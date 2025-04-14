import ReactMarkdown from "react-markdown"
import { Constraints } from "./constraints"
import SubmitSolution from "./submit-solution"

// Mock problem content in markdown
const mockProblemMarkdown = `
# Deterministic Finite Automaton for Binary Strings

## Problem Description

Design a deterministic finite automaton (DFA) that accepts all binary strings that meet the following criteria:

1. The string must end with "01"
2. The string must not contain "11" as a substring

## Input Format

Your automaton should process a string of 0s and 1s.

## Output

Your automaton should accept the string if it meets the criteria, and reject it otherwise.

## Examples

- "01" → Accept
- "001" → Accept
- "101" → Accept
- "0101" → Accept
- "11" → Reject
- "010" → Reject
- "0011" → Reject

## Alphabet

- The input string will only contain the characters '0' and '1'
- The input string length will be between 1 and 100 characters
`
const constraints = {
  allowFSM: true,
  allowPDA: false,
  allowTM: false,
  allowNonDet: false,
  stateLimit: 10,
  stepLimit: 1000,
  timeLimit: 5000,
}

interface ProblemContentProps {
  markdown: string
}

export default function ProblemContent({ markdown }: ProblemContentProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Markdown content */}
      <div className="col-span-2 prose prose-headings:my-4 prose-headings:p-0 max-w-none dark:prose-invert">
        <ReactMarkdown>{mockProblemMarkdown || ""}</ReactMarkdown>
      </div>

      <div className="space-y-8">
        <Constraints constraints={constraints} />
        <SubmitSolution problemId={"1"} />
      </div>
    </div>
  )
}

