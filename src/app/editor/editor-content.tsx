"use client"

import { Loader } from "lucide-react";
import dynamic from "next/dynamic";

import SideMenu from "@/components/editor/SideMenu";

const LoadingCanvas = () => (
  <div className="flex-1 h-full flex items-center justify-center">
    <Loader className="animate-spin" size={60} />
  </div>
);

const Canvas = dynamic(() => import("@/components/editor/Canvas"), {
  ssr: false,
  loading: LoadingCanvas,
});

export default function EditorContent() {
  return (
    <main className="h-full">
      <div className="flex h-full">
        <Canvas />
        <SideMenu />
      </div>
    </main>
  )
}