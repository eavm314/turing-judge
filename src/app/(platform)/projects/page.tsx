import { getUserProjects } from "@/actions/projects";
import AutomataLibrary from "@/components/projects";

export default async function ProjectsPage() {
  const savedAutomata = await getUserProjects();
  return (
    <main className="container flex-1 mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-2">My Projects</h1>
      <AutomataLibrary projectItems={savedAutomata} />
    </main>
  )
}

