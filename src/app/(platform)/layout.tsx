import Link from 'next/link';

import { Cpu, ExternalLink } from 'lucide-react';

import { AccountMenu } from '@/components/layout/account-menu';
import { DarkModeToggle } from '@/components/layout/dark-mode-toogle';
import { GithubIcon } from '@/components/ui/icons';
import { APP_NAME, REPO } from '@/constants/app';

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
            <span className="h-full text-xl font-orbitron text-primary">{APP_NAME}</span>
          </Link>
          <div className="flex items-center gap-6">
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
          </div>
        </nav>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <DarkModeToggle />
          <AccountMenu />
        </nav>
      </header>
      {children}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-2 py-4 w-full px-4 md:px-6 text-accent-foreground">
        <div className="flex flex-col gap-1 text-sm text-center sm:flex-row sm:text-left">
          <p>
            © 2025 <span className="font-semibold tracking-wide">{APP_NAME}</span>.
          </p>
          <p>
            Developed by <span className="font-semibold tracking-wide">Enrique Vicente</span>.
          </p>
        </div>
        <nav className="flex items-center gap-4">
          <a
            href={REPO}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon className="size-6" />
            <span className="sr-only">GitHub</span>
          </a>
        </nav>
      </footer>
    </div>
  );
}
