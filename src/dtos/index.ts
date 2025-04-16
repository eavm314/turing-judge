import {
  type Problem,
  type Project,
  type Submission,
} from '@prisma/client'

export type AutomatonProjectItem = Omit<Project, 'automaton' | 'userId'>

export type ProblemSetItem = Pick<Problem, 'id' | 'title' | 'difficulty' | 'createdAt' | 'updatedAt'>

export type ProblemView = Omit<Problem, 'testCases' | 'authorId' | 'isPublic' | 'solutionAutomaton' | 'publicSolution' | 'createdAt' | 'updatedAt'>

export type SubmissionItem = Pick<Submission, 'status' | 'verdict' | 'message' | 'createdAt'>