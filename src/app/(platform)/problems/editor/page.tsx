import { getUserProblems } from "@/actions/problems";
import UserProblems from "@/components/problems/editor/user-problems";

export default async function ProblemsEditorPage() {
  const problems = await getUserProblems();
  return (
    <main className="container flex-1 mx-auto py-10 px-4">
      <UserProblems problems={problems} />
    </main>
  )
}

