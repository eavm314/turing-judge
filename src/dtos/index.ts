import { JsonFSM } from '@/lib/automaton/FiniteStateMachine'
import { ProblemSchema } from '@/lib/schemas/problem-form'
import {
  type AutomatonType,
  type Problem,
  type Project,
  type Submission,
} from '@prisma/client'

export type AutomatonProjectItem = Omit<Project, 'automaton' | 'userId'>

export type ProblemSetItem = Pick<Problem, 'id' | 'title' | 'difficulty' | 'updatedAt'>

export type ProblemEditorItem = Pick<Problem, 'id' | 'title' | 'isPublic' | 'updatedAt' | 'createdAt'>

export type ProblemConstraints = Pick<Problem, 'allowFSM' | 'allowPDA' | 'allowTM' | 'allowNonDet' | 'stateLimit' | 'depthLimit' | 'maxStepLimit'>

export type ProblemView = Pick<Problem, 'id' | 'title' | 'difficulty' | 'statement'> & { constraints: ProblemConstraints }

export type SubmissionItem = Pick<Submission, 'status' | 'verdict' | 'message'> & { createdAt: string }

export type AutomatonCode = {
  type: AutomatonType
  automaton: JsonFSM
}

export type ProblemUpdateSchema = ProblemSchema & { isPublic: boolean }