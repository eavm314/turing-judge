import { getAutomatonById } from "@/actions/library";
import EditorContent from "../editor-content";

export default async function EditorPageById({ params }: { params: { automatonId: string } }) {
  const { title, automatonJson } = await getAutomatonById(params.automatonId);
  return <EditorContent title={title} automaton={automatonJson} />;
}