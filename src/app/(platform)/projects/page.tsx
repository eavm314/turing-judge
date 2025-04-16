import { getUserProjects } from "@/actions/projects";
import AutomataLibrary from "@/components/projects/automaton-projects";

export default async function ProjectsPage() {
  const savedAutomata = await getUserProjects();
  return (
    <main className="container flex-1 mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">My Projects</h1>
      <AutomataLibrary projectItems={savedAutomata} />
    </main>
  )
}

