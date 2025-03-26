import { type UserAutomaton } from '@prisma/client'

export type AutomatonLibraryItem = Omit<UserAutomaton, 'automaton' | 'userId'>