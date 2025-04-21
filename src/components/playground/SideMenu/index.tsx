import { Separator } from "@/components/ui/separator";
import { AlphabetEditor } from "./alphabet-editor";
import { TestSuite } from "./test-suite";

export default function SideMenu() {
  return (
    <div className="w-72 border-l">
      <AlphabetEditor />
      <Separator />
      <TestSuite />
    </div>
  )
}