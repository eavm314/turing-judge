"use client"

import { SideMenu } from "@/components/editor/side-menu"
import { ReactFlowProvider } from "@xyflow/react";
import { Loader } from "lucide-react";
import dynamic from "next/dynamic";

const LoadingCanvas = () => (
  <div className="flex-1 h-[600px] flex items-center justify-center">
    <Loader className="animate-spin" size={60} />
  </div>
);

const Canvas = dynamic(() => import("@/components/editor/canvas"), {
  ssr: false,
  loading: LoadingCanvas,
});

export default function EditorPage() {
  return (
    <ReactFlowProvider>
      <main>
        <div className="flex">
          <Canvas />
          <SideMenu />
        </div>
      </main>
    </ReactFlowProvider>
  )
}