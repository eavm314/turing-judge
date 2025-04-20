"use client"

import dynamic from "next/dynamic";

import { type Project } from "@prisma/client";
import { Loader } from "lucide-react";

import { PlaygroundLayout } from "@/components/playground/Layout";
import SideMenu from "@/components/playground/SideMenu";
import { FiniteStateMachine, type JsonFSM } from "@/lib/automaton/FiniteStateMachine";
import { PlaygroundStoreProvider } from "@/providers/playground-provider";

const LoadingCanvas = () => (
  <div className="flex-1 h-full flex items-center justify-center">
    <Loader className="animate-spin" size={60} />
  </div>
);

const Canvas = dynamic(() => import("@/components/playground/Canvas"), {
  ssr: false,
  loading: LoadingCanvas,
});

export default function PlaygroundContent({ data }: { data?: Project }) {
  return (
    <PlaygroundStoreProvider initState={{ automaton: new FiniteStateMachine(data?.automaton as unknown as JsonFSM | undefined) }}>
      <div className="flex flex-col h-screen">
        <PlaygroundLayout data={data} />
        <main className="flex h-full">
          <Canvas />
          <SideMenu />
        </main>
      </div>
    </PlaygroundStoreProvider>
  )
}