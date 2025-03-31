import { getProblemSet } from "@/actions/problems";
import ProblemSet from "@/components/problems/problemset";

export default async function ProblemsPage() {
  const problems = await getProblemSet();
  return (
    <main className="container h-full mx-auto py-10 px-4">
      <ProblemSet problems={problems} />
    </main>
  )
}

