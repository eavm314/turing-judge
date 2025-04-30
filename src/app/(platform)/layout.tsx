import Link from "next/link";

import { Cpu, ExternalLink } from "lucide-react";

import { AccountMenu } from "@/components/layout/account-menu";
import { DarkModeToggle } from "@/components/layout/dark-mode-toogle";
import { appName } from "@/constants/app";

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <nav className="mr-auto flex items-center">
          <Link className="flex items-center justify-center mr-8" href="/">
            <Cpu className="size-8 mr-2 text-primary" />
            <span className="font-bold h-full text-xl font-orbitron text-primary">
              {appName}
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/playground"
              target="_blank"
              className="flex gap-1 hover:border-b hover:text-primary border-primary"
            >
              <span>Playground</span>
              <ExternalLink size={19} className="mt-0.5" />
            </Link>
            <Link
              href="/problems"
              className="hover:border-b hover:text-primary border-primary"
            >
              <span>Problem Set</span>
            </Link>
          </div>
        </nav>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <DarkModeToggle />
          <AccountMenu />
        </nav>
      </header>
      {children}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6">
        <p className="text-xs text-muted-foreground">
          © 2025 {appName}. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
