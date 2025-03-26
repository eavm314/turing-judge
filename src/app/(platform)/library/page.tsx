import AutomataLibrary from "@/components/library/automata-library";
import { automataData } from "@/store/data";

export default async function LibraryPage() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">Automata Library</h1>
      <AutomataLibrary automataData={automataData} />
    </main>
  )
}

