"use client"

import dynamic from "next/dynamic";

import { type UserAutomaton } from "@prisma/client";
import { Loader } from "lucide-react";

import { EditorLayout } from "@/components/editor/Layout";
import SideMenu from "@/components/editor/SideMenu";
import { FiniteStateMachine, type JsonFSM } from "@/lib/automaton/FiniteStateMachine";
import { EditorStoreProvider } from "@/providers/editor-provider";

const LoadingCanvas = () => (
  <div className="flex-1 h-full flex items-center justify-center">
    <Loader className="animate-spin" size={60} />
  </div>
);

const Canvas = dynamic(() => import("@/components/editor/Canvas"), {
  ssr: false,
  loading: LoadingCanvas,
});

export default function EditorContent({ data }: { data?: UserAutomaton }) {
  return (
    <EditorStoreProvider initState={{ automaton: new FiniteStateMachine(data?.automaton as unknown as JsonFSM | undefined) }}>
      <div className="flex flex-col h-screen">
        <EditorLayout data={data} />
        <main className="flex h-full">
          <Canvas />
          <SideMenu />
        </main>
      </div>
    </EditorStoreProvider>
  )
}