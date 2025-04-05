import { getAutomatonById } from "@/actions/projects";
import EditorContent from "../editor-content";

export default async function EditorPageById({ params }: { params: Promise<{ automatonId: string }> }) {
  const data = await getAutomatonById((await params).automatonId);
  return <EditorContent data={data} />;
}