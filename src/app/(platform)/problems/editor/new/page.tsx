import { ProblemForm } from "@/components/problems/editor/problem-form"

export default function CreateProblemPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold">Create New Problem</h1>
        <ProblemForm />
      </div>
    </div>
  )
}

