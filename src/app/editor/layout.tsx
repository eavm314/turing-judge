import Link from "next/link";
import { Cpu } from "lucide-react";
import { DarkModeToggle } from "@/components/layout/dark-mode-toogle";
import { ExamplesMenu } from "@/components/layout/examples-menu";

export default function EditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Cpu className="h-6 w-6 mr-2" />
          <span className="font-bold">TuringProject</span>
        </Link>
        <nav className="ml-6 mr-auto flex items-center gap-4 sm:gap-6">
          <ExamplesMenu />
        </nav>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <DarkModeToggle />
        </nav>
      </header>
      {children}
    </div>
  );
}