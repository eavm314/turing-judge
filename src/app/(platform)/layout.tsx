import Link from "next/link";

import { Cpu } from "lucide-react";

import { AccountMenu } from "@/components/layout/account-menu";
import { DarkModeToggle } from "@/components/layout/dark-mode-toogle";

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <Cpu className="h-6 w-6 mr-2" />
          <span className="font-bold">TuringProject</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <DarkModeToggle />
          <AccountMenu />
        </nav>
      </header>
      {children}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2025 TuringLabs. All rights reserved.</p>
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