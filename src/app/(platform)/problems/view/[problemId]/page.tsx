import { ProblemContent, Submissions } from "@/components/problems/view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProblemPage({ params }: { params: { problemId: string } }) {
  return (
    <main className="mx-10 my-4 flex-1">
      <Tabs defaultValue="problem">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="problem">Problem Statement</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>
        <TabsContent value="problem" className="pt-4 outline-none">
          <ProblemContent markdown={"1"} />
        </TabsContent>
        <TabsContent value="submissions" className="pt-4">
          <Submissions problemId={params.problemId} />
        </TabsContent>
      </Tabs>
    </main>
  )
}