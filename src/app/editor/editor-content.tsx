"use client"

import dynamic from "next/dynamic";
import Link from "next/link";

import { type UserAutomaton } from "@prisma/client";
import { Cpu, Loader } from "lucide-react";

import SideMenu from "@/components/editor/SideMenu";
import { AccountMenu } from "@/components/layout/account-menu";
import { DarkModeToggle } from "@/components/layout/dark-mode-toogle";
import { ExamplesMenu } from "@/components/layout/examples-menu";
import { EditorStoreProvider } from "@/providers/editor-provider";
import { SaveAutomaton } from "@/components/layout/save-automaton";
import { FiniteStateMachine, type JsonFSM } from "@/lib/automaton/FiniteStateMachine";

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
  const metadata = data ? { ...data, automaton: undefined } : undefined;
  return (
    <EditorStoreProvider initState={{ automaton: new FiniteStateMachine(data?.automaton as unknown as JsonFSM | undefined) }}>
      <div className="flex flex-col h-screen">
        <header className="px-4 lg:px-6 h-14 flex items-center border-b">
          <Link className="flex items-center justify-center" href="/">
            <Cpu className="h-6 w-6 mr-2" />
          </Link>
          <nav className="ml-2 mr-auto flex items-center gap-4 sm:gap-6">
            <SaveAutomaton metadata={metadata}/>
          </nav>
          <nav className="ml-auto flex items-center gap-4 sm:gap-6">
            <ExamplesMenu />
            <DarkModeToggle />
            <AccountMenu variant="ghost" />
          </nav>
        </header>
        <main className="h-full">
          <div className="flex h-full">
            <Canvas />
            <SideMenu />
          </div>
        </main>
      </div>
    </EditorStoreProvider>
  )
}