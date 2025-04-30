import { getAutomatonById } from "@/actions/projects";
import Playground from "@/components/playground";

export default async function PlaygroundPageById({
  params,
}: {
  params: Promise<{ automatonId: string }>;
}) {
  const data = await getAutomatonById((await params).automatonId);
  return <Playground data={data} />;
}
