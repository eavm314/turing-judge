import { type Account, type Problem, type Project, type Submission, type User } from '@prisma/browser';

export type AutomatonProjectItem = Omit<Project, 'automaton' | 'userId'>;

export type ProblemSetItem = Pick<Problem, 'id' | 'title' | 'difficulty' | 'updatedAt'>;

export type ProblemEditorItem = Pick<
  Problem,
  'id' | 'title' | 'isPublic' | 'updatedAt' | 'createdAt'
>;

export type ProblemConstraints = Pick<
  Problem,
  'allowFSM' | 'allowPDA' | 'allowTM' | 'allowNonDet' | 'stateLimit' | 'depthLimit' | 'maxStepLimit'
>;

export type ProblemView = Pick<Problem, 'id' | 'title' | 'difficulty' | 'statement'> & {
  constraints: ProblemConstraints;
};

export type SubmissionItem = Pick<Submission, 'status' | 'verdict' | 'message'> & {
  createdAt: string;
};

export type LinkedAccount = Pick<Account, 'provider' | 'providerAccountId' | 'createdAt'>;

export type UserProfile = Pick<User, 'id' | 'name' | 'email' | 'image' | 'role'> & {
  hasPassword: boolean;
  accounts: LinkedAccount[];
};
