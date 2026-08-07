import { ProblemForm } from '@/components/problems/editor/problem-form';

export default function CreateProblemPage() {
  return (
    <main className="container mx-auto p-4 flex-1">
      <h1 className="mb-4">Create New Problem</h1>
      <ProblemForm />
    </main>
  );
}
