import { Canvas } from "@/components/editor/canvas"
import { SideMenu } from "@/components/editor/side-menu"

export default function EditorPage() {
  return (
    <main className="">
      <div className="flex">
        <Canvas />
        <SideMenu />
      </div>
    </main>
  )
}