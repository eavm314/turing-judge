import { type Problem, type Project } from '@prisma/client'

export type AutomatonProjectItem = Omit<Project, 'automaton' | 'userId'>

export type ProblemSetItem = Pick<Problem, 'id' | 'title' | 'difficulty' | 'createdAt' | 'updatedAt'>