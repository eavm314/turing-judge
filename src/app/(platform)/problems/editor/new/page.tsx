import type { Metadata } from 'next';

import { ProblemForm } from '@/components/problems/editor/problem-form';

export const metadata: Metadata = {
  title: 'New Problem',
  description: 'Draft a new problem statement, constraints and test cases.',
};

export default function CreateProblemPage() {
  return (
    <main className="container mx-auto p-4 flex-1">
      <h1 className="mb-4">Create New Problem</h1>
      <ProblemForm />
    </main>
  );
}
