import { getAutomatonById } from "@/actions/projects";
import PlaygroundContent from "../playground-content";

export default async function PlaygroundPageById({ params }: { params: Promise<{ automatonId: string }> }) {
  const data = await getAutomatonById((await params).automatonId);
  return <PlaygroundContent data={data} />;
}