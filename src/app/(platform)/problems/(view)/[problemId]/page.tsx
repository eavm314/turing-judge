import { getProblemView } from "@/actions/problems";
import { ProblemContent, Submissions } from "@/components/problems/view";
import { SetSection } from "@/components/problems/view/set-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ProblemPage({
  params,
  searchParams,
}: {
  params: Promise<{ problemId: string }>;
  searchParams: Promise<{ section: string | undefined }>;
}) {
  const { problemId } = await params;
  const { section } = await searchParams;

  const currentTab = section === "submissions" ? "submissions" : "statement";

  const problem = await getProblemView(problemId);

  return (
    <main className="mx-10 my-4 flex-1">
      <Tabs defaultValue={currentTab}>
        <TabsList className="grid w-full grid-cols-2 text-4xl">
          <TabsTrigger value="statement">Problem Statement</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>
        <TabsContent value="statement" className="pt-4">
          <ProblemContent problem={problem} />
          <SetSection section="statement" />
        </TabsContent>
        <TabsContent value="submissions" className="pt-4">
          <Submissions problemId={problem.id} />
          <SetSection section="submissions" />
        </TabsContent>
      </Tabs>
    </main>
  );
}
