import { ProblemForm } from "@/components/problems/editor/problem-form";

export default function CreateProblemPage() {
  return (
    <main className="container py-4 flex-1">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4">Create New Problem</h1>
        <ProblemForm />
      </div>
    </main>
  );
}
