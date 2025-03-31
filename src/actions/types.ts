import { type Problem, type UserAutomaton } from '@prisma/client'

export type AutomatonLibraryItem = Omit<UserAutomaton, 'automaton' | 'userId'>

export type ProblemSetItem = Pick<Problem, 'id' | 'title' | 'difficulty' | 'createdAt' | 'updatedAt'>