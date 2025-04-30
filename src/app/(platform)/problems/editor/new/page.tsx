import { ProblemForm } from "@/components/problems/editor/problem-form";

export default function CreateProblemPage() {
  return (
    <main className="container py-10 flex-1">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold">Create New Problem</h1>
        <ProblemForm />
      </div>
    </main>
  );
}
