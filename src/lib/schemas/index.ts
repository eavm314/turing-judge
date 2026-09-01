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

export type UserResourceCounts = {
  projects: number;
  problems: number;
  submissions: number;
};

export type AdminUserItem = Pick<User, 'id' | 'name' | 'email' | 'image' | 'role' | 'createdAt'> & {
  hasPassword: boolean;
  counts: UserResourceCounts;
};

export type AdminUserResources = Pick<
  User,
  'id' | 'name' | 'email' | 'image' | 'role' | 'createdAt'
> & {
  projects: Pick<Project, 'id' | 'title' | 'type' | 'isPublic' | 'updatedAt'>[];
  problems: Pick<Problem, 'id' | 'title' | 'difficulty' | 'isPublic' | 'updatedAt'>[];
  submissions: (Pick<Submission, 'id' | 'verdict' | 'status' | 'createdAt'> & {
    problemTitle: string;
  })[];
  totals: UserResourceCounts;
};
