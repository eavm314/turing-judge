import { getSavedAutomata } from "@/actions/library";
import AutomataLibrary from "@/components/library/automata-library";

export default async function LibraryPage() {
  const automataData = await getSavedAutomata();
  return (
    <main className="container flex-1 mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">Automata Library</h1>
      <AutomataLibrary automataData={automataData} />
    </main>
  )
}

