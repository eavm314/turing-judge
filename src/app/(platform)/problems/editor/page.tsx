import { getUserProblems } from "@/actions/problems";
import UserProblems from "@/components/problems/editor/user-problems";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function ProblemsEditorPage() {
  const problems = await getUserProblems();
  return (
    <main className="container flex-1 mx-auto py-10 px-4">
      <div className="flex justify-between mb-4">
        <h1>Problems Editor</h1>
        <Button asChild>
          <Link href="/problems/editor/new">
            <PlusCircle size={20} /> New Problem
          </Link>
        </Button>
      </div>
      <UserProblems problems={problems} />
    </main>
  );
}
