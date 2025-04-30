import { getProblemSet } from "@/actions/problems";
import ProblemSet from "@/components/problems/problemset";

export default async function ProblemsPage() {
  const problems = await getProblemSet();
  return (
    <main className="container flex-1 mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Problem Set</h1>
      <ProblemSet problems={problems} />
    </main>
  );
}
