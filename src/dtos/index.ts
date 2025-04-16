import {
  type Problem,
  type Project,
  type Submission,
} from '@prisma/client'

export type AutomatonProjectItem = Omit<Project, 'automaton' | 'userId'>

export type ProblemSetItem = Pick<Problem, 'id' | 'title' | 'difficulty' | 'createdAt' | 'updatedAt'>

export type ProblemConstraints = Pick<Problem, 'allowFSM' | 'allowPDA' | 'allowTM' | 'allowNonDet' | 'stateLimit' | 'stepLimit' | 'timeLimit'>

export type ProblemView = Pick<Problem, 'id' | 'title' | 'difficulty' | 'statement'> & { constraints: ProblemConstraints }

export type SubmissionItem = Pick<Submission, 'status' | 'verdict' | 'message' | 'createdAt'>