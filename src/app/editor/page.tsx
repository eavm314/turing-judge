import { EditorStoreProvider } from "@/providers/editor-provider";
import EditorContent from "./editor-content";
import EditorLayout from "./editor-layout";

export default function EditorPage() {
  return (
    <EditorStoreProvider>
      <div className="flex flex-col h-screen">
        <EditorLayout />
        <EditorContent />
      </div>
    </EditorStoreProvider>
  )
}