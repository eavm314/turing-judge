import Link from 'next/link';

import { Cpu, ExternalLink } from 'lucide-react';

import { AccountMenu } from '@/components/layout/account-menu';
import { DarkModeToggle } from '@/components/layout/dark-mode-toogle';
import { MobileNav } from '@/components/layout/mobile-nav';
import { APP_NAME } from '@/constants/app';

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-dvh">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <nav className="mr-auto flex items-center">
          <MobileNav />
          <Link className="flex items-center justify-center mr-2 md:mr-8" href="/">
            <Cpu className="size-8 mr-2 text-primary" />
            <span className="hidden sm:inline h-full text-xl font-orbitron text-primary">
              {APP_NAME}
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/playground"
              target="_blank"
              className="flex gap-1 hover:border-b text-neutral-foreground hover:text-secondary border-secondary"
            >
              <span>Playground</span>
              <ExternalLink size={19} className="mt-0.5" />
            </Link>
            <Link
              href="/problems"
              className="hover:border-b text-neutral-foreground hover:text-secondary border-secondary"
            >
              <span>Problem Set</span>
            </Link>
            <Link
              href="/docs"
              className="hover:border-b text-neutral-foreground hover:text-secondary border-secondary"
            >
              <span>Docs</span>
            </Link>
          </div>
        </nav>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <DarkModeToggle />
          <AccountMenu />
        </nav>
      </header>
      {children}
    </div>
  );
}
